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

//Punch Card sheet
var punchCardSheet = SpreadsheetApp.openById('1d3jLeX_FcNEEq_bQvcK7LRKQnq01-8hKHH5JSR_HH5k');

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
        var userList = punchCardSheet.getSheetByName("Member").getDataRange().getValues();
        // Find out col number
        for (var i = 0; i < userList.length; i++) {
            punchUserHash.labels[userList[i][0]] = i;
        }
    }
};
punchUserHash.init();

/* Flag cells, condination is (row, col)
* OK to submit flag: H8 (8,8)
* Record is Ok flag: A4-A25 (4,1)-(25,1)

/**
 * Get Current Google User
 */

function getCurrentUser() {
    return Session.getActiveUser().getEmail();
}

/**
 * When submit is pressed
 */
function submit() {
    var sheet = SpreadsheetApp.getActiveSheet();
    var ui = SpreadsheetApp.getUi();
    var date = sheet.getRange(inputDateCell).getValue();
    var weekDay = {
        1: '月',
        2: '火',
        3: '水',
        4: '木',
        5: '金',
        6: '土',
        0: '日'
    };
    var row = dayOfYear(date); //convert date into row number
    var status = sheet.getRange(okToSubmit).getValue();
    if (status == 'NG') {
        ui.alert('記入内容を修正してください。');
    } else if (isPunched(getCurrentUser(), row)) {
        ui.alert('この日はすでに記録があります。日付をチェックしてください。');
    } else if (ui.alert(String(date.getMonth() + 1) + "月" + String(date.getDate()) + "日" + "(" + weekDay[date.getDay()] + ")分の記入内容を登録しますか？",
            ui.ButtonSet.YES_NO) == ui.Button.YES) {
        // Add records in punch card
        punchCard(getCurrentUser(), row);
        insertNewRecords(sheet);
    }
}

/**
 * Insert new records to database sheet
 */
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

/**
 * Check duplication insertion, if not, punch card and send ok to proceed submit
 */
function isPunched(user, row) {
    var offset = 2;
    // Find out col number
    var col = punchUserHash.labels[user] + 3;
    var punchSheet = punchCardSheet.getSheetByName("Punch");
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
    var punchSheet = punchCardSheet.getSheetByName("Punch");
    // Punch
    punchSheet.getRange(row + offset, col).setValue(1);
    punchSheet.getRange(row + offset, col).setBackground("#68ed9b");
    punchSheet.getRange(row + offset, col).setFontColor("#68ed9b");
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

/**
 * Clear Current Table
 */
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

/**
 * Generate sub drop list
 */

function onEdit(e) {
    var row = e.range.getRow();
    var col = e.range.getColumn();
    if (e.range.getHeight() > 1) {
        return void(0);
    }
    if (e.value === undefined) {
        e.range.getSheet().getRange(row, col + 1, 1, 2).clear({
            contentsOnly: true,
            validationsOnly: true
        });
    } else {
        // When main class is selected
        var cell = e.range.getSheet().getRange(row, col + 1);
        if (row <= rowEnd && row >= rowStart && col == 5) { // set sub class items
            var rule = SpreadsheetApp.newDataValidation().requireValueInList(dropList[dropListHash.labels[e.value]].slice(1), true).build();
            cell.setDataValidation(rule);
            // Set phase items
            cell = e.source.getActiveSheet().getRange(row, col + 2);
            if (dropListHash.labels[e.value] != 1) {
                cell.clearDataValidations();
                cell.setValue("-");
            } else {
                var rule = SpreadsheetApp.newDataValidation().requireValueInList(dropList[dropList.length - 1].slice(1), true).build();
                cell.setDataValidation(rule);
            }
        }
    }
}


// Covert time string to decimal format: 2:30->2.50
function timeStringToFloat(time) {
    var hours = time.getHours();
    var minutes = time.getMinutes();
    return hours + minutes / 60;
}

/**
 * UI related
 */

function onOpen(e) {
    SpreadsheetApp.getUi() // Or DocumentApp or FormApp.
        .createMenu('Custom Menu')
        .addItem('Show sidebar', 'showSidebar')
        .addToUi();
    showSidebar();
}

function showSidebar() {
    var html = HtmlService.createTemplateFromFile('Sidebar').evaluate()
        .setSandboxMode(HtmlService.SandboxMode.IFRAME);

    SpreadsheetApp.getUi() // Or DocumentApp or FormApp.
        .showSidebar(html);
}

function include(filename) {
    return HtmlService.createHtmlOutputFromFile(filename)
        .setSandboxMode(HtmlService.SandboxMode.IFRAME)
        .getContent();
}

function nipp() {
    var sheet = SpreadsheetApp.getActiveSheet();
    insertNewRecords(sheet);
}