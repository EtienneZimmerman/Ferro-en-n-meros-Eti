# Ferro en números

Estadísticas de Ferro Carril Oeste con datos de [FerroWeb](http://www.ferroweb.com.ar) · *Hablemos de Ferro*.
Sitio: https://ferroweb.github.io/ferro-en-numeros/

## Cómo trabajar

```
npm install      # una sola vez
npm run dev      # servidor local con recarga en vivo
npm run build    # genera dist/ (lo que se publica)
```

Al subir a `main`, GitHub Actions hace el build y publica en Pages (`.github/workflows/deploy.yml`).

## Estructura

```
public/data/        Los datos. La actualización diaria SOLO toca esta carpeta.
  tabla.json          tabla de posiciones, fecha, "actualizado"
  partidos.json       partidos y participaciones de cada jugador
  jugadores.json      estadísticas del plantel
  hallazgos.json      hallazgos, novedades del día, "la última vez"
  equipo.json         rendimiento, franjas, histórico 2025/2026
  proximo.json        próximo partido: calendario, pronóstico FW, escenarios, árbitro, cruce de planteles
  lab.json            datos del laboratorio
  prode-*.json        configuración y claves (hash) del Prode
  fotos-*.json        nombre → imagen (los archivos están en public/img/)
public/img/         Escudos y fotos.
src/
  main.js             arranque: carga los datos y monta todo
  ctx.js              datos cargados y valores derivados (se completa una vez)
  router.js           navegación por hash: #/vista/pestaña/parámetro
  search.js           buscador global (/ o Ctrl+K)
  views/              una vista por área: inicio, partido, temporada, jugadores, hallazgos, laboratorio, prode
    templates/          el HTML de cada vista (las pestañas son los bloques con data-tab)
  components/         piezas compartidas: tarjetas, caras, diálogo de desarrollo
  lib/                utilidades: DOM, gráficos y tablas, formatos, tema
  styles/             CSS por tema
```

## Sumar algo nuevo

- **Una pestaña nueva**: agregar un `<div class="tab" data-tab="id" data-label="Nombre">` en el template de la vista. El router arma la barra solo.
- **Una vista nueva**: crear `src/views/x.js` (con `id`, `titulo`, `html`, `init`) + su template y registrarla en `src/views/index.js`.
- **Un grupo de datos nuevo**: crear `public/data/x.json` y sumarlo a `ARCHIVOS` en `src/main.js`. Sus claves quedan disponibles en `DATA`.
- **Que se encuentre en el buscador**: agregar el destino a `DESTINOS` en `src/search.js`.

## Links viejos

Los links a anclas anteriores (`#previa`, `#prode`, `#lab`, `#tabla`…) siguen funcionando: el router los traduce a las vistas nuevas.
