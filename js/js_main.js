// JavaScript General App

var showAlerts = false;
var vFlagFrame = 0;

var idNoti = 0;
var vCont1 = 0;
var vLogin = 0;
var vIdSMS = -1;
var limitGreen = 99.99;
var limitYellow = 90

var vDatosUsuario ={"user":"", "login":""};
var vTitle ="Sales Operation-BOC";
var vKPIdash = 0;

var dataChart1 = [];
var dataChart2 = [];
var dataChart3 = [];  
var kpis_list =[];
var cnl_list =[];
var fech_data = [];

$(document).ready(function(e){

    /*alert($("#ckfav")[0].checked = true);
    $("#ckfav").checkboxradio('refresh');*/
    carga_cnls();
    
    $("#dvHead").hide();
    $("#dvKPIFavs").hide();
    $("#dvKPIbyChannel").hide();
    $("#dvConfigs").hide();
	$("#dvMain").hide();

	$("#frm_login").hide();
	$("#dvDashboard").hide();  
    $("#dvDashboard_cn").hide();  

      

    //$("#dv_Config").hide();

	$("#dvtitle").html(vTitle);

	$("#btn_menu").click(function(e) {
        e.preventDefault();
        $("#dvMain").toggleClass("toggled");
    });
    $("#btn_close_menu").click(function(){
        $("#dvMain").toggleClass("toggled");
    });


function validaLogin(){
    var tempLogin = getParams();
    vLogin = tempLogin.login;

    vDatosUsuario.user = tempLogin.user;
    vDatosUsuario.login = vLogin;

        if(parseInt(vLogin) != 1){ 
            db.transaction(function(cmd){   
                cmd.executeSql("SELECT * FROM users where login = '1'", [], function (cmd, results) {
                    var len = results.rows.length, i;
                    i = 0;
                    if(len>0){
                        vDatosUsuario.user = results.rows.item(i).id;
                        vDatosUsuario.login = 1;
                        logInOut(vDatosUsuario.user, '1');		   
                        $("#dvHead").show();
                        $("#dvMain").show();
                        $("#bg_login").hide();	
	    				$("#dv_splash").hide();    	
						$("#frm_login").hide();	                                              
                    }else{                          
                        $("#bg_login").show();                          
                        $("#frm_login").show();                         
	    				$("#dv_splash").hide();
                        $("#dvHead").hide();     	
	   	 				$("#dvMain").hide();                        
                    }
                    leeSMSs(); 
                });
            });
        }else{ 
            $("#dvHead").show();
        	$("#dvMain").show(); 
        	$("#bg_login").hide();    	
	    	$("#dv_splash").hide();    	
			$("#frm_login").hide();	
	    	  		

            logInOut(tempLogin.user, '1'); 	
            $("#body_kpi_mbl").html('');
            $("#body_kpi_star").html('');
            //sleep(400);
            leeSMSs();
        }
}


setTimeout(function(){ 
    validaLogin();
    KPIsmain(0);
}, 800);


$("#switch_alert").bind("change", function(event, ui){
    ejecutaSQL("UPDATE configs SET estado="+ $(this).val() +" where id='NOT'");
    if(event.value==1){
        showAlerts = true;

    }else{
        showAlerts = false;
    }
});

});


function chek(vFrom, vVal){  
    var vFavl = 0; 
    var vKPIid = ''; 
    if(vVal.checked){
        vFavl = 1;
    }else{
        vFavl = 0;
    }
    if(vFrom == 0){
        vKPIid = vKPIdash;
        ejecutaSQL("UPDATE kpi_master SET fav="+ vFavl +" where id='" + vKPIdash +"'");
    }else{
        //alert(vVal.id);
        ejecutaSQL("UPDATE kpi_master SET fav="+ vFavl +" where id='" + vVal.id +"'");
        vKPIid = vVal.id;
    }
    for(i=0;i<kpis_list.length;i++){
        if(vKPIid==kpis_list[i].id){
            kpis_list[i].fav = vFavl;
            break;
        }
    }
}

function login(){
		var usr = $("#user").val();
		var pwd = $("#pwd").val();        

		db.transaction(function(cmd){   
            cmd.executeSql("SELECT * FROM users where id =? and status='1'", [usr], function (cmd, results) {
                var len = results.rows.length, i;

                if(len>0){
                    //alert(len);
                    for (i = 0; i < len; i++) {
                        //alert(results.rows.item(i).login);
                        if(results.rows.item(i).pwd == pwd){
                            //logInOut($scope.usuario, '1');
                            sleep(300);
                            window.location.replace('index.html?user=' + usr +  '&login=1');
                        }else{
                            $("#msj_err").html('Clave Incorrecta');
                        }
                       //alert(results.rows.item(i).id);          
                    }
                }else{
                    $("#msj_err").html("Usuario Incorecto");
                }
            });
        });
}

