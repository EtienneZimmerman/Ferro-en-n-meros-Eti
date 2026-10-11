// Registro de vistas: define el orden y los textos de la navegación.
import inicio from "./inicio.js";
import partido from "./partido.js";
import temporada from "./temporada.js";
import jugadores from "./jugadores.js";
import hallazgos from "./hallazgos.js";
import laboratorio from "./laboratorio.js";
import prode from "./prode.js";

export const VISTAS = [
  { ...inicio, nav: "Inicio", icono: "🏠" },
  { ...partido, nav: "Próximo partido", icono: "⚽", desc: "La previa de la fecha: pronóstico, pizarra de Sara, el rival, las chicanas y el árbitro." },
  { ...temporada, nav: "Temporada", icono: "📈", desc: "La tabla, los resultados, cómo juntamos los puntos y cómo venimos contra 2025." },
  { ...jugadores, nav: "Jugadores", icono: "👟", desc: "Minutos calculados con titulares, cambios y expulsiones de cada síntesis. «Pts/p» es lo que sumamos por partido con cada uno en cancha." },
  { ...hallazgos, nav: "Hallazgos", icono: "💡", desc: "Récords, rachas, figuras y datos de color de nuestro Ferro, sacados de las síntesis de Ferroweb y la tabla oficial. Los recuadros con borde ámbar son las novedades del día." },
  { ...laboratorio, nav: "Laboratorio", icono: "🧪", desc: "Herramientas para jugar con los números: calculadora del ascenso, qué pasa según cómo va el partido, duplas, el banco, cábalas, rivales y trivia." },
  { ...prode, nav: "Prode", icono: "🎯", desc: "Los muchachos contra la Máquina. Exacto: 3 puntos. Acertar quién gana o el empate: 1. Cada goleador que acertás: 1 más." },
];
