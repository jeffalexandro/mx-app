function readFile(fileEntry){
    fileEntry.file(function (file) {
        var reader = new FileReader();

        reader.onloadend = function() {
            // console.log("Successful file read: " + this.result);
            displayFileData(this.result);
        };
        reader.readAsText(file);

    }, function(){
        console.log("Erro ao escrever arquivo")
    });
}


function writeFile(fileEntry, dataObj) {
    // Create a FileWriter object for our FileEntry (log.txt).    
    fileEntry.createWriter(function (fileWriter) {

        fileWriter.onwriteend = function() {
            console.log("Successful file write...");
            //fileWriter.truncate(10000);
            readFile(fileEntry);
        };

        fileWriter.onerror = function (e) {
            console.log("Failed file write: " + e.toString());
        };        
        // If data object is not passed in,
        // create a new Blob instead.
        if (!dataObj) {
            dataObj = new Blob(['some file data'], { type: 'text/plain' });
        }

        fileWriter.write(dataObj);
    });
}

function displayFileData(dataFile){    
    
    console.log(dataFile);
    
    // dataFile = dataFile.trim();
    // var json = JSON.parse(dataFile); 
    // console.log(json);
}




function onFileSystemSuccess(fileSystem) {
    fileSystem.root.getFile("system_offline.json",
    {create: true, exclusive: false},
    gotFileEntry, fail);
}

function gotFileEntry(fileEntry) {
    fileObject = fileEntry;
    $$('#login_submit').on('click', function() {
        saveFileContent();
    });
}
 
function saveFileContent() {
    fileObject.createWriter(gotFileWriter, fail);
}
            
function gotFileWriter(writer) {
    var myText = document.getElementById('email_login').value;    

    writer.onwriteend = function(evt) {
        // console.log("contents of file now '"+myText+"'");        
        console.log("2");
        readFile(fileObject);
        
        writer.truncate(0);
        
        //readFile(fileObject);        
        writer.onwriteend = function(evt) {                        
            
            console.log("3");            
            readFile(fileObject);
        };
    };  
    console.log("1");
    writer.write(myText);
    readFile(fileObject);
    // writer.onwriteend = function(evt) {
    //     //$$('#message').html('<p>File contents have been written.<br /><strong>File path:</strong> ' + fileObject.fullPath + '</p>');
    //     // var reader = new FileReader();        
        
    //     // reader.readAsText(fileObject);

    //     // var reader = new FileReader();

    //     // reader.onloadend = function() {
    //     //     // console.log("Successful file read: " + this.result);
    //     //     displayFileData(this.result);
    //     // };
    //     // reader.readAsText(fileObject);
    //     // // reader.onload = function(evt) {
    //     // //     $$('#contents').html('<strong>File contents:</strong> <br />'
    //     // //         + evt.target.result);
    //     // // };

    //     readFile(fileObject);
    // };
}
 
function fail(error) {  
      alert(error.code);
}