function switchMenu(vM, vl_title, vkpi_id, vFrom){
    var tempFech= getYMD(0);
    var year = tempFech.substring(0,4);
    var month = tempFech.substring(4,6);

    switch(vM){
    	case 1:            
    		KPIsmain(0);
            vFlagFrame = 0;
    	break;
    	case 2:
            vFlagFrame = 1;
    		vKPIdash = vkpi_id;
            $("#filter_ter").val('TP');
            $('#filter_fech').html("");

            for(i=0;i<fech_data.length; i++){
                $('#filter_fech').append($("<option></option>")
                        .attr("value",fech_data[i].date)
                        .text(fech_data[i].text));
            }
            $("#filter_fech").val(fech_data[0].date);
            $("#filter_fech").selectmenu('refresh');

    		getDataKPI(vkpi_id, parseInt(month),year,'TER', 'TP', 'chr_dashboard', 'dv_dashboard');
    		$("#dvDashboard").show();
    		$("#dvMain").hide();
            $("#dvKPIFavs").hide();
            $("#dvConfigs").hide();           
            $("#dvKPIbyChannel").hide();
            $("#dvKPIbyZone").hide();
            $("#dvDashboard_cn").hide();

    	break;
        case 3:
            vFlagFrame = 1;
            $("#dvConfigs").show();
            $("#dvKPIFavs").hide();
            $("#dvDashboard").hide();            
            $("#dvKPIbyChannel").hide();
            $("#dvDashboard_cn").hide();
            $("#dvKPIbyZone").hide();
            $("#dvMain").hide();
        break;
        case 4:
            vFlagFrame = 1;
            KPImainSubChanel();
            $("#dvKPIbyChannel").show();
            $("#dvDashboard_cn").hide();
            $("#dvKPIbyZone").hide();
            $("#dvKPIFavs").hide();
            $("#dvDashboard").hide();
            $("#dvConfigs").hide();
            $("#dvMain").hide();
        break;
        case 5:
            KPIsmain(1);
            vFlagFrame = 1;
            $("#dvKPIFavs").show();
            $("#dvDashboard_cn").hide();
            $("#dvKPIbyChannel").hide();
            $("#dvKPIbyZone").hide();
            $("#dvDashboard").hide();
            $("#dvConfigs").hide();
            $("#dvMain").hide();
        break;
        case 6:
            vFlagFrame = 1;
            vKPIdash = vkpi_id;
            getDataKPI_zn(vkpi_id, parseInt(month),year,'ZN', '0', 'chr_dashboard_cn', 'dv_dashboard_cn');
            $('#filter_fech_cn').html("");
            $("#filter_zn").val('0');
            for(i=0;i<fech_data.length; i++){
                $('#filter_fech_cn').append($("<option></option>")
                        .attr("value",fech_data[i].date)
                        .text(fech_data[i].text));
            }
            $("#filter_fech_cn").val(fech_data[0].date);
            $("#filter_fech_cn").selectmenu('refresh');

            $("#dvDashboard_cn").show();
            $("#dvKPIbyChannel").hide();
            $("#dvKPIbyZone").hide();
            $("#dvKPIFavs").hide();
            $("#dvDashboard").hide();
            $("#dvConfigs").hide();
            $("#dvMain").hide();
        break;
        case 7:
            vFlagFrame = 1;
            $("#dvKPIbyZone").show();
            $("#dvKPIFavs").hide();
            $("#dvDashboard_cn").hide();
            $("#dvKPIbyChannel").hide();
            $("#dvDashboard").hide();
            $("#dvConfigs").hide();
            $("#dvMain").hide();
        break;
    	case 99:
            vFlagFrame = 0;
    		logInOut(vDatosUsuario.user, '0');
            sleep(200)
            window.location.replace('index.html?user=0&login=0');
    	break;

    }
    if(vM!=99 && vFrom ==0){
        $("#dvMenu").panel("close");
        $("#dvMenuConfig").panel("close");
    }
    $("#dvtitle").html(vl_title);
}

function carga_cnls(){
    cnl_list = [];
    db.transaction(function(cmd){   
        cmd.executeSql("SELECT * FROM tbl_canales", [], function (cmd, results) {
            for(i=0;i<results.rows.length; i++){ 
                cnl_list.push({"idcnl":results.rows.item(i).id, "cnl":results.rows.item(i).canal, "idsbcnl":results.rows.item(i).id_sb, "scnl":results.rows.item(i).sub_canal});
            }
        });        
    });
}

function filter_dashboard(vkey, event){
    var vTer = "";
    var vFech = ""; 

    switch(vkey){
        case 1:
            vTer = event.value;
            vFech = $("#filter_fech").val();            
        break;
        case 2:
            vTer = $("#filter_ter").val();
            vFech = event.value;
        break;
    }
    getDataKPI(vKPIdash, parseInt(vFech.substring(4,6)),vFech.substring(0,4),'TER', vTer, 'chr_dashboard', 'dv_dashboard');
}

function filter_dashboard2(vkey, event){
    var vZn = "";
    var vFech2 = ""; 

    switch(vkey){
        case 1:
            vZn = event.value;
            vFech2 = $("#filter_fech_cn").val();            
        break;
        case 2:
            vZn = $("#filter_zn").val();
            vFech2 = event.value;
        break;
    }
    console.log(vZn);
    getDataKPI_zn(vKPIdash, parseInt(vFech2.substring(4,6)),vFech2.substring(0,4),'ZN', vZn, 'chr_dashboard_cn', 'dv_dashboard_cn');
}

