function findCell(value) {
    // find row number of cell value
    // if IMEI is sorted should implement binary search
    var columns = SpreadsheetApp.getActiveSheet().getDataRange().getValues();
    for (var i = 0; i < columns.length; i++) {
        // column E: IMEI
        if(columns[i][4] == value){ 
            return i+1;
        }
    }
      return -1
}

function updateCells(row){
  sheet = SpreadsheetApp.getActiveSheet();
    //Status: G9 7,9
    status = sheet.getRange(9, 7).getValue();
    //Location:E9
    location = sheet.getRange(9, 5).getValue();
    //Person: F9
    person = sheet.getRange(9, 6).getValue();
    sheet.getRange(row, 9).setValue(status);
    sheet.getRange(row, 10).setValue(location);
    sheet.getRange(row, 11).setValue(person);
    sheet.getRange(row, 12).setValue(new Date());
    sheet.getRange(row, 14).setValue("○")
}

function onEdit(e) {
    var range = e.range; 
    //range.setNote('Last modified: ' + new Date() + e.range);
    // Ignore if length not equal to 15 (not IMEI)
    if (e.value.length == 15){
        var row = findCell(e.value);
        updateCells(row);
    }
}