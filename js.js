var BOT_TOKEN = PropertiesService.getScriptProperties().getProperty("BOT_TOKEN") || "8832826558:AAG4dReMmGKxCq6WSGWCvReyM9Dzleq8WtU";
var CHAT_ID = "-1004385586958";
var TOPIC_ID = 3;
var DRIVE_FOLDER_ID = "17jT5nBfdPUEsJoNQ3scYY9KqUTx6MTtg";

function doGet(e) {
  return ContentService.createTextOutput(JSON.stringify({ status: "activo", message: "Servidor FTTH OBI GROUP activo." }))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  try {
    if (!e || !e.postData || !e.postData.contents) {
      return createJsonResponse({ success: false, error: "Sin datos recibidos." });
    }

    var data;
    try {
      data = JSON.parse(e.postData.contents);
    } catch (parseErr) {
      return createJsonResponse({ success: false, error: "JSON inválido." });
    }

    // FILTRO DE SEGURIDAD: validar que sea un envío del formulario real
    if (data.update_id || data.message || !data.cuadrilla || !data.tipo_trabajo) {
      return createJsonResponse({ success: false, error: "Petición ignorada: no es un envío válido del formulario." });
    }

    // Guardar fotos en Google Drive (si hay imágenes)
    var driveFolderUrl = "";
    if (data.imagenes && data.imagenes.length > 0) {
      try {
        driveFolderUrl = guardarEnGoogleDrive(data);
        data.drive_url = driveFolderUrl;
      } catch (eDrive) {
        Logger.log("Error al guardar en Google Drive: " + eDrive.toString());
      }
    }

    var texto = buildMessage(data);
    var respuestaTelegram = sendTelegramMessage(texto);

    try {
      var jsonResp = JSON.parse(respuestaTelegram);
      if (jsonResp.ok && data.imagenes && data.imagenes.length > 0) {
        var replyId = jsonResp.result.message_id;
        sendTelegramPhotos(data.imagenes, replyId);
      }
    } catch (eFoto) {
      Logger.log("Error enviando imágenes: " + eFoto.toString());
    }

    return createJsonResponse({ success: true, telegramResponse: JSON.parse(respuestaTelegram), driveUrl: driveFolderUrl });

  } catch (err) {
    Logger.log("Error en doPost: " + err.toString());
    return createJsonResponse({ success: false, error: err.toString() });
  }
}

