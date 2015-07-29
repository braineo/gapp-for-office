function showSidebar() {
    var html = HtmlService.createTemplateFromFile('Sidebar').evaluate()
        .setSandboxMode(HtmlService.SandboxMode.IFRAME);

    SpreadsheetApp.getUi() // Or DocumentApp or FormApp.
        .showSidebar(html);
}

// Submit is pressed
function submit() {
    var sheet = SpreadsheetApp.getActiveSheet();
    var ui = SpreadsheetApp.getUi();
    var date = sheet.getRange(inputDateCell).getValue();
    var row = dayOfYear(date); //convert date into row number
    var status = sheet.getRange(okToSubmit).getValue();
    if (status == 'NG') {
        ui.alert('記入内容を修正してください。');
    } else if (isPunched(getCurrentUser(), row)) {
        ui.alert('この日付は既に登録済みです。日付を再確認してください。');
    } else if (ui.alert(String(date.getMonth() + 1) + "月" 
                + String(date.getDate()) + "日" 
                + "(" + getWeekDay(date.getDay()) 
                + ")分の記入内容を登録しますか？",
                ui.ButtonSet.YES_NO) == ui.Button.YES) {
        // Add records in punch card
        punchCard(getCurrentUser(), row);
        insertNewRecords(sheet);
    }
}

// Insert new records to database sheet
function insertNewRecords(sourceSheet) {
    // Append items to database sheet
    var content = sourceSheet.getRange(recordRange).getValues();
    var userName = getCurrentUser();
    var inputDate = sourceSheet.getRange(inputDateCell).getValue();
    for (var i = 0; i < content.length; i++) {
        if (content[i][content[i].length - 1] == "OK") { // Record is Ok to submit flag:
            content[i][content[i].length - 2] = timeStringToFloat(content[i][content[i].length - 2]);
            databaseSheet.appendRow([userName, inputDate].concat(content[i].slice(0, content[i].length - 1)));
        }
    }
    // Append items to attendance sheet
    var attendData = sourceSheet.getRange(attendRange).getValues();
    attendData[0][attendData[0].length - 1] = timeStringToFloat(attendData[0][attendData[0].length - 1]);
    attandenceSheet.appendRow([userName, inputDate].concat(attendData[0]));
    SpreadsheetApp.getUi().alert('登録完了');
}

// Check duplication insertion, if not, punch card and send ok to proceed submit
function isPunched(user, row) {
    var offset = 2;
    // Find out col number
    var col = punchUserHash.labels[user] + 3;
    var punchSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("登録状況一覧");
    // Punch: 1:punched, 0:not punched, -1:holiday
    if (punchSheet.getRange(row + offset, col).getValue() != 1) {
        return false;
    } else {
        return true;
    }
}

function punchCard(user, row) {
    var offset = 2;
    // Find out col number
    var col = punchUserHash.labels[user] + 3;
    var punchSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("登録状況一覧");
    // Punch
    punchSheet.getRange(row + offset, col).setValue(1);
    punchSheet.getRange(row + offset, col).setBackground("#68ed9b");
    punchSheet.getRange(row + offset, col).setFontColor("#68ed9b");
}

// clear input content and set default content
function clearContents() {
    var sheet = SpreadsheetApp.getActiveSheet();
    sheet.getRange(contentClearRange).clear({
        contentsOnly: true
    });
    sheet.getRange(dataValiClearRange).clear({
        validationsOnly: true
    });
    // Fill in default date, work time
    sheet.getRange(attendanceInputRange).setValues([
        [new Date()],
        ["9:00"],
        ["17:45"],
        ["1:00"],
        ["No"]
    ]);
}