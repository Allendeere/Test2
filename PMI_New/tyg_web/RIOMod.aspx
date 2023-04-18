<%@ Page Language="C#" AutoEventWireup="true" CodeFile="RIOMod.aspx.cs" Inherits="PlatformList" %>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
<meta http-equiv="X-UA-Compatible" content="IE=edge" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>PMI - RIO修改</title>
<link href="css/bootstrap.min.css" rel="stylesheet" type="text/css" />
<script src="js/jquery-1.12.0.min.js" type="text/javascript"></script>
<script src="js/bootstrap.min.js" type="text/javascript"></script>
<script src="js/tyg_new.js" type="text/javascript"></script>
<!--通用-->
<link href="css/general.css" rel="stylesheet" type="text/css" />
<link href="css/luo_default.css" rel="stylesheet" type="text/css" />
<link href="css/all.css" rel="stylesheet" type="text/css" />
<!--私用-->
<link href="css/mat_station_m_edit.css" rel="stylesheet" type="text/css" />
<script type="text/javascript">	
	function soap(){
		tyg.setHead("<% Response.Write(Session["user"]); %>", true);	
		//platform.getPlatform("<% Response.Write(Request.QueryString["id"]); %>");
		rio.getRIO("<% Response.Write(Request.QueryString["id"]); %>");
	};
	
	function modPlatform() {		
        var rioID = $("#rioID").val();
        var rioIP = $("#rioIP").val();
        var platformID = $("#platformID").val();
        var rioMachineID = $("#rioMachineID").val();

        if (rioID != "" && rioIP != "" && rioMachineID != "" && platformID!="") {
            rio.modRIO(rioID, rioIP, rioMachineID, platformID);
		}else{
			alert("請填入所有必填欄位!!!");
		}
	}
</script>
</head>
<body onload="soap()">
	<!--head-->
	<div id="head"></div>
	<!--content-->
	<div id="content">
		<div class="container">
			<div class="v1">
				<div class="ma_0_10">
					<h1 class="clearfix ma_10_0"><span class="fn_20 flo_l fn_black fn_bold">RIO修改</span></h1>
					<div class="hr bc_blue3 ma_btm_20"></div>
					<div class="container view_content">
						<div class="row ma_btm_20">

						</div>
						<div class="row ma_btm_20">
							<div class="col-md-3 col-sm-3 col-xs-12">
								<p class="title_lvl1"><span class="fn_red">*</span>RIO ID</p>
							</div>
							<div class="col-md-9 col-sm-9 col-xs-12">
								<input type="text" id="rioID" name="rioID" readonly="readonly" />
								<span>必填，限定數字</span>
							</div>
						</div>
						<div class="row ma_btm_20">
							<div class="col-md-3 col-sm-3 col-xs-12">
								<p class="title_lvl1"><span class="fn_red">*</span>RIO IP</p>
							</div>
							<div class="col-md-9 col-sm-9 col-xs-12">
								<input type="text" id="rioIP" name="rioIP" />
								<span>必填，限定數字、長度15</span>
							</div>
						</div>
						<div class="row ma_btm_20">
							<div class="col-md-3 col-sm-3 col-xs-12">
								<p class="title_lvl1"><span class="fn_red">*</span>平台ID</p>
							</div>
							<div class="col-md-9 col-sm-9 col-xs-12">
								<input type="text" id="platformID" name="platformID" />
								<span>必填</span>
							</div>
						</div>
						<div class="row ma_btm_20">
							<div class="col-md-3 col-sm-3 col-xs-12">
								<p class="title_lvl1"><span class="fn_red">*</span>對應成形機ID</p>
							</div>
							<div class="col-md-9 col-sm-9 col-xs-12">
								<input type="text" id="rioMachineID" name="rioMachineID" />
								必填，限定數字
							</div>
						</div>
						
						<div class="row ">
							<div class="col-md-6 col-sm-6 col-xs-12 ma_btm_20"><input Type="button" value="取消" onClick="rio.gotoList()" class="btn input_style2"></div>
							<div class="col-md-6 col-sm-6 col-xs-12 ma_btm_20"><input type="button" value="儲存" onClick="modPlatform()" class="btn input_style1"></div>
						</div>
					</div>
					<div class="clr"></div>
				</div>
			</div>
		</div>
	</div>
	<!--foot-->
	<div id="foot" class="txt_center txt_spac_3 ma_10_0">© Copyright 2017 東陽事業集團 All Rights Reserved</div>	
</body>
</html>
