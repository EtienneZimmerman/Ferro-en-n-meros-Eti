import "./styles/index.css";
import { initCtx, DATA } from "./ctx.js";
import { montar, iniciarRouter } from "./router.js";
import { VISTAS } from "./views/index.js";
import { initDesarrollo } from "./components/desarrollo.js";
import { initBuscador } from "./search.js";
import { initTema } from "./lib/theme.js";

const BASE = import.meta.env.BASE_URL + "data/";
// Los archivos de data/ se mezclan en un solo objeto DATA. Para sumar un grupo de datos, agregarlo acá.
const ARCHIVOS = ["tabla", "partidos", "jugadores", "hallazgos", "equipo", "proximo", "lab"];

const leer = (nombre) => fetch(`${BASE}${nombre}.json`, { cache: "no-cache" })
  .then(r => { if (!r.ok) throw new Error(`${nombre}.json: ${r.status}`); return r.json(); });

async function arrancar() {
  const app = document.querySelector("#app");
  try {
    const [partes, fotosJug, fotosFw, prodeCfg, prodeHash] = await Promise.all([
      Promise.all(ARCHIVOS.map(leer)), leer("fotos-jugadores"), leer("fotos-fw"), leer("prode-config"), leer("prode-hash"),
    ]);
    initCtx({ data: Object.assign({}, ...partes), fotosJug, fotosFw, prodeCfg, prodeHash });
  } catch (e) {
    console.error(e);
    app.innerHTML = '<p class="cargando" role="alert">No pudimos cargar los datos. Probá recargar la página en un rato.</p>';
    return;
  }
  initTema();
  montar(app);
  initDesarrollo();
  for (const v of VISTAS) {
    try { if (v.init) v.init(); } catch (e) { console.error(`Error iniciando la vista «${v.id}»`, e); }
  }
  document.querySelector("#pie").textContent = `Datos al cierre de la fecha ${DATA.ultima_fecha} de la Primera Nacional 2026. Se actualiza automáticamente todos los días a las 9 y la noche de cada partido. Última actualización: ${DATA.actualizado}.`;
  initBuscador();
  iniciarRouter();
}

arrancar();