function KPIsmain(vTypeK){
	var bus ="";
    var nombre = "";
    var vid="";
    var cn = '';
    var zn = '';
    var fav = 0;
	var temStr = "";
    var tempFechs = "";
    var tempText = ""

    var countMBL = 0;
    var countStar = 0;
    var vAB = 'a';
    var vAB2 = 'a';
    var vABF = '';

    var vQuery = '';

	hideDashboard();
    getConfigs();
    
    $("#dvKPIbyChannel").hide();
    $("#dvKPIbyZone").hide();
    $("#dvDashboard_cn").hide();
    $("#dvKPIFavs").hide();
    $("#dvConfigs").hide();
	$("#dvMain").show();

    if(vTypeK==0){
        $("#body_kpi_mbl").html('');
        $("#body_kpi_star").html('');
    }else{ 
        $("#body_kpi_fav_mbl").html('');
        $("#body_kpi_fav_star").html('');
    }
    //$("#mdl_load").modal();

    fech_data=[];
    for(i=0;i>-3;i--){
        tempFechs= getYearMoth(i);
        tempText = getMonthName(parseInt(tempFechs.substring(4,6))) + '-' + tempFechs.substring(0,4);
        //alert(tempFechs);
        fech_data.push({"date":tempFechs, "text":tempText});
    }

    setTimeout(function(){ deleteKPI(getYMD(-60), 0); }, 2000);

    if(vTypeK == 1){
        vQuery = 'SELECT * FROM kpi_master where fav = 1 order by bu';
    }else{
        vQuery = 'SELECT * FROM kpi_master order by bu';
    }

    db.transaction(function(cmd){   
        cmd.executeSql(vQuery, [], function (cmd, results) {
        	var len = results.rows.length;
            //alert(len);
        	kpis_list = [];
     
              /*  $("#sbm_star").html('');
                $("#sbm_mfs").html('');
                $("#sbm_mobile").html('');*/
          
        	for(i=0;i<len; i++){ 
                bus = results.rows.item(i).bu;
                nombre = results.rows.item(i).name;
                vid = results.rows.item(i).id;
                cn = results.rows.item(i).cn;
                zn = results.rows.item(i).zn;
                fav = parseInt(results.rows.item(i).fav);
                //alert(fav);

                if(bus == 'MBL'){
                    if(countMBL > 0){
                        if(vAB =='a'){
                            vAB ='b';
                        }else{
                            vAB ='a';
                        }
                    }
                    countMBL += 1;
                    vABF= vAB;
                }
                
                if(bus == 'STAR'){
                    if(countStar > 0){
                        if(vAB2 =='a'){
                            vAB2 ='b';
                        }else{
                            vAB2 ='a';
                        }
                    }
                    countStar += 1;
                    vABF= vAB2;
                }
               

        		showKPIdata(vid, bus, nombre, 'TP', vABF, vTypeK);
        		kpis_list.push({"id":vid, "bu":bus, "name":nombre, "fav":fav, "cn":cn, "zn":zn});
    		}
            //setTimeout(function(){ $("#mdl_load").modal('hide');}, 1000);
        });
    });    
}

function KPImainSubChanel(){
    var arrKPIS = [];
    for(j=0;j<kpis_list.length;j++){
        //alert(results.rows.item(i).id);
        if(1 == parseInt(kpis_list[j].cn)){
            arrKPIS.push(kpis_list[j].id);
        }
    }

    getKPI_byCn(arrKPIS, 2,1, 'body_kpi_mbl_sbch3');
    getKPI_byCn(arrKPIS, 1,2, 'body_kpi_mbl_sbch1');
    getKPI_byCn(arrKPIS, 1,1, 'body_kpi_mbl_sbch2');
    getKPI_byCn(arrKPIS, 3,1, 'body_kpi_mbl_sbch4');

}

