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
    markMiss(punchCardSheet, row + offset);
    sendNotification(memberSheet, findMissing(punchCardSheet, row + offset - 1))
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

function markRed(sheet, row) {
    var header = sheet.getRange("1:1").getValues();
    sheet.getRange(row, 3, row, header.length).setBackground("#FF7791");
}

function sendNotification(memberSheet, missingList) {
    for(var i = 0; i < missingList.length; i++ ){
        var email = memberSheet.getRange(i,1).getValue();
        GmailApp.sendEmail(email, "工数入力の入力", "abcdefg");
    }
}

function findMissing(sheet, row){
    var notFilled = [];
    // ignore when it is weekend
    if(["土", "日"].indexOf(sheet.getRange(row, 2).getValue()) < 0){
        return notFilled;
    }
    var header = sheet.getRange("1:1").getValues();
    for (var i = 3; i <= header[0].length; i++) {
        if (sheet.getRange(row, i).isBlank()) {
            notFilled.append(i);
        }
    }
    return notFilled;
}

function onOpen(e) {
    var row = dayOfYear(new Date());
    var punchCardSheet = SpreadsheetApp.openById('1d3jLeX_FcNEEq_bQvcK7LRKQnq01-8hKHH5JSR_HH5k').getSheetByName("Punch");
    SpreadsheetApp.setActiveRange(punchCardSheet.getRange(row + 10, 1)); //Move activate cell to recent date
}
