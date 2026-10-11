import { previa } from "./partido/previa.js";
import { initPizarra } from "./partido/pizarra.js";
import { initArbitro } from "./partido/arbitro.js";
import { initRival } from "./partido/rival.js";
import { initResumen } from "./partido/resumen.js";
import html from "./templates/partido.html?raw";

export default {
  id: "partido", titulo: "Próximo partido", html,
  init() { previa(); initPizarra(); initArbitro(); initRival(); initResumen(); },
  onShow() { previa(); },
};
