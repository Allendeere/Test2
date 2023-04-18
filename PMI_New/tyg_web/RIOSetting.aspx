<%@ Page Language="C#" AutoEventWireup="true" CodeFile="RIOSetting.aspx.cs" Inherits="RIOSetting" %>

<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>PMI - RIOSetting</title>
    <script src="js/jquery-1.12.0.min.js" type="text/javascript"></script>
    <script src="js/bootstrap.min.js" type="text/javascript"></script>
    <script src="js/tyg_new.js" type="text/javascript"></script>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous">
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0/dist/js/bootstrap.bundle.min.js" integrity="sha384-p34f1UUtsS3wqzfto5wAAmdvj+osOnFyQFpp4Ua3gs/ZVWx6oOypYoCJhGGScy+8" crossorigin="anonymous"></script>

    <!--通用-->
    <link href="css/general.css" rel="stylesheet" type="text/css" />
    <link href="css/luo_default.css" rel="stylesheet" type="text/css" />
    <!--私用-->
    <link href="css/device_status_detail.css" rel="stylesheet" type="text/css" />
    <link href="css/mat_station_m.css" rel="stylesheet" type="text/css" />

    <script type="text/javascript">
        function soap() {
            tyg.setHead("<% Response.Write(Session["user"]); %>", true);
            rio.getListAllTest("<% Response.Write(RioAuth); %>");
        };

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
                    <h1 class="clearfix ma_10_0"><span class="fn_20 flo_l fn_black fn_bold">RIOSetting</span></h1>
                    <div class="hr bc_blue3 ma_btm_20"></div>


                    <div class="table_ctrl">
                        <div class="flo_l">
                            <% if (RioAuth == 2)
                                { %>
                            <button type="button" class="btn btn-primary btn-sm" style="color: #333; background-color: #fff; border-color: #ccc;" onclick="rio.gotoAdd()">新增RIO</button><% } %>
                        </div>
                    </div>

                    <!--表格-->
                    <div id="a"></div>
                    <div class="table-responsive bor_0">
                        <table id="my_table" class="my_table table table-bordered bc_gray3">
                            <thead>
                                <tr>
                                    <th>RIOSetting  </th>
                                </tr>
                            </thead>
                            <div class="v2">
                                <div class="ma_0_10">
                                    <tbody>
                                    </tbody>
                                </div>
                            </div>
                        </table>
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
