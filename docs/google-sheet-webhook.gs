/**
 * QaderTech — Google Sheet lead webhook
 *
 * Sheet row 1 headers (must match exactly):
 * Timestamp | Name | Email | Phone | Message | Source | Locale | Page | UserAgent
 *
 * After ANY edit: Deploy → Manage deployments → Edit → New version → Deploy
 * (Saving alone does NOT update the live webhook URL.)
 */
function doPost(e) {
  try {
    var raw = e && e.postData && e.postData.contents ? e.postData.contents : "{}";
    var data = JSON.parse(raw);

    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

    var timestamp = String(data.timestamp || new Date().toLocaleString("en-US", { timeZone: "Asia/Riyadh" }));
    var name = String(data.name || "").trim();
    var email = String(data.email || "").trim().toLowerCase();
    var phone = String(data.phone || "").trim();
    var message = String(data.message || "").trim();
    var source = String(data.source || "website").trim();
    var locale = String(data.locale || "").trim();
    var page = String(data.page || "landing").trim();
    var userAgent = String(data.userAgent || "").trim();

    if (userAgent.length > 200) {
      userAgent = userAgent.substring(0, 200);
    }

    // Google Sheets treats values starting with + as formulas — force plain text
    if (phone && phone.charAt(0) === "+") {
      phone = "'" + phone;
    }

    // Safety: never write message text into the phone column
    if (phone && (phone.indexOf("@") !== -1 || phone.indexOf(" ") !== -1)) {
      if (!message) {
        message = phone.replace(/^'/, "");
      }
      phone = "";
    }

    sheet.appendRow([
      timestamp,
      name,
      email,
      phone,
      message,
      source,
      locale,
      page,
      userAgent,
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({
        success: true,
        message: "Lead successfully recorded in Google Sheet!",
      }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({
        success: false,
        message: "Failed to record lead in Google Sheet.",
        error: String(error),
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doOptions(e) {
  return ContentService.createTextOutput("OK");
}

function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({
      success: true,
      message: "QaderTech webhook is live. Use POST to submit leads.",
    }))
    .setMimeType(ContentService.MimeType.JSON);
}
