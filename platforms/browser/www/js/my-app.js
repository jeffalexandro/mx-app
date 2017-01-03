// Initialize app
var myApp = new Framework7({
	material: true,
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
        			//myApp.formFromJSON('#my-form', data.info);

        			$$("#user_name").html(data.info.user_name);        			
        			myApp.closeModal('.login-screen');
        		}
        		else{
        			myApp.alert(data.error_msg, 'Ops!');
        			// window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function (fs) {
        			// 	console.log('file system open: ' + fs.name);
        			// 	fs.root.getFile("newPersistentFile.txt", { create: true, exclusive: false }, function (fileEntry) {
        			// 		console.log("fileEntry is file?" + fileEntry.isFile.toString());
		         //                	// fileEntry.name == 'someFile.txt'
		         //                	// fileEntry.fullPath == '/someFile.txt'
		         //                	writeFile(fileEntry, "Teste123");
		         //                	//writeFile(fileEntry, false);
		         //                }, function(){
		         //                	console.log("Erro on create file")
		         //                });

        			// }, function(){
        			// 	console.log("Erro ao carregar plugin")
        			// });

        			myApp.closeModal('.login-screen');
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


myApp.onPageInit('index', function (page) {
	//myApp.alert("Exemplo de notificação");
});

// Option 1. Using page callback for page (for "about" page in this case) (recommended way):
myApp.onPageInit('about', function (page) {
	$$('.open_alert').click(function () {
		myApp.alert("Exemplo de notificação");
	})
});



myApp.onPageInit('listar_entrega_coleta', function (page) {

	$$.getJSON (
		'http://messenger.com.br/app/controller.php',
		{ request_key: 'get_lista_coleta_entrega' },
		function (data) {

		var html = "";

		$$.each(data, function (index, value) {

			if (index != "sucesso")
			{
				console.log(value);
				$$.each(value.awb_lista, function (index_j, value_j) {

					html +='<li class="card accordion-item"> <a href="#" class="item-content item-link">\
						 	<div class="card-header item-inner">\
						 		<div class="list-block">\
		      						<ul>\
		      							<li>\
		      								<div class="row">\
		      									<div class="col-60">\
		      										<strong>'+value_j.nome_contato+'</strong>\
		      									</div>\
		      									<div class="col-40">\
				      								<div class="chip">\
		    											<div class="chip-label">'+value_j.nome+'</div>\
		  											</div>\
	  											</div>\
	  										</div>\
		      							</li>\
		      							<li>'+value_j.cep+' - '+value_j.rua+' nº '+value_j.numero+'</li>\
		      						</ul>\
		      					</div>\
						 	</div></a>\
					  		<div class="card-content accordion-item-content">\
					    			<div class="card-content-inner">\
					    				<p>Código AWB: <strong>'+value_j.awb+'</strong></p>\
					    				<p>Rota: <strong>'+value_j.NOME+'</strong></p>\
					    				<p>CEP: <strong>'+value_j.cep+'</strong></p>\
					    				<p>Endereço: <strong>'+value_j.rua+' nº '+value_j.numero+'</strong></p>\
					    				<p>Bairro: <strong>'+value_j.bairro+'</strong></p>\
					    				<p>Cidade: <strong>'+value_j.cidade+'</strong></p>\
					    				<p>Estado: <strong>'+value_j.estado+'</strong></p>\
					    				<p>Complemento: <strong>'+value_j.complemento+'</strong></p>\
					    				<p>Nome Contato: <strong>'+value_j.nome_contato+'</strong></p>\
					    				<p>Tel Contato: <strong>'+value_j.telefone_contato+'</strong></p>\
					    			</div>\
					  		</div>\
						</div>';

					// html +='<li class="card accordion-item"> <a href="#" class="item-content item-link">\
					// 	 	<div class="card-header item-inner"><strong>'+value_j.awb+'</strong>'+value_j.nome+'</div></a>\
					//   		<div class="card-content accordion-item-content">\
					//     			<div class="card-content-inner">\
					//     				<p>Rota: '+value_j.NOME+'</p>\
					//     				<p>CEP: '+value_j.cep+'</p>\
					//     				<p>Endereço: '+value_j.rua+', '+value_j.numero+', '+value_j.complemento+'</p>\
					//     				<p>Nome Contato: '+value_j.nome_contato+'</p>\
					//     				<p>Tel Contato: '+value_j.telefone_contato+'</p>\
					//     			</div>\
					//   		</div>\
					// 	</div>';

					// html += '<li class="accordion-item"><a href="#" class="item-content item-link">\
					// 	<div class="item-inner">\
					// 		<div class="item-title">'+value_j.awb+'</div>\
					// 	</div></a>\
					// 	<div class="accordion-item-content">\
					// 		<div class="content-block">\
					// 			<p>Endereço: '+value_j.rua+', '+value_j.numero+', '+value_j.complemento+'</p>\
					// 			<p>Contato: Nome </p>\
					// 			<a href="detalhe_entrega_coleta.html" class="button button-fill button-raised">Ver mais...</a>\
					// 		</div>\
					// 	</div>\
					// </li>';

				});

			}



		});

		$$("#accordion_listar").html(html);

	})
});