function getKPI_byCn(idKPI, vChanel, vSubCnl, vDVsbCnl){
    //alert('Building');
    var strTBL = '';
    var kpiName = '';
    var vBu = '';
    var idskpi = ''
    var ejecutado = 0;
    var forecast = 0;
    var meta = 0; 
    var avg = 0;
    var unit = '';
    var strInfD = '';
    var cnl_name = '';

    for(j=0;j<cnl_list.length;j++){
        //alert(results.rows.item(i).id);
        if(vChanel == parseInt(cnl_list[j].idcnl) && vSubCnl == parseInt(cnl_list[j].idsbcnl)){
            cnl_name = cnl_list[j].scnl; 
        }
    }

    //alert(cnl_name);

    var vQuery = 'SELECT * FROM kpi_data_zonas where id in ('; //\'1101\', \'1201\')';
    /*var vQuery = 'SELECT id, fecha, cnl, sub_cnl, unit, SUM(ejecutado) ejecutado , SUM(budget) budget, SUM(forecast) forecast, ROUND((SUM(forecast)/SUM(budget))*100,1) tend';
        vQuery += ' FROM kpi_data_zonas where id in(';*/

    for(j=0;j<idKPI.length;j++){
        idskpi += '\'' + idKPI[j] + '\',';
    }
    vQuery = vQuery + idskpi.substring(0, idskpi.length -1) +') and cnl=\'' + vChanel + '\' and sub_cnl=\'' + vSubCnl + '\' order by id';
    //vQuery += " group by id, fecha, cnl, sub_cnl, unit";
    //alert(vQuery);
    fech_data=[];
    for(i=0;i>-3;i--){
        tempFechs= getYearMoth(i);
        tempText = getMonthName(parseInt(tempFechs.substring(4,6))) + '-' + tempFechs.substring(0,4);
        //alert(tempFechs);
        fech_data.push({"date":tempFechs, "text":tempText});
    }

    db.transaction(function(cmd){   
            cmd.executeSql(vQuery, [], function (cmd, results) {
                var len = results.rows.length, i;

                //alert(len);
                if(len>0){
                    strTBL = '<table style="font-size:0.9em" data-role="table" data-mode="columntoggle" class="ui-responsive table-stripe" id="tbl1" data-column-popup-theme="a">'
                    strTBL += '<thead>';
                    strTBL += '<tr>';
                    strTBL += '<th data-priority="0">KPI</th>';
                    strTBL += '<th style="text-align:left" data-priority="1">Date</th>';
                    strTBL += '<th style="text-align:right" data-priority="2">Fullfill</th>';
                    strTBL += '<th style="text-align:right" data-priority="2">Forecast</th>';
                    strTBL += '<th style="text-align:right" data-priority="2">Budget</th>';
                    strTBL += '<th style="text-align:right" data-priority="1">Result</th>';
                    strTBL += '</tr>';
                    strTBL += '</thead>';
                    strTBL += '<tbody>';

                    for(i=0; i<len; i++){

                        for(j=0;j<kpis_list.length;j++){
                            //alert(results.rows.item(i).id);
                            if(results.rows.item(i).id == kpis_list[j].id){
                                kpiName = kpis_list[j].name;
                                vBU = kpis_list[j].bu;
                                break;
                            }
                        }

                        strInfD =  results.rows.item(i).fecha.substring(6,8);
                        strInfD += ' ' +getMonthName(results.rows.item(i).fecha.substring(4,6));
                        strInfD += ' ' +results.rows.item(i).fecha.substring(0,4);

                        ejecutado = parseFloat(results.rows.item(i).ejecutado);
                        forecast = parseFloat(results.rows.item(i).forecast);
                        meta = parseFloat(results.rows.item(i).budget);
                        avg = parseFloat(results.rows.item(i).forecast/results.rows.item(i).budget) * 100;
                        unit = results.rows.item(i).unit;

                        strTBL += '<tr>';
                        strTBL += '<td><a href="#" onclick=\"switchMenu(6, \'' +  vBU + '-' + kpiName + '-'+ cnl_name +'\',\'' + results.rows.item(i).id + '\',1)\">'+ kpiName +' (' + unit + ')</a></td>';
                        strTBL += '<td style="text-align:left">' + strInfD +'</td>';
                        strTBL += '<td style="text-align:right">' + ejecutado.toLocaleString('en') +'</td>';
                        strTBL += '<td style="text-align:right">' + forecast.toLocaleString('en') + '</td>';
                        strTBL += '<td style="text-align:right">' + meta.toLocaleString('en') + '</td>';
                        strTBL += '<td style="text-align:right; color:black">' + avg.toFixed(2) + '%</td>';
                        strTBL += '</tr>';
                    }  

                    strTBL += '</tbody>';
                    strTBL += '</table>';                    
                }
                $("#" + vDVsbCnl).html(strTBL);
                $("#" + vDVsbCnl).trigger('create');
            });

        });     
}


function hideDashboard(){
	$("#dvDashboard").hide();
}


