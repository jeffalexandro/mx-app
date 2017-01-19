
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
	},
	modalButtonCancel: 'Calcelar'
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
        			myApp.alert(data.error_msg, 'Usuário ou senha incorretos!');
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

        			//myApp.closeModal('.login-screen');
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

		$$.each(data.awb_lista, function (index, value_j) {
				
			ranger = "";
			if(value_j.nome == "Coleta") {
				ranger = '<div class="chip">\
							<div class="chip-label"><b>'+value_j.data_inicio+'</b> até <b>'+value_j.data_final+'</b></div>\
						</div>';
				action = "PDC";
			}
			else {
				action = "PDE";
			}


			if (value_j.status == 0) {
				var card_color = "";
				var btn_init = '<button class="button button-fill button-raised color-green iniciar_coleta_entrega" id="iniciar_coleta_entrega_'+value_j.rota_log_id+'"/>Iniciar</button>\
								<button class="button button-fill button-raised color-red cod_disp_coleta_entrega" id="cod_disp_coleta_entrega_'+value_j.rota_log_id+'"/>Cód. de Pendência</button>';
			}
			else if(value_j.status == 1){
				var card_color = "card_green";
				var btn_init = '<button class="button button-fill button-raised pod_coleta_entrega" id="pod_coleta_entrega_'+value_j.rota_log_id+'"/>'+action+'</button>\
								<button class="button button-fill button-raised color-red cod_disp_coleta_entrega" id="cod_disp_coleta_entrega_'+value_j.rota_log_id+'"/>Cód. de Pendência</button>';
			}
			else if(value_j.status == 2){
				var card_color = "card_blue";
				var btn_init = '';	
			}
			else {
				var card_color = "card_red";
				var btn_init = '';	
			}



			html +='<li class="card '+card_color+' accordion-item"> <a href="#" class="item-content item-link">\
				 	<div class="card-header item-inner">\
				 		<div class="list-block small-text">\
      						<ul>\
      							<li>\
      								<div class="row">\
      									<div class="col-60">\
      										<strong>'+value_j.nome_empresa+'</strong>\
      									</div>\
      							</li>\
      							<li>'+value_j.cep+' - '+value_j.rua+' nº '+value_j.numero+'</li>\
      							<li>'+ranger+'</li>\
      						</ul>\
      					</div>\
				 	</div></a>\
			  		<div class="card-content accordion-item-content">\
		    			<div class="card-content-inner">\
		    				<h3>Informações</h3><hr/>\
		    				<p>Código AWB: <strong>'+value_j.awb+'</strong></p>\
		    				<p>CEP: <strong>'+value_j.cep+'</strong></p>\
		    				<p>Endereço: <strong>'+value_j.rua+' nº '+value_j.numero+'</strong></p>\
		    				<p>Bairro: <strong>'+value_j.bairro+'</strong></p>\
		    				<p>Cidade: <strong>'+value_j.cidade+'</strong></p>\
		    				<p>Estado: <strong>'+value_j.estado+'</strong></p>\
		    				<p>Complemento: <strong>'+value_j.complemento+'</strong></p>\
		    				<p>Nome Contato: <strong>'+value_j.nome_contato+'</strong></p>\
		    				<p>Tel Contato: <strong>'+value_j.telefone_contato+'</strong></p>\
		    				<hr/>';

		    				// $$.each(data.awb_lista.mercadorias, function (index_m, value_m) {
		    					html +='<p>Descrição: <strong>'+value_j.mercadorias[0].descricao+'</strong></p>\
		    							<p>Peso: <strong>'+value_j.peso+'</strong></p>';
		    				// });

		    				
		    		html +='<hr/>\
		    				<p class="buttons-row">\
							  	'+btn_init+'\
							</p>\
		    			</div>\
			  		</div>\
				</div>';				
		});

		$$("#accordion_listar").html(html);


		$$('.iniciar_coleta_entrega').on('click', function (e) {						    

			var id = this.id.substring(23);

		    myApp.confirm('Deseja iniciar esse evento?', 'Confirmação', function () {
		        $$.getJSON (
					'http://messenger.com.br/app/controller.php',
					{ request_key: 'iniciar_coleta_entrega', item: id },
					function (data) {						
						myApp.alert('', 'Evento iniciado', function () { mainView.router.refreshPage(); });
					});
		    });
		});


		$$('.pod_coleta_entrega').on('click', function (e) {
			
			var id = this.id.substring(19);
						
			var data = new Date();
			
			getMonth = data.getMonth();
			getDate = data.getDate();
			getHours = data.getHours();
			getMinutes = data.getMinutes();

			if (data.getMonth() < 9)getMonth = '0' + (data.getMonth() + 1);
			if (data.getDate() <10)getDate = '0' + data.getDate();
			if (data.getHours() <10)getHours = '0' + data.getHours();
			if (data.getMinutes() <10)getMinutes = '0' + data.getMinutes();

			var str_data = getDate + '/' + getMonth + '/' + data.getFullYear();
			var str_hora = getHours + ':' + getMinutes;


			var form = '<div class="list-block">\
							<ul>\
								<li class="item-content">\
      								<div class="item-inner">\
      									<div class="item-input">\
      										<input type="text" name="pod_entrega_coleta_nome" id="pod_entrega_coleta_nome" placeholder="Nome" />\
      									</div>\
      								</div>\
      							</li>\
      							<li class="item-content">\
      								<div class="item-inner">\
      									<div class="item-input">\
      										<input type="text" name="pod_entrega_coleta_doc" id="pod_entrega_coleta_doc" placeholder="Documento" />\
      									</div>\
      								</div>\
      							</li>\
      							<li class="item-content">\
      								<div class="item-inner">\
      									<div class="item-input">\
      										<input type="text" name="pod_entrega_coleta_data" id="pod_entrega_coleta_data" value="'+str_data+'" readonly />\
      									</div>\
      								</div>\
      							</li>\
      							<li class="item-content">\
      								<div class="item-inner">\
      									<div class="item-input">\
      										<input type="text" name="pod_entrega_coleta_hora" id="pod_entrega_coleta_hora" value="'+str_hora+'" readonly />\
      									</div>\
      								</div>\
      							</li>\
							</ul>\
						</div>';

		    myApp.confirm(form, 'Confirmação de Entrega/Coleta', function () {
		        $$.getJSON (
					'http://messenger.com.br/app/controller.php',
					{ 	request_key: 'pod_coleta_entrega', 
						item: id,
						nome: $$("#pod_entrega_coleta_nome").val(),
						doc: $$("#pod_entrega_coleta_doc").val(),
						data: $$("#pod_entrega_coleta_data").val(),
						hora: $$("#pod_entrega_coleta_hora").val(),
					},
					function (data) {
						if(data.sucesso){
							myApp.alert('', 'Confirmação de Entrega/Coleta informada com sucesso', function () { mainView.router.refreshPage(); });	
						}
						else{
							myApp.alert('', 'Ocorreu um erro ao salvar informações, tente novamente.');	
						}
						
					});
		    });

		});


		$$('.cod_disp_coleta_entrega').on('click', function (e) {	
			
			var id = this.id.substring(24);

			var form = '<div class="list-block">\
							<ul>\
								<li class="item-content">\
      								<div class="item-inner">\
      									<div class="item-input">\
      										<select>\
												<input type="text" name="cod_disp_entrega_coleta_descricao" id="cod_disp_entrega_coleta_descricao" placeholder="Informe um código de pendência" / >\
								            </select>\
      									</div>\
      								</div>\
      							</li>\
							</ul>\
						</div>';
						// <option value="" hidden="">Selecione um código</option><option value="1">CONSOLIDAÇAO DISPONIVEL PARA LIBERAÇÃO</option><option value="2">BIOLOGICO</option><option value="3">CARGA DANIFICADA</option><option value="4">CARGA DANIFICADA NA EMBALAGEM</option><option value="5">CARGA DANIFICADA NO CONTEUDO</option><option value="6">CARGA DANIFICADA OUTROS</option><option value="7">CAREGA ATRASADA</option><option value="8">CAREGA ATRASADA POR INTEMPERIES</option><option value="9">CAREGA ATRASADA POR ALAGAMENTO</option><option value="10">CAREGA ATRASADA POR CHUVAS</option><option value="11">CARGA ATRASADA POR OUTROS</option><option value="12">CONSIGNATÁRIO NOTIFICADO</option><option value="13">CONSIGNATÁRIO NOTIFICADO - PRIMEIRA NOTIFICACAO</option><option value="14">CONSIGNATÁRIO NOTIFICADO - SEGUNDA NOTIFICACAO</option><option value="15">CONSIGNATÁRIO NOTIFICADO - TERCEIRA NOTIFICACAO</option><option value="16">ENTREGA EM CAIXA POSTAL</option><option value="17">CARGA A RETIRAR PELO CONSIGNATÁRIO</option><option value="18">CONFLITO CEP/LOCALIDADE</option><option value="19">DESTINATÁRIO AUSENTE</option><option value="20">DEVOLVIDO A MESSENGER</option><option value="21">DEVOLVIDO A MESSENGER PELOS CORREIOS</option><option value="22">DEVOLVIDO A MESSENGER PELA JAD</option><option value="23">DEVOLVIDO A MESSENGER PELO AGENTE</option><option value="24">DEVOLVIDO A MESSENGER POR OUTROS</option><option value="25">ENTREGUE </option><option value="26">CARGA PERIGOSA</option><option value="27">TRANFERIDA PARA DI</option><option value="28">MANIFESTO RECEBIDO PARA PROCESSAMENTO</option><option value="29">MANIFESTO SUBMETIDO A ADUANA</option><option value="30">DECLARAÇÃO DE IMPORTAÇÃO SUBMETIDA A ADUANA</option><option value="31">PRESENÇA DE CARGA SUBMETIDA</option><option value="32">CARGA DESTRUIDA</option><option value="33">CARGA DESTRUIDA - SOLICITAÇAO REMETENTE</option><option value="34">CARGA DESTRUIDA - DESTINATÁRIO</option><option value="35">CARGA DESTRUIDA - DECURSO DE PRAZO</option><option value="36">CARGA DESTRUIDA - ADUANA</option><option value="37">CARGA DESTRUIDA - ANVISA</option><option value="38">CARGA DESTRUIDA - VIGIAGRO</option><option value="39">CARGA DESTRUIDA - OUTROS</option><option value="40">EMBALAGEM EM ANALISE</option><option value="41">ENTREGAS NAS CAPITAIS </option><option value="42">GARGA DANIFICADA E EMBALAGEM</option><option value="43">ENTREGAS NO INTERIOR</option><option value="44">ENDEREÇO INCOMPLETO</option><option value="45">ENDEREÇO INCOMPLETO - FALTA NUMERO</option><option value="46">ENDEREÇO INCOMPLETO - FALTA SALA</option><option value="47">ENDEREÇO INCOMPLETO - FALTA CASA</option><option value="48">ENDEREÇO INCOMPLETO - FALTA APTO</option><option value="49">ENDEREÇO INCOMPLETO - FALTA BLOCO</option><option value="50">ENTREGA PROGRAMADA</option><option value="51">ENTREGA PROGRAMADA - DATA</option><option value="52">ENTREGA PROGRAMADA - LOCAL</option><option value="53">ENTREGA PROGRAMADA - OUTRO</option><option value="54">CARGA SAIU PARA ROTA DE ENTREGA</option><option value="55">ESPERA SUPERIOR A 15 MINUTOS</option><option value="56">ESPERA SUPERIOR A 15 MINUTOS - CONSIGNATARIO AUSENTE</option><option value="57">ESPERA SUPERIOR A 15 MINUTOS - NAO LOCALIZADO</option><option value="58">ESPERA SUPERIOR A 15 MINUTOS - OUTROS</option><option value="59">FALSA DECLARAÇÃO DE CONTEUDO</option><option value="60">COMPANHIA FECHADA ( INFORMAR DATA E HORA DA VISITA)</option><option value="61">FREE DOMICILE</option><option value="62">ARQUIVO EDI RECEBIDO</option><option value="63">ARQUIVO EDI RECEBIDO - VIA FTP</option><option value="64">ARQUIVO EDI RECEBIDO - VIA WEB</option><option value="65">ARQUIVO EDI RECEBIDO - VIA INPUT</option><option value="66">CORREÇÃO EFETUADA PELO GATEWAY - (ESPECIFICAR)</option><option value="67">RETIDA NO GATEWAY/ DOCUMENTOS DE EMBARQUE ERRADOS OU INSUFICIENTES</option><option value="68">RETIDA NO GATEWAY</option><option value="69">RETIDA NO GATEWAY/CARGA INACEITAVEL OU PROIBIDA - 01 </option><option value="70">CONSOLIDAÇÃO LIBERADA PARA REALIZAR PAGAMENTO DOS TRIBUTOS</option><option value="71">ENDEREÇO ILEGIVEL</option><option value="72">INVESTIGANDO</option><option value="73">RECUSADA - MERCADORIA EM DESACORDO</option><option value="74">PAGAMENTOS TRANSFERIDOS PARA A ADUANA</option><option value="75">DESEMBARAÇADA</option><option value="76">CONSIGNATÁRIO MUDOU-SE</option><option value="77">CIDADE NAO ATENDIDA</option><option value="78">PROBLEMAS CONSIGNATÁRIO</option><option value="79">CONSIGNATÁRIO DESCONHECIDO</option><option value="80">CONSIGNATÁRIO DEMITIDO</option><option value="81">CONSIGNATÁRIO FALECIDO</option><option value="82">CONSIGNATÁRIO OUTRO</option><option value="83">ENVIO NÃO ENTREGUE</option><option value="84">ENVIO NÃO ENTREGUE - VEICULO ENGUIÇADO</option><option value="85">ENVIO NÃO ENTREGUE - ACIDENTE</option><option value="86">ENVIO NÃO ENTREGUE - NAO VISITADO</option><option value="87">ENVIO NÃO ENTREGUE - OUTRO</option><option value="88">ENDEREÇO NÃO EXISTE</option><option value="89">CARGA DESEMBARAÇADA, ENVIO DE EDI PARA O ENTREGADOR</option><option value="90">ENVIO DE DIRES PARA O TRANSPORTADOR</option><option value="91">CARGA PENDENTE DE COMMERCIAL INVOICE OU NOTA FISCAL</option><option value="92">CARGA AGUARDANDO</option><option value="93">CARGA AGUARDANDO AUTORIZAÇÃO</option><option value="94">CARGA AGUARDANDO LICENSA</option><option value="95">CARGA AGUARDANDO VALOR</option><option value="96">CARGA AGUARDANDO PROCURAÇÃO</option><option value="97">INFORMAÇÃO SOBRE O CONSIGNATÁRUO INCOMPLETA</option><option value="98">DOCUMENTAÇÃO DA CARGA ENTREGUE PARA O DESPACHNATE</option><option value="99">DOCUMENTAÇÃO DA CARGA ENTRGUE CONSIGNATÁRIO</option><option value="100">CONSIGNATÁRIO NÃO PAGOU OS IMPOSTOS</option><option value="101">ENDERÇO ERRADO</option><option value="102">ENDERÇO ERRADO - FALTA RUA</option><option value="103">ENDERÇO ERRADO - FALTA CIDADE</option><option value="104">ENDERÇO ERRADO - FALTA CEP</option><option value="105">PROBLEMAS FISCAIS</option><option value="106">PROBLEMAS FISCAIS - SEFAZ</option><option value="107">PROBLEMAS FISCAIS - ADUANA</option><option value="108">PROBLEMAS FISCAIS - OUTROS</option><option value="109">CARGA COLETADA NO TERMINAL PELO ENTREGADOR</option><option value="110">FARMACEUTICO</option><option value="111">RETIDA, PENDENTE DE PAGAMENTO DE IMPOSTOS/TAX ID</option><option value="112">PROBLEMAS COM CPF/CNPJ</option><option value="113">VALOR DECLARADO RECUSADO PELA ALFANDEGA</option><option value="114">CARGA PERDIDA</option><option value="115">POD CONSEGUIDO VIA TELEFONE</option><option value="116">COMPANHIA FALIDA</option><option value="117">CARGA COLOCADA EM QUARENTENA</option><option value="118">ENVIO EXTRAVIADO</option><option value="119">ENVIO EXTRAVIADO - COURIER</option><option value="120">ENVIO EXTRAVIADO - CIA AÉREA</option><option value="121">ENVIO EXTRAVIADO - RODOVIARIA</option><option value="122">ENVIO EXTRAVIADO - OUTRO</option><option value="123">ROUBO DE CARGA</option><option value="124">ROUBO DE CARGA NA TRANSPORTADORA</option><option value="125">ROUBO DE CARGA NOS CORREIOS</option><option value="126">ROUBO DE CARGA NO AGENTE</option><option value="127">ROUBO DE CARGA COURIER</option><option value="128">RETORNADA AO CLIENTE</option><option value="129">CARGA RECUSADA PELO CONSIGNATÁRIO/ DANIFICADA</option><option value="130">CARGA MAL DIRECIONADA</option><option value="131">CARGA MAL DIRECIONADA - PAIS ERRADO</option><option value="132">CARGA MAL DIRECIONADA - CIDADE ERRADA</option><option value="133">CARGA MAL DIRECIONADA - ROTA LOCAL ERRADA</option><option value="134">CARGA MAL DIRECIONADA - OUTROS</option><option value="135">CARGA RECUSA PELO CONSIGNATÁRIO</option><option value="136">CARGA PENDENTE ANUENCIA</option><option value="137">CARGA PENDENTE ANUENCIA - ANVISA</option><option value="138">CARGA PENDENTE ANUENCIA - VIGIAGRO</option><option value="139">CARGA PENDENTE ANUENCIA - EXERCITO</option><option value="140">CARGA PENDENTE ANUENCIA - IBAMA</option><option value="141">CARGA PENDENTE ANUENCIA - OUTRO</option><option value="142">LIBERADA PEDENTE PAGAMENTO</option><option value="143">REMESSA INDISPONIVEL PARA COLETA</option><option value="144">CARGA RETORNADA A ORIGEM</option><option value="145">GREVES OU PROBLEMAS PUBLICOS/ AREA DE RISCO</option><option value="146">CONSIGNATÁRIO SE RECUSA A PAGAR OS IMPOSTOS DE IMPORTAÇÃO</option><option value="147">CARGA RETORNADA E RECEBIDA PELA MX</option><option value="148">ROTEADA</option><option value="149">RECEBIDA</option><option value="150">RECEBIDA NA ADUANA</option><option value="151">RECEBIDA NA MESSENGER</option><option value="152">RECEBIDA NO AGENTE</option><option value="153">SERVIÇO CANCELADO</option><option value="154">SERVIÇO CANCELADO PELO DESTINATARIO</option><option value="155">SERVIÇO CANCELADO PELO REMETENTE</option><option value="156">SERVIÇO CANCELADO POR OUTRO</option><option value="157">CARGA NÃO CARREGADA</option><option value="158">CARGA NÃO CARREGADA - AEROLINEA</option><option value="159">CARGA NÃO CARREGADA - RODOVIARIO</option><option value="160">CARGA NÃO CARREGADA - CORTE</option><option value="161">CARGA NÃO CARREGADA - OUTRO</option><option value="162">REDESPACHO VIA CORREIO</option><option value="163">SINISTRO LIQUIDADO</option><option value="164">MERCADORIA ENVIADA PARA SALVADOS</option><option value="165">CARGA RECEBIDA SEM MANIFESTAR</option><option value="166">CARGA RECEBIDA PARCIAL</option><option value="167">TENTATIVA DE ENTREGA NINGUEM EM CASA</option><option value="168">RETIDA PELA ADUANA</option><option value="169">TRANSFERENCIA PARA RIO</option><option value="170">TRANSFERENCIA PARA MEA</option><option value="171">TRANSFERENCIA PARA SAO</option><option value="172">TRANSFERENCIA PARA AGENTES</option><option value="173">TRANSFERENCIA PARA TOTAL</option><option value="174">TRANSFERENCIA PARA OUTROS</option><option value="175">AREA URBANA NAO ATENDIDA</option><option value="176">RETIDA PARA INSPEÇÃO</option><option value="177">RETIDA PARA INSPEÇÃO - ADUANA</option><option value="178">RETIDA PARA INSPEÇÃO - ANVISA</option><option value="179">RETIDA PARA INSPEÇÃO - VIGIAGRO</option><option value="180">RETIDA PARA INSPEÇÃO - SEFAZ</option><option value="181">RETIDA PARA INSPEÇÃO - OUTROS</option><option value="182">SACA DESAPARECIDA</option><option value="183">CONSOLIDAÇÃO EXTRAVIADA</option><option value="184">CONSOLIDAÇÃO EXTRAVIADA - AGENTE</option><option value="185">CONSOLIDAÇÃO EXTRAVIADA - COURIER</option><option value="186">CONSOLIDAÇÃO EXTRAVIADA - AEREA</option><option value="187">CONSOLIDAÇÃO EXTRAVIADA - RODOVIARIA</option><option value="188">TRANSFERENCIA ATRASADA</option><option value="189">TRANSFERENCIA ATRASADA - AEROLINEA</option><option value="190">TRANSFERENCIA ATRASADA - RODOVIARIA</option><option value="191">TRANSFERENCIA ATRASADA - OUTROS</option>\

			myApp.confirm(form, 'Código de Pendência', function () {
		        $$.getJSON (
					'http://messenger.com.br/app/controller.php',
					{ 	request_key: 'cod_disp_coleta_entrega', 
						item: id,
						descricao: $$("#cod_disp_entrega_coleta_descricao").val(),
						
					},
					function (data) {
						if(data.sucesso){
							myApp.alert('', 'Código de Pendência informado com sucesso', function () { mainView.router.refreshPage(); });	
						}
						else{
							myApp.alert('', 'Ocorreu um erro ao salvar informações, tente novamente.');	
						}
						
					}
				);
	    	});
		});		
	});		

});
	

function alertFunc() {

	$$.getJSON ('http://messenger.com.br/app/notificacao.php', 
	{ user_id: '35' },
	function (data) {
		if(data.success){
			myApp.alert('', "Sua rota foi alterada!", function () { 
				mainView.router.loadPage("listar_entrega_coleta.html"); 
				mainView.router.reloadPage("listar_entrega_coleta.html"); 
				
				// console.log(myApp.getCurrentView());
			});
		}
		else {
			return;
		}

	});

	
}
setInterval(alertFunc, 5000);