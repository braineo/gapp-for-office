// Send notification to remind Admin to check out the fill-in status
function sendNotification() {
    var sheet = SpreadsheetApp.openById('1TLS3SFC7LizPLe96p86MsQN_uLRXLgF1L52tJjIeroI').getSheetByName("Settings")
    var email = sheet.getRange("B1").getValue();
    var subject = sheet.getRange("B2").getValue();
    var body = sheet.getRange("B3").getValue();
    GmailApp.sendEmail(email, subject, body);
}