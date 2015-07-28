/**
 * Global variables
 */

// Database sheet
var databaseSheet = SpreadsheetApp.openById('1jbj7zbpqvkKXF-QjLq0S3Lw21f_fBsAweKbiwE9j5Ig').getSheets()[0];
var recordRange = "E3:I24";
var attendRange = "K2:O2";
var contentClearRange = "E3:H24";
var dataValiClearRange = "F3:G24";
var inputDateCell = "C2";
var attendanceInputRange = "C2:C6";
var okToSubmit = "C15";
var rowStart = 3;
var rowEnd = 24;

// Attandence sheet
var attandenceSheet = SpreadsheetApp.openById('1dpdU3CgIamunwLS_Opv5zrNCVypE6AEAn80iZXbRMic').getSheets()[0];
var inputSheets = SpreadsheetApp.openById('1onEux9Kjr6TM8dACPnwUHz0ovOwC4cNHociMUWIiG-I');
// Drop List sheet @param string[][]
var dropList = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("List").getDataRange().getValues();

// Hash map for main drop list
var dropListHash = {
    labels: {},
    init: function() {
        for (var i = 1; i < dropList.length; i++) {
            dropListHash.labels[dropList[i][0]] = i;
        }
    }
};
dropListHash.init();

var punchUserHash = {
    labels: {},
    init: function() {
        var userList = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Member").getDataRange().getValues();
        // Find out col number
        for (var i = 0; i < userList.length; i++) {
            punchUserHash.labels[userList[i][0]] = i;
        }
    }
};
punchUserHash.init();


// retrieve user data
function getCurrentUser() {
    return Session.getActiveUser().getEmail();
}

// @param day:int
// @return string
// 0:SUN 1:MON etc
function getWeekDay(day) {
    var weekDay = {
        1: '月',
        2: '火',
        3: '水',
        4: '木',
        5: '金',
        6: '土',
        0: '日'
    };
    return weekDay[day];
}

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

// Covert time string to decimal format: 2:30->2.50
function timeStringToFloat(time) {
    var hours = time.getHours();
    var minutes = time.getMinutes();
    return hours + minutes / 60;
}

function include(filename) {
    return HtmlService.createHtmlOutputFromFile(filename)
        .setSandboxMode(HtmlService.SandboxMode.IFRAME)
        .getContent();
}