function showKPIdata(vidKPI, vBU, vName, vTer, vAB, vFav){
        var strDv = "";
        var class_color = 'bgcolor_green';
        var class_bgPost = 'bg_posticR'
        var strInfD = "";
        var avg = 0;
        var vKPIname = ""

        var ejecutado = 0;
        var forecast = 0;
        var meta = 0;        
        vKPIname = vName;
        
        db.transaction(function(cmd){   
                cmd.executeSql("SELECT fecha,budget,unit,ejecutado,forecast FROM kpi_data_territorio where id=? and territorio = ? order by fecha desc", [vidKPI, vTer], function (cmd, results) {
                    var len = results.rows.length, i;
                    //alert(len);
                    if(len>0){
                        //alert(len);
                        var i =0;
                        //for (i = 0; i < len; i++) {
                            //alert(results.rows.item(i).nombre_kpi + '/Suma:' + results.rows.item(i).vsuma);
                            //alert(results.rows.item(i).id);
                            avg = parseFloat(results.rows.item(i).forecast/results.rows.item(i).budget) * 100;    
                            if(avg >= limitGreen){
                                class_color = 'bgcolor_green';
                                class_bgPost = 'bg_posticG'
                            }else if(avg >= limitYellow){
                                class_color = 'bgcolor_yellow';
                                class_bgPost = 'bg_posticY'
                            }else{
                                class_color = 'bgcolor_red';
                                class_bgPost = 'bg_posticR'
                            }

                            strInfD =  results.rows.item(i).fecha.substring(6,8);
                            strInfD += ' ' +getMonthName(results.rows.item(i).fecha.substring(4,6));
                            strInfD += ' ' +results.rows.item(i).fecha.substring(0,4);

                            ejecutado = parseFloat(results.rows.item(i).ejecutado);
                            forecast = parseFloat(results.rows.item(i).forecast);
                            meta = parseFloat(results.rows.item(i).budget);

                            strDv += "<div class=\"ui-block-" + vAB + "\">";
                            strDv += "<div class=\"pad_post\" onclick=\"switchMenu(2, '" +  vBU + '-' + vKPIname + "','" + vidKPI + "',1)\">";
                            strDv += "<div class=\"ui-grid-solo "+ class_bgPost +"\" style=\"border:solid 1px gray;\">";
                            strDv += "<div class=\"ui-grid-solo "+ class_color +" lbl_title1\"><center><span>" + vKPIname + "-</span><span class=\"lbl_c1\">(" + results.rows.item(i).unit + ")</span></center></div>";
                            strDv += "<div class=\"ui-grid-solo\" style=\"text-align:right; padding-right:5px\"><span class=\"lbl_c1\">"+ strInfD +"</span></div>";
                            strDv += "<div class=\"ui-grid-a\" style=\"padding-left:4px; padding-right:4px;\">";
                            strDv += "<div class=\"ui-block-a lbl_c1\"><i>Fullfillment</i></div>";
                            strDv += "<div class=\"ui-block-b lbl_cant\">"+ ejecutado.toLocaleString('en') +"</div>";
                            strDv += "</div>";
                            strDv += "<div class=\"ui-grid-a\" style=\"padding-left:4px; padding-right:4px;\">";
                            strDv += "<div class=\"ui-block-a lbl_c1\"><i>Forecast</i></div>";
                            strDv += "<div class=\"ui-block-b lbl_cant\">"+ forecast.toLocaleString('en') + "</div>";
                            strDv += "</div>";
                            strDv += "<div class=\"ui-grid-a\" style=\"padding-left:4px; padding-right:4px;\">";
                            strDv += "<div class=\"ui-block-a lbl_c1\"><i>Budget</i></div>";
                            strDv += "<div class=\"ui-block-b lbl_cant\">"+ meta.toLocaleString('en') + "</div>";
                            strDv += "</div>";
                            strDv += "<div class=\"ui-grid-a\" style=\"padding-left:4px; padding-right:4px;\">";
                            strDv += "<div class=\"ui-block-a\">Result</div>";
                            strDv += "<div class=\"ui-block-b lblResult\"><b>"+ avg.toFixed(2) +"%</b></div>";
                            strDv += "</div>";
                            strDv += "</div>";                  
                            strDv += "</div>";
                            strDv += "</div>";
           

                            switch(vFav){
                                case 0:
                                    if(vBU == 'MBL'){
                                        $("#body_kpi_mbl").append(strDv);
                                    }else if(vBU == 'STAR'){
                                        $("#body_kpi_star").append(strDv);
                                    }
                                break;
                                case 1:
                                    if(vBU == 'MBL'){
                                        $("#body_kpi_fav_mbl").append(strDv);
                                    }else if(vBU == 'STAR'){
                                        $("#body_kpi_fav_star").append(strDv);
                                    }
                                break;
                            }
                            
                            strDv = "";
                        //}
                    }
                });
            });
}


function getDataKPI(vIdKpi,vmonth,vyear,vtpoKPI,vfiltro, dvChart,dvData){
        var jsn_categories = [];
        var jsn_series = [];
        var arrResumen = [];
        var vQuery = "";
        var fechaData = "";
        var KPI_Title = "NA";
        var vFav = 0;

        for(i=0;i<kpis_list.length;i++){
            if(vIdKpi==kpis_list[i].id){
                KPI_Title = kpis_list[i].name;
                vFav = kpis_list[i].fav;
                break;
            }
        }

                dataChart1=[];
                dataChart2=[];
                dataChart3=[];

                vQuery = "SELECT * FROM kpi_data_territorio where year='"+ vyear +"' and month='"+ vmonth +"' and id ='" + vIdKpi + "' and territorio = '"+ vfiltro +"' order by fecha asc"
               
                //alert(vQuery);
                db.transaction(function(cmd){   
                    cmd.executeSql(vQuery,[], function (cmd, results) {
                        
                        for(i=0;i<results.rows.length; i++){
                            
                            dataChart1.push(parseFloat(results.rows.item(i).budget));                        
                            dataChart2.push(parseFloat(results.rows.item(i).forecast));
                            dataChart3.push(parseFloat(results.rows.item(i).ejecutado));

                            fechaData = results.rows.item(i).fecha;
                            arrResumen = {"ejecutado":results.rows.item(i).ejecutado, "unit":results.rows.item(i).unit,
                                            "forecast":results.rows.item(i).forecast,"budget":results.rows.item(i).budget};                              
                            jsn_categories.push(results.rows.item(i).fecha.substring(6,8)); 
                        }

                        jsn_series.push({"name":"Meta", "data":dataChart1});
                        jsn_series.push({"name":"Forecast", "data":dataChart2});                        
                        jsn_series.push({"name":"Ejecutado", "data":dataChart3});
                        //alert(dataChart1.length);
                        drawCharts(dvChart, KPI_Title,'Miles', jsn_series, jsn_categories);
                        drawDataKPI(dvData,arrResumen,fechaData, vFav);
                    });
                });
}


