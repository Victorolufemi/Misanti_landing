/**
 * Misanti waitlist → Google Sheet webhook.
 *
 * Setup:
 *  1. Create a Google Sheet (e.g. "Misanti Waitlist").
 *  2. Extensions → Apps Script. Delete the sample code, paste this whole file, Save.
 *  3. Deploy → New deployment → type "Web app".
 *       Execute as: Me
 *       Who has access: Anyone
 *     Click Deploy, approve the Google permissions prompt.
 *  4. Copy the "Web app URL" (ends in /exec). That is your WAITLIST_WEBHOOK_URL.
 *
 * If you edit this script later: Deploy → Manage deployments → edit (pencil) →
 * Version: "New version" → Deploy. The URL stays the same.
 */

const SHEET_NAME = "Waitlist";
const HEADERS = ["Joined at", "First name", "WhatsApp", "Email", "Source", "ID"];

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000); // avoid two signups writing to the same row
  try {
    const data = JSON.parse(e.postData.contents);
    const sheet = getSheet_();

    sheet.appendRow([
      data.createdAt ? new Date(data.createdAt) : new Date(),
      clean_(data.firstName),
      // leading apostrophe keeps "+234…" as text instead of a number
      "'" + clean_(data.whatsapp),
      clean_(data.email),
      clean_(data.source),
      clean_(data.id),
    ]);

    return json_({ ok: true });
  } catch (err) {
    return json_({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

// Visiting the URL in a browser shows this — handy to confirm the deployment works.
function doGet() {
  return json_({ ok: true, message: "Misanti waitlist webhook is live." });
}

function getSheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) sheet = ss.insertSheet(SHEET_NAME);
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
    sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight("bold");
    sheet.setFrozenRows(1);
  }
  return sheet;
}

// Stops a value like "=HYPERLINK(...)" from being run as a formula in the sheet.
function clean_(v) {
  const s = String(v == null ? "" : v).slice(0, 200);
  return /^[=+\-@]/.test(s) && !/^\+\d/.test(s) ? "'" + s : s;
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(
    ContentService.MimeType.JSON,
  );
}