function createJsonResponse(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

function sanitizarTag(str) {
  if (!str) return "";
  return String(str).replace(/[^A-Z0-9_]/gi, "_").replace(/_+/g, "_").replace(/^_|_$/g, "").toUpperCase();
}

function buildHashtags(data, tipoTrabajo) {
  var tags = ["#REPORTE"];
  var t = (tipoTrabajo || "").toUpperCase();

  if (t.indexOf("NAP") !== -1) {
    tags.push("#NAP", "#CAJA_NAP");
  } else if (t.indexOf("MANGA") !== -1 || t.indexOf("HUB") !== -1) {
    tags.push("#MANGA_HUB", "#MANGA", "#MH");
  } else if (t.indexOf("TAP") !== -1 || t.indexOf("TENDIDO") !== -1) {
    tags.push("#TENDIDO_TAP", "#TAP");
  } else if (t.indexOf("FUSI") !== -1 || t.indexOf("ADECUA") !== -1) {
    tags.push("#FUSION", "#ADECUACION");
  } else if (t.indexOf("MANTEN") !== -1 || t.indexOf("AVER") !== -1) {
    tags.push("#MANTENIMIENTO", "#AVERIA");
  } else {
    tags.push("#OTRO_TRABAJO");
  }

  if (data.mh) {
    var mhTag = sanitizarTag(data.mh);
    if (mhTag) tags.push("#" + mhTag);
  }

  if (data.nap_nombre) {
    var napTag = sanitizarTag(data.nap_nombre);
    if (napTag) tags.push("#" + napTag);
  }

  if (data.tag_num) {
    var tagNum = sanitizarTag(data.tag_num);
    if (tagNum) tags.push("#TAG_" + tagNum);
  }

  if (data.cuadrilla) {
    var cuadTag = sanitizarTag(data.cuadrilla);
    if (cuadTag) tags.push("#" + cuadTag);
  }

  if (data.sede) {
    var sedeTag = sanitizarTag(data.sede);
    if (sedeTag) tags.push("#" + sedeTag);
  }

  return tags.join(" ");
}

function buildMessage(data) {
  var fechaDisplay = (data.fecha || "").replace("T", " ");
  var tipoTrabajo = (data.tipo_trabajo || "").toUpperCase();
  if (data.otro_trabajo_detalle && tipoTrabajo.indexOf("OTRO") !== -1) {
    tipoTrabajo = "OTRO: " + data.otro_trabajo_detalle.toUpperCase();
  }

  var icono = "📋";
  if (tipoTrabajo.indexOf("NAP") !== -1) icono = "🏷️";
  else if (tipoTrabajo.indexOf("MANGA") !== -1 || tipoTrabajo.indexOf("HUB") !== -1) icono = "🔌";
  else if (tipoTrabajo.indexOf("TAP") !== -1 || tipoTrabajo.indexOf("TENDIDO") !== -1) icono = "🪢";
  else if (tipoTrabajo.indexOf("FUSI") !== -1 || tipoTrabajo.indexOf("ADECUA") !== -1) icono = "⚡";
  else if (tipoTrabajo.indexOf("MANTEN") !== -1 || tipoTrabajo.indexOf("AVER") !== -1) icono = "🔧";
  else icono = "🛠️";

  var lineasElementos = [];
  if (data.mh) {
    lineasElementos.push("🔌 *Manga \\(MH\\):* " + escapeMarkdown(data.mh));
  }
  if (data.nap_nombre) {
    lineasElementos.push("🏷️ *NAP:* " + escapeMarkdown(data.nap_nombre));
  }
  if (data.tag_num) {
    lineasElementos.push("🔖 *Tag:* " + escapeMarkdown(data.tag_num));
  }
  var elementosRedText = lineasElementos.length > 0 ? lineasElementos.join("\n") + "\n" : "";

  var potenciaText = "";
  if (data.potencia) {
    potenciaText = "\n📶 *Lectura de Potencia:* " + escapeMarkdown(data.potencia) + " dBm";
  }

  var gpsText = "";
  if (data.gps_url) {
    gpsText = "\n📍 *Ubicación GPS:* " + escapeMarkdown(data.gps_url);
  }

  var driveText = "";
  if (data.drive_url) {
    driveText = "\n📁 *Carpeta Google Drive:* " + escapeMarkdown(data.drive_url);
  }

  var hashtags = buildHashtags(data, tipoTrabajo);

  var msg =
    "📋 *[REPORTE FTTH: " + escapeMarkdown(tipoTrabajo) + "]* " + icono + "\n" +
    "🏢 *" + escapeMarkdown(data.sede || "FIBEX") + "*\n" +
    "──────────────────────────────\n" +
    "📌 *Clasificación:* " + escapeMarkdown(tipoTrabajo) + "\n" +
    "👷‍♂️ *Cuadrilla:* " + escapeMarkdown(data.cuadrilla || "N/A") + "\n" +
    "📅 *Fecha/Hora:* " + escapeMarkdown(fechaDisplay) + "\n" +
    elementosRedText +
    "📍 *Zona/Sector:* " + escapeMarkdown(data.zona || "N/A") + gpsText + driveText + "\n\n" +
    "📦 *Material Utilizado / Insumos:*\n" +
    "🪜 *Postes transitados:* " + escapeMarkdown(data.postes || "0") + "\n" +
    "⛓️ *Flejes:* " + escapeMarkdown(data.fleje || "0") + "\n" +
    "🔲 *Hebillas:* " + escapeMarkdown(data.hebilla || "0") + "\n" +
    "⭕ *Anillas de suspensión:* " + escapeMarkdown(data.anilla || "0") + "\n" +
    "🌀 *Preformados:* " + escapeMarkdown(data.preformados || "0") + "\n" +
    "〰️ *Preformados tipo bigote:* " + escapeMarkdown(data.preformados_bigote || "0") +
    potenciaText + "\n\n" +
    "📝 *Notas/Observaciones:*\n" + escapeMarkdown(data.nota || "SIN OBSERVACIONES") + "\n" +
    "──────────────────────────────\n" +
    "🔍 *Búsqueda / Filtros:*\n" + escapeMarkdown(hashtags) + "\n" +
    "──────────────────────────────\n" +
    "_Responda a este mensaje con las fotos de la instalación\\._";

  return msg;
}

function escapeMarkdown(text) {
  if (!text) return "";
  return String(text)
    .replace(/\\/g, "\\\\")
    .replace(/_/g, "\\_")
    .replace(/\*/g, "\\*")
    .replace(/\[/g, "\\[").replace(/\]/g, "\\]")
    .replace(/\(/g, "\\(").replace(/\)/g, "\\)")
    .replace(/~/g, "\\~")
    .replace(/`/g, "\\`")
    .replace(/>/g, "\\>")
    .replace(/#/g, "\\#")
    .replace(/\+/g, "\\+")
    .replace(/-/g, "\\-")
    .replace(/=/g, "\\=")
    .replace(/\|/g, "\\|")
    .replace(/\{/g, "\\{")
    .replace(/\}/g, "\\}")
    .replace(/\./g, "\\.")
    .replace(/!/g, "\\!");
}

function sendTelegramMessage(texto) {
  var url = "https://api.telegram.org/bot" + BOT_TOKEN + "/sendMessage";

  var payload = {
    chat_id: CHAT_ID,
    text: texto,
    parse_mode: "MarkdownV2"
  };

  if (TOPIC_ID && TOPIC_ID > 0) {
    payload.message_thread_id = parseInt(TOPIC_ID);
  }

  var options = {
    method: "post",
    contentType: "application/json",
    payload: JSON.stringify(payload),
    muteHttpExceptions: true
  };

  var response = UrlFetchApp.fetch(url, options);
  return response.getContentText();
}

function sendTelegramPhotos(imagenes, replyId) {
  var url = "https://api.telegram.org/bot" + BOT_TOKEN + "/sendPhoto";

  for (var i = 0; i < imagenes.length; i++) {
    try {
      var imgData = imagenes[i];
      var blob = Utilities.newBlob(Utilities.base64Decode(imgData.base64), imgData.mimeType || "image/jpeg", imgData.name || ("foto_" + (i + 1) + ".jpg"));

      var payload = {
        chat_id: CHAT_ID,
        photo: blob,
        reply_to_message_id: replyId
      };

      if (TOPIC_ID && TOPIC_ID > 0) {
        payload.message_thread_id = parseInt(TOPIC_ID);
      }

      var options = {
        method: "post",
        payload: payload,
        muteHttpExceptions: true
      };

      UrlFetchApp.fetch(url, options);
    } catch (e) {
      Logger.log("Error al enviar foto " + i + ": " + e.toString());
    }
  }
}

function guardarEnGoogleDrive(data) {
  var rootFolder;

  try {
    if (DRIVE_FOLDER_ID && DRIVE_FOLDER_ID.trim() !== "") {
      rootFolder = DriveApp.getFolderById(DRIVE_FOLDER_ID.trim());
    }
  } catch (errDrive) {
    Logger.log("Error buscando carpeta por ID: " + errDrive.toString());
  }

  if (!rootFolder) {
    var nombreCarpetaRaiz = "REPORTES FTTH FIBEX";
    var parentFolders = DriveApp.getFoldersByName(nombreCarpetaRaiz);
    if (parentFolders.hasNext()) {
      rootFolder = parentFolders.next();
    } else {
      rootFolder = DriveApp.createFolder(nombreCarpetaRaiz);
    }
  }

  var partes = [];
  if (data.zona) partes.push(data.zona.trim());
  if (data.mh) partes.push("MH " + data.mh.trim());
  if (data.nap_nombre) partes.push("NAP " + data.nap_nombre.trim());

  var folderName = partes.length > 0 ? partes.join(" - ") : "REPORTE_SIN_NOMBRE";

  var timestamp = (data.fecha || "").replace(/[^0-9]/g, "").slice(0, 12);
  if (timestamp) {
    folderName += " (" + timestamp + ")";
  }

  var subFolder = rootFolder.createFolder(folderName);

  for (var i = 0; i < data.imagenes.length; i++) {
    var imgObj = data.imagenes[i];
    var blob = Utilities.newBlob(
      Utilities.base64Decode(imgObj.base64),
      imgObj.mimeType || "image/jpeg",
      imgObj.name || ("foto_" + (i + 1) + ".jpg")
    );
    subFolder.createFile(blob);
  }

  return subFolder.getUrl();
}