function getDataKPI_zn(vIdKpi,vmonth,vyear,vtpoKPI,vfiltro, dvChart,dvData){
        var jsn_categories = [];
        var jsn_series = [];
        var arrResumen = [];
        var vQuery = "";
        var fechaData = "";
        var KPI_Title = "NA";
        var vFav = 0;

        for(i=0;i<kpis_list.length;i++){
            if(vIdKpi==kpis_list[i].id){
                KPI_Title = kpis_list[i].name;
                vFav = kpis_list[i].fav;
                break;
            }
        }

                dataChart1=[];
                dataChart2=[];
                dataChart3=[];
 
                vQuery = "SELECT * FROM kpi_data_zonas_hist where year='"+ vyear +"' and month='"+ vmonth +"' and id ='" + vIdKpi + "' and zona = '"+ vfiltro +"' order by fecha asc";
  
               
                //alert(vQuery);
                db.transaction(function(cmd){ 
                    console.log('Consultando la DB');  
                    cmd.executeSql(vQuery,[], function (cmd, results) {

                        for(i=0;i<results.rows.length; i++){
                            
                            dataChart1.push(parseFloat(results.rows.item(i).budget));                        
                            dataChart2.push(parseFloat(results.rows.item(i).forecast));
                            dataChart3.push(parseFloat(results.rows.item(i).ejecutado));

                            fechaData = results.rows.item(i).fecha;
                            arrResumen = {"ejecutado":results.rows.item(i).ejecutado, "unit":results.rows.item(i).unit,
                                            "forecast":results.rows.item(i).forecast,"budget":results.rows.item(i).budget};                              
                            jsn_categories.push(results.rows.item(i).fecha.substring(6,8)); 
                        }

                        jsn_series.push({"name":"Meta", "data":dataChart1});
                        jsn_series.push({"name":"Forecast", "data":dataChart2});                        
                        jsn_series.push({"name":"Ejecutado", "data":dataChart3});

                        console.log(dvData);
                        drawCharts(dvChart, KPI_Title,'Miles', jsn_series, jsn_categories);
                        drawDataKPI(dvData,arrResumen,fechaData, vFav);
                    });
                });
}




function getConfigs(){
    var flagConfig = 0;
    var tmpStr = '';
    db.transaction(function(cmd){   
        cmd.executeSql('SELECT * FROM configs where id =?', ['NOT'], function (cmd, results) {
            if(results.rows.length > 0){
                //alert(results.rows[0].estado);
                flagConfig = results.rows.item(0).estado;                
                switch(flagConfig){
                    case 1:
                        showAlerts = true;
                        $("#switch_alert").val('1');
                        $("#switch_alert").slider('refresh');
                    break;
                    default:
                        showAlerts = false;
                        $("#switch_alert").val('0');
                        $("#switch_alert").slider('refresh');
                }
            }
        });

        $("#dvFavsConfig").html('');
        cmd.executeSql('SELECT * FROM kpi_master order by bu',[], function(cmd, results){
            for (i = 0; i < results.rows.length ; i++) {
                tmpStr = "<label class=\"lbl2\">"+ results.rows.item(i).bu +'-'+ results.rows.item(i).name;

                if(parseInt(results.rows.item(i).fav) == 0){
                    tmpStr +="<input type=\"checkbox\" onclick=\"chek(1, this)\" data-mini=\"true\" name=\"checkbox-0\" id=\""+ results.rows.item(i).id +"\" data-theme=\"a\" data-iconpos=\"right\"></label>";
                }else{
                    tmpStr +="<input type=\"checkbox\" onclick=\"chek(1, this)\" checked=\"true\" data-mini=\"true\" name=\"checkbox-0\" id=\""+ results.rows.item(i).id +"\" data-theme=\"a\" data-iconpos=\"right\"></label>";
                }
                $("#dvFavsConfig").append(tmpStr);
                $("#dvFavsConfig").trigger('create');
            }
        })
    });
}





//Sleep 
function sleep(milliseconds) {
  var start = new Date().getTime();
  for (var i = 0; i < 1e7; i++) {
    if ((new Date().getTime() - start) > milliseconds){
      break;
    }
  }
}

function getParams(param) {
    var vars = {};
    window.location.href.replace( location.hash, '' ).replace( 
        /[?&]+([^=&]+)=?([^&]*)?/gi, // regexp
        function( m, key, value ) { // callback
            vars[key] = value !== undefined ? value : '';
        }
    );

    if ( param ) {
        return vars[param] ? vars[param] : null;    
    }
    return vars;
}

function getYearMoth(vM){
    var vResult = '';
    var year = 0;
    var mes = 0;
    year = parseInt(getYMD(0).substring(0,4));
    mes = parseInt(getYMD(0).substring(4,6));

    mes = mes + vM
    if(mes < 1){
        mes = 12 + mes;
        year = year - 1
    }
    if(mes <10){
        vResult = year + "0" + mes;
    }else{
        vResult = year + "" + mes;
    }

    return vResult;
}

