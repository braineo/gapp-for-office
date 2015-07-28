// Day routine work for punchSheet to create date header, mark holidays, unchecked status
function dayRoutine() {
    var today = new Date();
    var row = dayOfYear(today);
    var offset = 2;
    var sheets = inputSheets;
    var punchCardSheet = sheets.getSheetByName("Punch");
    var memberSheet = sheets.getSheetByName("Member");
    generateDayHead(punchCardSheet, row + offset, today);
    markCellColor(punchCardSheet, row + offset, isHoliday(today));
    //sendNotification();
}

// When document is opened, jump to a row for today
function jumpToToday(e) {
    var row = dayOfYear(new Date());
    var punchCardSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Punch");
    SpreadsheetApp.setActiveRange(punchCardSheet.getRange(row, 1)); //Move activate cell to recent date
}


function onOpen(e) {
    SpreadsheetApp.getUi() // Or DocumentApp or FormApp.
        .createMenu('Custom Menu')
        .addItem('Show sidebar', 'showSidebar')
        .addToUi();
    showSidebar();
}

// Generate sub drop list
function onEdit(e) {
    var row = e.range.getRow();
    var col = e.range.getColumn();
    if (e.range.getHeight() > 1  || (e.range.getSheet().getName() in notOnEditSheet)) {
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