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
  router.js           navegación por hash (#/grupo/página/parámetro) y menú lateral
  search.js           buscador global (/ o Ctrl+K)
  pages/              el MAPA DEL SITIO: index.js define los grupos del menú y hay un .html por grupo
                      (cada bloque data-tab es una página del menú, con su título y descripción)
  features/           la lógica que dibuja cada cosa (tablas, gráficos, previa, prode, laboratorio…)
  components/         piezas compartidas: tarjetas, caras, diálogo de desarrollo
  lib/                utilidades: DOM, gráficos y tablas, formatos, tema
  styles/             CSS por tema
```

## Menú del sitio

Inicio · Próximo partido (previa, pronóstico, pizarra, rival, chicanas, árbitro) · El equipo (tabla, resultados, goles,
puntos y forma, 2026 vs 2025) · Jugadores (plantel, ficha, comparador, duplas y banco) · Rivales · Herramientas ·
Comunidad (prode, trivia) · Hallazgos y datos.

## Sumar algo nuevo

- **Una página nueva del menú**: agregar un `<div class="tab" data-tab="id" data-label="Nombre" data-desc="Qué responde">` en el `.html` del grupo (en `src/pages/`). El menú y el título se arman solos.
- **Un grupo nuevo del menú**: crear `src/pages/x.html` y registrarlo en `GRUPOS` de `src/pages/index.js`. Si necesita lógica, crear un módulo en `src/features/` con `init()` y sumarlo a `FEATURES`.
- **Un grupo de datos nuevo**: crear `public/data/x.json` y sumarlo a `ARCHIVOS` en `src/main.js`. Sus claves quedan disponibles en `DATA`.
- **Que se encuentre en el buscador**: agregar el destino a `DESTINOS` en `src/search.js`.

## Links viejos

Los links anteriores (`#previa`, `#prode`, `#lab`, `#tabla`, `#/temporada/...`, `#/laboratorio/...`) siguen funcionando: el router los traduce a la ubicación nueva.
