// Initialize app
var myApp = new Framework7();

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

    //console.log(myApp.getCurrentView());
    // $$("#login_submit").click(function (e) {
    //     e.preventDefault();

    //     var email = $$("#email_login").val();
    //     var password = $$("#password_login").val();


    // })

    $$('#login_form').on('submitted', function (e) {
        var xhr = e.detail.xhr; // actual XHR object
        var data = JSON.parse(e.detail.data); // Ajax response from action file
        
        //myApp.alert(data.sucesso);

        if(data.sucesso == 1) {

            // var formData = data.info;
            // var formData = {
            //     'name': ,
            //     'email': 'john@doe.com',
            //     'doc': 'female',
            //     'perfil_system': ,
            //     'uf': 10
            // }
            myApp.formFromJSON('#my-form', data.info);
            myApp.closeModal('.login-screen');
        }
        else{
            myApp.alert(data.error_msg, 'Ops!');
            myApp.closeModal('.login-screen');

        }
        // do something with response data
    });

    $$('.ajax-submit').on('submitError', function (e) {        
        myApp.alert("Erro durante requisição ao servidor", 'Ops!');
    }); 
});


$$(document).on("backbutton", function () {

    if(myApp.getCurrentView().activePage.name == "index"){
        myApp.confirm('Deseja sair?', 'Sair', 
            function () {
                //navigator.app.exitApp();
                navigator.app.backHistory()
            },
            function () {
                return false;
            }
        );        
    }
    else {
        mainView.router.back();
        
    }


});


// Now we need to run the code that will be executed only for About page.

// Option 1. Using page callback for page (for "about" page in this case) (recommended way):
myApp.onPageInit('about', function (page) {
    // Do something here for "about" page    
    
    $$('.open_alert').click(function () {
        myApp.alert("Exemplo de notificação");
    })    
    //myApp.alert('Here comes About page');
})

// // Option 2. Using one 'pageInit' event handler for all pages:
// $$(document).on('pageInit', function (e) {
//     // Get page data from event data
//     var page = e.detail.page;

//     if (page.name === 'about') {
//         // Following code will be executed for page with data-page attribute equal to "about"
//         // myApp.alert('Here comes About page');
//     }
//     //console.log("Option 2");
// })

// // Option 2. Using live 'pageInit' event handlers for each page
// $$(document).on('pageInit', '.page[data-page="about"]', function (e) {
//     // Following code will be executed for page with data-page attribute equal to "about"
//     // myApp.alert('Here comes About page');

//     //console.log("Option 3");
// })