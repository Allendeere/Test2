<%@ Page Language="C#" AutoEventWireup="true" CodeFile="WeightMod.aspx.cs" Inherits="WeightMod" %>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
<meta http-equiv="X-UA-Compatible" content="IE=edge" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>PMI - 秤重參數修改</title>
<link href="css/bootstrap.min.css" rel="stylesheet" type="text/css" />
<script src="js/jquery-1.12.0.min.js" type="text/javascript"></script>
<script src="js/bootstrap.min.js" type="text/javascript"></script>
<script src="js/tyg.js?version=20220728" type="text/javascript"></script>
<script src="js/chosen.jquery.js" type="text/javascript"></script>
<!--通用-->
<link href="css/general.css" rel="stylesheet" type="text/css" />
<link href="css/luo_default.css" rel="stylesheet" type="text/css" />
<!--私用-->
<link href="css/authority_m_add.css" rel="stylesheet" type="text/css" />
<link href="css/chosen.css" rel="stylesheet" type="text/css" />
<script>
	function soap(){
		tyg.setHead("<% Response.Write(Session["user"]); %>", true);
        weight.getWeightMod("<% Response.Write(Request.QueryString["ID"]); %>","<% Response.Write(Request.QueryString["Code"]); %>","<% Response.Write(Request.QueryString["Data"]); %>","<% Response.Write(Request.QueryString["Unit"]); %>");
	};
	
    function modWeight() {
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
					<h1 class="clearfix ma_10_0"><span class="fn_20 flo_l fn_black fn_bold">權限管理</span></h1>
					<div class="hr bc_blue3 ma_btm_20"></div>					
					<div class="tab-content">
						<div role="tabpanel" class="tab-pane active" id="authority_set">
							<div class="container wid100">
								<div class="row">
									<div class="col-md-3 col-sm-3 col-xs-12">
										<p class="fn_bold text-center">參數類型</p>
									</div>
									<div class="col-md-9 col-sm-9 col-xs-12">
										<p>
											<input type="text" id="tb_WB_GoodsID" name="WB_GoodsID" class="wid100" readonly="readonly" disabled="disabled"/>
										</p>
									</div>
                                    <div class="col-md-3 col-sm-3 col-xs-12">
										<p class="fn_bold text-center">參數條件</p>
									</div>
									<div class="col-md-9 col-sm-9 col-xs-12">
										<p>
											<input type="text" id="tb_WB_GoodsCode" name="WB_GoodsCode" class="wid100" readonly="readonly" disabled="disabled"/>
										</p>
									</div>
                                    <div class="col-md-3 col-sm-3 col-xs-12">
										<p class="fn_bold text-center">管理數值</p>
									</div>
									<div class="col-md-9 col-sm-9 col-xs-12">
										<p>
											<input type="text" id="tb_WB_GoodsData" name="WB_GoodsData" class="wid100"/>
										</p>
									</div>
                                    <div class="col-md-3 col-sm-3 col-xs-12">
										<p class="fn_bold text-center">使用單位</p>
									</div>
									<div class="col-md-9 col-sm-9 col-xs-12">
										<p>
											<input type="text" id="tb_WB_Unit" name="WB_Unit" class="wid100" readonly="readonly" disabled="disabled"/>
										</p>
									</div>
								</div>
								<div class="row">
									<div class="col-sm-6 col-xs-12 ma_btm_20">
										<input type="button" value="取消" onclick="weight.goWeightSetting()" class="btn input_style2"/>
									</div>
									<div class="col-sm-6 col-xs-12 ma_btm_20">
										<input type="submit" value="儲存" onclick="weight.updateWeightData()" class="btn input_style1"/>
									</div>
								</div>
							</div>
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
