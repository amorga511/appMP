//Javascript 

$(document).ready(function(e){

    navigator.splashscreen.show();
    setTimeout(function () {
        navigator.splashscreen.hide();
    }, 6000);

    /*$("#dv_splash").show();
    $("#dvHead").hide();
    setTimeout(function(){ 
        $("#dv_splash").hide(); 
        $("#dvHead").show();
    }, 3000);*/
});