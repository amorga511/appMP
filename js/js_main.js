//Javascript 

$(document).ready(function(e){

    $("#dv_splash").show();
    $("#dvHead").hide();
    setTimeout(function(){ 
        $("#dv_splash").hide(); 
        $("#dvHead").show();
    }, 3000);
});