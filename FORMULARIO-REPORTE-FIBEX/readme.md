# Bot FTTH - Sistema de Reportes de Campo

## Archivos del proyecto

- index.html - WebApp de Telegram (formulario FTTH)
- google_apps_script.js - Backend en Google Apps Script (webhook)

---

## PASO 1: Obtener el TOPIC_ID del tema de Reportes

1. Abre Telegram Web: https://web.telegram.org/k/#-4385586958
2. Navega al tema 'Reportes' dentro del supergrupo
3. La URL cambiara a algo como: https://web.telegram.org/k/#-4385586958_1234
4. El numero despues del guion bajo es tu TOPIC_ID (en el ejemplo: 1234)
5. Copia ese numero

---

## PASO 2: Subir index.html a GitHub Pages

1. Crea un repositorio en https://github.com (ej: reportes-ftth)
2. Sube el archivo index.html
3. Ve a Settings > Pages > Branch: main > Save
4. Tu URL sera: https://TU-USUARIO.github.io/reportes-ftth/

---

## PASO 3: Configurar Google Apps Script

1. Ve a https://script.google.com
2. Crea un nuevo proyecto
3. Copia el contenido de google_apps_script.js y pegalo
4. CAMBIA el valor de TOPIC_ID con el numero del Paso 1
5. Guarda el proyecto

---

## PASO 4: Implementar como webhook

1. Click en Implementar > Nueva implementacion
2. Tipo: Aplicacion web
3. Ejecutar como: Yo
4. Acceso: Cualquier usuario
5. Implementar y copia la URL (termina en /exec)
6. Reemplaza TU_URL_DE_APPS_SCRIPT con esa URL
7. Ejecuta la funcion setWebhook() desde el editor

---

## PASO 5: Configurar WebApp en BotFather

1. Habla con @BotFather en Telegram
2. /setmenubutton > selecciona tu bot
3. URL: tu URL HTTPS de index.html
4. Texto del boton: Nuevo Reporte

---

## Datos del bot

- Bot Token: 8832826558:AAG4dReMmGKxCq6WSGWCvReyM9Dzleq8WtU
- Supergrupo ID: -1004385586958
- TOPIC_ID: Por obtener (ver Paso 1)

---

## Indicador de potencia (dBm)

- -8 a -25 dBm: Optima
- -25 a -30 / -3 a -8 dBm: Marginal
- Fuera de rango: Revisar linea
