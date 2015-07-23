/* cardUI
 * generate day and weekday every day
 * markout who did not punch in previous day
 */

// Day of year
function dayOfYear(date) {
    if (!(date instanceof Date)) {
        return 0;
    }
    var start = new Date(date.getFullYear(), 0, 0);
    var diff = date - start;
    var oneDay = 86400000; // (1000*60*60*24)
    return Math.floor(diff / oneDay);
}

function dayRoutine() {
    var row = dayOfYear(new Date());
    var offset = 2;
    var sheets = SpreadsheetApp.openById('1d3jLeX_FcNEEq_bQvcK7LRKQnq01-8hKHH5JSR_HH5k');
    var punchCardSheet = sheets.getSheetByName("Punch");
    var memberSheet = sheets.getSheetByName("Member");
    generateDayHead(punchCardSheet, row + offset);
    markCellColor(punchCardSheet, row + offset);
    sendNotification();
}

function generateDayHead(sheet, row) {
    var today = new Date();
    sheet.getRange(row, 1).setValue(today);
    var weekDay = {
        1: '月',
        2: '火',
        3: '水',
        4: '木',
        5: '金',
        6: '土',
        0: '日'
    };
    sheet.getRange(row, 2).setValue(weekDay[today.getDay()]);
}

function markCellColor(sheet, row) {
    var header = sheet.getRange("1:1").getValues();
    sheet.getRange(row, 3, row, header[0].length).setBackground("#FF7791");
    sheet.getRange(row, 3, row, header[0].length).setValues(createValues(header[0].length, 0));
    sheet.getRange(row, 3, row, header[0].length).setFontColor("#FF7791");
}

function sendNotification() {
    var today = new Date();
    if (today.getDay() == 1) {
        var email = "binbin.ye@g.softbank.co.jp";
        GmailApp.sendEmail(email, "[Reminder]工数集計状況の確認", "お疲れ様です。工数集計状況を確認してください。");
    }

}

function onOpen(e) {
    var row = dayOfYear(new Date());
    var punchCardSheet = SpreadsheetApp.openById('1d3jLeX_FcNEEq_bQvcK7LRKQnq01-8hKHH5JSR_HH5k').getSheetByName("Punch");
    SpreadsheetApp.setActiveRange(punchCardSheet.getRange(row + 10, 1)); //Move activate cell to recent date
}

// create 2d array [[value]*length]
function createValues(length, value) {
    array = [
        []
    ];
    for (var i = length; i < length; array[0][i] = value, i++);
    return array;
}

function isHoliday(date) {

}
