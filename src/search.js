// Buscador global (atajo: / o Ctrl+K). Indexa jugadores, rivales, árbitros, hallazgos y herramientas.
import { DATA, TODOS } from "./ctx.js";
import { abrirDesarrollo } from "./components/desarrollo.js";
import { $, el } from "./lib/dom.js";
import { FERRO } from "./lib/consts.js";

const norm = (s) => String(s || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
const MAX_POR_GRUPO = 6;

// Destinos fijos: herramientas y secciones, con sinónimos para que se encuentren como las nombra la gente.
const DESTINOS = [
  ["Tabla de posiciones", "#/temporada/tabla", "posiciones clasificacion grupo puntos reducido", "🏆"],
  ["Resultados partido por partido", "#/temporada/tabla", "fixture partidos resultados fechas sintesis", "🗓️"],
  ["Evolución de puntos y goles por franja", "#/temporada/evolucion", "grafico puntos acumulados franjas minutos rendimiento", "📈"],
  ["Ferro 2026 contra 2025", "#/temporada/vs-2025", "comparacion temporada anterior historial rivales repetidos", "🔁"],
  ["La última vez que…", "#/temporada/ultima-vez", "goleada remontada racha ultima vez", "⏳"],
  ["Previa del próximo partido", "#/partido/previa", "proximo rival fecha cuando donde", "⚽"],
  ["Pronóstico FW", "#/partido/pronostico", "prediccion maquina chances escenarios", "🔮"],
  ["La pizarra de Sara", "#/partido/pizarra", "once probable formacion sistema instrucciones dt", "📋"],
  ["El rival: la previa en números y caras conocidas", "#/partido/rival", "ateneaid ex jugadores trayectorias", "🤝"],
  ["Chicanas", "#/partido/chicanas", "manual humor cargada", "😜"],
  ["El árbitro", "#/partido/arbitro", "referi designacion", "🟨"],
  ["Plantel completo", "#/jugadores/plantel", "jugadores minutos goles tarjetas", "👟"],
  ["Comparador de jugadores", "#/jugadores/comparador", "comparar versus", "⚖️"],
  ["Calculadora del primer puesto", "#/laboratorio/calculadora", "ascenso primero punta simulador", "🧮"],
  ["¿Y si al minuto…? (en vivo)", "#/laboratorio/en-vivo", "entretiempo ganando empatando perdiendo indice de forma", "⏱️"],
  ["Mapa de minutos", "#/laboratorio/minutos", "cuarto de hora goles franja calor", "🔥"],
  ["Duplas, tridentes e impacto del banco", "#/laboratorio/duplas-banco", "suplentes cambios titulares", "🤝"],
  ["Rivales favoritos, bestias negras y cábalas", "#/laboratorio/rivales", "cabala bestia negra cronicas termometro", "😈"],
  ["Trivia de la semana", "#/laboratorio/trivia", "preguntas juego quiz", "❓"],
  ["Prode", "#/prode", "pronosticos apuestas tabla maquina", "🎯"],
];

let indice = null;

function armarIndice() {
  const items = [];
  DESTINOS.forEach(([t, href, kw, ico]) => items.push({ grupo: "Ir a", ico, t, sub: "", href, k: norm(t + " " + kw) }));
  DATA.jugadores.forEach(j => items.push({
    grupo: "Jugadores", ico: "👟", t: j.jugador,
    sub: `${j.pj} PJ · ${j.goles} ${j.goles === 1 ? "gol" : "goles"} · ${j.minutos.toLocaleString("es-AR")}'`,
    href: "#/jugadores/ficha/" + encodeURIComponent(j.jugador), k: norm(j.jugador),
  }));
  const rivales = new Map();
  DATA.tabla.filter(r => r.equipo !== FERRO).forEach(r => rivales.set(norm(r.equipo), r));
  rivales.forEach(r => {
    const h = DATA.historico && DATA.historico.h2h && DATA.historico.h2h.find(x => r.equipo.includes(x.rival) || x.rival.includes(r.equipo));
    items.push({
      grupo: "Rivales", ico: "🆚", t: r.equipo,
      sub: `${r.pos}° en la tabla · ${r.pts} pts` + (h ? ` · historial ${h.g}G ${h.e}E ${h.p}P` : ""),
      href: "#/temporada/tabla/" + encodeURIComponent(r.equipo.replace(/^Deportivo /, "")), k: norm(r.equipo),
    });
  });
  const ya = new Set([...rivales.keys()]);
  DATA.partidos.forEach(p => {
    const n = norm(p.rival);
    if ([...ya].some(x => x.includes(n) || n.includes(x))) return;
    ya.add(n);
    items.push({ grupo: "Rivales", ico: "🆚", t: p.rival, sub: "Rival de esta temporada", href: "#/temporada/tabla/" + encodeURIComponent(p.rival), k: n });
  });
  if (DATA.arbitros && DATA.arbitros.tabla) DATA.arbitros.tabla.forEach(a => items.push({
    grupo: "Árbitros", ico: "🟨", t: a.arbitro,
    sub: `${a.pj} ${a.pj === 1 ? "partido" : "partidos"} con Ferro · ${a.g}G ${a.e}E ${a.p}P`, href: "#/partido/arbitro", k: norm(a.arbitro),
  }));
  TODOS.forEach(x => items.push({
    grupo: "Hallazgos", ico: x.tipo === "novedad" ? "🆕" : "💡", t: x.titulo,
    sub: x.detalle ? x.detalle.slice(0, 110) + (x.detalle.length > 110 ? "…" : "") : "", abrir: x,
    k: norm(x.titulo + " " + (x.detalle || "") + " " + (x.jugador || "")),
  }));
  return items;
}

function buscar(q) {
  const t = norm(q).trim().split(/\s+/).filter(Boolean);
  if (!t.length) return [];
  const puntos = (i) => {
    if (!t.every(w => i.k.includes(w))) return 0;
    const ini = norm(i.t);
    const base = ini.startsWith(t[0]) ? 4 : ini.split(/[\s·-]+/).some(w => w.startsWith(t[0])) ? 3 : ini.includes(t[0]) ? 2 : 1;
    return base + (i.grupo === "Ir a" ? .5 : 0);
  };
  return indice.map(i => [puntos(i), i]).filter(x => x[0]).sort((a, b) => b[0] - a[0]).map(x => x[1]);
}

export function initBuscador() {
  const dlg = $("#buscador"), inp = $("#bs-q"), out = $("#bs-res");
  let lista = [], visibles = [], sel = -1;

  const ir = (i) => {
    if (!i) return;
    dlg.close();
    if (i.abrir) abrirDesarrollo(i.abrir); else location.hash = i.href;
  };

  const marcar = (scroll = true) => {
    out.querySelectorAll(".bs-i").forEach(b => {
      const on = +b.dataset.i === sel;
      b.classList.toggle("on", on); b.setAttribute("aria-selected", String(on));
      if (on && scroll) b.scrollIntoView({ block: "nearest" });
    });
  };

  const pintar = () => {
    out.textContent = "";
    visibles = [];
    if (!inp.value.trim()) { out.append(el("p", "bs-vacio", "Escribí un jugador, un rival, un árbitro, «prode», «calculadora»…")); return; }
    if (!lista.length) { out.append(el("p", "bs-vacio", "No encontramos nada con eso. Probá con otra palabra.")); return; }
    let grupo = "";
    const cuenta = {};
    lista.forEach(i => {
      cuenta[i.grupo] = (cuenta[i.grupo] || 0) + 1;
      if (cuenta[i.grupo] > MAX_POR_GRUPO) return;
      if (i.grupo !== grupo) { out.append(el("div", "bs-g", i.grupo)); grupo = i.grupo; }
      const idx = visibles.push(i) - 1;
      const b = el("button", "bs-i"); b.type = "button"; b.setAttribute("role", "option"); b.dataset.i = idx;
      const ic = el("span", "ic", i.ico); ic.setAttribute("aria-hidden", "true");
      const tx = el("span", "tx"); tx.append(el("b", null, i.t)); if (i.sub) tx.append(el("small", null, i.sub));
      b.append(ic, tx);
      b.addEventListener("click", () => ir(i));
      b.addEventListener("mousemove", () => { sel = idx; marcar(false); });
      out.append(b);
    });
    sel = 0; marcar(false);
  };

  const mover = (d) => { if (visibles.length) { sel = (sel + d + visibles.length) % visibles.length; marcar(); } };

  const abrir = () => {
    if (!indice) indice = armarIndice();
    if (!dlg.open) dlg.showModal();
    inp.value = ""; lista = []; pintar(); inp.focus();
  };

  inp.addEventListener("input", () => { lista = buscar(inp.value); pintar(); });
  inp.addEventListener("keydown", e => {
    if (e.key === "ArrowDown") { e.preventDefault(); mover(1); }
    else if (e.key === "ArrowUp") { e.preventDefault(); mover(-1); }
    else if (e.key === "Enter") { e.preventDefault(); ir(visibles[sel]); }
  });
  $("#bs-x").addEventListener("click", () => dlg.close());
  dlg.addEventListener("click", e => { if (e.target === dlg) dlg.close(); });
  $("#btn-buscar").addEventListener("click", abrir);
  document.addEventListener("keydown", e => {
    const a = document.activeElement;
    const escribiendo = a && (/^(INPUT|TEXTAREA|SELECT)$/.test(a.tagName) || a.isContentEditable);
    if ((e.key === "k" && (e.ctrlKey || e.metaKey)) || (e.key === "/" && !escribiendo && !e.ctrlKey && !e.metaKey)) { e.preventDefault(); abrir(); }
  });
}
