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
    var punchCardSheet = SpreadsheetApp.openById('1d3jLeX_FcNEEq_bQvcK7LRKQnq01-8hKHH5JSR_HH5k').getSheetByName("Punch");
    generateDayHead(punchCardSheet, row + offset);
    markMiss(punchCardSheet, row + offset);
}

function generateDayHead(sheet, row) {
    var today = new Date();
    sheet.getRange(row, 1).setValue(today);
    var weekDay = { 1: '月', 2: '火', 3: '水', 4: '木', 5: '金', 6: '土', 7: '日' };
    sheet.getRange(row, 2).setValue(weekDay[today.getDay()]);
}

function markMiss(sheet, row) {
  var header = sheet.getRange("1:1").getValues();
  Logger.log(header);
    for(var i=3; i<=header[0].length; i++){
        if(sheet.getRange(row, i).isBlank()){
            sheet.getRange(row, i).setBackground("red");
        }
    }
}

function onOpen(e){
    var row = dayOfYear(new Date());
    var punchCardSheet = SpreadsheetApp.openById('1d3jLeX_FcNEEq_bQvcK7LRKQnq01-8hKHH5JSR_HH5k').getSheetByName("Punch");
    SpreadsheetApp.setActiveRange(punchCardSheet.getRange(row, 1));
} 