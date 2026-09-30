// ============================================================
//  REPORTE FTTH - OBI GROUP (Backend Google Apps Script)
// ============================================================

var BOT_TOKEN = "8832826558:AAG4dReMmGKxCq6WSGWCvReyM9Dzleq8WtU";
var CHAT_ID = "-1004385586958";
var TOPIC_ID = 3;

function doGet(e) {
  return ContentService.createTextOutput("Servidor FTTH OBI GROUP activo.");
}

function doPost(e) {
  try {
    if (!e || !e.postData || !e.postData.contents) {
      return ContentService.createTextOutput("Sin datos");
    }

    var data = JSON.parse(e.postData.contents);

    // FILTRO DE SEGURIDAD:
    // Se valida 'cuadrilla' y 'nap_nombre' que sí existen en el envío del HTML.
    if (data.update_id || data.message || !data.cuadrilla || !data.nap_nombre) {
      return ContentService.createTextOutput("Petición ignorada: No es un envío válido del formulario.");
    }

    var texto = buildMessage(data);
    var respuestaTelegram = sendTelegramMessage(texto);

    return ContentService.createTextOutput("OK: " + respuestaTelegram);

  } catch (err) {
    Logger.log("Error en doPost: " + err.toString());
    return ContentService.createTextOutput("Error interno: " + err.toString());
  }
}

function buildMessage(data) {
  var fechaDisplay = (data.fecha || "").replace("T", " ");

  var napTagText = "🏷️ *NAP:* " + escapeMarkdown(data.nap_nombre || "");
  if (data.tag_num) {
    napTagText += "\n🔖 *Tag:* " + escapeMarkdown(data.tag_num);
  }

  var potenciaText = "";
  if (data.potencia) {
    potenciaText = "\n📶 *Lectura de Potencia:* " + escapeMarkdown(data.potencia) + " dBm";
  }

  var msg =
    "📋 *REPORTE DE CONSTRUCCIÓN*\n" +
    "🏢 *" + escapeMarkdown(data.sede || "FIBEX") + "*\n" +
    "──────────────────────────────\n" +
    "👷‍♂️ *Cuadrilla:* " + escapeMarkdown(data.cuadrilla) + "\n" +
    "📅 *Fecha/Hora:* " + escapeMarkdown(fechaDisplay) + "\n" +
    "🛠 *Tipo de Trabajo:* " + escapeMarkdown(data.tipo_trabajo) + "\n" +
    "🔌 *Manga \\(MH\\):* " + escapeMarkdown(data.mh) + "\n" +
    napTagText + "\n" +
    "📍 *Zona/Sector:* " + escapeMarkdown(data.zona) + "\n\n" +
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
  var responseText = response.getContentText();
  Logger.log("Respuesta de Telegram: " + responseText);
  return responseText;
}