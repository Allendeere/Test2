﻿<%@ Page Language="C#" AutoEventWireup="true" CodeFile="StatusDetail.aspx.cs" Inherits="Default2" %>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
<meta http-equiv="X-UA-Compatible" content="IE=edge" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>PMI - 成型機狀態</title>
<link href="css/bootstrap.min.css" rel="stylesheet" type="text/css" />
<script src="js/jquery-1.12.0.min.js" type="text/javascript"></script>
<script src="js/jquery-ui-1.12.1.js"  type="text/javascript"></script>
<script src="js/bootstrap.min.js" type="text/javascript"></script>
<script src="js/tyg.js?version=20220510" type="text/javascript"></script>
<!--通用-->
<link href="css/general.css" rel="stylesheet" type="text/css" />
<link href="css/luo_default.css" rel="stylesheet" type="text/css" />
<link href="css/all.css" rel="stylesheet" type="text/css" />
<!--私用-->
<link href="css/device_status_detail.css" rel="stylesheet" type="text/css" />
<link href="css/jquery-ui-1.12.1.css" rel="stylesheet" />
<script type="text/javascript">
	function soap(){
        tyg.setHead("<% Response.Write(Session["user"]); %>", true);
        machine.getDetail("<% Response.Write(Request.Form["factoryID"]); %>", "<% Response.Write(Request.Form["areaID"]); %>");
    };
  $(function() {
      $(document).tooltip();
  });
</script>
</head>
<body onload="soap()">
	<!--head-->
	<div id="head"></div>
	<!--content-->
	<div id="content">
		<div class="container">
			<div class="v1">
				<!--按鈕-->
				<div class="row">
					<div class="col-md-2 col-sm-3 col-xs-12">
						<a class="btn btn-default disabled w100">詳細資料</a>
					</div>
                    <div class="col-md-2 col-sm-3 col-xs-12">
						<a href="StatusPlan.aspx" class="btn btn-default btn-detail w100">平面圖</a>
					</div>	
                    <div class="col-md-8 col-sm-6 col-xs-12">
						<div class="panel-group" id="accordion" role="tablist" aria-multiselectable="false">
							<div class="panel panel-default">
								<div class="panel-heading" role="tab" id="headingOne">
									<a role="button" data-toggle="collapse" data-parent="#accordion" href="#collapseOne" aria-expanded="false" aria-controls="collapseOne" class="collapsed panel-btn">
										<h4 class="panel-title">搜尋工具</h4>
									</a>
								</div>
								<div id="collapseOne" class="panel-collapse collapse" role="tabpanel" aria-labelledby="headingOne">
									<div class="panel-body">
										<form id="search-form" method="post" action="StatusDetail.aspx">
											<div class="form-group">
												<div class="row">
													<div class="col-lg-12 fn_red red-star">依選取廠區，列出區域</div>
												</div>
											</div>
											<div class="form-group">
												<div class="row fn_black">
													<div class="col-md-2 col-sm-2 ta-r">廠區</div>
													<div class="col-md-10 col-sm-10">
														<select id="factoryID" name="factoryID" class="w100" onchange="machine.getAreaOption(this.value, '')"></select>
													</div>
												</div>
											</div>
											<div class="form-group" id="areaSelDiv" style="display: none">
												<div class="row fn_black">
													<div class="col-md-2 col-sm-2 red-star ta-r">區域</div>
													<div class="col-md-10 col-sm-10">
														<select id="areaID" name="areaID" class="w100"></select>
													</div>
												</div>
											</div>
											<div class="row">
												<div class="col-md-6 col-sm-6 col-xs-12 ta-r">
													<input name="reset" type="reset" id="reset" value="清空" class="btn btn-default clear-btn" onclick="machine.hideAreaOption('')" />
												</div>
												<div class="col-md-6 col-sm-6 col-xs-12">
													<input name="submit" type="submit" id="submit" value="查詢" class="btn btn-default yes-btn" />
												</div>
											</div>
										</form>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>				
			</div>
			<div class="v2">
				<div class="ma_0_10">
					<div class="row" id="my_row"></div>
				</div>
			</div>
		</div>
	</div>
	<!--foot-->
	<div id="foot" class="txt_center txt_spac_3 ma_10_0">© Copyright 2017 東陽事業集團 All Rights Reserved</div>
</body>
</html>