function getYMD(vDays){
    var vToday = new Date();
    var time = vToday.getTime();
    var milsecs = parseInt(vDays*24*60*60*1000);
    vToday.setTime(time + milsecs);

    var strDate = '';
    strDate = vToday.getFullYear();

    if(parseInt(vToday.getMonth() + 1) < 10 ){
        strDate += '0' + (vToday.getMonth()+1);
    }else{
        strDate += '' + (vToday.getMonth()+1);
    }
    if(parseInt(vToday.getDate()) < 10 ){
        strDate += '0' + vToday.getDate();
    }else{
        strDate += '' + vToday.getDate();
    }
    return strDate;
}

function getMonthName(vMonth){
    var ArrNames = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul','Ago','Sep','Oct', 'Nov', 'Dic'];
    return ArrNames[parseInt(vMonth)-1];
}

//Dibuja chartStr
function drawCharts(dvChart, vTitleC, vYaxis, vSeries, vCategories){

var chartStr = "";
 chartStr += "var chartx = Highcharts.chart(dvChart, {";
 chartStr += "  chart: {    type: 'area' },";
 chartStr += "  title: {    text: vTitleC },";
 chartStr += "  subtitle: { text: '' },";
 //chartStr += "  xAxis: {  allowDecimals: false,   labels: ";
 //chartStr += "  { formatter: function () {  return this.value; }  }  },";
 chartStr += "  xAxis: { categories: vCategories },"
 chartStr += "  yAxis: {  title: {  text: vYaxis },";
 chartStr += "  labels: { formatter: function () { return (this.value/1000).toFixed(2) + ''; } } },";
 chartStr += "  tooltip: {";
 chartStr += "  pointFormat: '{series.name}<b> {point.y:,.0f}</b>' },";
 chartStr += "  plotOptions: {";
 chartStr += "     area: {";
 //chartStr += "     pointStart: 1,";
 chartStr += "     fillOpacity:0.6,";
 chartStr += "     marker: {";
 chartStr += "     enabled: false,";
 chartStr += "     symbol: 'circle',";
 chartStr += "     radius: 2,";
 chartStr += "     states: {";
 chartStr += "     hover: {";
 chartStr += "     enabled: true";
 chartStr += "            }";
 chartStr += "          }";
 chartStr += "        }";
 chartStr += "      }";
 chartStr += "     },";
 chartStr += "       series:vSeries";
 chartStr += "  });";

console.log('Drawing Chart');
eval(chartStr);
}

function drawDataKPI(vdvKPI,vArrDatos,vFechD, vFav1){
    var class_color = '';
    var avg = 0;
    var strInfD = "";
    avg = (vArrDatos.forecast/vArrDatos.budget)*100;
    if(avg >= limitGreen){
        class_color = 'bgcolor_green2';
    }else if(avg >= limitYellow){
        class_color = 'bgcolor_yellow2';
    }else{
        class_color = 'bgcolor_red2';
    }

    if(vFav1 == 1){
        $("#ckfav")[0].checked = true;
        $("#ckfav").checkboxradio('refresh');
    }else{
        $("#ckfav")[0].checked = false;
        $("#ckfav").checkboxradio('refresh');
    }

    strInfD =  vFechD.substring(6,8);
    strInfD += ' '+getMonthName(vFechD.substring(4,6));
    strInfD += ' ' +vFechD.substring(0,4);

    strDv2 = "";
    strDv2 += "<div  style=\"margin:0px;\"><span class=\"infodate_c\" >Info Date: "+ strInfD +"</span></div>";
    strDv2 += "<div style=\"margin:0px; width:100%; height:90px\">";
    strDv2 += "<div style=\"float:left; width:30%\">";
    strDv2 += "<div style=\"width:90%; padding-top:8px\">";
    strDv2 += "<center><div style=\"border-radius:50%\" class=\""+ class_color +"\"></div></center>";
    strDv2 += "</div>";
    strDv2 += "</div>";
    strDv2 += "<div style=\"float:right; width:70%; padding-top:6px\">";
    strDv2 += "<table cellspacing=\"0\" border=\"0\" width=\"100%\">";
    strDv2 += "<tr class=\"lbl_c1\">";
    strDv2 += "<td width=\"40%\">Fullfilment</td>";
    strDv2 += "<td width=\"20%\">"+ vArrDatos.unit +"</td>";
    strDv2 += "<td align=\"right\" width=\"40%\">"+ parseFloat(vArrDatos.ejecutado).toLocaleString('en') +"</td>";
    strDv2 += "</tr>";
    strDv2 += "<tr class=\"lbl_c1\">";
    strDv2 += "<td width=\"40%\">Forecast</td>";
    strDv2 += "<td width=\"20%\">"+ vArrDatos.unit +"</td>";
    strDv2 += "<td align=\"right\" width=\"40%\">"+ parseFloat(vArrDatos.forecast).toLocaleString('en') + "</td>";
    strDv2 += "</tr>";
    strDv2 += "<tr class=\"lbl_c1\">";
    strDv2 += "<td width=\"40%\">Budget</td>";
    strDv2 += "<td width=\"20%\">"+ vArrDatos.unit +"</td>";
    strDv2 += "<td align=\"right\" width=\"40%\">"+ parseFloat(vArrDatos.budget).toLocaleString('en') + "</td>";
    strDv2 += "</tr>";
    strDv2 += "<tr>";
    strDv2 += "<td width=\"40%\">Result</td>";
    strDv2 += "<td width=\"20%\"></td>";
    strDv2 += "<td align=\"right\" width=\"40%\">"+ avg.toFixed(2) +"%</td>";
    strDv2 += "</tr>";
    strDv2 += "</table>";
    strDv2 += "</div>";
    strDv2 += "</div>";
/*
    strDv2 += "<div class=\"row\" style=\"margin:0px\"><span class=\"infodate_c\" >Info Date: "+ strInfD +"</span></div><div class=\"row\" style=\"margin:0px;\">";
    strDv2 += "    <div class=\"col-xs-4\" style=\"padding:10px\">"                                    
    //strDv2 += "        <label></label>"
    strDv2 += "        <center><div style=\"border-radius:50%\" class=\""+ class_color +"\"></div></center>"
    strDv2 += "</div>"
    strDv2 += "<div class=\"col-xs-8\">"
    strDv2 += "    <div class=\"row lbl_c1\"><div class=\"col-xs-5\">Fullfilment</div><div class=\"col-xs-2\">"+ vArrDatos.unit +"</div><div class=\"col-xs-5\" style=\"text-align:right; padding-right:10px\">"+ parseFloat(vArrDatos.ejecutado).toLocaleString('en') +"</div></div>"
    strDv2 += "    <div class=\"row lbl_c1\"><div class=\"col-xs-5\">Forecast</div><div class=\"col-xs-2\">"+ vArrDatos.unit +"</div><div class=\"col-xs-5\" style=\"text-align:right; padding-right:10px\">"+ parseFloat(vArrDatos.forecast).toLocaleString('en') + "</div></div>"
    strDv2 += "    <div class=\"row lbl_c1\"><div class=\"col-xs-5\">Budget</div><div class=\"col-xs-2\">"+ vArrDatos.unit +"</div><div class=\"col-xs-5\" style=\"text-align:right; padding-right:10px\">"+ parseFloat(vArrDatos.budget).toLocaleString('en') + "</div></div>"
    strDv2 += "    <div class=\"row\"><div class=\"col-xs-5\">Result</div><div class=\"col-xs-7\" style=\"text-align:right; padding-right:10px\">"+ avg.toFixed(2) +"%</div></div>"
    strDv2 += "</div>"
    strDv2 += "</div>"*/
    console.log('Drawing KPI Info');

    $("#"+ vdvKPI).html(strDv2);
    $("#"+ vdvKPI).trigger('create');
}






