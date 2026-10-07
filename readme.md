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
3. Copia el contenido de [js.js](file:///c:/Users/jpichardo/Desktop/FORMULARIO-REPORTE-FIBEX/FORMULARIO-REPORTE-FIBEX/js.js) y pégalo en el editor de Apps Script
4. (Opcional) Puedes seleccionar la función `probarDrive` en el desplegable superior y presionar **Ejecutar** para validar los permisos y verificar que cree la carpeta en tu Google Drive.
5. Haz clic en **Implementar > Administrar implementaciones > Editar > Nueva versión > Implementar**

---

## 📷 Carga de Fotos y Almacenamiento en Google Drive

El sistema permite adjuntar fotos tomadas desde la cámara móvil o seleccionadas desde la galería:

1. **Optimización en Cliente**: Las imágenes se comprimen y redimensionan automáticamente a máximo **1280px** (calidad JPEG 75%) antes de enviarse para ahorrar consumo de datos móviles en el campo.
2. **Envío a Telegram**: Las fotos se envían adjuntas directamente como respuesta al mensaje del reporte en el canal/topic especificado.
3. **Organización en Google Drive**: Se crea automáticamente la estructura de carpetas en tu Google Drive:
   - **Carpeta Raíz**: `REPORTES FTTH FIBEX`
   - **Subcarpeta Dinámica**: `ZONA - MH - NAP (FECHA)` (ejemplo: `ARAURE LA TAPA - MH-223 - NAP AB-706`)
4. **Enlace Directo**: El reporte de Telegram incluye un link directo a la carpeta creada en Google Drive para consultar o descargar las fotos originales en cualquier momento.

---

## Indicador de potencia (dBm)

- `-8 a -25 dBm`: Óptima
- `-25 a -30 / -3 a -8 dBm`: Marginal
- `Fuera de rango`: Revisar línea


