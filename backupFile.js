function backupCurrFile() {
    var fileId = File.getId();
    var file = DriveApp.getFileById(fileId);
    File.makeCopy()
}

function setNextBackup() {
    
}

