// Initialize app
var myApp = new Framework7({
	materialPageLoadDelay: 1,
	materialRipple: true,
	onAjaxStart: function (xhr) {
		myApp.showIndicator();
	},
	onAjaxComplete: function (xhr) {
		myApp.hideIndicator();
	}
});

// If we need to use custom DOM library, let's save it to $$ variable:
var $$ = Dom7;

// Add view
var mainView = myApp.addView('.view-main', {
    // Because we want to use dynamic navbar, we need to enable it for this view:
    material: true,
    // Enable Template7 pages
    template7Pages: true
});

// Handle Cordova Device Ready Event
$$(document).on('deviceready', function() {

	console.log("Device is ready!");

	 // On click in area label next to input, focus in imput into this area
	$$('.item-content').click(function () {
		$$("#"+$$(this).data('for')).focus();
	});


   	 // ON LOGIN SUBMIT ------------------------------------------------------------------------------------------------------------------------
    	$$('#login_form').on('submitted', function (e) {
        		var xhr = e.detail.xhr; // actual XHR object
        		var data = JSON.parse(e.detail.data); // Ajax response from action file

		if(data.sucesso == 1) {
        			myApp.formFromJSON('#my-form', data.info);
        			myApp.closeModal('.login-screen');
        		}
        		else{
        			myApp.alert(data.error_msg, 'Ops!');
        			window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function (fs) {
		        			console.log('file system open: ' + fs.name);
		        			fs.root.getFile("newPersistentFile.txt", { create: true, exclusive: false }, function (fileEntry) {

		        			console.log("fileEntry is file?" + fileEntry.isFile.toString());
		                        	// fileEntry.name == 'someFile.txt'
		                        	// fileEntry.fullPath == '/someFile.txt'
		                        	writeFile(fileEntry, "Teste123");
		                        	//writeFile(fileEntry, false);

		                    	}, function(){
		        			console.log("Erro on create file")
		                    	});

		        	}, function(){
		        		console.log("Erro ao carregar plugin")
		        	});
		}
        	// do something with response data
    	});

    	$$('.ajax-submit').on('submitError', function (e) {
    		myApp.alert("Erro durante requisição ao servidor", 'Ops!');
    		myApp.closeModal('.login-screen');
    	});

    	$$('form.ajax-submit').on('form:success', function (e) {
      		var xhr = e.detail.xhr; // actual XHR object
      		var data = e.detail.data; // Ajax response from action file
      		// do something with response data
  	});

    	// ON LOGIN SUBMIT FINISH ------------------------------------------------------------------------------------------------------------------------
});


// ON BACKBUTTON CLICKED ------------------------------------------------------------------------------------------------------------------------
$$(document).on("backbutton", function () {
	if(myApp.getCurrentView().activePage.name == "index"){
		myApp.confirm('Deseja sair?', 'Sair',
			function () {
				navigator.app.exitApp();
                // myApp.closeModal('.login-screen');
                // navigator.app.backHistory();
            },
            function () {
            	return false;
            });
	}
	else {
		mainView.router.back();
	}
});


// Option 1. Using page callback for page (for "about" page in this case) (recommended way):
myApp.onPageInit('about', function (page) {
	$$('.open_alert').click(function () {
		myApp.alert("Exemplo de notificação");
	})
});


myApp.onPageInit('listar_entrega_coleta', function (page) {
	//myApp.alert("Exemplo de notificação");
});