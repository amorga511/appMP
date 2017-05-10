//Javascript 

$(document).ready(function(e){

    $("#dv_splash").show();
    $("#page").hide();
    setTimeout(function(){ 
        $("#dv_splash").hide(); 
        $("#page").show();
    }, 1500);
});