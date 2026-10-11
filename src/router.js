// Router por hash: #/vista/pestaña/parámetro. Todas las vistas viven en el DOM; se muestra una sola.
import { $, el } from "./lib/dom.js";
import { VISTAS } from "./views/index.js";

// Links viejos (#previa, #prode, #lab…) siguen funcionando.
const VIEJOS = {
  previa: ["partido", "previa"], "pv-fwcaja": ["partido", "pronostico"], pizarra: ["partido", "pizarra"], "humor-caja": ["partido", "chicanas"],
  arbitros: ["partido", "arbitro"], prode: ["prode"], lab: ["laboratorio"], hallazgos: ["hallazgos"], equipo: ["temporada", "evolucion"],
  ultimas: ["temporada", "ultima-vez"], jugadores: ["jugadores"], ficha: ["jugadores", "ficha"], historia: ["temporada", "vs-2025"], tabla: ["temporada", "tabla"],
};

const secciones = new Map();   // id de vista -> <section>

export function montar(app) {
  app.textContent = "";
  const nav = $("#nav");
  VISTAS.forEach(v => {
    const sec = el("section", "view"); sec.dataset.view = v.id; sec.setAttribute("aria-label", v.titulo);
    if (v.desc) { const h = el("header", "view-head"); h.append(el("h1", null, v.titulo), el("p", null, v.desc)); sec.append(h); }
    const cuerpo = el("div", "view-body"); cuerpo.innerHTML = v.html; sec.append(...cuerpo.childNodes);
    app.append(sec); secciones.set(v.id, sec);
    const a = el("a", null, v.nav); a.href = v.id === "inicio" ? "#/" : `#/${v.id}`; a.dataset.view = v.id;
    if (v.id === "inicio") a.append(Object.assign(el("span", "nuevo", "NUEVO"), { id: "nav-hoy", hidden: true }));
    nav.append(a);
  });
}

// Pestañas: cada hijo directo con data-tab es un panel; arma la barra de pestañas de la vista.
function armarPestañas(sec, v) {
  const paneles = [...sec.querySelectorAll(":scope > [data-tab]")];
  if (paneles.length < 2) return;
  const barra = el("nav", "subnav"); barra.setAttribute("aria-label", "Secciones de " + v.titulo);
  paneles.forEach(p => { const a = el("a", null, p.dataset.label); a.href = `#/${v.id}/${p.dataset.tab}`; a.dataset.tab = p.dataset.tab; barra.append(a); });
  paneles[0].before(barra);
}

const vacio = (panel) => [...panel.children].every(c => c.hidden);

function parsear() {
  const h = location.hash;
  let partes = [];
  if (h.startsWith("#/")) partes = h.slice(2).split("/").filter((x, i) => i < 2 || x !== "");
  else if (h.length > 1) partes = VIEJOS[h.slice(1)] || [];
  const v = VISTAS.find(x => x.id === partes[0]) || VISTAS[0];
  return { v, tab: partes[1], param: partes.slice(2).join("/") };
}

let previo = "";
function mostrar() {
  const { v, tab: pedida, param } = parsear();
  const sec = secciones.get(v.id);
  VISTAS.forEach(x => secciones.get(x.id).classList.toggle("on", x === v));
  document.querySelectorAll("#nav a").forEach(a => { if (a.dataset.view === v.id) a.setAttribute("aria-current", "page"); else a.removeAttribute("aria-current"); });

  const paneles = [...sec.querySelectorAll(":scope > [data-tab]")];
  let tab = null;
  if (paneles.length) {
    const libres = paneles.filter(p => !vacio(p));
    tab = (libres.find(p => p.dataset.tab === pedida) || libres[0] || paneles[0]).dataset.tab;
    paneles.forEach(p => p.classList.toggle("on", p.dataset.tab === tab));
    sec.querySelectorAll(".subnav a").forEach(a => {
      const p = paneles.find(x => x.dataset.tab === a.dataset.tab);
      a.hidden = vacio(p); if (a.dataset.tab === tab) a.setAttribute("aria-current", "page"); else a.removeAttribute("aria-current");
    });
  }
  document.title = (v.id === "inicio" ? "" : v.titulo + " · ") + "Ferro en números · Ferroweb";
  const clave = v.id + "/" + tab;
  if (clave !== previo) window.scrollTo({ top: 0 });
  previo = clave;
  if (v.onShow) v.onShow(tab, param);
}

export function iniciarRouter() {
  VISTAS.forEach(v => { const sec = secciones.get(v.id); armarPestañas(sec, v); });
  window.addEventListener("hashchange", mostrar);
  let rt; window.addEventListener("resize", () => { clearTimeout(rt); rt = setTimeout(mostrar, 200); });
  mostrar();
}
