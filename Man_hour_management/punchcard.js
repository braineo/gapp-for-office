// set row color
// @param holiday:boolean
function markCellColor(sheet, row, holiday) {
    var header = sheet.getRange("1:1").getValues();
    var len = header[0].length - 2;
    if (!holiday) {
        sheet.getRange(row, 3, 1, len).setBackground("#FF0000");
        sheet.getRange(row, 3, 1, len).setValues(createValues(len, 0));
        sheet.getRange(row, 3, 1, len).setFontColor("#FF0000");
    } else {
        sheet.getRange(row, 3, 1, len).setBackground("#CCCCCC");
        sheet.getRange(row, 3, 1, len).setValues(createValues(len, -1));
        sheet.getRange(row, 3, 1, len).setFontColor("#CCCCCC");
    }
}

function isHoliday(date) {
    var calendar = CalendarApp.getCalendarById(
        'ja.japanese#holiday@group.v.calendar.google.com');
    var events = calendar.getEventsForDay(date);
    return (events.length > 0 || date.getDay() == 0 || date.getDay() == 6);
}


// Create day header. e.g. 2015/7/27 MON
function generateDayHead(sheet, row, today) {
    sheet.getRange(row, 1).setValue(today);
    sheet.getRange(row, 2).setValue(getWeekDay(today.getDay()));
}
