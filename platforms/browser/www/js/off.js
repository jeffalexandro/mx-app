// Wait for Cordova to load
//

fileText = "";
fileObj = {};

//document.addEventListener("deviceready", onDeviceReady, false);

// Cordova is ready
//
// function onDeviceReady() {    

//     // Start FileObj
    
// }


// READ TEXT --------------------------------------------------------------------------------------------
function gotFS(fileSystem) {        
    fileSystem.root.getFile("arquivo_teste.txt", {create: true, exclusive: false}, gotFileEntry, fail);    
}

function gotFileEntry(fileEntry) {
    fileEntry.file(gotFile, fail);
}

function gotFile(file){
    //readDataUrl(file);
    readAsText(file);
}

function readDataUrl(file) {
    var reader = new FileReader();
    reader.onloadend = function(evt) {
        console.log("Read as data URL");
        console.log(evt.target.result);
    };
    reader.readAsDataURL(file);
}

function readAsText(file) {
    var reader = new FileReader();
    reader.onloadend = function(evt) {
        // console.log("Read as text.....");
        // console.log(evt.target.result);        

        fileText = evt.target.result;

        fileObj = JSON.parse(evt.target.result);

        console.log(fileObj);
        //fileJson = JSON.stringify(eval("(" + target.result + ")"));

        //console.log(fileJson);
    };
    reader.readAsText(file);
}


// WRITE TEXT --------------------------------------------------------------------------------------------
function writeFS(fileSystem) {
    fileSystem.root.getFile("arquivo_teste.txt", {create: true, exclusive: false}, WriteFileEntry, fail);
}

function WriteFileEntry(fileEntry) {
    fileEntry.createWriter(gotFileWriter, fail);
}

function gotFileWriter(writer) {
    writer.onwriteend = function(evt) {
        writer.truncate(11);  
        writer.onwriteend = function(evt) {
            writer.write(" different");
            writer.onwriteend = function(evt){
                console.log("Write Success");
            }
        };
    };
    writer.write(fileText);
}


//Login
function writeFSLogin(fileSystem) {
    fileSystem.root.getFile("arquivo_teste.txt", {create: true, exclusive: false}, WriteFileEntryLogin, fail);
}

function WriteFileEntryLogin(fileEntry) {
    fileEntry.createWriter(
        function(writer) {
            fileObj.email = $$("#email_login").val();
            fileObj.password = $$("#password_login").val();
            fileObj.name = $$("#user_name").html();
            fileObj.logged_in = 1;

            json = JSON.stringify(fileObj);

            writer.onwriteend = function(evt) {
                writer.truncate(0);  
                writer.onwriteend = function(evt) {
                    writer.write(json);
                    writer.onwriteend = function(evt){
                        console.log("Write Success");
                    }
                };
            };
            writer.write(json);
        }
        , fail
    );
}


// Logout
function writeFSLogout(fileSystem) {
    fileSystem.root.getFile("arquivo_teste.txt", {create: true, exclusive: false}, WriteFileEntryLogout, fail);
}

function WriteFileEntryLogout(fileEntry) {
    fileEntry.createWriter(
        function(writer) {
            fileObj.email = "";
            fileObj.password = "";
            fileObj.name = "";
            fileObj.logged_in = 0;
            //fileObj = {};

            json = JSON.stringify(fileObj);

            writer.onwriteend = function(evt) {
                writer.truncate(0);  
                writer.onwriteend = function(evt) {
                    writer.write(json);
                    writer.onwriteend = function(evt){
                        console.log("Write Success");
                    }
                };
            };
            writer.write(json);
        }
        , fail
    );
}



// Lista de tarefas
function writeFSDefault(fileSystem) {
    fileSystem.root.getFile("arquivo_teste.txt", {create: true, exclusive: false}, WriteFileEntryDefault, fail);
}

function WriteFileEntryDefault(fileEntry) {
    fileEntry.createWriter(
        function(writer) {
            
            json = JSON.stringify(fileObj);

            writer.onwriteend = function(evt) {
                writer.truncate(0);  
                writer.onwriteend = function(evt) {
                    writer.write(json);
                    writer.onwriteend = function(evt){
                        console.log("Write Success");
                    }
                };
            };
            writer.write(json);
        }
        , fail
    );
}


// Commum
function fail(evt) {
    console.log(evt.target.error.code);
}