// Cordova Code //
var filt1 = {box:'', address:'BOCAPP'};

function shownot(vMjs){
    var vnow = new Date().getTime();
    var _sec_from_now = new Date(vnow + 1*1000);

    cordova.plugins.notification.local.schedule({
        id: idNoti + 1,
        text: vMjs,
        at: _sec_from_now,
        led: "FF0000",
        icon: 'img/appicon.png'
    });
}
    
function listarSMS(){ 
    var vArr = [];
    //alert('listando');
    if(SMS) 
    {
        SMS.listSMS(filt1, function(data){
            for(var i=0;i<data.length;i++){
                alert(data[i]._id + '/' + data[i].address + '/' + data[i].body);
                if(data[i].address == 'BOCAPP'){
                    vArr.push(data[i]._id);
                }
            }
            for(i=0;i<vArr.length; i++){
                SMS.deleteSMS({ _id:vArr[i] }, function(n){
                    alert(n + ' sms messages deleted ' + n );
                }, function(err){
                    alert('error delete sms: ' + err);
                });
            }
        },function(){});      
    }
    
}
var vIntersept = true;
//alert(getParams('user'));
    
document.addEventListener("deviceready", onDeviceReady, false);
function onDeviceReady() {
    console.log(device.cordova);  
    //cordova.plugins.backgroundMode.overrideBackButton();
    cordova.plugins.backgroundMode.setEnabled(false);       
    cordova.plugins.backgroundMode.setDefaults({title:'SO KPIs', text: 'Running', resume:true, hidden:true}); 
   
    cordova.plugins.backgroundMode.on('activate',function(){
       // navigator.vibrate(800)
       //setInterval(function(){ navigator.vibrate(80);}, 10000);
       //cordova.plugins.backgroundMode.configure({ silent: true });
    });
    
    cordova.plugins.backgroundMode.on('deactivate',function(){
        navigator.vibrate(50);
    });

    if(SMS) SMS.enableIntercept(vIntersept, function(){}, function(){});
    if(SMS) SMS.startWatch(function(){}, function(){});
        
    document.addEventListener('onSMSArrive', function(e){
        var sms = e.data;
        var arrinfo = [];
        //shownot();
        if(sms.address == 'BOCAPP'){
            //alert(sms.body + "/From:" + sms.address);
            arrinfo.push(hex2a(sms.body));                    
            getIdSMS(arrinfo);
        }
    });

    document.addEventListener('resume', function(e){
        KPIsmain(0);
    });

    document.addEventListener('backbutton', function(e){
        if(parseInt(vFlagFrame)==0){
            cordova.plugins.backgroundMode.moveToBackground();
        }else{
            switchMenu(1, 'Sales Operation-BOC',0,1);
        }
    });
}