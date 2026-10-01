# Bot FTTH - Sistema de Reportes de Campo

## Archivos del proyecto

- `index.html` - WebApp de Telegram (formulario FTTH con vista previa y selector visual)
- `style.css` - Estilos de la aplicación web y badges
- `js.js` - Backend en Google Apps Script (webhook para Telegram)

---

## 🔍 Búsqueda y Filtrado en Telegram

El sistema clasifica automáticamente cada reporte y añade hashtags y encabezados destacados para que puedas filtrar fácilmente en la barra de búsqueda del grupo o tema de Telegram:

| Tipo de Trabajo | Icono | Hashtags automáticos |
|---|---|---|
| **Instalación Caja NAP** | 🏷️ | `#REPORTE` `#NAP` `#CAJA_NAP` `#TAG_...` `#NAP_...` |
| **Instalación Manga HUB** | 🔌 | `#REPORTE` `#MANGA_HUB` `#MANGA` `#MH` `#MH_...` |
| **Tendido TAP Preconectorizado** | 🪢 | `#REPORTE` `#TENDIDO_TAP` `#TAP` |
| **Fusión / Adecuación** | ⚡ | `#REPORTE` `#FUSION` `#ADECUACION` |
| **Mantenimiento / Avería** | 🔧 | `#REPORTE` `#MANTENIMIENTO` `#AVERIA` |
| **Otro Trabajo** | 🛠️ | `#REPORTE` `#OTRO_TRABAJO` |

> 💡 **Tip:** En Telegram sólo necesitas escribir en el buscador `#NAP` o `#MANGA_HUB` o tocar el hashtag en cualquier mensaje para ver todos los reportes de ese tipo.

---

## PASO 1: Obtener el TOPIC_ID del tema de Reportes

1. Abre Telegram Web: https://web.telegram.org/k/#-4385586958
2. Navega al tema 'Reportes' dentro del supergrupo
3. La URL cambiará a algo como: `https://web.telegram.org/k/#-4385586958_1234`
4. El número después del guión bajo es tu `TOPIC_ID` (en el ejemplo: 1234)
5. Copia ese número

---

## PASO 2: Subir index.html y style.css a GitHub Pages

1. Sube los archivos `index.html`, `style.css` y `fibex-logo.png` a tu repositorio GitHub
2. Ve a **Settings > Pages > Branch: main > Save**
3. Tu URL será: `https://TU-USUARIO.github.io/FORMULARIO-REPORTE-FIBEX/`

---

## PASO 3: Configurar Google Apps Script

1. Ve a https://script.google.com
2. Abre tu proyecto de Apps Script existente o crea uno nuevo
3. Copia el contenido de [js.js](file:///d:/Users/jesus/Documents/proyectos/FORMULARIO-REPORTE-FIBEX/js.js) y pégalo
4. Verifica el valor de `TOPIC_ID`
5. Guarda el proyecto y haz clic en **Implementar > Administrar implementaciones > Editar > Nueva versión > Implementar**

---

## Indicador de potencia (dBm)

- `-8 a -25 dBm`: Óptima
- `-25 a -30 / -3 a -8 dBm`: Marginal
- `Fuera de rango`: Revisar línea

