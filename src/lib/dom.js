export const $ = (s) => document.querySelector(s);
export const el = (tag, cls, txt) => { const e = document.createElement(tag); if (cls) e.className = cls; if (txt != null) e.textContent = txt; return e; };
export const f2 = (v) => v == null ? "—" : Number(v).toFixed(2).replace(".", ",");
export const miles = (v) => v == null ? "—" : Number(v).toLocaleString("es-AR");
const svgNS = "http://www.w3.org/2000/svg";
export const S = (tag, attrs, parent) => { const e = document.createElementNS(svgNS, tag); for (const k in attrs) e.setAttribute(k, attrs[k]); if (parent) parent.appendChild(e); return e; };
