/**
 * Global variables
 */

// Database sheet
var databaseSheet = SpreadsheetApp.openById('1jbj7zbpqvkKXF-QjLq0S3Lw21f_fBsAweKbiwE9j5Ig').getSheets()[0];
var recordRange = "B3:F24";
var attendRange = "K2:P2";
var inputDateCell = "I2";
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

        // Test to check hash tabel
        for (var key in dropListHash.labels) {
            Logger.log("key: %s, value: %s", key, dropListHash.labels[key]);
        }

    }
};
dropListHash.init();

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
 * Check if it is ready to submit
 */
function submit() {
    var sheet = SpreadsheetApp.getActiveSheet();
    var ui = SpreadsheetApp.getUi();
    var row = dayOfYear(sheet.getRange("I2").getValue());
    var status = sheet.getRange("I15").getValue(); // OK to submit flag: I15
    if (status == 'NG') {
        ui.alert('記入内容を修正してください。')
    } else if (!dateNotChecked(getCurrentUser(), row)) { // Cell I2 is Date
        ui.alter('この日はすでに記録があります。日付をチェックしてください。')
    } else if (ui.alert("記入内容を登録するか", ui.ButtonSet.YES_NO) == ui.Button.YES) {
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
    Logger.log(content);
    for (var i = 0; i < content.length; i++) {
        if (content[i][0] == "OK") { // Record is Ok to submit flag:
            Logger.log(content[i][content[i].length - 1])
            content[i][content[i].length - 1] = timeStringToFloat(content[i][content[i].length - 1]);
            databaseSheet.appendRow([userName, inputDate].concat(content[i].slice(1)));
        }
    }
    // Append items to attendance sheet
    var attendData = sourceSheet.getRange(attendRange).getValues();
    attandenceSheet.appendRow([userName].concat(attendData[0]));
    // Add records in punch card
    punchCard(userName, inputDate);
    SpreadsheetApp.getUi().alert('登録完了');
}

/**
 * Check duplication insertion
 */
function dateNotChecked(user, row) {
    if ((user instanceof String) && (row instanceof Number)) {
        var offset = 1;
        var userTable = punchCardSheet.getSheetByName("Member").getDataRange().getValues();
        var col = -1;
        for(var i=0; i<userTable.length;i++){
            if(user == userTable[i][0]){
                col = i+3;
            }
        }
        return punchCardSheet.getSheetByName().getRange(row + offset, col).isBlank();
    }
}

// Mark date for user in Punch card
function punchCard(user, date) {
    
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
    //Clear input area C3, F24
    sheet.getRange("C3:F24").clear({
        contentsOnly: true
    });
    sheet.getRange("D3:E24").clear({
        validationsOnly: true
    });
    // Fill in default date, work time
    sheet.getRange("I2:I6").setValues([
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
    Logger.log(e.range.getRow());
    if (e.range.getHeight() > 1) {
        return void(0);
        Logger.log(e.range.getHeight());
    }
    // When main class is selected
    var cell = e.range.getSheet().getRange(row, col + 1);
    if (row <= rowEnd && row >= rowStart && col == 3) { // set sub class items
        var rule = SpreadsheetApp.newDataValidation().requireValueInList(dropList[dropListHash.labels[e.value]].slice(1), true).build();
        cell.setDataValidation(rule);
        // Set phase items
        cell = e.source.getActiveSheet().getRange(row, col + 2);
        if (dropListHash.labels[e.value] != dropList.length - 2) {
            cell.clearDataValidations();
            cell.setValue("-");
        } else {
            var rule = SpreadsheetApp.newDataValidation().requireValueInList(dropList[dropList.length - 1].slice(1), true).build();
            cell.setDataValidation(rule);
        }
    }
}

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
    var a = new String();
    console.log(typeof a);
}
