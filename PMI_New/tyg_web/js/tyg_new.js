//var IUDServiceURL = "http://172.17.3.85:9999/IUDService.asmx";
//var HDServiceURL = "http://172.17.3.85:9999/HoleDetectService.asmx";
var IUDServiceURL = "http://localhost:2509/IUDService.asmx";
var HDServiceURL = "http://localhost:2509/HoleDetectService.asmx";


var tyg = {
    setHead: function (user, show) {
        var head = "";

        head += "<div class='container'>";

        head += "<div class='row ma_10_0'>";
        head += "<div class='col-sm-3 col-xs-5'>";
        if (show) {
            head += "<a class='flo_l' href='Default.aspx' title=''><img src='image/home png icon.png' alt=''></a>";
        }
        //head += "<a class='flo_l' data-toggle='collapse' data-target='#multiCollapseExample1' aria-controls='multiCollapseExample1'><img src='image/menubtn.png' alt=''></a>";
        head += "</div>";
        head += "<div class='col-sm-5 col-xs-3 txt_center'>";
        head += "<div class='sys_name'><span class='fn_20'>塑膠製造資訊系統</span></div>";
        head += "</div>";
        head += "<div class='col-sm-4 col-xs-4'><a class='flo_r' href='" + ((user == "訪客") ? "Enter" : "Logout") + ".aspx' title=''><img src='image/" + ((user == "訪客") ? "in" : "out") + "btn.png' alt=''></a><span class='login-user flo_r user_name' style='margin-right:16px;'>目前使用者：" + user + "</span ></div>";
        //head += "<div class='col-sm-12 col-xs-12' id='multiCollapseExample1'>";
        head += "<div class='status_list' style='flo_l'>";
        head += "<span class='fn_white' title='XX：供料設備異常\nX：若該成型機無監控供料\n**：使用Bypass\n無：無插供料插銷\n英數：供料孔位置'>成型機狀態：</span>";
        head += "<span class='status_color bc_green fn_black'>全自動</span>";
        head += "<span class='status_color bc_blue fn_black'>半自動</span>";
        head += "<span class='status_color bc_tan fn_black'>手&emsp;&emsp;動</span>";
        head += "<span class='status_color bc_white fn_black'>換模中</span>";
        head += "<span class='status_color bc_red fn_white'>馬達停止</span>";
        head += "<span class='status_color bc_gray2 fn_white'>未連線</span>";
        head += "<span class='fn_white' style='margin-left: 20px;'>燈號：</span>";
        head += "<span class='light_status' style='margin-left: 10px; background:#00cb00;'></span>用料正常";
        head += "<span class='light_status' style='margin-left: 10px; background:#ed1b24;'></span>用料異常";
        head += "<span class='light_status' style='margin-left: 10px; background:#ffff11;'></span>工單異常";
        head += "<span class='light_status' style='margin-left: 10px; background:#ff7800;'></span>用料工單皆異常";
        head += "</div>";
        //head += "</div>";
        head += "</div>";
        head += "</div>";

        $("#head").html(head);
    },
    getTime: function () {
        var nowTime = new Date();

        var year = nowTime.getFullYear();
        var month = nowTime.getMonth() + 1;
        month = ((month < 10) ? "0" : "") + month;
        var day = nowTime.getDate();
        day = ((day < 10) ? "0" : "") + day;
        var hour = nowTime.getHours();
        hour = ((hour < 10) ? "0" : "") + hour;
        var minute = nowTime.getMinutes();
        minute = ((minute < 10) ? "0" : "") + minute;
        var second = nowTime.getSeconds();

        var nowText = year + "/" + month + "/" + day + " " + hour + ":" + minute + ":" + second;

        return nowText;
    }
};

var factory = {
    getList: function (check) {
        var data = "<?xml version=\"1.0\" encoding=\"utf-8\"?>"
            + "<soap12:Envelope xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\" xmlns:soap12=\"http://www.w3.org/2003/05/soap-envelope\">"
            + "<soap12:Body>"
            + "<GetAllFactory xmlns=\"http://tempuri.org/\" />"
            + "</soap12:Body>"
            + "</soap12:Envelope>";

        var xhr = new XMLHttpRequest();
        xhr.withCredentials = false;
        xhr.addEventListener(
            "readystatechange",
            function () {
                if (this.readyState === 4) {
                    var parser = new DOMParser();
                    var xmlDoc = parser.parseFromString(this.responseText, "text/xml");
                    var json = JSON.parse(xmlDoc.getElementsByTagName("GetAllFactoryResult")[0].innerHTML);

                    var tbody = document.getElementById("my_table").getElementsByTagName("tbody")[0];

                    for (i = 0; i < json.Data.length; i++) {
                        var tr = tbody.insertRow(i);
                        for (j = 0; j < 5; j++) {
                            tr.insertCell(j);
                        }

                        tbody.getElementsByTagName("tr")[i].getElementsByTagName("td")[0].innerHTML = json.Data[i].CreateDate;
                        tbody.getElementsByTagName("tr")[i].getElementsByTagName("td")[1].innerHTML = json.Data[i].FactoryID;
                        tbody.getElementsByTagName("tr")[i].getElementsByTagName("td")[2].innerHTML = unescape(json.Data[i].FactoryName);
                        tbody.getElementsByTagName("tr")[i].getElementsByTagName("td")[3].innerHTML = json.Data[i].Updater;
                        tbody.getElementsByTagName("tr")[i].getElementsByTagName("td")[4].innerHTML = ((check == 2) ? "<button type='button' class='btn btn-primary' onclick='factory.gotoMod(\"" + json.Data[i].FactoryID + "\")'>設定</button>\n<button type='button' class='btn btn-primary' onclick='factory.delFactory(\"" + json.Data[i].FactoryID + "\")'>刪除</button>" : "");
                    }
                }
            }
        );

        xhr.open("POST", IUDServiceURL, false);
        xhr.setRequestHeader("content-type", "text/xml");
        xhr.send(data);
    },
    gotoList: function () {
        location.href = "FactoryList.aspx";
    },
    gotoAdd: function () {
        location.href = "FactoryAdd.aspx";
    },
    gotoMod: function (factoryID) {
        location.href = "FactoryMod.aspx?id=" + factoryID;
    },
    getFactory: function (factoryID) {
        var data = "<?xml version=\"1.0\" encoding=\"utf-8\"?>"
            + "<soap12:Envelope xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\" xmlns:soap12=\"http://www.w3.org/2003/05/soap-envelope\">"
            + "<soap12:Body>"
            + "<GetFactoryByID xmlns=\"http://tempuri.org/\">"
            + "<factoryID>" + factoryID + "</factoryID>"
            + "</GetFactoryByID>"
            + "</soap12:Body>"
            + "</soap12:Envelope>";

        var xhr = new XMLHttpRequest();
        xhr.withCredentials = false;
        xhr.addEventListener(
            "readystatechange",
            function () {
                if (this.readyState === 4) {
                    var parser = new DOMParser();
                    var xmlDoc = parser.parseFromString(this.responseText, "text/xml");
                    var json = JSON.parse(xmlDoc.getElementsByTagName("GetFactoryByIDResult")[0].innerHTML);

                    $("#factoryID").val(json.Data[0].FactoryID);
                    $("#factoryName").val(unescape(json.Data[0].FactoryName));
                    $("#factoryPic").attr("src", json.Data[0].PictureFileName);
                    $("#oribgImageStr").val(json.Data[0].bgImage);
                    $("#note").val(json.Data[0].Note);
                    $("#modDate").html(json.Data[0].Updater + "\n" + json.Data[0].AlterDate);
                }
            }
        );

        xhr.open("POST", IUDServiceURL, false);
        xhr.setRequestHeader("content-type", "text/xml");
        xhr.send(data);
    },
    addFactory: function (factoryID, factoryName, bgImageStr, note, founder) {
        var data = "<?xml version=\"1.0\" encoding=\"utf-8\"?>"
            + "<soap12:Envelope xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\" xmlns:soap12=\"http://www.w3.org/2003/05/soap-envelope\">"
            + "<soap12:Body>"
            + "<AddFactory xmlns=\"http://tempuri.org/\">"
            + "<factoryID>" + factoryID + "</factoryID>"
            + "<factoryName>" + escape(factoryName) + "</factoryName>"
            + "<bgImage>" + bgImageStr + "</bgImage>"
            + "<note>" + note + "</note>"
            + "<founder>" + founder + "</founder>"
            + "</AddFactory>"
            + "</soap12:Body>"
            + "</soap12:Envelope>";

        var xhr = new XMLHttpRequest();
        xhr.withCredentials = false;
        xhr.addEventListener(
            "readystatechange",
            function () {
                if (this.readyState === 4) {
                    var parser = new DOMParser();
                    var xmlDoc = parser.parseFromString(this.responseText, "text/xml");
                    var json = JSON.parse(xmlDoc.getElementsByTagName("AddFactoryResult")[0].innerHTML);

                    alert(json.Data[0].Result + "!!!");
                    if (json.Data[0].Result == "新增成功") {
                        location.href = "FactoryList.aspx";
                    }
                }
            }
        );

        xhr.open("POST", IUDServiceURL, false);
        xhr.setRequestHeader("content-type", "text/xml");
        xhr.send(data);
    },
    modFactory: function (factoryID, factoryName, bgImageStr, note, updater) {
        var data = "<?xml version=\"1.0\" encoding=\"utf-8\"?>"
            + "<soap12:Envelope xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\" xmlns:soap12=\"http://www.w3.org/2003/05/soap-envelope\">"
            + "<soap12:Body>"
            + "<ModFactory xmlns=\"http://tempuri.org/\">"
            + "<factoryID>" + factoryID + "</factoryID>"
            + "<factoryName>" + escape(factoryName) + "</factoryName>"
            + "<bgImage>" + bgImageStr + "</bgImage>"
            + "<note>" + note + "</note>"
            + "<updater>" + updater + "</updater>"
            + "</ModFactory>"
            + "</soap12:Body>"
            + "</soap12:Envelope>";

        var xhr = new XMLHttpRequest();
        xhr.withCredentials = false;
        xhr.addEventListener(
            "readystatechange",
            function () {
                if (this.readyState === 4) {
                    var parser = new DOMParser();
                    var xmlDoc = parser.parseFromString(this.responseText, "text/xml");
                    var json = JSON.parse(xmlDoc.getElementsByTagName("ModFactoryResult")[0].innerHTML);

                    alert(json.Data[0].Result + "!!!");
                    if (json.Data[0].Result == "修改成功") {
                        location.href = "FactoryList.aspx";
                    }
                }
            }
        );

        xhr.open("POST", IUDServiceURL, false);
        xhr.setRequestHeader("content-type", "text/xml");
        xhr.send(data);
    },
    delFactory: function (factoryID) {
        if (confirm("確定刪除此廠區?")) {
            var data = "<?xml version=\"1.0\" encoding=\"utf-8\"?>"
                + "<soap12:Envelope xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\" xmlns:soap12=\"http://www.w3.org/2003/05/soap-envelope\">"
                + "<soap12:Body>"
                + "<DelFactory xmlns=\"http://tempuri.org/\">"
                + "<factoryID>" + factoryID + "</factoryID>"
                + "</DelFactory>"
                + "</soap12:Body>"
                + "</soap12:Envelope>";

            var xhr = new XMLHttpRequest();
            xhr.withCredentials = false;

            xhr.open("POST", IUDServiceURL, false);
            xhr.setRequestHeader("content-type", "text/xml");
            xhr.send(data);

            alert("刪除成功!!!");
            window.location.reload();
        }
    },
    uploadPic: function () {
        $("#bgImage").click();
    },
    setBase64() {
        var file = document.getElementById("bgImage").files.item(0);
        var reader = new FileReader();

        reader.onloadend = function () {
            var base64Str = reader.result;

            $("#bgImageText").val(file.name);
            $("#bgImageStr").val(base64Str.split(",")[1]);
        }

        reader.readAsDataURL(file);
    }
};

var area = {
    getList: function (check) {
        var data = "<?xml version=\"1.0\" encoding=\"utf-8\"?>"
            + "<soap12:Envelope xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\" xmlns:soap12=\"http://www.w3.org/2003/05/soap-envelope\">"
            + "<soap12:Body>"
            + "<GetAllArea xmlns=\"http://tempuri.org/\" />"
            + "</soap12:Body>"
            + "</soap12:Envelope>";

        var xhr = new XMLHttpRequest();
        xhr.withCredentials = false;
        xhr.addEventListener(
            "readystatechange",
            function () {
                if (this.readyState === 4) {
                    var parser = new DOMParser();
                    var xmlDoc = parser.parseFromString(this.responseText, "text/xml");
                    var json = JSON.parse(xmlDoc.getElementsByTagName("GetAllAreaResult")[0].innerHTML);

                    var tbody = document.getElementById("my_table").getElementsByTagName("tbody")[0];

                    for (i = 0; i < json.Data.length; i++) {
                        var tr = tbody.insertRow(i);
                        for (j = 0; j < 8; j++) {
                            tr.insertCell(j);
                        }

                        tbody.getElementsByTagName("tr")[i].getElementsByTagName("td")[0].innerHTML = json.Data[i].CreateDate;
                        tbody.getElementsByTagName("tr")[i].getElementsByTagName("td")[1].innerHTML = json.Data[i].FactoryID;
                        tbody.getElementsByTagName("tr")[i].getElementsByTagName("td")[2].innerHTML = json.Data[i].AreaID;
                        tbody.getElementsByTagName("tr")[i].getElementsByTagName("td")[3].innerHTML = unescape(json.Data[i].AreaName);
                        tbody.getElementsByTagName("tr")[i].getElementsByTagName("td")[4].innerHTML = json.Data[i].MNum;
                        tbody.getElementsByTagName("tr")[i].getElementsByTagName("td")[5].innerHTML = ((json.Data[i].TestMode) ? "是" : "否");
                        tbody.getElementsByTagName("tr")[i].getElementsByTagName("td")[6].innerHTML = json.Data[i].Updater;
                        tbody.getElementsByTagName("tr")[i].getElementsByTagName("td")[7].innerHTML = ((check == 2) ? "<button type='button' class='btn btn-primary' onclick='area.gotoMod(\"" + json.Data[i].AreaID + "\")'>設定</button>\n<button type='button' class='btn btn-primary' onclick='area.gotoSet(\"" + json.Data[i].AreaID + "\")'>成型機</button>\n<button type='button' class='btn btn-primary' onclick='area.delArea(\"" + json.Data[i].AreaID + "\")'>刪除</button>" : "");
                    }
                }
            }
        );

        xhr.open("POST", IUDServiceURL, false);
        xhr.setRequestHeader("content-type", "text/xml");
        xhr.send(data);
    },
    getFactoryList: function (factoryID) {
        //factoryID = "";
        var data = "<?xml version=\"1.0\" encoding=\"utf-8\"?>"
            + "<soap12:Envelope xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\" xmlns:soap12=\"http://www.w3.org/2003/05/soap-envelope\">"
            + "<soap12:Body>"
            + "<GetAllFactory xmlns=\"http://tempuri.org/\" />"
            + "</soap12:Body>"
            + "</soap12:Envelope>";

        var xhr = new XMLHttpRequest();
        xhr.withCredentials = false;
        xhr.addEventListener(
            "readystatechange",
            function () {
                if (this.readyState === 4) {
                    var parser = new DOMParser();
                    var xmlDoc = parser.parseFromString(this.responseText, "text/xml");
                    var json = JSON.parse(xmlDoc.getElementsByTagName("GetAllFactoryResult")[0].innerHTML);

                    for (i = 0; i < json.Data.length; i++) {
                        $("#factoryID").append($("<option></option>").attr("value", json.Data[i].FactoryID).text(unescape(json.Data[i].FactoryName)));
                    }

                    if (factoryID != "") {
                        $("#factoryID").val(factoryID);
                    } else {
                        $("#factoryID").val($("#factoryID option:first").val());
                    }
                }
            }
        );

        xhr.open("POST", IUDServiceURL, false);
        xhr.setRequestHeader("content-type", "text/xml");
        xhr.send(data);
    },
    gotoList: function () {
        location.href = "AreaList.aspx";
    },
    gotoAdd: function () {
        location.href = "AreaAdd.aspx";
    },
    gotoMod: function (areaID) {
        location.href = "AreaMod.aspx?id=" + areaID;
    },
    gotoSet: function (areaID) {
        location.href = "MachineList.aspx?aid=" + areaID;
    },
    getArea: function (areaID) {
        var data = "<?xml version=\"1.0\" encoding=\"utf-8\"?>"
            + "<soap12:Envelope xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\" xmlns:soap12=\"http://www.w3.org/2003/05/soap-envelope\">"
            + "<soap12:Body>"
            + "<GetAreaByID xmlns=\"http://tempuri.org/\">"
            + "<areaID>" + areaID + "</areaID>"
            + "</GetAreaByID>"
            + "</soap12:Body>"
            + "</soap12:Envelope>";

        var xhr = new XMLHttpRequest();
        xhr.withCredentials = false;
        xhr.addEventListener(
            "readystatechange",
            function () {
                if (this.readyState === 4) {
                    var parser = new DOMParser();
                    var xmlDoc = parser.parseFromString(this.responseText, "text/xml");
                    var json = JSON.parse(xmlDoc.getElementsByTagName("GetAreaByIDResult")[0].innerHTML);

                    area.getFactoryList(json.Data[0].FactoryID);
                    $("#areaID").val(json.Data[0].AreaID);
                    $("#areaName").val(unescape(json.Data[0].AreaName));
                    $("#areaIP").val(json.Data[0].AreaIP);
                    $("#areaPort").val(json.Data[0].AreaPort);
                    $("#testMode").val(json.Data[0].TestMode);
                    $("#note").val(json.Data[0].Note);
                    $("#modDate").html(json.Data[0].Updater + "\n" + json.Data[0].AlterDate);
                }
            }
        );

        xhr.open("POST", IUDServiceURL, false);
        xhr.setRequestHeader("content-type", "text/xml");
        xhr.send(data);
    },
    addArea: function (factoryID, areaID, areaName, areaIP, areaPort, testMode, note, founder) {
        var data = "<?xml version=\"1.0\" encoding=\"utf-8\"?>"
            + "<soap12:Envelope xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\" xmlns:soap12=\"http://www.w3.org/2003/05/soap-envelope\">"
            + "<soap12:Body>"
            + "<AddArea xmlns=\"http://tempuri.org/\">"
            + "<factoryID>" + factoryID + "</factoryID>"
            + "<areaID>" + areaID + "</areaID>"
            + "<areaName>" + escape(areaName) + "</areaName>"
            + "<areaIP>" + areaIP + "</areaIP>"
            + "<areaPort>" + areaPort + "</areaPort>"
            + "<testMode>" + testMode + "</testMode>"
            + "<note>" + note + "</note>"
            + "<founder>" + founder + "</founder>"
            + "</AddArea>"
            + "</soap12:Body>"
            + "</soap12:Envelope>";

        var xhr = new XMLHttpRequest();
        xhr.withCredentials = false;
        xhr.addEventListener(
            "readystatechange",
            function () {
                if (this.readyState === 4) {
                    var parser = new DOMParser();
                    var xmlDoc = parser.parseFromString(this.responseText, "text/xml");
                    var json = JSON.parse(xmlDoc.getElementsByTagName("AddAreaResult")[0].innerHTML);

                    alert(json.Data[0].Result + "!!!");
                    if (json.Data[0].Result == "新增成功") {
                        location.href = "AreaList.aspx";
                    }
                }
            }
        );

        xhr.open("POST", IUDServiceURL, false);
        xhr.setRequestHeader("content-type", "text/xml");
        xhr.send(data);
    },
    modArea: function (factoryID, areaID, areaName, areaIP, areaPort, testMode, note, updater) {
        var data = "<?xml version=\"1.0\" encoding=\"utf-8\"?>"
            + "<soap12:Envelope xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\" xmlns:soap12=\"http://www.w3.org/2003/05/soap-envelope\">"
            + "<soap12:Body>"
            + "<ModArea xmlns=\"http://tempuri.org/\">"
            + "<factoryID>" + factoryID + "</factoryID>"
            + "<areaID>" + areaID + "</areaID>"
            + "<areaName>" + escape(areaName) + "</areaName>"
            + "<areaIP>" + areaIP + "</areaIP>"
            + "<areaPort>" + areaPort + "</areaPort>"
            + "<testMode>" + testMode + "</testMode>"
            + "<note>" + note + "</note>"
            + "<updater>" + updater + "</updater>"
            + "</ModArea>"
            + "</soap12:Body>"
            + "</soap12:Envelope>";

        var xhr = new XMLHttpRequest();
        xhr.withCredentials = false;
        xhr.addEventListener(
            "readystatechange",
            function () {
                if (this.readyState === 4) {
                    var parser = new DOMParser();
                    var xmlDoc = parser.parseFromString(this.responseText, "text/xml");
                    var json = JSON.parse(xmlDoc.getElementsByTagName("ModAreaResult")[0].innerHTML);

                    alert(json.Data[0].Result + "!!!");
                    if (json.Data[0].Result == "修改成功") {
                        location.href = "AreaList.aspx";
                    }
                }
            }
        );

        //plc.checkAreaReflash("2021/11/25 13:51:14", factoryID, areaID);

        xhr.open("POST", IUDServiceURL, false);
        xhr.setRequestHeader("content-type", "text/xml");
        xhr.send(data);
    },
    delArea: function (areaID) {
        if (confirm("確定刪除此區域?")) {
            var data = "<?xml version=\"1.0\" encoding=\"utf-8\"?>"
                + "<soap12:Envelope xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\" xmlns:soap12=\"http://www.w3.org/2003/05/soap-envelope\">"
                + "<soap12:Body>"
                + "<DelArea xmlns=\"http://tempuri.org/\">"
                + "<areaID>" + areaID + "</areaID>"
                + "</DelArea>"
                + "</soap12:Body>"
                + "</soap12:Envelope>";

            var xhr = new XMLHttpRequest();
            xhr.withCredentials = false;

            xhr.open("POST", IUDServiceURL, false);
            xhr.setRequestHeader("content-type", "text/xml");
            xhr.send(data);

            alert("刪除成功!!!");
            window.location.reload();
        }
    }
};

var platform = {
    getList: function (check) {
        var data = "<?xml version=\"1.0\" encoding=\"utf-8\"?>"
            + "<soap12:Envelope xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\" xmlns:soap12=\"http://www.w3.org/2003/05/soap-envelope\">"
            + "<soap12:Body>"
            + "<GetAllPlatform_New xmlns=\"http://tempuri.org/\" />"
            + "</soap12:Body>"
            + "</soap12:Envelope>";

        var xhr = new XMLHttpRequest();
        xhr.withCredentials = false;
        xhr.addEventListener(
            "readystatechange",
            function () {
                if (this.readyState === 4) {
                    var parser = new DOMParser();
                    var xmlDoc = parser.parseFromString(this.responseText, "text/xml");
                    var json = JSON.parse(xmlDoc.getElementsByTagName("GetAllPlatform_NewResult")[0].innerHTML);

                    var tbody = document.getElementById("my_table").getElementsByTagName("tbody")[0];

                    for (i = 0; i < json.Data.length; i++) {
                        var tr = tbody.insertRow(i);
                        for (j = 0; j < 7; j++) {
                            tr.insertCell(j);
                        }

                        tbody.getElementsByTagName("tr")[i].getElementsByTagName("td")[0].innerHTML = json.Data[i].CreateDate;
                        tbody.getElementsByTagName("tr")[i].getElementsByTagName("td")[1].innerHTML = unescape(json.Data[i].PlatformName);
                        tbody.getElementsByTagName("tr")[i].getElementsByTagName("td")[2].innerHTML = json.Data[i].GroupNo;
                        tbody.getElementsByTagName("tr")[i].getElementsByTagName("td")[3].innerHTML = json.Data[i].XNum;
                        tbody.getElementsByTagName("tr")[i].getElementsByTagName("td")[4].innerHTML = json.Data[i].YNum;
                        tbody.getElementsByTagName("tr")[i].getElementsByTagName("td")[5].innerHTML = json.Data[i].Updater;
                        tbody.getElementsByTagName("tr")[i].getElementsByTagName("td")[6].innerHTML = ((check == 2) ? "<button type='button' class='btn btn-primary' onclick='platform.gotoMod(\"" + json.Data[i].PlatformID + "\")'>設定</button>\n<button type='button' class='btn btn-primary' onclick='platform.delPlatform(\"" + json.Data[i].PlatformID + "\")'>刪除</button>" : "");
                    }
                }
            }
        );

        xhr.open("POST", IUDServiceURL, false);
        xhr.setRequestHeader("content-type", "text/xml");
        xhr.send(data);
    },
    getHeap: function (allow) {
        var data = "<?xml version=\"1.0\" encoding=\"utf-8\"?>"
            + "<soap12:Envelope xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\" xmlns:soap12=\"http://www.w3.org/2003/05/soap-envelope\">"
            + "<soap12:Body>"
            + "<GetAllowPlatform_New xmlns=\"http://tempuri.org/\">"
            + "<allow>" + allow + "</allow>"
            + "</GetAllowPlatform_New>"
            + "</soap12:Body>"
            + "</soap12:Envelope>";

        var xhr = new XMLHttpRequest();
        xhr.withCredentials = false;
        xhr.addEventListener(
            "readystatechange",
            function () {
                if (this.readyState === 4) {
                    var parser = new DOMParser();
                    var xmlDoc = parser.parseFromString(this.responseText, "text/xml");
                    console.log(xmlDoc.getElementsByTagName("GetAllowPlatform_NewResult")[0].innerHTML);
                    var json = JSON.parse(xmlDoc.getElementsByTagName("GetAllowPlatform_NewResult")[0].innerHTML);

                    var tbody = document.getElementById("my_table").getElementsByTagName("tbody")[0];

                    for (i = 0; i < json.Data.length; i++) {
                        var tr = tbody.insertRow(i);
                        for (j = 0; j < 6; j++) {
                            tr.insertCell(j);
                        }

                        tbody.getElementsByTagName("tr")[i].getElementsByTagName("td")[0].innerHTML = json.Data[i].CreateDate;
                        tbody.getElementsByTagName("tr")[i].getElementsByTagName("td")[1].innerHTML = unescape(json.Data[i].PlatformName);
                        tbody.getElementsByTagName("tr")[i].getElementsByTagName("td")[2].innerHTML = json.Data[i].GroupNo;
                        tbody.getElementsByTagName("tr")[i].getElementsByTagName("td")[3].innerHTML = json.Data[i].XNum;
                        tbody.getElementsByTagName("tr")[i].getElementsByTagName("td")[4].innerHTML = json.Data[i].YNum;
                        tbody.getElementsByTagName("tr")[i].getElementsByTagName("td")[5].innerHTML = "<button type='button' class='btn btn-primary' onclick='platform.gotoPile(\"" + json.Data[i].PlatformID + "\")'>料號</button>";
                    }
                }
            }
        );

        xhr.open("POST", IUDServiceURL, false);
        xhr.setRequestHeader("content-type", "text/xml");
        xhr.send(data);
    },
    getPlatformState: function (factoryID, areaID) {
        var data = "<?xml version=\"1.0\" encoding=\"utf-8\"?>"
            + "<soap12:Envelope xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\" xmlns:soap12=\"http://www.w3.org/2003/05/soap-envelope\">"
            + "<soap12:Body>"
            + "<GetThePlatform xmlns=\"http://tempuri.org/\">"
            + "<factoryID>" + factoryID + "</factoryID>"
            + "<areaID>" + areaID + "</areaID>"
            + "</GetThePlatform>"
            + "</soap12:Body>"
            + "</soap12:Envelope>";

        var xhr = new XMLHttpRequest();
        xhr.withCredentials = false;
        xhr.addEventListener(
            "readystatechange",
            function () {
                if (this.readyState === 4) {
                    var parser = new DOMParser();
                    var xmlDoc = parser.parseFromString(this.responseText, "text/xml");
                    var json = JSON.parse(xmlDoc.getElementsByTagName("GetThePlatformResult")[0].innerHTML);

                    var mText = ["F", "E", "D", "C", "B", "A"];
                    var dText = ["5", "4", "3", "2", "1"];

                    var light = ["red", "green"];

                    for (i = 0; i < json.Data.length; i++) {
                        var mNum = json.Data[i].MNum;
                        var dNum = json.Data[i].DNum;

                        var nullMNum = 6 - mNum;
                        var nullDNum = 5 - dNum;

                        var dFlag = 0;

                        $("#pfs").append("<div class='col-md-6 col-sm-12 col-xs-12 station first cf'id='device" + json.Data[i].PlatformID + "' ></div>");
                        $("#device" + json.Data[i].PlatformID).append("<div class='w100 bc_white pd1 m-b2'id='state" + json.Data[i].PlatformID + "' ></div>");
                        $("#state" + json.Data[i].PlatformID).append("<div class='mat_title'><div class='mat_status light_status_" + light[json.Data[i].ConnectionStatus] + "'></div><div style='display: inline-block;'>" + unescape(json.Data[i].PlatformName) + "</div></div>");
                        $("#state" + json.Data[i].PlatformID).append("<input type='hidden' id='lastReflash" + json.Data[i].PlatformID + "' name='lastReflash" + json.Data[i].PlatformID + "' value='" + tyg.getTime() + "' />");
                        for (x = 1; x <= nullDNum; x++) {
                            var mFlag = 0;
                            $("#state" + json.Data[i].PlatformID).append("<div class='row' id='row" + json.Data[i].PlatformID + "_" + dText[dFlag] + "'></div>");
                            for (y = 1; y <= 6; y++) {
                                $("#row" + json.Data[i].PlatformID + "_" + dText[dFlag]).append("<div id='hole" + json.Data[i].PlatformID + "_" + mText[mFlag] + dText[dFlag] + "' class='col-xs-2 ta-c'><img class='hole_D5_img img-100' src='image/ball-null.png'><span class='fn_white'>0</span></div>");
                                mFlag++;
                            }
                            dFlag++;
                        }
                        for (x = 1; x <= dNum; x++) {
                            var mFlag = 0;

                            $("#state" + json.Data[i].PlatformID).append("<div class='row' id='row" + json.Data[i].PlatformID + "_" + dText[dFlag] + "'></div>");
                            for (y = 1; y <= nullMNum; y++) {
                                $("#row" + json.Data[i].PlatformID + "_" + dText[dFlag]).append("<div id='hole" + json.Data[i].PlatformID + "_" + mText[mFlag] + dText[dFlag] + "' class='col-xs-2 ta-c'><img class='hole_D5_img img-100' src='image/ball-null.png'><span class='fn_white'>0</span></div>");
                                mFlag++;
                            }
                            for (y = 1; y <= mNum; y++) {
                                $("#row" + json.Data[i].PlatformID + "_" + dText[dFlag]).append("<div id='hole" + json.Data[i].PlatformID + "_" + mText[mFlag] + dText[dFlag] + "' class='showHole" + json.Data[i].PlatformID + " col-xs-2 ta-c'><img class='hole_D5_img img-100' src='image/ball-gray.png'><span id='holeText" + json.Data[i].PlatformID + "_" + mText[mFlag] + dText[dFlag] + "' class='fn_white'>0</span></div>");
                                mFlag++;
                            }
                            dFlag++;
                        }
                        $("#state" + json.Data[i].PlatformID).append("<div class='row' id='rowHole" + json.Data[i].PlatformID + "_text'></div>");
                        $("#rowHole" + json.Data[i].PlatformID + "_text").append("<div class='col-xs-2'><p class='" + ((mNum > 5) ? "txt_center" : "fn_white") + "'>F</p></div>");
                        $("#rowHole" + json.Data[i].PlatformID + "_text").append("<div class='col-xs-2'><p class='" + ((mNum > 4) ? "txt_center" : "fn_white") + "'>E</p></div>");
                        $("#rowHole" + json.Data[i].PlatformID + "_text").append("<div class='col-xs-2'><p class='" + ((mNum > 3) ? "txt_center" : "fn_white") + "'>D</p></div>");
                        $("#rowHole" + json.Data[i].PlatformID + "_text").append("<div class='col-xs-2'><p class='" + ((mNum > 2) ? "txt_center" : "fn_white") + "'>C</p></div>");
                        $("#rowHole" + json.Data[i].PlatformID + "_text").append("<div class='col-xs-2'><p class='" + ((mNum > 1) ? "txt_center" : "fn_white") + "'>B</p></div>");
                        $("#rowHole" + json.Data[i].PlatformID + "_text").append("<div class='col-xs-2'><p class='txt_center'>A</p></div>");

                        $("#state" + json.Data[i].PlatformID).append("<div class='row rowPile' id='rowPile" + json.Data[i].PlatformID + "_text'></div>");
                        $("#rowPile" + json.Data[i].PlatformID + "_text").append("<div class='col-xs-2 pa0'><p id='pile5" + json.Data[i].PlatformID + "' class='fn_8 br1 " + ((mNum > 5) ? "txt_center" : "fn_white") + "'></p></div>");
                        $("#rowPile" + json.Data[i].PlatformID + "_text").append("<div class='col-xs-2 pa0'><p id='pile4" + json.Data[i].PlatformID + "' class='fn_8 br1 " + ((mNum > 4) ? "txt_center" : "fn_white") + "'></p></div>");
                        $("#rowPile" + json.Data[i].PlatformID + "_text").append("<div class='col-xs-2 pa0'><p id='pile3" + json.Data[i].PlatformID + "' class='fn_8 br1 " + ((mNum > 3) ? "txt_center" : "fn_white") + "'></p></div>");
                        $("#rowPile" + json.Data[i].PlatformID + "_text").append("<div class='col-xs-2 pa0'><p id='pile2" + json.Data[i].PlatformID + "' class='fn_8 br1 " + ((mNum > 2) ? "txt_center" : "fn_white") + "'></p></div>");
                        $("#rowPile" + json.Data[i].PlatformID + "_text").append("<div class='col-xs-2 pa0'><p id='pile1" + json.Data[i].PlatformID + "' class='fn_8 br1 " + ((mNum > 1) ? "txt_center" : "fn_white") + "'></p></div>");
                        $("#rowPile" + json.Data[i].PlatformID + "_text").append("<div class='col-xs-2 pa0'><p id='pile0" + json.Data[i].PlatformID + "' class='fn_8 br1 '></p></div>");

                        plc.getPlatformState(json.Data[i].FactoryID, json.Data[i].AreaID, json.Data[i].PlatformID);

                        setInterval("plc.checkPlatformReflash('" + $("#lastReflash" + json.Data[i].PlatformID).val() + "', '" + json.Data[i].FactoryID + "', '" + json.Data[i].AreaID + "', '" + json.Data[i].PlatformID + "');", 1000);
                    }

                    machine.getFactoryOpion(factoryID, areaID);
                }
            }
        );

        xhr.open("POST", IUDServiceURL, true);
        xhr.setRequestHeader("content-type", "text/xml");
        xhr.send(data);
    },
    getPlatformState_New: function (factoryID, areaID) {
        var data = "<?xml version=\"1.0\" encoding=\"utf-8\"?>"
            + "<soap12:Envelope xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\" xmlns:soap12=\"http://www.w3.org/2003/05/soap-envelope\">"
            + "<soap12:Body>"
            + "<GetThePlatform_New xmlns=\"http://tempuri.org/\">"
            + "<factoryID>" + factoryID + "</factoryID>"
            + "<areaID>" + areaID + "</areaID>"
            + "</GetThePlatform_New>"
            + "</soap12:Body>"
            + "</soap12:Envelope>";

        var xhr = new XMLHttpRequest();
        xhr.withCredentials = false;
        xhr.addEventListener(
            "readystatechange",
            function () {
                if (this.readyState === 4) {
                    var parser = new DOMParser();
                    var xmlDoc = parser.parseFromString(this.responseText, "text/xml");
                    var json = JSON.parse(xmlDoc.getElementsByTagName("GetThePlatform_NewResult")[0].innerHTML);

                    var mText = ["F", "E", "D", "C", "B", "A"];
                    var dText = ["5", "4", "3", "2", "1"];

                    var light = ["red", "green"];

                    for (i = 0; i < json.Data.length; i++) {
                        var xNum = json.Data[i].XNum;
                        var yNum = json.Data[i].YNum;

                        //var nullMNum = 6 - mNum;
                        //var nullDNum = 5 - dNum;

                        //var dFlag = 0;

                        $("#pfs").append("<div class='col-md-6 col-sm-12 col-xs-12 station first cf'id='device" + json.Data[i].PlatformID + "' ></div>");
                        $("#device" + json.Data[i].PlatformID).append("<div class='w100 bc_white pd1 m-b2'id='state" + json.Data[i].PlatformID + "' ></div>");
                        $("#state" + json.Data[i].PlatformID).append("<div class='mat_title'><div class='mat_status light_status_" + light[json.Data[i].ConnectionStatus] + "'></div><div style='display: inline-block;'>" + unescape(json.Data[i].PlatformName) + "</div></div>");
                        $("#state" + json.Data[i].PlatformID).append("<input type='hidden' id='lastReflash" + json.Data[i].PlatformID + "' name='lastReflash" + json.Data[i].PlatformID + "' value='" + tyg.getTime() + "' />");
                        //for (x = 1; x <= nullDNum; x++) {
                        //    var mFlag = 0;
                        //    $("#state" + json.Data[i].PlatformID).append("<div class='row' id='row" + json.Data[i].PlatformID + "_" + dText[dFlag] + "'></div>");
                        //    for (y = 1; y <= 6; y++) {
                        //        $("#row" + json.Data[i].PlatformID + "_" + dText[dFlag]).append("<div id='hole" + json.Data[i].PlatformID + "_" + mText[mFlag] + dText[dFlag] + "' class='col-xs-2 ta-c'><img class='hole_D5_img img-100' src='image/ball-null.png'><span class='fn_white'>0</span></div>");
                        //        mFlag++;
                        //    }
                        //    dFlag++;
                        //}
                        for (x = 1; x <= xNum; x++) {
                            //var mFlag = 0;

                            $("#state" + json.Data[i].PlatformID).append("<div class='row' id='row" + json.Data[i].PlatformID + "_" + padLeft(String(x), 2) + "'></div>");
                            //for (y = 1; y <= nullMNum; y++) {
                            //    $("#row" + json.Data[i].PlatformID + "_" + dText[dFlag]).append("<div id='hole" + json.Data[i].PlatformID + "_" + mText[mFlag] + dText[dFlag] + "' class='col-xs-2 ta-c'><img class='hole_D5_img img-100' src='image/ball-null.png'><span class='fn_white'>0</span></div>");
                            //    mFlag++;
                            //}
                            for (y = 1; y <= yNum; y++) {
                                $("#row" + json.Data[i].PlatformID + "_" + padLeft(String(x), 2)).append("<div id='hole" + json.Data[i].PlatformID + "_" + padLeft(String(x), 2) + padLeft(String(y), 2) + "' class='showHole" + json.Data[i].PlatformID + " col-xs-2 ta-c'><img class='hole_D5_img img-100' src='image/ball-gray.png'><span id='holeText" + json.Data[i].PlatformID + "_" + padLeft(String(x), 2) + padLeft(String(y), 2) + "' class='fn_white'>0</span></div>");
                                //mFlag++;
                            }
                            //dFlag++;
                        }
                        //$("#state" + json.Data[i].PlatformID).append("<div class='row' id='rowHole" + json.Data[i].PlatformID + "_text'></div>");
                        //$("#rowHole" + json.Data[i].PlatformID + "_text").append("<div class='col-xs-2'><p class='" + ((mNum > 5) ? "txt_center" : "fn_white") + "'>F</p></div>");
                        //$("#rowHole" + json.Data[i].PlatformID + "_text").append("<div class='col-xs-2'><p class='" + ((mNum > 4) ? "txt_center" : "fn_white") + "'>E</p></div>");
                        //$("#rowHole" + json.Data[i].PlatformID + "_text").append("<div class='col-xs-2'><p class='" + ((mNum > 3) ? "txt_center" : "fn_white") + "'>D</p></div>");
                        //$("#rowHole" + json.Data[i].PlatformID + "_text").append("<div class='col-xs-2'><p class='" + ((mNum > 2) ? "txt_center" : "fn_white") + "'>C</p></div>");
                        //$("#rowHole" + json.Data[i].PlatformID + "_text").append("<div class='col-xs-2'><p class='" + ((mNum > 1) ? "txt_center" : "fn_white") + "'>B</p></div>");
                        //$("#rowHole" + json.Data[i].PlatformID + "_text").append("<div class='col-xs-2'><p class='txt_center'>A</p></div>");

                        //$("#state" + json.Data[i].PlatformID).append("<div class='row rowPile' id='rowPile" + json.Data[i].PlatformID + "_text'></div>");
                        //$("#rowPile" + json.Data[i].PlatformID + "_text").append("<div class='col-xs-2 pa0'><p id='pile5" + json.Data[i].PlatformID + "' class='fn_8 br1 " + ((mNum > 5) ? "txt_center" : "fn_white") + "'></p></div>");
                        //$("#rowPile" + json.Data[i].PlatformID + "_text").append("<div class='col-xs-2 pa0'><p id='pile4" + json.Data[i].PlatformID + "' class='fn_8 br1 " + ((mNum > 4) ? "txt_center" : "fn_white") + "'></p></div>");
                        //$("#rowPile" + json.Data[i].PlatformID + "_text").append("<div class='col-xs-2 pa0'><p id='pile3" + json.Data[i].PlatformID + "' class='fn_8 br1 " + ((mNum > 3) ? "txt_center" : "fn_white") + "'></p></div>");
                        //$("#rowPile" + json.Data[i].PlatformID + "_text").append("<div class='col-xs-2 pa0'><p id='pile2" + json.Data[i].PlatformID + "' class='fn_8 br1 " + ((mNum > 2) ? "txt_center" : "fn_white") + "'></p></div>");
                        //$("#rowPile" + json.Data[i].PlatformID + "_text").append("<div class='col-xs-2 pa0'><p id='pile1" + json.Data[i].PlatformID + "' class='fn_8 br1 " + ((mNum > 1) ? "txt_center" : "fn_white") + "'></p></div>");
                        //$("#rowPile" + json.Data[i].PlatformID + "_text").append("<div class='col-xs-2 pa0'><p id='pile0" + json.Data[i].PlatformID + "' class='fn_8 br1 '></p></div>");

                        plc.getPlatformState_New(json.Data[i].FactoryID, json.Data[i].AreaID, json.Data[i].PlatformID);

                        setInterval("plc.checkPlatformReflash_New('" + $("#lastReflash" + json.Data[i].PlatformID).val() + "', '" + json.Data[i].FactoryID + "', '" + json.Data[i].AreaID + "', '" + json.Data[i].PlatformID + "');", 1000);
                    }

                    machine.getFactoryOpion(factoryID, areaID);
                }
                function padLeft(str, len) {
                    str = "" + str;
                    return str.length >= len ? str : new Array(len - str.length + 1).join("0") + str;
                }
            }


        );

        xhr.open("POST", IUDServiceURL, true);
        xhr.setRequestHeader("content-type", "text/xml");
        xhr.send(data);
    },
    getListByAreaID: function (areaID, target) {
        var data = "<?xml version=\"1.0\" encoding=\"utf-8\"?>"
            + "<soap12:Envelope xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\" xmlns:soap12=\"http://www.w3.org/2003/05/soap-envelope\">"
            + "<soap12:Body>"
            + "<GetAllPlatform_New xmlns=\"http://tempuri.org/\" />"
            + "</soap12:Body>"
            + "</soap12:Envelope>";

        var xhr = new XMLHttpRequest();
        xhr.withCredentials = false;
        xhr.addEventListener(
            "readystatechange",
            function () {
                if (this.readyState === 4) {
                    var parser = new DOMParser();
                    var xmlDoc = parser.parseFromString(this.responseText, "text/xml");
                    var json = JSON.parse(xmlDoc.getElementsByTagName("GetAllPlatform_NewResult")[0].innerHTML);

                    for (i = 0; i < json.Data.length; i++) {
                        $("#platformID" + target).append($("<option></option>").attr("value", json.Data[i].PlatformID).text(unescape(json.Data[i].PlatformName)));
                    }
                }
            }
        );

        xhr.open("POST", IUDServiceURL, false);
        xhr.setRequestHeader("content-type", "text/xml");
        xhr.send(data);
    },
    getFactoryList: function (factoryID, areaID) {
        //factoryID = "";
        //areaID = "";
        var data = "<?xml version=\"1.0\" encoding=\"utf-8\"?>"
            + "<soap12:Envelope xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\" xmlns:soap12=\"http://www.w3.org/2003/05/soap-envelope\">"
            + "<soap12:Body>"
            + "<GetAllFactory xmlns=\"http://tempuri.org/\" />"
            + "</soap12:Body>"
            + "</soap12:Envelope>";

        var xhr = new XMLHttpRequest();
        xhr.withCredentials = false;
        xhr.addEventListener(
            "readystatechange",
            function () {
                if (this.readyState === 4) {
                    var parser = new DOMParser();
                    var xmlDoc = parser.parseFromString(this.responseText, "text/xml");
                    var json = JSON.parse(xmlDoc.getElementsByTagName("GetAllFactoryResult")[0].innerHTML);

                    for (i = 0; i < json.Data.length; i++) {
                        $("#factoryID").append($("<option></option>").attr("value", json.Data[i].FactoryID).text(unescape(json.Data[i].FactoryName)));
                    }

                    if (factoryID != "") {
                        $("#factoryID").val(factoryID);
                    } else {
                        $("#factoryID").val($("#factoryID option:first").val());
                    }

                    platform.getAreaList($("#factoryID").val(), areaID);
                }
            }
        );

        xhr.open("POST", IUDServiceURL, false);
        xhr.setRequestHeader("content-type", "text/xml");
        xhr.send(data);
    },
    getAreaList: function (factoryID, areaID) {
        //areaID = "";
        var data = "<?xml version=\"1.0\" encoding=\"utf-8\"?>"
            + "<soap12:Envelope xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\" xmlns:soap12=\"http://www.w3.org/2003/05/soap-envelope\">"
            + "<soap12:Body>"
            + "<GetAreaByFactoryID xmlns=\"http://tempuri.org/\">"
            + "<factoryID>" + factoryID + "</factoryID>"
            + "</GetAreaByFactoryID>"
            + "</soap12:Body>"
            + "</soap12:Envelope>";

        var xhr = new XMLHttpRequest();
        xhr.withCredentials = false;
        xhr.addEventListener(
            "readystatechange",
            function () {
                if (this.readyState === 4) {
                    var parser = new DOMParser();
                    var xmlDoc = parser.parseFromString(this.responseText, "text/xml");
                    var json = JSON.parse(xmlDoc.getElementsByTagName("GetAreaByFactoryIDResult")[0].innerHTML);

                    $("#areaID option").remove();
                    $("#area2ID option").remove();

                    $("#areaID").append($("<option></option>").attr("value", "").text(" "));
                    $("#area2ID").append($("<option></option>").attr("value", "").text(" "));

                    for (i = 0; i < json.Data.length; i++) {
                        $("#areaID").append($("<option></option>").attr("value", json.Data[i].AreaID).text(unescape(json.Data[i].AreaName)));
                        $("#area2ID").append($("<option></option>").attr("value", json.Data[i].AreaID + "_").text(unescape(json.Data[i].AreaName)));
                    }

                    /*if (areaID != "") { $("#areaID").val(areaID); $("#area2ID").val(areaID); }*/
                }
            }
        );

        xhr.open("POST", IUDServiceURL, false);
        xhr.setRequestHeader("content-type", "text/xml");
        xhr.send(data);
    },
    gotoList: function () {
        location.href = "PlatformList_New.aspx";
    },
    gotoAdd: function () {
        location.href = "PlatformAdd_New.aspx";
    },
    gotoMod: function (platformID) {
        location.href = "PlatformMod_New.aspx?id=" + platformID;
    },
    gotoPile: function (platformID) {
        location.href = "PlatformPile_New.aspx?pid=" + platformID;
    },
    gotoSet: function (platformID, groupNo, holeID) {
        location.href = "PlatformSet_New.aspx?pid=" + platformID + "&gid=" + groupNo + "&hid=" + holeID;
    },
    getPlatform: function (platformID) {
        var data = "<?xml version=\"1.0\" encoding=\"utf-8\"?>"
            + "<soap12:Envelope xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\" xmlns:soap12=\"http://www.w3.org/2003/05/soap-envelope\">"
            + "<soap12:Body>"
            + "<GetPlatformByID_New xmlns=\"http://tempuri.org/\">"
            + "<platformID>" + platformID + "</platformID>"
            + "</GetPlatformByID_New>"
            + "</soap12:Body>"
            + "</soap12:Envelope>";

        var xhr = new XMLHttpRequest();
        xhr.withCredentials = false;
        xhr.addEventListener(
            "readystatechange",
            function () {
                if (this.readyState === 4) {
                    var parser = new DOMParser();
                    var xmlDoc = parser.parseFromString(this.responseText, "text/xml");
                    var json = JSON.parse(xmlDoc.getElementsByTagName("GetPlatformByID_NewResult")[0].innerHTML);




                    platform.getFactoryList(json.Data[0].FactoryID, json.Data[0].AreaID);
                    $("#platformID").val(json.Data[0].PlatformID);
                    $("#platformName").val(unescape(json.Data[0].PlatformName));
                    $("#platformIP").val(json.Data[0].PlatformIP);
                    $("#platformPort").val(json.Data[0].PlatformPort);
                    $("#groupNo").val(json.Data[0].GroupNo);
                    $("#xNum").val(json.Data[0].XNum);
                    $("#yNum").val(json.Data[0].YNum);
                    $("#note").val(json.Data[0].Note);
                    $("#modDate").html(json.Data[0].Updater + "\n" + json.Data[0].AlterDate);

                    
                    for (i = 0; i < json.Data.length; i++) {

                        var option = document.querySelector('option[value="' + json.Data[0].AreaID + '"]');
                        option.selected = true;

                        var optio1n = document.querySelector('option[value="' + json.Data[1].AreaID + '_"]');
                        optio1n.selected = true;
                    }

                }
            }
        );

        xhr.open("POST", IUDServiceURL, false);
        xhr.setRequestHeader("content-type", "text/xml");
        xhr.send(data);
    },
    getPlatformData: function (platformID) {
        var data = "<?xml version=\"1.0\" encoding=\"utf-8\"?>"
            + "<soap12:Envelope xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\" xmlns:soap12=\"http://www.w3.org/2003/05/soap-envelope\">"
            + "<soap12:Body>"
            + "<GetPlatformByID_New xmlns=\"http://tempuri.org/\">"
            + "<platformID>" + platformID + "</platformID>"
            + "</GetPlatformByID_New>"
            + "</soap12:Body>"
            + "</soap12:Envelope>";

        var xhr = new XMLHttpRequest();
        xhr.withCredentials = false;
        xhr.addEventListener(
            "readystatechange",
            function () {
                if (this.readyState === 4) {
                    var parser = new DOMParser();
                    var xmlDoc = parser.parseFromString(this.responseText, "text/xml");
                    var json = JSON.parse(xmlDoc.getElementsByTagName("GetPlatformByID_NewResult")[0].innerHTML);

                    $("#factoryID").val(json.Data[0].FactoryID);
                    $("#areaID").val(json.Data[0].AreaID);
                }
            }
        );

        xhr.open("POST", IUDServiceURL, false);
        xhr.setRequestHeader("content-type", "text/xml");
        xhr.send(data);
    },
    addPlatform: function (factoryID, areaID, platformID, platformName, platformIP, platformPort, groupNo, xNum, yNum, note, founder, area2ID) {
        var data = "<?xml version=\"1.0\" encoding=\"utf-8\"?>"
            + "<soap12:Envelope xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\" xmlns:soap12=\"http://www.w3.org/2003/05/soap-envelope\">"
            + "<soap12:Body>"
            + "<AddPlatform_New xmlns=\"http://tempuri.org/\">"
            + "<factoryID>" + factoryID + "</factoryID>"
            + "<areaID>" + areaID + "</areaID>"
            + "<platformID>" + platformID + "</platformID>"
            + "<platformName>" + escape(platformName) + "</platformName>"
            + "<platformIP>" + platformIP + "</platformIP>"
            + "<platformPort>" + platformPort + "</platformPort>"
            + "<groupNo>" + groupNo + "</groupNo>"
            + "<xNum>" + xNum + "</xNum>"
            + "<yNum>" + yNum + "</yNum>"
            + "<note>" + note + "</note>"
            + "<founder>" + founder + "</founder>"
            + "<area2ID>" + area2ID + "</area2ID>"
            + "</AddPlatform_New>"
            + "</soap12:Body>"
            + "</soap12:Envelope>";

        var xhr = new XMLHttpRequest();
        xhr.withCredentials = false;
        xhr.addEventListener(
            "readystatechange",
            function () {
                if (this.readyState === 4) {
                    var parser = new DOMParser();
                    var xmlDoc = parser.parseFromString(this.responseText, "text/xml");

                    var json = JSON.parse(xmlDoc.getElementsByTagName("AddPlatform_NewResult")[0].innerHTML);

                    alert(json.Data[0].Result + "!!!");
                    if (json.Data[0].Result == "新增成功") {
                        location.href = "PlatformList_New.aspx";
                    }
                }
            }
        );

        xhr.open("POST", IUDServiceURL, false);
        xhr.setRequestHeader("content-type", "text/xml");
        xhr.send(data);
    },
    modPlatform: function (factoryID, areaID, platformID, platformName, platformIP, platformPort, groupNo, xNum, yNum, note, updater, area2ID) {
        var data = "<?xml version=\"1.0\" encoding=\"utf-8\"?>"
            + "<soap12:Envelope xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\" xmlns:soap12=\"http://www.w3.org/2003/05/soap-envelope\">"
            + "<soap12:Body>"
            + "<ModPlatform_New xmlns=\"http://tempuri.org/\">"
            + "<factoryID>" + factoryID + "</factoryID>"
            + "<areaID>" + areaID + "</areaID>"
            + "<platformID>" + platformID + "</platformID>"
            + "<platformName>" + escape(platformName) + "</platformName>"
            + "<platformIP>" + platformIP + "</platformIP>"
            + "<platformPort>" + platformPort + "</platformPort>"
            + "<groupNo>" + groupNo + "</groupNo>"
            + "<xNum>" + xNum + "</xNum>"
            + "<yNum>" + yNum + "</yNum>"
            + "<note>" + note + "</note>"
            + "<updater>" + updater + "</updater>"
            + "<area2ID>" + area2ID + "</area2ID>"
            + "</ModPlatform_New>"
            + "</soap12:Body>"
            + "</soap12:Envelope>";

        var xhr = new XMLHttpRequest();
        xhr.withCredentials = false;
        xhr.addEventListener(
            "readystatechange",
            function () {
                if (this.readyState === 4) {
                    var parser = new DOMParser();
                    var xmlDoc = parser.parseFromString(this.responseText, "text/xml");
                    var json = JSON.parse(xmlDoc.getElementsByTagName("ModPlatform_NewResult")[0].innerHTML);

                    alert(json.Data[0].Result + "!!!");
                    if (json.Data[0].Result == "修改成功") {
                        location.href = "PlatformList_New.aspx";
                    }
                }
            }
        );

        xhr.open("POST", IUDServiceURL, false);
        xhr.setRequestHeader("content-type", "text/xml");
        xhr.send(data);
    },
    delPlatform: function (platformID) {
        if (confirm("確定刪除此供料台?")) {
            var data = "<?xml version=\"1.0\" encoding=\"utf-8\"?>"
                + "<soap12:Envelope xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\" xmlns:soap12=\"http://www.w3.org/2003/05/soap-envelope\">"
                + "<soap12:Body>"
                + "<DelPlatform xmlns=\"http://tempuri.org/\">"
                + "<platformID>" + platformID + "</platformID>"
                + "</DelPlatform>"
                + "</soap12:Body>"
                + "</soap12:Envelope>";

            var xhr = new XMLHttpRequest();
            xhr.withCredentials = false;

            xhr.open("POST", IUDServiceURL, false);
            xhr.setRequestHeader("content-type", "text/xml");
            xhr.send(data);

            pile.delMPileByPlatform(platformID);

            alert("刪除成功!!!");
            window.location.reload();
        }
    }
};

var rio = {
    getList: function (check) {
        var data = "<?xml version=\"1.0\" encoding=\"utf-8\"?>"
            + "<soap12:Envelope xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\" xmlns:soap12=\"http://www.w3.org/2003/05/soap-envelope\">"
            + "<soap12:Body>"
            + "<GetAllRIO xmlns=\"http://tempuri.org/\" />"
            + "</soap12:Body>"
            + "</soap12:Envelope>";

        var xhr = new XMLHttpRequest();
        xhr.withCredentials = false;
        xhr.addEventListener(
            "readystatechange",
            function () {

                if (this.readyState === 4) {
                    var parser = new DOMParser();
                    var xmlDoc = parser.parseFromString(this.responseText, "text/xml");
                    var json = JSON.parse(xmlDoc.getElementsByTagName("GetAllRIOResult")[0].innerHTML);
                    var tbody = document.getElementById("my_table").getElementsByTagName("tbody")[0];

                    for (i = 0; i < json.Data.length; i++) {
                        var tr = tbody.insertRow(i);
                        for (j = 0; j < 4; j++) {
                            tr.insertCell(j);
                        }

                        tbody.getElementsByTagName("tr")[i].getElementsByTagName("td")[0].innerHTML = json.Data[i].RIOID;
                        tbody.getElementsByTagName("tr")[i].getElementsByTagName("td")[1].innerHTML = json.Data[i].RIOIP;
                        tbody.getElementsByTagName("tr")[i].getElementsByTagName("td")[2].innerHTML = json.Data[i].RIOMachineID;
                        tbody.getElementsByTagName("tr")[i].getElementsByTagName("td")[3].innerHTML = ((check == 2) ? "<button type='button' class='btn btn-primary' onclick='rio.gotoMod(\"" + json.Data[i].RIOID + "\")'>設定</button>\n<button type='button' class='btn btn-primary' onclick='rio.delRIO(\"" + json.Data[i].RIOID + "\")'>刪除</button>" : "");
                    }
                }
            }
        );

        xhr.open("POST", IUDServiceURL, false);
        xhr.setRequestHeader("content-type", "text/xml");
        xhr.send(data);
    },
    delRIO: function (rioID) {
        if (confirm("確定刪除此供料台?")) {
            var data = "<?xml version=\"1.0\" encoding=\"utf-8\"?>"
                + "<soap12:Envelope xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\" xmlns:soap12=\"http://www.w3.org/2003/05/soap-envelope\">"
                + "<soap12:Body>"
                + "<DelRIO xmlns=\"http://tempuri.org/\">"
                + "<rioID>" + rioID + "</rioID>"
                + "</DelRIO>"
                + "</soap12:Body>"
                + "</soap12:Envelope>";

            var xhr = new XMLHttpRequest();
            xhr.withCredentials = false;

            xhr.open("POST", IUDServiceURL, false);
            xhr.setRequestHeader("content-type", "text/xml");
            xhr.send(data);

            alert("刪除成功!!!");
            window.location.reload();
           
        }
    },
    getRIO: function (rioID) {
        var data = "<?xml version=\"1.0\" encoding=\"utf-8\"?>"
            + "<soap12:Envelope xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\" xmlns:soap12=\"http://www.w3.org/2003/05/soap-envelope\">"
            + "<soap12:Body>"
            + "<GetRIOByID xmlns=\"http://tempuri.org/\">"
            + "<rioID>" + rioID + "</rioID>"
            + "</GetRIOByID>"
            + "</soap12:Body>"
            + "</soap12:Envelope>";

        var xhr = new XMLHttpRequest();
        xhr.withCredentials = false;
        xhr.addEventListener(
            "readystatechange",
            function () {
                if (this.readyState === 4) {
                    var parser = new DOMParser();
                    var xmlDoc = parser.parseFromString(this.responseText, "text/xml");
                    var json = JSON.parse(xmlDoc.getElementsByTagName("GetRIOByIDResult")[0].innerHTML);

                    $("#rioID").val(json.Data[0].RIOID);
                    $("#newrioID").val(json.Data[0].RIOID);
                    $("#rioIP").val(unescape(json.Data[0].RIOIP));
                    $("#platformID").val(unescape(json.Data[0].RIOPlatformID));
                    $("#rioMachineID").val(json.Data[0].RIOMachineID);

                }
            }
        );

        xhr.open("POST", IUDServiceURL, false);
        xhr.setRequestHeader("content-type", "text/xml");
        xhr.send(data);
    },
    modRIO: function (rioID, rioIP, machineID, platformID) {
        var data = "<?xml version=\"1.0\" encoding=\"utf-8\"?>"
            + "<soap12:Envelope xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\" xmlns:soap12=\"http://www.w3.org/2003/05/soap-envelope\">"
            + "<soap12:Body>"
            + "<ModRIO xmlns=\"http://tempuri.org/\">"
            + "<rioID>" + rioID + "</rioID>"
            + "<rioIP>" + rioIP + "</rioIP>"
            + "<machineID>" + machineID + "</machineID>"
            + "<platformID>" + platformID + "</platformID>"
            + "</ModRIO>"
            + "</soap12:Body>"
            + "</soap12:Envelope>";

        var xhr = new XMLHttpRequest();
        xhr.withCredentials = false;
        xhr.addEventListener(
            "readystatechange",
            function () {
                if (this.readyState === 4) {
                    var parser = new DOMParser();
                    var xmlDoc = parser.parseFromString(this.responseText, "text/xml");
                    var json = JSON.parse(xmlDoc.getElementsByTagName("ModRIOResult")[0].innerHTML);

                    alert(json.Data[0].Result + "!!!");
                    if (json.Data[0].Result == "修改成功") {
                        location.href = "RIOSetting.aspx";
                    }
                }
            }
        );

        xhr.open("POST", IUDServiceURL, false);
        xhr.setRequestHeader("content-type", "text/xml");
        xhr.send(data);
    },
    gotoAdd: function () {
        location.href = "RIOAdd.aspx";
    },
    closePn: function () {
        var targetRemove = document.getElementById('my_row');
        var elements = document.getElementsByName('my_row');

        if (targetRemove != null) targetRemove.parentNode.removeChild(targetRemove);
        if (elements != null) {
            for (var i = 0; i < elements.length; i++) {
 
                    elements[i].parentNode.removeChild(elements[i]);
                
            }
        };
        //if (elements != null) elements.parentNode.removeChild(elements);
    },
    gotoList: function () {
        location.href = "RIOSetting.aspx";
    },
    gotoMod: function (rioID) {
        location.href = "RIOMod.aspx?id=" + rioID;
    },
    addRIO: function (platformID, rioID, rioIP, machineID) {
        var data = "<?xml version=\"1.0\" encoding=\"utf-8\"?>"
            + "<soap12:Envelope xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\" xmlns:soap12=\"http://www.w3.org/2003/05/soap-envelope\">"
            + "<soap12:Body>"
            + "<AddRIO xmlns=\"http://tempuri.org/\">"
            + "<platformID>" + platformID + "</platformID>"
            + "<rioID>" + rioID + "</rioID>"
            + "<rioIP>" + rioIP + "</rioIP>"
            + "<machineID>" + machineID + "</machineID>"
            + "</AddRIO>"
            + "</soap12:Body>"
            + "</soap12:Envelope>";

        var xhr = new XMLHttpRequest();
        xhr.withCredentials = false;
        xhr.addEventListener(
            "readystatechange",
            function () {
                if (this.readyState === 4) {
                    var parser = new DOMParser();
                    var xmlDoc = parser.parseFromString(this.responseText, "text/xml");

                    var json = JSON.parse(xmlDoc.getElementsByTagName("AddRIOResult")[0].innerHTML);

                    alert(json.Data[0].Result + "!!!");
                    if (json.Data[0].Result == "新增成功") {
                        location.href = "RIOSetting.aspx";
                    }
                }
            }
        );

        xhr.open("POST", IUDServiceURL, false);
        xhr.setRequestHeader("content-type", "text/xml");
        xhr.send(data);
    },
    getListAllTest: function (check) {
        var data = "<?xml version=\"1.0\" encoding=\"utf-8\"?>"
            + "<soap12:Envelope xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\" xmlns:soap12=\"http://www.w3.org/2003/05/soap-envelope\">"
            + "<soap12:Body>"
            + "<GetAllList xmlns=\"http://tempuri.org/\" />"
            + "</soap12:Body>"
            + "</soap12:Envelope>";

        var xhr = new XMLHttpRequest();
        xhr.withCredentials = false;
        xhr.addEventListener(
            "readystatechange",
            function () {
                if (this.readyState === 4) {
                    var parser = new DOMParser();
                    var xmlDoc = parser.parseFromString(this.responseText, "text/xml");
                    var json = JSON.parse(xmlDoc.getElementsByTagName("GetAllListResult")[0].innerHTML);
                    var tbody = document.getElementById("my_table").getElementsByTagName("tbody")[0];

                    var temstore = "";
                    var temstorep = "";
                    var o = 0;

                    for (i = 0; i < json.Data.length; i++) {

                        if (temstore != json.Data[i].FactoryID) {

                            var fd = document.createElement("div");
                            tbody.appendChild(fd);
                            fd.innerHTML = " <button type='button' class='accordion-button collapsed' data-bs-toggle='collapse' data-bs-target='#" + json.Data[i].FactoryID + "' aria-expanded='true' aria-controls='" + json.Data[i].FactoryID + "'>" + json.Data[i].FactoryName + "</button>  <div id='" + json.Data[i].FactoryID + "' class='accordion - collapse collapse show' ></div>";
                            temstore = json.Data[i].FactoryID;

                        }

                        if (temstorep != json.Data[i].PlatformID) {
                            var pd = document.createElement("div");
                            document.getElementById(temstore).appendChild(pd);
                            pd.innerHTML = " <button type='button' class='accordion-button collapsed' data-bs-toggle='collapse' data-bs-target='#" + json.Data[i].PlatformID + "' aria-expanded='true' aria-controls='" + json.Data[i].PlatformID + "'>" + json.Data[i].PlatformName + "</button> <div id='" + json.Data[i].PlatformID + "'  class='accordion - collapse collapse show' ></div>";

                            temstorep = json.Data[i].PlatformID;

                            var platformtarget = document.getElementById(temstorep);

                            var tr_platform = document.createElement("tr");
                            tr_platform.classList.add("row");
                            tr_platform.classList.add("justify-content-md-center");
                            platformtarget.appendChild(tr_platform);

                            for (z = 0; z < 3; z++) {
                                var tp = tr_platform.insertCell(z);
                                tp.classList.add("align-middle");
                                tp.setAttribute("style", "width: 32.5999%");
                                if (z == 0) { tp.classList.add("col-lg-3"); tp.classList.add("bc_gray3"); tp.innerHTML = "IP";  }
                                if (z == 1) { tp.classList.add("col-lg-1"); tp.classList.add("bc_gray3"); tp.innerHTML = "對應成形機"; }
                                if (z == 2) { tp.classList.add("col-lg-7"); tp.classList.add("bc_gray3"); tp.innerHTML = "操作管理"; }
                            }
                            o++;
                        }
                      

                        var targetElement = document.getElementById(temstorep);

                        var tr = document.createElement("tr");
                        tr.classList.add("row");
                        tr.classList.add("justify-content-md-center");
                        targetElement.appendChild(tr);

                        for (j = 0; j < 3; j++) {
                            var trc = tr.insertCell(j);
                            trc.classList.add("align-middle");
                            trc.setAttribute("style", "width: 32.5999%");
                            if (j == 0) { trc.classList.add("col-lg-3"); }
                            if (j == 1) { trc.classList.add("col-lg-1"); }
                            if (j == 2) { trc.classList.add("col-lg-7"); }
                        }
                        tbody.getElementsByTagName("tr")[o].id = json.Data[i].RIOID;
                        tbody.getElementsByTagName("tr")[o].getElementsByTagName("td")[0].innerHTML = json.Data[i].RIOIP;
                        tbody.getElementsByTagName("tr")[o].getElementsByTagName("td")[1].innerHTML = json.Data[i].RIOMachineID;
                        tbody.getElementsByTagName("tr")[o].getElementsByTagName("td")[1].setAttribute("onclick", "machine.getByRIO(\""+ json.Data[i].RIOID +"\")");
                        tbody.getElementsByTagName("tr")[o].getElementsByTagName("td")[1].setAttribute("id", json.Data[i].RIOID+"btn");
                        tbody.getElementsByTagName("tr")[o].getElementsByTagName("td")[2].innerHTML = ((check == 2) ? "<button type='button' style='color: #fff;background-color: #337ab7;border-color: #2e6da4;' class='btn btn-sm' onclick='rio.gotoMod(\"" + json.Data[i].RIOID + "\")'>設定</button>\n<button type='button' class='btn btn-sm' style='color: #fff;background-color: #337ab7;border-color: #2e6da4;' onclick='rio.delRIO(\"" + json.Data[i].RIOID + "\")'>刪除</button>" : "");


                        o += 1;
                    }
                }
            }
        );

        xhr.open("POST", IUDServiceURL, false);
        xhr.setRequestHeader("content-type", "text/xml");
        xhr.send(data);
    },


};

var hole = {
    gotoState: function () {
        location.href = "PlatformState_New.aspx";
    },
    gotoList: function () {
        location.href = "PileList_New.aspx";
    },
    getFactoryOpion: function () {
        var data = "<?xml version=\"1.0\" encoding=\"utf-8\"?>"
            + "<soap12:Envelope xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\" xmlns:soap12=\"http://www.w3.org/2003/05/soap-envelope\">"
            + "<soap12:Body>"
            + "<GetAllFactory xmlns=\"http://tempuri.org/\" />"
            + "</soap12:Body>"
            + "</soap12:Envelope>";

        var xhr = new XMLHttpRequest();
        xhr.withCredentials = false;
        xhr.addEventListener(
            "readystatechange",
            function () {
                if (this.readyState === 4) {
                    var parser = new DOMParser();
                    var xmlDoc = parser.parseFromString(this.responseText, "text/xml");
                    var json = JSON.parse(xmlDoc.getElementsByTagName("GetAllFactoryResult")[0].innerHTML);

                    $("#factoryID").append($("<option></option>").attr("value", "").text("全部"));
                    for (i = 0; i < json.Data.length; i++) {
                        $("#factoryID").append($("<option></option>").attr("value", json.Data[i].FactoryID).text(unescape(json.Data[i].FactoryName)));
                    }

                    $("#factoryID").val($("#factoryID option:first").val());

                    hole.getAreaOption($("#factoryID").val());

                    $("#serial1").comboSelect({ comboClass: "combo-select cs1" });
                    $("#serial2").comboSelect({ comboClass: "combo-select cs2" });
                    $("#serial3").comboSelect({ comboClass: "combo-select cs3" });

                    $(".cs1 .combo-input").on("keyup", function () {
                        if (this.value.length == 5) {
                            pile.getMPileOption("serial1", "cs1", this.value, false);
                        }
                    });

                    $(".cs2 .combo-input").on("keyup", function () {
                        if (this.value.length == 5) {
                            pile.getMPileOption("serial2", "cs2", this.value, false);
                        }
                    });

                    $(".cs3 .combo-input").on("keyup", function () {
                        if (this.value.length == 5) {
                            pile.getMPileOption("serial3", "cs3", this.value, false);
                        }
                    });

                    ratio.getRatioList();
                }
            }
        );

        xhr.open("POST", IUDServiceURL, false);
        xhr.setRequestHeader("content-type", "text/xml");
        xhr.send(data);
    },
    getAreaOption: function (factoryID) {
        var data = "<?xml version=\"1.0\" encoding=\"utf-8\"?>"
            + "<soap12:Envelope xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\" xmlns:soap12=\"http://www.w3.org/2003/05/soap-envelope\">"
            + "<soap12:Body>"
            + "<GetAreaOption xmlns=\"http://tempuri.org/\">"
            + "<factoryID>" + factoryID + "</factoryID>"
            + "</GetAreaOption>"
            + "</soap12:Body>"
            + "</soap12:Envelope>";

        var xhr = new XMLHttpRequest();
        xhr.withCredentials = false;
        xhr.addEventListener(
            "readystatechange",
            function () {
                if (this.readyState === 4) {
                    var parser = new DOMParser();
                    var xmlDoc = parser.parseFromString(this.responseText, "text/xml");
                    var json = JSON.parse(xmlDoc.getElementsByTagName("GetAreaOptionResult")[0].innerHTML);

                    $("#areaID option").remove();

                    $("#areaID").append($("<option></option>").attr("value", "").text("全部"));
                    for (i = 0; i < json.Data.length; i++) {
                        $("#areaID").append($("<option></option>").attr("value", json.Data[i].AreaID).text(unescape(json.Data[i].AreaName)));
                    }

                    $("#areaID").val($("#areaID option:first").val());

                    hole.getPlatformOption(factoryID, $("#areaID").val());
                }
            }
        );

        xhr.open("POST", IUDServiceURL, false);
        xhr.setRequestHeader("content-type", "text/xml");
        xhr.send(data);
    },
    getPlatformOption: function (factoryID, areaID) {
        var data = "<?xml version=\"1.0\" encoding=\"utf-8\"?>"
            + "<soap12:Envelope xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\" xmlns:soap12=\"http://www.w3.org/2003/05/soap-envelope\">"
            + "<soap12:Body>"
            + "<GetPlatformOption_New xmlns=\"http://tempuri.org/\">"
            + "<factoryID>" + factoryID + "</factoryID>"
            + "<areaID>" + areaID + "</areaID>"
            + "</GetPlatformOption_New>"
            + "</soap12:Body>"
            + "</soap12:Envelope>";

        var xhr = new XMLHttpRequest();
        xhr.withCredentials = false;
        xhr.addEventListener(
            "readystatechange",
            function () {
                if (this.readyState === 4) {
                    var parser = new DOMParser();
                    var xmlDoc = parser.parseFromString(this.responseText, "text/xml");
                    var json = JSON.parse(xmlDoc.getElementsByTagName("GetPlatformOption_NewResult")[0].innerHTML);

                    $("#platformID option").remove();

                    $("#platformID").append($("<option></option>").attr("value", "").text("全部"));
                    for (i = 0; i < json.Data.length; i++) {
                        $("#platformID").append($("<option></option>").attr("value", json.Data[i].PlatformID).text(unescape(json.Data[i].PlatformName)));
                    }

                    $("#platformID").val($("#platformID option:first").val());

                    hole.getMHoleList($("#platformID").val());
                }
            }
        );

        xhr.open("POST", IUDServiceURL, false);
        xhr.setRequestHeader("content-type", "text/xml");
        xhr.send(data);
    },
    getList: function () {
        var data = "<?xml version=\"1.0\" encoding=\"utf-8\"?>"
            + "<soap12:Envelope xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\" xmlns:soap12=\"http://www.w3.org/2003/05/soap-envelope\">"
            + "<soap12:Body>"
            + "<GetAllMHole xmlns=\"http://tempuri.org/\" />"
            + "</soap12:Body>"
            + "</soap12:Envelope>";

        var xhr = new XMLHttpRequest();
        xhr.withCredentials = false;
        xhr.addEventListener(
            "readystatechange",
            function () {
                if (this.readyState === 4) {
                    var parser = new DOMParser();
                    var xmlDoc = parser.parseFromString(this.responseText, "text/xml");
                    var json = JSON.parse(xmlDoc.getElementsByTagName("GetAllMHoleResult")[0].innerHTML);

                    var tbody = document.getElementById("my_table").getElementsByTagName("tbody")[0];

                    for (i = 0; i < json.Data.length; i++) {
                        var tr = tbody.insertRow(i);
                        for (j = 0; j < 6; j++) {
                            tr.insertCell(j);
                        }

                        tbody.getElementsByTagName("tr")[i].getElementsByTagName("td")[0].innerHTML = json.Data[i].PlatformID;
                        tbody.getElementsByTagName("tr")[i].getElementsByTagName("td")[1].innerHTML = json.Data[i].MHoleID;
                        tbody.getElementsByTagName("tr")[i].getElementsByTagName("td")[2].innerHTML = json.Data[i].MHoleSerial1;
                        tbody.getElementsByTagName("tr")[i].getElementsByTagName("td")[3].innerHTML = ((json.Data[i].MHoleSerial2 != "") ? json.Data[i].MHoleSerial2 : "無");
                        tbody.getElementsByTagName("tr")[i].getElementsByTagName("td")[4].innerHTML = ((json.Data[i].MHoleSerial3 != "") ? json.Data[i].MHoleSerial3 : "無");
                        tbody.getElementsByTagName("tr")[i].getElementsByTagName("td")[5].innerHTML = json.Data[i].MRatio;
                    }
                }
            }
        );

        xhr.open("POST", IUDServiceURL, false);
        xhr.setRequestHeader("content-type", "text/xml");
        xhr.send(data);
    },
    getMHoleList: function (platformID) {
        var data = "<?xml version=\"1.0\" encoding=\"utf-8\"?>"
            + "<soap12:Envelope xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\" xmlns:soap12=\"http://www.w3.org/2003/05/soap-envelope\">"
            + "<soap12:Body>"
            + "<GetAllMHoleByPlatformID xmlns=\"http://tempuri.org/\">"
            + "<platformID>" + platformID + "</platformID>"
            + "</GetAllMHoleByPlatformID>"
            + "</soap12:Body>"
            + "</soap12:Envelope>";

        var xhr = new XMLHttpRequest();
        xhr.withCredentials = false;
        xhr.addEventListener(
            "readystatechange",
            function () {
                if (this.readyState === 4) {
                    var parser = new DOMParser();
                    var xmlDoc = parser.parseFromString(this.responseText, "text/xml");
                    var json = JSON.parse(xmlDoc.getElementsByTagName("GetAllMHoleByPlatformIDResult")[0].innerHTML);
                    var platformID = json.Data[0].PlatformID;
                    var groupNo = json.Data[0].GroupNo;
                    var holeID = json.Data[0].MHoleID;

                    hole.getListByGroupNo(platformID, groupNo, holeID);

                    $("#MHole option").remove();

                    for (i = 0; i < json.Data.length; i++) {
                        var isExist = false;
                        var count = $("#MHole").find("option").length;
                        var MPileStr = "";
                        var MPileVal = "";
                        console.log(json.Data[i].MHoleID);
                        MPileStr += json.Data[i].MHoleSerial1;
                        MPileStr += ((json.Data[i].MHoleSerial2 != "") ? "、" + json.Data[i].MHoleSerial2 : "");
                        MPileStr += ((json.Data[i].MHoleSerial3 != "") ? "、" + json.Data[i].MHoleSerial3 : "");
                        MPileStr += ((json.Data[i].MRatio != "") ? "  (" + json.Data[i].MRatio + ")" : "");

                        MPileVal += json.Data[i].MHoleSerial1;
                        MPileVal += ((json.Data[i].MHoleSerial2 != "") ? "," + json.Data[i].MHoleSerial2 : "");
                        MPileVal += ((json.Data[i].MHoleSerial3 != "") ? "," + json.Data[i].MHoleSerial3 : "");
                        MPileVal += ((json.Data[i].MRatio != "") ? ";" + json.Data[i].MRatio : "");

                        for (var j = 0; j < count; j++) {
                            if ($("#MHole").find("option").eq(j).val() == MPileVal) {
                                isExist = true;
                                break;
                            }
                        }

                        if (!isExist && MPileStr != "") {
                            $("#MHole").append($("<option></option>").attr("value", MPileVal).text(MPileStr));
                        }
                    }

                    $("#MHole").val($("#MHole option:first").val());
                }
            }
        );

        xhr.open("POST", IUDServiceURL, false);
        xhr.setRequestHeader("content-type", "text/xml");
        xhr.send(data);
    },
    modMHole: function (setMode, factoryID, areaID, platformID, MHoleID, MHoleSerial1, MHoleSerial2, MHoleSerial3, MRatio, updater) {
        console.log(factoryID);
        console.log(areaID);
        console.log(platformID);
        console.log(MHoleID);
        console.log(MHoleSerial1);
        console.log(MHoleSerial2);
        console.log(MHoleSerial3);
        console.log(MRatio);
        var data = "<?xml version=\"1.0\" encoding=\"utf-8\"?>"
            + "<soap12:Envelope xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\" xmlns:soap12=\"http://www.w3.org/2003/05/soap-envelope\">"
            + "<soap12:Body>"
            + "<ModMHole xmlns=\"http://tempuri.org/\">"
            + "<factoryID>" + factoryID + "</factoryID>"
            + "<areaID>" + areaID + "</areaID>"
            + "<platformID>" + platformID + "</platformID>"
            + "<MHoleID>" + MHoleID + "</MHoleID>"
            + "<MHoleSerial1>" + MHoleSerial1 + "</MHoleSerial1>"
            + "<MHoleSerial2>" + MHoleSerial2 + "</MHoleSerial2>"
            + "<MHoleSerial3>" + MHoleSerial3 + "</MHoleSerial3>"
            + "<MRatio>" + MRatio + "</MRatio>"
            + "<updater>" + updater + "</updater>"
            + "</ModMHole>"
            + "</soap12:Body>"
            + "</soap12:Envelope>";

        var xhr = new XMLHttpRequest();
        xhr.withCredentials = false;
        xhr.addEventListener(
            "readystatechange",
            function () {
                if (this.readyState === 4) {
                    var parser = new DOMParser();
                    var xmlDoc = parser.parseFromString(this.responseText, "text/xml");
                    var json = JSON.parse(xmlDoc.getElementsByTagName("ModMHoleResult")[0].innerHTML);

                    alert(json.Data[0].Result + "!!!");
                    if (json.Data[0].Result == "設定成功") {
                        if (setMode) {
                            location.href = "PlatformPile_New.aspx?pid=" + platformID;
                        } else {
                            location.href = "PileSet_New.aspx";
                        }

                    }
                }
            }
        );

        xhr.open("POST", IUDServiceURL, false);
        xhr.setRequestHeader("content-type", "text/xml");
        xhr.send(data);
    },
    modBatchMHole: function (setMode, factoryID, areaID, platformID, MHoleID, MHoleSerial1, MHoleSerial2, MHoleSerial3, MRatio, updater) {
        var data = "<?xml version=\"1.0\" encoding=\"utf-8\"?>"
            + "<soap12:Envelope xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\" xmlns:soap12=\"http://www.w3.org/2003/05/soap-envelope\">"
            + "<soap12:Body>"
            + "<ModBatchMHole xmlns=\"http://tempuri.org/\">"
            + "<factoryID>" + factoryID + "</factoryID>"
            + "<areaID>" + areaID + "</areaID>"
            + "<platformID>" + platformID + "</platformID>"
            + "<MHoleID>" + MHoleID + "</MHoleID>"
            + "<MHoleSerial1>" + MHoleSerial1 + "</MHoleSerial1>"
            + "<MHoleSerial2>" + MHoleSerial2 + "</MHoleSerial2>"
            + "<MHoleSerial3>" + MHoleSerial3 + "</MHoleSerial3>"
            + "<MRatio>" + MRatio + "</MRatio>"
            + "<updater>" + updater + "</updater>"
            + "</ModBatchMHole>"
            + "</soap12:Body>"
            + "</soap12:Envelope>";

        var xhr = new XMLHttpRequest();
        xhr.withCredentials = false;
        xhr.addEventListener(
            "readystatechange",
            function () {
                if (this.readyState === 4) {
                    var parser = new DOMParser();
                    var xmlDoc = parser.parseFromString(this.responseText, "text/xml");
                    var json = JSON.parse(xmlDoc.getElementsByTagName("ModBatchMHoleResult")[0].innerHTML);

                    alert(json.Data[0].Result + "!!!");
                    if (json.Data[0].Result == "設定成功") {
                        if (setMode) {
                            location.href = "PlatformPile_New.aspx?pid=" + platformID;
                        } else {
                            location.href = "PileSet_New.aspx";
                        }

                    }
                }
            }
        );

        xhr.open("POST", IUDServiceURL, false);
        xhr.setRequestHeader("content-type", "text/xml");
        xhr.send(data);
    },
    getListByGroupNo: function (platformID, groupNo, holeID) {
        console.log(holeID);
        let HoleID = holeID;
        var data = "<?xml version=\"1.0\" encoding=\"utf-8\"?>"
            + "<soap12:Envelope xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\" xmlns:soap12=\"http://www.w3.org/2003/05/soap-envelope\">"
            + "<soap12:Body>"
            + "<GetMHoleListByGroupNo xmlns=\"http://tempuri.org/\">"
            + "<platformID>" + platformID + "</platformID>"
            + "<groupNo>" + groupNo + "</groupNo>"
            + "</GetMHoleListByGroupNo>"
            + "</soap12:Body>"
            + "</soap12:Envelope>";
        console.log(holeID);
        var xhr = new XMLHttpRequest();
        xhr.withCredentials = false;
        xhr.addEventListener(
            "readystatechange",
            function () {
                if (this.readyState === 4) {
                    var parser = new DOMParser();
                    var xmlDoc = parser.parseFromString(this.responseText, "text/xml");
                    var json = JSON.parse(xmlDoc.getElementsByTagName("GetMHoleListByGroupNoResult")[0].innerHTML);
                    var x = json.Data[0].XNum;
                    var y = json.Data[0].YNum;
                    var groupNo = json.Data[0].GroupNo;
                    var holeID = json.Data[0].HoleID
                    myFunction(x, y, groupNo, holeID);
                    console.log(HoleID);
                }
            }

        );

        xhr.open("POST", IUDServiceURL, false);
        xhr.setRequestHeader("content-type", "text/xml");
        xhr.send(data);
        function myFunction(x, y, groupNo, holeID) {
            console.log(x);
            console.log(y);
            console.log(groupNo);
            console.log(holeID);
            var mm = document.getElementById("MHoleList");
            console.log(mm);
            for (var i = 1; i <= x; i++) {
                for (var j = 1; j <= y; j++) {
                    var label = document.createElement("label");
                    label.htmlFor = "id";
                    label.appendChild(document.createTextNode(groupNo + "-" + padLeft(String(i), 2) + "-" + padLeft(String(j), 2)));
                    var checkbox = document.createElement("input");
                    checkbox.type = "checkbox";
                    checkbox.name = "checkbox";
                    checkbox.value = groupNo + "-" + padLeft(String(i), 2) + "-" + padLeft(String(j), 2);
                    checkbox.id = groupNo + "-" + padLeft(String(i), 2) + "-" + padLeft(String(j), 2);
                    mm.appendChild(checkbox);
                    mm.appendChild(label);
                }
                var br = document.createElement("br");
                var foo = document.getElementById("MHoleList");
                foo.appendChild(br);
            }
            console.log(HoleID);
            document.getElementById(HoleID).checked = true;

        };
        function padLeft(str, len) {
            str = "" + str;
            return str.length >= len ? str : new Array(len - str.length + 1).join("0") + str;
        }
    }

};

var pile = {
    getList: function () {
        var data = "<?xml version=\"1.0\" encoding=\"utf-8\"?>"
            + "<soap12:Envelope xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\" xmlns:soap12=\"http://www.w3.org/2003/05/soap-envelope\">"
            + "<soap12:Body>"
            + "<GetAllMPile xmlns=\"http://tempuri.org/\" />"
            + "</soap12:Body>"
            + "</soap12:Envelope>";

        var xhr = new XMLHttpRequest();
        xhr.withCredentials = false;
        xhr.addEventListener(
            "readystatechange",
            function () {
                if (this.readyState === 4) {
                    var parser = new DOMParser();
                    var xmlDoc = parser.parseFromString(this.responseText, "text/xml");
                    var json = JSON.parse(xmlDoc.getElementsByTagName("GetAllMPileResult")[0].innerHTML);

                    var tbody = document.getElementById("my_table").getElementsByTagName("tbody")[0];

                    for (i = 0; i < json.Data.length; i++) {
                        var tr = tbody.insertRow(i);
                        for (j = 0; j < 6; j++) {
                            tr.insertCell(j);
                        }

                        tbody.getElementsByTagName("tr")[i].getElementsByTagName("td")[0].innerHTML = json.Data[i].PlatformID;
                        tbody.getElementsByTagName("tr")[i].getElementsByTagName("td")[1].innerHTML = "料堆" + json.Data[i].MPileSort;
                        tbody.getElementsByTagName("tr")[i].getElementsByTagName("td")[2].innerHTML = json.Data[i].MPileSerial1;
                        tbody.getElementsByTagName("tr")[i].getElementsByTagName("td")[3].innerHTML = ((json.Data[i].MPileSerial2 != "") ? json.Data[i].MPileSerial2 : "無");
                        tbody.getElementsByTagName("tr")[i].getElementsByTagName("td")[4].innerHTML = ((json.Data[i].MPileSerial3 != "") ? json.Data[i].MPileSerial3 : "無");
                        tbody.getElementsByTagName("tr")[i].getElementsByTagName("td")[5].innerHTML = json.Data[i].MRatio;
                    }
                }
            }
        );

        xhr.open("POST", IUDServiceURL, false);
        xhr.setRequestHeader("content-type", "text/xml");
        xhr.send(data);
    },
    getListByPlatformID: function (platformID) {
        var data = "<?xml version=\"1.0\" encoding=\"utf-8\"?>"
            + "<soap12:Envelope xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\" xmlns:soap12=\"http://www.w3.org/2003/05/soap-envelope\">"
            + "<soap12:Body>"
            + "<GetAllPlatformMHole xmlns=\"http://tempuri.org/\">"
            + "<platformID>" + platformID + "</platformID>"
            + "</GetAllPlatformMHole>"
            + "</soap12:Body>"
            + "</soap12:Envelope>";

        var xhr = new XMLHttpRequest();
        xhr.withCredentials = false;
        xhr.addEventListener(
            "readystatechange",
            function () {
                if (this.readyState === 4) {
                    var parser = new DOMParser();
                    var xmlDoc = parser.parseFromString(this.responseText, "text/xml");
                    var json = JSON.parse(xmlDoc.getElementsByTagName("GetAllPlatformMHoleResult")[0].innerHTML);

                    var tbody = document.getElementById("my_table").getElementsByTagName("tbody")[0];

                    for (i = 0; i < json.Data.length; i++) {
                        var tr = tbody.insertRow(i);
                        for (j = 0; j < 8; j++) {
                            tr.insertCell(j);
                        }

                        tbody.getElementsByTagName("tr")[i].getElementsByTagName("td")[0].innerHTML = json.Data[i].PlatformID;
                        tbody.getElementsByTagName("tr")[i].getElementsByTagName("td")[1].innerHTML = json.Data[i].MHoleID;
                        tbody.getElementsByTagName("tr")[i].getElementsByTagName("td")[2].innerHTML = ((json.Data[i].MHoleSerial1 != "") ? json.Data[i].MHoleSerial1 : "未設定");
                        tbody.getElementsByTagName("tr")[i].getElementsByTagName("td")[3].innerHTML = ((json.Data[i].MHoleSerial2 != "") ? json.Data[i].MHoleSerial2 : "未設定");
                        tbody.getElementsByTagName("tr")[i].getElementsByTagName("td")[4].innerHTML = ((json.Data[i].MHoleSerial3 != "") ? json.Data[i].MHoleSerial3 : "未設定");
                        tbody.getElementsByTagName("tr")[i].getElementsByTagName("td")[5].innerHTML = json.Data[i].MRatio;
                        tbody.getElementsByTagName("tr")[i].getElementsByTagName("td")[6].innerHTML = json.Data[i].Updater;
                        tbody.getElementsByTagName("tr")[i].getElementsByTagName("td")[7].innerHTML = "<button type='button' class='btn btn-primary' onclick='platform.gotoSet(\"" + json.Data[i].PlatformID + "\", \"" + json.Data[i].GroupNo + "\", \"" + json.Data[i].MHoleID + "\")'>設定</button>";
                    }
                }
            }
        );

        xhr.open("POST", IUDServiceURL, false);
        xhr.setRequestHeader("content-type", "text/xml");
        xhr.send(data);
    },
    getMPileList: function (platformID, groupNo, holeID, setMode) {
        if (setMode) {
            platform.getPlatformData(platformID);
            $("#platformID").val(platformID);
            $("#groupNo").val(groupNo);

            pile.getMPileByPlatformID(platformID, groupNo, holeID);
            hole.getListByGroupNo(platformID, groupNo, holeID);
        }

        $("#serial1").comboSelect({ comboClass: "combo-select cs1" });
        $("#serial2").comboSelect({ comboClass: "combo-select cs2" });
        $("#serial3").comboSelect({ comboClass: "combo-select cs3" });
        $("#ratio").comboSelect({ comboClass: "combo-select " });

        $(".cs1 .combo-input").on("keyup", function () {
            if (this.value.length == 5) {
                pile.getMPileOption("serial1", "cs1", this.value, false);
            } else if (this.value.length == 0) {
                pile.resetMPileOption("serial1", "cs1", "", false);
            }
        });

        $(".cs2 .combo-input").on("keyup", function () {
            if (this.value.length == 5) {
                pile.getMPileOption("serial2", "cs2", this.value, false);
            } else if (this.value.length == 0) {
                pile.resetMPileOption("serial2", "cs2", "", false);
            }
        });

        $(".cs3 .combo-input").on("keyup", function () {
            if (this.value.length == 5) {
                pile.getMPileOption("serial3", "cs3", this.value, false);
            } else if (this.value.length == 0) {
                pile.resetMPileOption("serial3", "cs3", "", false);
            }
        });
    },
    getMPileOption: function (id, className, keyword, none) {
        var data = "<?xml version=\"1.0\" encoding=\"utf-8\"?>"
            + "<soap12:Envelope xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\" xmlns:soap12=\"http://www.w3.org/2003/05/soap-envelope\">"
            + "<soap12:Body>"
            + "<GetOracleMPile xmlns=\"http://tempuri.org/\">"
            + "<keyword>" + keyword + "</keyword>"
            + "</GetOracleMPile>"
            + "</soap12:Body>"
            + "</soap12:Envelope>";

        var xhr = new XMLHttpRequest();
        xhr.withCredentials = false;
        xhr.addEventListener(
            "readystatechange",
            function () {
                if (this.readyState === 4) {
                    var parser = new DOMParser();
                    var xmlDoc = parser.parseFromString(this.responseText, "text/xml");
                    var json = JSON.parse(xmlDoc.getElementsByTagName("GetOracleMPileResult")[0].innerHTML);

                    var text = "";

                    $("#" + id + " option").remove();

                    if (none) {
                        $("#" + id).append($("<option></option>").attr("value", "").text("無"));
                    }

                    for (i = 0; i < json.Data.length; i++) {
                        if (i == 0) {
                            $("#" + id).append($("<option></option>").attr("value", keyword).text(keyword));
                        }
                        $("#" + id).append($("<option></option>").attr("value", json.Data[i].MPile).text(json.Data[i].MPile));
                    }

                    $("#" + id).comboSelect({ comboClass: "combo-select " + className });

                    if (json.Data.length == 0) {
                        //pile.resetMPileOption(id, className, ((className == "cs1") ? false : true));
                        pile.resetMPileOption(id, className, false);
                    } else {
                        $("#" + id).focus();
                        $("." + className + " .combo-input").val(keyword);
                    }

                    $("." + className + " .combo-input").on("keyup", function () {
                        text = this.value;
                        if (this.value.length == 0) {
                            //pile.resetMPileOption(id, className, ((className == "cs1") ? false : true));
                            pile.resetMPileOption(id, className, false);
                        }
                    });
                }
            }
        );

        xhr.open("POST", IUDServiceURL, true);
        xhr.setRequestHeader("content-type", "text/xml");
        xhr.send(data);
    },
    resetMPileOption: function (id, className, none) {
        $("#" + id + " option").remove();

        $("#" + id).append($("<option></option>").attr("value", "").text("輸入5碼後啟動篩選"));

        $("#" + id).comboSelect({ comboClass: "combo-select " + className });
        $("." + className + " .combo-input").on("keyup", function () {
            if (this.value.length == 5) {
                pile.getMPileOption(id, className, this.value, none);
            }
        });
    },
    getMPileByPlatformID: function (platformID, groupNo, holeID) {
        var data = "<?xml version=\"1.0\" encoding=\"utf-8\"?>"
            + "<soap12:Envelope xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\" xmlns:soap12=\"http://www.w3.org/2003/05/soap-envelope\">"
            + "<soap12:Body>"
            + "<GetMHoleByPlatformID xmlns=\"http://tempuri.org/\">"
            + "<platformID>" + platformID + "</platformID>"
            + "<groupNo>" + groupNo + "</groupNo>"
            + "<holeID>" + holeID + "</holeID>"
            + "</GetMHoleByPlatformID>"
            + "</soap12:Body>"
            + "</soap12:Envelope>";

        var xhr = new XMLHttpRequest();
        xhr.withCredentials = false;
        xhr.addEventListener(
            "readystatechange",
            function () {
                if (this.readyState === 4) {
                    var parser = new DOMParser();
                    var xmlDoc = parser.parseFromString(this.responseText, "text/xml");
                    var json = JSON.parse(xmlDoc.getElementsByTagName("GetMHoleByPlatformIDResult")[0].innerHTML);

                    if (json.Data[0].MHoleSerial1 != "") {
                        $("#serial1").append($("<option></option>").attr("value", json.Data[0].MHoleSerial1).text(json.Data[0].MHoleSerial1));
                    } else {
                        $("#serial1").append($("<option></option>").attr("value", "null").text("未設定"));
                    }

                    if (json.Data[0].MHoleSerial2 != "") {
                        $("#serial2").append($("<option></option>").attr("value", json.Data[0].MHoleSerial2).text(json.Data[0].MHoleSerial2));
                    } else {
                        $("#serial2").append($("<option></option>").attr("value", "null").text("無"));
                    }

                    if (json.Data[0].MHoleSerial3 != "") {
                        $("#serial3").append($("<option></option>").attr("value", json.Data[0].MHoleSerial3).text(json.Data[0].MHoleSerial3));
                    } else {
                        $("#serial3").append($("<option></option>").attr("value", "null").text("無"));
                    }

                    if (json.Data[0].MRatio != "") {
                        $("#ratio").append($("<option></option>").attr("value", json.Data[0].MRatio).text(json.Data[0].MRatio));
                    } else {
                        $("#ratio").append($("<option></option>").attr("value", "null").text("無混料"));
                    }

                    ratio.getRatioList(json.Data[0].MRatio);
                }
            }
        );

        xhr.open("POST", IUDServiceURL, false);
        xhr.setRequestHeader("content-type", "text/xml");
        xhr.send(data);
    },
    getFactoryOpion: function () {
        var data = "<?xml version=\"1.0\" encoding=\"utf-8\"?>"
            + "<soap12:Envelope xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\" xmlns:soap12=\"http://www.w3.org/2003/05/soap-envelope\">"
            + "<soap12:Body>"
            + "<GetAllFactory xmlns=\"http://tempuri.org/\" />"
            + "</soap12:Body>"
            + "</soap12:Envelope>";

        var xhr = new XMLHttpRequest();
        xhr.withCredentials = false;
        xhr.addEventListener(
            "readystatechange",
            function () {
                if (this.readyState === 4) {
                    var parser = new DOMParser();
                    var xmlDoc = parser.parseFromString(this.responseText, "text/xml");
                    var json = JSON.parse(xmlDoc.getElementsByTagName("GetAllFactoryResult")[0].innerHTML);

                    $("#factoryID").append($("<option></option>").attr("value", "").text("全部"));
                    for (i = 0; i < json.Data.length; i++) {
                        $("#factoryID").append($("<option></option>").attr("value", json.Data[i].FactoryID).text(unescape(json.Data[i].FactoryName)));
                    }

                    $("#factoryID").val($("#factoryID option:first").val());

                    pile.getAreaOption($("#factoryID").val());

                    $("#serial1").comboSelect({ comboClass: "combo-select cs1" });
                    $("#serial2").comboSelect({ comboClass: "combo-select cs2" });
                    $("#serial3").comboSelect({ comboClass: "combo-select cs3" });

                    $(".cs1 .combo-input").on("keyup", function () {
                        if (this.value.length == 5) {
                            pile.getMPileOption("serial1", "cs1", this.value, false);
                        }
                    });

                    $(".cs2 .combo-input").on("keyup", function () {
                        if (this.value.length == 5) {
                            pile.getMPileOption("serial2", "cs2", this.value, false);
                        }
                    });

                    $(".cs3 .combo-input").on("keyup", function () {
                        if (this.value.length == 5) {
                            pile.getMPileOption("serial3", "cs3", this.value, false);
                        }
                    });

                    ratio.getRatioList();
                }
            }
        );

        xhr.open("POST", IUDServiceURL, false);
        xhr.setRequestHeader("content-type", "text/xml");
        xhr.send(data);
    },
    getAreaOption: function (factoryID) {
        var data = "<?xml version=\"1.0\" encoding=\"utf-8\"?>"
            + "<soap12:Envelope xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\" xmlns:soap12=\"http://www.w3.org/2003/05/soap-envelope\">"
            + "<soap12:Body>"
            + "<GetAreaOption xmlns=\"http://tempuri.org/\">"
            + "<factoryID>" + factoryID + "</factoryID>"
            + "</GetAreaOption>"
            + "</soap12:Body>"
            + "</soap12:Envelope>";

        var xhr = new XMLHttpRequest();
        xhr.withCredentials = false;
        xhr.addEventListener(
            "readystatechange",
            function () {
                if (this.readyState === 4) {
                    var parser = new DOMParser();
                    var xmlDoc = parser.parseFromString(this.responseText, "text/xml");
                    var json = JSON.parse(xmlDoc.getElementsByTagName("GetAreaOptionResult")[0].innerHTML);

                    $("#areaID option").remove();

                    $("#areaID").append($("<option></option>").attr("value", "").text("全部"));
                    for (i = 0; i < json.Data.length; i++) {
                        $("#areaID").append($("<option></option>").attr("value", json.Data[i].AreaID).text(unescape(json.Data[i].AreaName)));
                    }

                    $("#areaID").val($("#areaID option:first").val());

                    pile.getPlatformOption(factoryID, $("#areaID").val());
                }
            }
        );

        xhr.open("POST", IUDServiceURL, false);
        xhr.setRequestHeader("content-type", "text/xml");
        xhr.send(data);
    },
    getPlatformOption: function (factoryID, areaID) {
        var data = "<?xml version=\"1.0\" encoding=\"utf-8\"?>"
            + "<soap12:Envelope xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\" xmlns:soap12=\"http://www.w3.org/2003/05/soap-envelope\">"
            + "<soap12:Body>"
            + "<GetPlatformOption xmlns=\"http://tempuri.org/\">"
            + "<factoryID>" + factoryID + "</factoryID>"
            + "<areaID>" + areaID + "</areaID>"
            + "</GetPlatformOption>"
            + "</soap12:Body>"
            + "</soap12:Envelope>";

        var xhr = new XMLHttpRequest();
        xhr.withCredentials = false;
        xhr.addEventListener(
            "readystatechange",
            function () {
                if (this.readyState === 4) {
                    var parser = new DOMParser();
                    var xmlDoc = parser.parseFromString(this.responseText, "text/xml");
                    var json = JSON.parse(xmlDoc.getElementsByTagName("GetPlatformOptionResult")[0].innerHTML);

                    $("#platformID option").remove();

                    $("#platformID").append($("<option></option>").attr("value", "").text("全部"));
                    for (i = 0; i < json.Data.length; i++) {
                        $("#platformID").append($("<option></option>").attr("value", json.Data[i].PlatformID).text(unescape(json.Data[i].PlatformName)));
                    }

                    $("#platformID").val($("#platformID option:first").val());

                    hole.getMHoleList($("#platformID").val());
                }
            }
        );

        xhr.open("POST", IUDServiceURL, false);
        xhr.setRequestHeader("content-type", "text/xml");
        xhr.send(data);
    },
    getMPileSortList: function (platformID) {
        var data = "<?xml version=\"1.0\" encoding=\"utf-8\"?>"
            + "<soap12:Envelope xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\" xmlns:soap12=\"http://www.w3.org/2003/05/soap-envelope\">"
            + "<soap12:Body>"
            + "<GetAllMPileByPlatformID xmlns=\"http://tempuri.org/\">"
            + "<platformID>" + platformID + "</platformID>"
            + "</GetAllMPileByPlatformID>"
            + "</soap12:Body>"
            + "</soap12:Envelope>";

        var xhr = new XMLHttpRequest();
        xhr.withCredentials = false;
        xhr.addEventListener(
            "readystatechange",
            function () {
                if (this.readyState === 4) {
                    var parser = new DOMParser();
                    var xmlDoc = parser.parseFromString(this.responseText, "text/xml");
                    var json = JSON.parse(xmlDoc.getElementsByTagName("GetAllMPileByPlatformIDResult")[0].innerHTML);

                    $("#MPileSort option").remove();

                    for (i = 0; i < json.Data.length; i++) {
                        var isExist = false;
                        var count = $("#MPileSort").find("option").length;
                        var MPileStr = "";
                        var MPileVal = "";

                        MPileStr += json.Data[i].MPileSerial1;
                        MPileStr += ((json.Data[i].MPileSerial2 != "") ? "、" + json.Data[i].MPileSerial2 : "");
                        MPileStr += ((json.Data[i].MPileSerial3 != "") ? "、" + json.Data[i].MPileSerial3 : "");
                        MPileStr += ((json.Data[i].MRatio != "") ? "  (" + json.Data[i].MRatio + ")" : "");

                        MPileVal += json.Data[i].MPileSerial1;
                        MPileVal += ((json.Data[i].MPileSerial2 != "") ? "," + json.Data[i].MPileSerial2 : "");
                        MPileVal += ((json.Data[i].MPileSerial3 != "") ? "," + json.Data[i].MPileSerial3 : "");
                        MPileVal += ((json.Data[i].MRatio != "") ? ";" + json.Data[i].MRatio : "");

                        for (var j = 0; j < count; j++) {
                            if ($("#MPileSort").find("option").eq(j).val() == MPileVal) {
                                isExist = true;
                                break;
                            }
                        }

                        if (!isExist && MPileStr != "") {
                            $("#MPileSort").append($("<option></option>").attr("value", MPileVal).text(MPileStr));
                        }
                    }

                    $("#MPileSort").val($("#MPileSort option:first").val());
                }
            }
        );

        xhr.open("POST", IUDServiceURL, false);
        xhr.setRequestHeader("content-type", "text/xml");
        xhr.send(data);
    },
    gotoList: function () {
        location.href = "PileList.aspx";
    },
    gotoState: function () {
        location.href = "PlatformState.aspx";
    },
    addMPile: function (platformID, MPileSort, MPileSerial1, MPileSerial2, MPileSerial3, MRatio, founder) {
        var data = "<?xml version=\"1.0\" encoding=\"utf-8\"?>"
            + "<soap12:Envelope xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\" xmlns:soap12=\"http://www.w3.org/2003/05/soap-envelope\">"
            + "<soap12:Body>"
            + "<AddMPile xmlns=\"http://tempuri.org/\">"
            + "<platformID>" + platformID + "</platformID>"
            + "<MPileSort>" + MPileSort + "</MPileSort>"
            + "<MPileSerial1>" + MPileSerial1 + "</MPileSerial1>"
            + "<MPileSerial2>" + MPileSerial2 + "</MPileSerial2>"
            + "<MPileSerial3>" + MPileSerial3 + "</MPileSerial3>"
            + "<MRatio>" + MRatio + "</MRatio>"
            + "<founder>" + founder + "</founder>"
            + "</AddMPile>"
            + "</soap12:Body>"
            + "</soap12:Envelope>";

        var xhr = new XMLHttpRequest();
        xhr.withCredentials = false;

        xhr.open("POST", IUDServiceURL, false);
        xhr.setRequestHeader("content-type", "text/xml");
        xhr.send(data);
    },
    modMPile: function (setMode, factoryID, areaID, platformID, MPileSort, MPileSerial1, MPileSerial2, MPileSerial3, MRatio, updater) {
        var data = "<?xml version=\"1.0\" encoding=\"utf-8\"?>"
            + "<soap12:Envelope xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\" xmlns:soap12=\"http://www.w3.org/2003/05/soap-envelope\">"
            + "<soap12:Body>"
            + "<ModMPile xmlns=\"http://tempuri.org/\">"
            + "<factoryID>" + factoryID + "</factoryID>"
            + "<areaID>" + areaID + "</areaID>"
            + "<platformID>" + platformID + "</platformID>"
            + "<MPileSort>" + MPileSort + "</MPileSort>"
            + "<MPileSerial1>" + MPileSerial1 + "</MPileSerial1>"
            + "<MPileSerial2>" + MPileSerial2 + "</MPileSerial2>"
            + "<MPileSerial3>" + MPileSerial3 + "</MPileSerial3>"
            + "<MRatio>" + MRatio + "</MRatio>"
            + "<updater>" + updater + "</updater>"
            + "</ModMPile>"
            + "</soap12:Body>"
            + "</soap12:Envelope>";

        var xhr = new XMLHttpRequest();
        xhr.withCredentials = false;
        xhr.addEventListener(
            "readystatechange",
            function () {
                if (this.readyState === 4) {
                    var parser = new DOMParser();
                    var xmlDoc = parser.parseFromString(this.responseText, "text/xml");
                    var json = JSON.parse(xmlDoc.getElementsByTagName("ModMPileResult")[0].innerHTML);

                    alert(json.Data[0].Result + "!!!");
                    if (json.Data[0].Result == "設定成功") {
                        if (setMode) {
                            location.href = "PlatformPile.aspx?pid=" + platformID;
                        } else {
                            location.href = "PileSet.aspx";
                        }

                    }
                }
            }
        );

        xhr.open("POST", IUDServiceURL, false);
        xhr.setRequestHeader("content-type", "text/xml");
        xhr.send(data);
    },
    modBatchMPile: function (setMode, factoryID, areaID, platformID, MPileSort, MPileSerial1, MPileSerial2, MPileSerial3, MRatio, updater) {
        var data = "<?xml version=\"1.0\" encoding=\"utf-8\"?>"
            + "<soap12:Envelope xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\" xmlns:soap12=\"http://www.w3.org/2003/05/soap-envelope\">"
            + "<soap12:Body>"
            + "<ModBatchMPile xmlns=\"http://tempuri.org/\">"
            + "<factoryID>" + factoryID + "</factoryID>"
            + "<areaID>" + areaID + "</areaID>"
            + "<platformID>" + platformID + "</platformID>"
            + "<MPileSort>" + MPileSort + "</MPileSort>"
            + "<MPileSerial1>" + MPileSerial1 + "</MPileSerial1>"
            + "<MPileSerial2>" + MPileSerial2 + "</MPileSerial2>"
            + "<MPileSerial3>" + MPileSerial3 + "</MPileSerial3>"
            + "<MRatio>" + MRatio + "</MRatio>"
            + "<updater>" + updater + "</updater>"
            + "</ModBatchMPile>"
            + "</soap12:Body>"
            + "</soap12:Envelope>";

        var xhr = new XMLHttpRequest();
        xhr.withCredentials = false;
        xhr.addEventListener(
            "readystatechange",
            function () {
                if (this.readyState === 4) {
                    var parser = new DOMParser();
                    var xmlDoc = parser.parseFromString(this.responseText, "text/xml");
                    var json = JSON.parse(xmlDoc.getElementsByTagName("ModBatchMPileResult")[0].innerHTML);

                    alert(json.Data[0].Result + "!!!");
                    if (json.Data[0].Result == "設定成功") {
                        if (setMode) {
                            location.href = "PlatformPile.aspx?pid=" + platformID;
                        } else {
                            location.href = "PileSet.aspx";
                        }

                    }
                }
            }
        );

        xhr.open("POST", IUDServiceURL, false);
        xhr.setRequestHeader("content-type", "text/xml");
        xhr.send(data);
    },
    delMPileByPlatform: function (platformID) {
        var data = "<?xml version=\"1.0\" encoding=\"utf-8\"?>"
            + "<soap12:Envelope xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\" xmlns:soap12=\"http://www.w3.org/2003/05/soap-envelope\">"
            + "<soap12:Body>"
            + "<DeleteMPileByPlatformID xmlns=\"http://tempuri.org/\">"
            + "<platformID>" + platformID + "</platformID>"
            + "</DeleteMPileByPlatformID>"
            + "</soap12:Body>"
            + "</soap12:Envelope>";

        var xhr = new XMLHttpRequest();
        xhr.withCredentials = false;

        xhr.open("POST", IUDServiceURL, false);
        xhr.setRequestHeader("content-type", "text/xml");
        xhr.send(data);
    },
    delMPileByPlatformSort: function (platformID, MPileSort) {
        var data = "<?xml version=\"1.0\" encoding=\"utf-8\"?>"
            + "<soap12:Envelope xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\" xmlns:soap12=\"http://www.w3.org/2003/05/soap-envelope\">"
            + "<soap12:Body>"
            + "<DeleteMPileByMPileSort xmlns=\"http://tempuri.org/\">"
            + "<platformID>" + platformID + "</platformID>"
            + "<MPileSort>" + MPileSort + "</MPileSort>"
            + "</DeleteMPileByMPileSort>"
            + "</soap12:Body>"
            + "</soap12:Envelope>";

        var xhr = new XMLHttpRequest();
        xhr.withCredentials = false;

        xhr.open("POST", IUDServiceURL, false);
        xhr.setRequestHeader("content-type", "text/xml");
        xhr.send(data);
    }
};

var machine = {
    getList: function (areaID) {
        var data = "<?xml version=\"1.0\" encoding=\"utf-8\"?>"
            + "<soap12:Envelope xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\" xmlns:soap12=\"http://www.w3.org/2003/05/soap-envelope\">"
            + "<soap12:Body>"
            + "<GetMachineByAreaID xmlns=\"http://tempuri.org/\">"
            + "<areaID>" + areaID + "</areaID>"
            + "</GetMachineByAreaID>"
            + "</soap12:Body>"
            + "</soap12:Envelope>";

        var xhr = new XMLHttpRequest();
        xhr.withCredentials = false;
        xhr.addEventListener(
            "readystatechange",
            function () {
                if (this.readyState === 4) {
                    var parser = new DOMParser();
                    var xmlDoc = parser.parseFromString(this.responseText, "text/xml");
                    var json = JSON.parse(xmlDoc.getElementsByTagName("GetMachineByAreaIDResult")[0].innerHTML);

                    var tbody = document.getElementById("my_table").getElementsByTagName("tbody")[0];

                    for (i = 0; i < json.Data.length; i++) {
                        var tr = tbody.insertRow(i);
                        for (j = 0; j < 7; j++) {
                            tr.insertCell(j);
                        }

                        tbody.getElementsByTagName("tr")[i].getElementsByTagName("td")[0].innerHTML = json.Data[i].CreateDate;
                        tbody.getElementsByTagName("tr")[i].getElementsByTagName("td")[1].innerHTML = json.Data[i].PlatformID;
                        tbody.getElementsByTagName("tr")[i].getElementsByTagName("td")[2].innerHTML = json.Data[i].MachineID;
                        tbody.getElementsByTagName("tr")[i].getElementsByTagName("td")[3].innerHTML = json.Data[i].SlaveNo;
                        tbody.getElementsByTagName("tr")[i].getElementsByTagName("td")[4].innerHTML = json.Data[i].Channel;
                        tbody.getElementsByTagName("tr")[i].getElementsByTagName("td")[5].innerHTML = json.Data[i].Updater;
                        tbody.getElementsByTagName("tr")[i].getElementsByTagName("td")[6].innerHTML = "<button type='button' class='btn btn-primary' onclick='machine.gotoMod(\"" + json.Data[i].MachineID + "\")'>設定</button>\n<button type='button' class='btn btn-primary' onclick='machine.delMachine(\"" + json.Data[i].MachineID + "\")'>刪除</button>";
                    }
                }
            }
        );

        xhr.open("POST", IUDServiceURL, false);
        xhr.setRequestHeader("content-type", "text/xml");
        xhr.send(data);
    },
    getDetail: function (factoryID, areaID) {
        var data = "<?xml version=\"1.0\" encoding=\"utf-8\"?>"
            + "<soap12:Envelope xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\" xmlns:soap12=\"http://www.w3.org/2003/05/soap-envelope\">"
            + "<soap12:Body>"
            + "<GetTheMachine_new xmlns=\"http://tempuri.org/\">"
            + "<factoryID>" + factoryID + "</factoryID>"
            + "<areaID>" + areaID + "</areaID>"
            + "</GetTheMachine_new>"
            + "</soap12:Body>"
            + "</soap12:Envelope>";

        var xhr = new XMLHttpRequest();
        xhr.withCredentials = false;
        xhr.addEventListener(
            "readystatechange",
            function () {
                if (this.readyState === 4) {
                    var parser = new DOMParser();
                    var xmlDoc = parser.parseFromString(this.responseText, "text/xml");
                    var json = JSON.parse(xmlDoc.getElementsByTagName("GetTheMachine_neweResult")[0].innerHTML);

                    for (i = 0; i < json.Data.length; i++) {
                        var row = $("#my_row").html();

                        var state = ["red", "green", "blue", "tan", "white", "gray"];
                        var light = ["null", "red", "green", "yellow", "orange"];

                        row += "<div id='machine" + json.Data[i].MachineID + "' class='col-md-4 col-sm-6 col-xs-12'>";
                        row += "<div id='state" + json.Data[i].MachineID + "' class='area device_" + state[json.Data[i].MachineState] + "'>";
                        row += "<div class='ma_btm_10'>";

                        row += "<div class='row fn_8'>";
                        row += "<div class='col-xs-5' style='padding-top: 12px;'>";
                        row += "<span id='lamp" + json.Data[i].MachineID + "' style='margin-right:5px;' class='device_status light_status_" + light[((json.Data[i].MachineState == 0) ? 0 : json.Data[i].LampState)] + "'></span>";
                        //row += "<span class='fn_18'>" + json.Data[i].MachineID + "</span>";
                        row += "<a class='fn_18' style='color:black;' href='http://webapp.tyg.com.tw/machine/machine.aspx?N1=" + json.Data[i].MachineID + "' target=_blank>" + json.Data[i].MachineID + "</a>";
                        row += "</div>";
                        //row += "<div class='col-xs-1' style='height: 60px; line-height: 27px; padding-left: 26px; font-weight:bold;'></div>";
                        row += "<div id='pileTable" + json.Data[i].MachineID + "' class='col-xs-4' style='height: 60px; background-color: rgba(255, 255, 255, 0.5); font-weight:bold; font-size:15px; padding-right:5px;padding-left:5px;'></div>";
                        row += "<div id='holeRatio" + json.Data[i].MachineID + "' class='col-xs-2 fn_bold txt_center fn-16' title='XX：供料設備異常\nX：該成型機無監控供料\n**：使用Bypass\n無：無插供料插銷\n英數：供料孔位置' style='height: 60px; line-height: 27px; border-left: 1px solid #000; background-color: rgba(255, 255, 255, 0.5); font-weight:bold; font-size:15px;'></div>";
                        row += "</div>";

                        row += "<input type='hidden' id='lastReflash" + json.Data[i].MachineID + "' name='lastReflash" + json.Data[i].MachineID + "' value='" + tyg.getTime() + "' />";
                        row += "<button id='hole" + json.Data[i].MachineID + "' class='hole" + ((json.Data[i].HoleID != "00") ? "" : " display_n") + "'>" + ((json.Data[i].HoleID != "00") ? json.Data[i].HoleID : "") + "</button>";
                        row += "</div>";
                        row += "<div class='device_content device_white' style='font-size: 14pt;'>";
                        row += "<p id='productID" + json.Data[i].MachineID + "' style='margin-bottom: 0px;display: inline-block;width: 50%;'></p>";
                        row += "<p id='weight" + json.Data[i].MachineID + "' style='margin-bottom: 0px; display: inline-block;text-align: right;width: 50%;'></p>";
                        row += "<p id='orderID" + json.Data[i].MachineID + "' style='margin-bottom: 0px;'>工&emsp;&emsp;單：" + json.Data[i].OrderID + "</p>";
                        row += "<p id='quantity" + json.Data[i].MachineID + "' style='margin-bottom: 0px;'></p>";
                        row += "</div>";
                        row += "</div>";
                        row += "</div>";

                        $("#my_row").html(row);

                        plc.getMachineData(json.Data[i].FactoryID, json.Data[i].AreaID, json.Data[i].MachineID);

                        setInterval("plc.checkMachineReflash('detail', '" + $("#lastReflash" + json.Data[i].MachineID).val() + "', '" + json.Data[i].FactoryID + "', '" + json.Data[i].AreaID + "', '" + json.Data[i].MachineID + "');", 2000);
                    }

                    machine.getFactoryOpion(factoryID, areaID);
                }
            }
        );

        xhr.open("POST", IUDServiceURL, false);
        xhr.setRequestHeader("content-type", "text/xml");
        xhr.send(data);
    },
    getByRIO: function (rioID) {
        var data = "<?xml version=\"1.0\" encoding=\"utf-8\"?>"
            + "<soap12:Envelope xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\" xmlns:soap12=\"http://www.w3.org/2003/05/soap-envelope\">"
            + "<soap12:Body>"
            + "<GetMachineByRioID xmlns=\"http://tempuri.org/\">"
            + "<rioID>" + rioID + "</rioID>"
            + "</GetMachineByRioID>"
            + "</soap12:Body>"
            + "</soap12:Envelope>";

        var xhr = new XMLHttpRequest();
        xhr.withCredentials = false;
        xhr.addEventListener(
            "readystatechange",
            function () {
                if (this.readyState === 4) {
                    var parser = new DOMParser();
                    var xmlDoc = parser.parseFromString(this.responseText, "text/xml");
                    var json = JSON.parse(xmlDoc.getElementsByTagName("GetMachineByRioIDResult")[0].innerHTML);

                    

                    rio.closePn();

                    //--------------------------
                    var targetElement = document.getElementById(rioID);
                    
                    //targetElement.innerHTML += "<div class='row' id='my_row'></div>";


                    //--------------------------

                    var tr = document.createElement("tr");
                    tr.classList.add("row");
                    tr.classList.add("justify-content-md-center");
                    tr.setAttribute("id","my_row")
                    targetElement.appendChild(tr);

                    for (z = 0; z < 13; z++) {
                        var tp = tr.insertCell(z);
                        tp.classList.add("align-middle");
                        tp.setAttribute("style", "col");
                        if (z == 0) { tp.classList.add("col"); tp.classList.add("bc_gray3"); tp.innerHTML = "成型機"; }
                        if (z == 1) { tp.classList.add("col"); tp.classList.add("bc_gray3"); tp.innerHTML = "原料<br>孔位"; }
                        if (z == 2) { tp.classList.add("col"); tp.classList.add("bc_gray3"); tp.innerHTML = "狀態"; }
                        if (z == 3) { tp.classList.add("col"); tp.classList.add("bc_gray3"); tp.innerHTML = "工單號碼"; }
                        if (z == 4) { tp.classList.add("col"); tp.classList.add("bc_gray3"); tp.innerHTML = "工單<br>類型"; }
                        if (z == 5) { tp.classList.add("col"); tp.classList.add("bc_gray3"); tp.innerHTML = "工單<br>狀態"; }
                        if (z == 6) { tp.classList.add("col"); tp.classList.add("bc_gray3"); tp.innerHTML = "成型料號"; }
                        if (z == 7) { tp.classList.add("col"); tp.classList.add("bc_gray3"); tp.innerHTML = "使用原料"; }
                        if (z == 8) { tp.classList.add("col"); tp.classList.add("bc_gray3"); tp.innerHTML = "重量"; }
                        if (z == 9) { tp.classList.add("col"); tp.classList.add("bc_gray3"); tp.innerHTML = "工單量"; }
                        if (z == 10) { tp.classList.add("col"); tp.classList.add("bc_gray3"); tp.innerHTML = "PLC<br>成型量"; }
                        if (z == 11) { tp.classList.add("col"); tp.classList.add("bc_gray3"); tp.innerHTML = "剩餘量"; }
                        if (z == 12) { tp.classList.add("col"); tp.classList.add("bc_gray3"); tp.innerHTML = "燈號"; }
                    }

                    //=============================
                    var statea = ["停機", "全自動", "半自動", "手動", "換模中", "未連線"];
                    var stateColor = ["bc_red", "bc_green", "bc_blue", "bc_tan", "bc_white", "bc_gray"];
                    var state = ["red", "green", "blue", "tan", "white", "gray"];
                    var light = ["null", "red", "green", "yellow", "orange"];
                    //=============================
                    var tra = document.createElement("tr");
                    tra.classList.add("row");
                    tra.classList.add("justify-content-md-center");
                    tra.setAttribute("name","my_row")

                    targetElement.appendChild(tra);

                    for (i = 0; i < json.Data.length; i++) {
                        for (j = 0; j < 13; j++) {
                            var trc = tra.insertCell(j);
                            trc.classList.add("align-middle");
                            trc.setAttribute("style", "col");
                            if (j == 0) { trc.classList.add("col"); trc.innerHTML = json.Data[i].MachineID; }
                            if (j == 1) { trc.classList.add("col"); trc.innerHTML = json.Data[i].HoleID; }
                            if (j == 2) { trc.classList.add("col"); trc.innerHTML = statea[json.Data[i].MachineState]; }
                            if (j == 2) { trc.classList.add("col"); trc.classList.add("device_" + state[json.Data[i].MachineState]) }
                            if (j == 3) { trc.classList.add("col"); trc.innerHTML = json.Data[i].OrderID; }
                            if (j == 4) { trc.classList.add("col"); trc.innerHTML = "- -"; }//工單<br>類型
                            if (j == 5) { trc.classList.add("col"); trc.innerHTML = "- -"; }//工單<br>狀態
                            if (j == 6) { trc.classList.add("col"); trc.innerHTML = "- -"; }//成型料號
                            if (j == 7) { trc.classList.add("col"); trc.innerHTML = "- -"; }//使用原料
                            if (j == 8) { trc.classList.add("col"); trc.innerHTML = "- -"; }//重量
                            if (j == 9) { trc.classList.add("col"); trc.innerHTML = "- -"; }//工單量
                            if (j == 10) { trc.classList.add("col"); trc.innerHTML = "- -"; }//PLC<br>成型量
                            if (j == 11) { trc.classList.add("col"); trc.innerHTML = "- -"; }//剩餘量
                            if (j == 12) { trc.classList.add("col"); trc.innerHTML = "- -"; }//燈號
                            //if (j == 12) { trc.classList.add("col"); trc.classList.add('device_status light_status_" + light[((json.Data[i].MachineState == 0) ? 0 : json.Data[i].LampState)] + "'); }
                            //if (j == 12) { trc.classList.add("col"); trc.setAttribute("class", "device_status light_status_" + light[((json.Data[i].MachineState == 0) ? 0 : json.Data[i].LampState)]); }

                            plc.getMachineData(json.Data[i].FactoryID, json.Data[i].AreaID, json.Data[i].MachineID);

                            setInterval("plc.checkMachineReflash('detail', '" + $("#lastReflash" + json.Data[i].MachineID).val() + "', '" + json.Data[i].FactoryID + "', '" + json.Data[i].AreaID + "', '" + json.Data[i].MachineID + "');", 2000);

                        }
                        machine.getFactoryOpion(json.Data[i].FactoryID, json.Data[i].AreaID);
                    }

                    //=============================
                }
            }
        );

        xhr.open("POST", IUDServiceURL, false);
        xhr.setRequestHeader("content-type", "text/xml");
        xhr.send(data);
    },
    getByPass: function (factoryID, areaID, userID) {
        var data = "<?xml version=\"1.0\" encoding=\"utf-8\"?>"
            + "<soap12:Envelope xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\" xmlns:soap12=\"http://www.w3.org/2003/05/soap-envelope\">"
            + "<soap12:Body>"
            + "<GetTheMachine xmlns=\"http://tempuri.org/\">"
            + "<factoryID>" + factoryID + "</factoryID>"
            + "<areaID>" + areaID + "</areaID>"
            + "</GetTheMachine>"
            + "</soap12:Body>"
            + "</soap12:Envelope>";

        var xhr = new XMLHttpRequest();
        xhr.withCredentials = false;
        xhr.addEventListener(
            "readystatechange",
            function () {
                if (this.readyState === 4) {
                    var parser = new DOMParser();
                    var xmlDoc = parser.parseFromString(this.responseText, "text/xml");
                    var json = JSON.parse(xmlDoc.getElementsByTagName("GetTheMachineResult")[0].innerHTML);

                    for (i = 0; i < json.Data.length; i++) {
                        var row = $("#my_row").html();

                        var state = ["red", "green", "blue", "tan", "white", "gray"];
                        var light = ["null", "red", "green", "yellow", "orange"];
                        row += "<div id='machine" + json.Data[i].MachineID + "' class='col-md-3 col-sm-6 col-xs-12'>";
                        row += "<div id='state" + json.Data[i].MachineID + "' class='area device_" + light[((json.Data[i].MachineState == 0) ? 0 : json.Data[i].LampState)] + "'>";
                        row += "<div class='ma_btm_6'>";
                        row += "<div class='row fn_16'>";
                        row += "<div class='col-xs-4' style='margin-top: 12px;'>";
                        row += "<span id='lamp" + json.Data[i].MachineID + "' class='device_status light_status_" + light[((json.Data[i].MachineState == 0) ? 0 : json.Data[i].LampState)] + "'></span>";
                        row += "</div>";
                        row += "<div class='col-xs-4' style='margin-top: 12px;'>";
                        row += "<span class='fn_16 text-center' style='font-weight: bold;'>" + json.Data[i].MachineID + "</span>";
                        row += "</div>";
                        row += "<div class='col-xs-4' style='margin-top: 3px;'>";
                        row += "<input type='checkbox' style='zoom: 2' class='form-check-input justify-content-center' id='passcheck" + json.Data[i].MachineID + "' onclick='machine.updateByPass(" + json.Data[i].MachineID + "," + userID + ")'>";
                        //row += "<div class='ui toggle checkbox'><input name='public' type='checkbox'></div>";  
                        row += "</div>";
                        row += "</div>";
                        row += "</div>";
                        row += "</div>";
                        row += "</div>";

                        $("#my_row").html(row);

                        plc.getByPassMachineData(json.Data[i].FactoryID, json.Data[i].AreaID, json.Data[i].MachineID);

                        setInterval("plc.checkMachineReflash('bypass', '" + $("#lastReflash" + json.Data[i].MachineID).val() + "', '" + json.Data[i].FactoryID + "', '" + json.Data[i].AreaID + "', '" + json.Data[i].MachineID + "');", 2000);
                    }
                    $('#btnRefresh').click();
                    setInterval("machine.clickrefresh();", 15000);
                    machine.getFactoryOpion(factoryID, areaID);
                }
            }
        );

        xhr.open("POST", IUDServiceURL, false);
        xhr.setRequestHeader("content-type", "text/xml");
        xhr.send(data);
    },
    getPlan: function (factoryID) {
        var data = "<?xml version=\"1.0\" encoding=\"utf-8\"?>"
            + "<soap12:Envelope xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\" xmlns:soap12=\"http://www.w3.org/2003/05/soap-envelope\">"
            + "<soap12:Body>"
            + "<GetMachineByFactoryID xmlns=\"http://tempuri.org/\">"
            + "<factoryID>" + factoryID + "</factoryID>"
            + "</GetMachineByFactoryID>"
            + "</soap12:Body>"
            + "</soap12:Envelope>";

        var xhr = new XMLHttpRequest();
        xhr.withCredentials = false;
        xhr.addEventListener(
            "readystatechange",
            function () {
                if (this.readyState === 4) {
                    var parser = new DOMParser();
                    var xmlDoc = parser.parseFromString(this.responseText, "text/xml");
                    var json = JSON.parse(xmlDoc.getElementsByTagName("GetMachineByFactoryIDResult")[0].innerHTML);

                    for (i = 0; i < json.Data.length; i++) {
                        var machineArea = $("#machineArea").html();

                        machineArea += "<div id='machine" + json.Data[i].MachineID + "' class='the_device'>";
                        machineArea += "<input type='hidden' id='lastReflash" + json.Data[i].MachineID + "' name='lastReflash" + json.Data[i].MachineID + "' value='" + tyg.getTime() + "' />";
                        machineArea += "<div id='num" + json.Data[i].MachineID + "' class='the_device_num'></div>";
                        machineArea += "<div class='the_device_content'>";
                        machineArea += "<img src='image/fa_device1.png' alt='' />";
                        machineArea += "<div id='msc" + json.Data[i].MachineID + "' class='device-num'>" + json.Data[i].MachineID.substr(0, 1) + "<br>" + json.Data[i].MachineID.substr(1, 1) + "<br>" + json.Data[i].MachineID.substr(2, 1) + "<br>" + json.Data[i].MachineID.substr(3, 1) + "</div>";
                        machineArea += "</div>";
                        machineArea += "</div>";

                        $("#machineArea").html(machineArea);

                        if (json.Data[i].MachineState == "0") {
                            $("#msc" + json.Data[i].MachineID).attr("class", "device-num device_red");
                        } else if (json.Data[i].MachineState == "1") {
                            $("#msc" + json.Data[i].MachineID).attr("class", "device-num device_green");
                        } else if (json.Data[i].MachineState == "2") {
                            $("#msc" + json.Data[i].MachineID).attr("class", "device-num device_blue");
                        } else if (json.Data[i].MachineState == "3") {
                            $("#msc" + json.Data[i].MachineID).attr("class", "device-num device_tan");
                        } else {
                            $("#msc" + json.Data[i].MachineID).attr("class", "device-num device_white");
                        }

                        setPosition("#machine" + json.Data[i].MachineID, json.Data[i].CoordinateX, json.Data[i].CoordinateY);
                        if (json.Data[i].LampState == "1" && json.Data[i].MachineState != "0") {
                            $("#num" + json.Data[i].MachineID).attr("class", "the_device_num border_red");
                        } else if (json.Data[i].LampState == "2" && json.Data[i].MachineState != "0") {
                            $("#num" + json.Data[i].MachineID).attr("class", "the_device_num border_green");
                        } else if (json.Data[i].LampState == "3" && json.Data[i].MachineState != "0") {
                            $("#num" + json.Data[i].MachineID).attr("class", "the_device_num border_yellow");
                        } else if (json.Data[i].LampState == "4" && json.Data[i].MachineState != "0") {
                            $("#num" + json.Data[i].MachineID).attr("class", "the_device_num border_orange");
                        } else {
                            $("#num" + json.Data[i].MachineID).attr("class", "the_device_num border_abnormal");
                        }

                        plc.getMachinePlan(json.Data[i].FactoryID, json.Data[i].AreaID, json.Data[i].MachineID);

                        setInterval("plc.checkMachineReflash('plan', '" + $("#lastReflash" + json.Data[i].MachineID).val() + "', '" + json.Data[i].FactoryID + "', '" + json.Data[i].AreaID + "', '" + json.Data[i].MachineID + "');", 1000);
                    }
                }
            }
        );

        xhr.open("POST", IUDServiceURL, false);
        xhr.setRequestHeader("content-type", "text/xml");
        xhr.send(data);
    },
    getNews: function (factoryID, areaID) {
        var data = "<?xml version=\"1.0\" encoding=\"utf-8\"?>"
            + "<soap12:Envelope xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\" xmlns:soap12=\"http://www.w3.org/2003/05/soap-envelope\">"
            + "<soap12:Body>"
            + "<GetTheMachine xmlns=\"http://tempuri.org/\">"
            + "<factoryID>" + factoryID + "</factoryID>"
            + "<areaID>" + areaID + "</areaID>"
            + "</GetTheMachine>"
            + "</soap12:Body>"
            + "</soap12:Envelope>";

        var xhr = new XMLHttpRequest();
        xhr.withCredentials = false;
        xhr.addEventListener(
            "readystatechange",
            function () {
                if (this.readyState === 4) {
                    var parser = new DOMParser();
                    var xmlDoc = parser.parseFromString(this.responseText, "text/xml");
                    var json = JSON.parse(xmlDoc.getElementsByTagName("GetTheMachineResult")[0].innerHTML);

                    var state = ["停機", "全自動", "半自動", "手動", "換模中", "未連線"];
                    var stateColor = ["bc_red", "bc_green", "bc_blue", "bc_tan", "bc_white", "bc_gray"];

                    var tbody = document.getElementById("my_table").getElementsByTagName("tbody")[0];

                    for (i = 0; i < json.Data.length; i++) {
                        var tr = tbody.insertRow(i);
                        for (j = 0; j < 14; j++) {
                            tr.insertCell(j);
                        }

                        tbody.getElementsByTagName("tr")[i].id = "tr" + json.Data[i].MachineID;
                        //$("#tr" + json.Data[i].MachineID).attr("class", stateColor[json.Data[i].MachineState]);

                        $("#tr" + json.Data[i].MachineID).find("td").eq(0).html(unescape(json.Data[i].FactoryName) + "<br>" + unescape(json.Data[i].AreaName));
                        $("#tr" + json.Data[i].MachineID).find("td").eq(1).html(json.Data[i].MachineID + "<input type='hidden' id='lastReflash" + json.Data[i].MachineID + "' value='" + tyg.getTime() + "' />");
                        $("#tr" + json.Data[i].MachineID).find("td").eq(2).text(json.Data[i].HoleID);
                        $("#tr" + json.Data[i].MachineID).find("td").eq(3).text(state[json.Data[i].MachineState]);
                        $("#tr" + json.Data[i].MachineID).find("td").eq(3).attr("class", stateColor[json.Data[i].MachineState]);
                        $("#tr" + json.Data[i].MachineID).find("td").eq(4).text("");
                        $("#tr" + json.Data[i].MachineID).find("td").eq(5).text("");
                        $("#tr" + json.Data[i].MachineID).find("td").eq(6).text("");
                        $("#tr" + json.Data[i].MachineID).find("td").eq(7).text("");
                        $("#tr" + json.Data[i].MachineID).find("td").eq(8).text("");
                        $("#tr" + json.Data[i].MachineID).find("td").eq(9).text("");
                        $("#tr" + json.Data[i].MachineID).find("td").eq(10).text("");
                        $("#tr" + json.Data[i].MachineID).find("td").eq(11).text("");
                        $("#tr" + json.Data[i].MachineID).find("td").eq(12).text("");
                        $("#tr" + json.Data[i].MachineID).find("td").eq(13).text("");


                        plc.getMachineNews(json.Data[i].FactoryID, json.Data[i].AreaID, json.Data[i].MachineID);

                        setInterval("plc.checkMachineReflash('news', '" + $("#lastReflash" + json.Data[i].MachineID).val() + "', '" + json.Data[i].FactoryID + "', '" + json.Data[i].AreaID + "', '" + json.Data[i].MachineID + "');", 1000);
                    }

                    machine.getFactoryOpion(factoryID, areaID);
                }
            }
        );

        xhr.open("POST", IUDServiceURL, false);
        xhr.setRequestHeader("content-type", "text/xml");
        xhr.send(data);
    },
    getFactoryList: function (factoryID) {
        //factoryID = "";
        var data = "<?xml version=\"1.0\" encoding=\"utf-8\"?>"
            + "<soap12:Envelope xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\" xmlns:soap12=\"http://www.w3.org/2003/05/soap-envelope\">"
            + "<soap12:Body>"
            + "<GetAllFactory xmlns=\"http://tempuri.org/\" />"
            + "</soap12:Body>"
            + "</soap12:Envelope>";

        var xhr = new XMLHttpRequest();
        xhr.withCredentials = false;
        xhr.addEventListener(
            "readystatechange",
            function () {
                if (this.readyState === 4) {
                    var parser = new DOMParser();
                    var xmlDoc = parser.parseFromString(this.responseText, "text/xml");
                    var json = JSON.parse(xmlDoc.getElementsByTagName("GetAllFactoryResult")[0].innerHTML);
                    var imgflag = false;
                    for (i = 0; i < json.Data.length; i++) {
                        $("#factoryID").append($("<option></option>").attr("value", json.Data[i].FactoryID).text((unescape(json.Data[i].FactoryName))));

                        if (imgflag == false) {
                            if (factoryID == json.Data[i].FactoryID) {
                                $("#device_bg").attr("src", json.Data[i].PictureFileName);
                                imgflag = true;
                            } else {
                                $("#device_bg").attr("src", json.Data[0].PictureFileName);
                            }
                        }
                    }

                    if (factoryID != "") {
                        $("#factoryID").val(factoryID);
                    } else {
                        $("#factoryID").val($("#factoryID option:first").val());
                    }

                    machine.getPlan($("#factoryID").val());
                }
            }
        );

        xhr.open("POST", IUDServiceURL, false);
        xhr.setRequestHeader("content-type", "text/xml");
        xhr.send(data);
    },
    getPlatformList: function (areaID, platformID) {
        //platformID = "";
        var data = "<?xml version=\"1.0\" encoding=\"utf-8\"?>"
            + "<soap12:Envelope xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\" xmlns:soap12=\"http://www.w3.org/2003/05/soap-envelope\">"
            + "<soap12:Body>"
            + "<GetPlatformByAreaID xmlns=\"http://tempuri.org/\">"
            + "<areaID>" + areaID + "</areaID>"
            + "</GetPlatformByAreaID>"
            + "</soap12:Body>"
            + "</soap12:Envelope>";

        var xhr = new XMLHttpRequest();
        xhr.withCredentials = false;
        xhr.addEventListener(
            "readystatechange",
            function () {
                if (this.readyState === 4) {
                    var parser = new DOMParser();
                    var xmlDoc = parser.parseFromString(this.responseText, "text/xml");
                    var json = JSON.parse(xmlDoc.getElementsByTagName("GetPlatformByAreaIDResult")[0].innerHTML);

                    for (i = 0; i < json.Data.length; i++) {
                        $("#platformID").append($("<option></option>").attr("value", json.Data[i].PlatformID).text(unescape(json.Data[i].PlatformName)));
                    }

                    machine.getAreaData(areaID);
                    if (platformID != "") {
                        $("#platformID").val(platformID);
                    } else {
                        $("#platformID").val($("#platformID option:first").val());
                    }
                }
            }
        );

        xhr.open("POST", IUDServiceURL, false);
        xhr.setRequestHeader("content-type", "text/xml");
        xhr.send(data);
    },
    getAreaData: function (areaID) {
        var data = "<?xml version=\"1.0\" encoding=\"utf-8\"?>"
            + "<soap12:Envelope xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\" xmlns:soap12=\"http://www.w3.org/2003/05/soap-envelope\">"
            + "<soap12:Body>"
            + "<GetAreaByID xmlns=\"http://tempuri.org/\">"
            + "<areaID>" + areaID + "</areaID>"
            + "</GetAreaByID>"
            + "</soap12:Body>"
            + "</soap12:Envelope>";

        var xhr = new XMLHttpRequest();
        xhr.withCredentials = false;
        xhr.addEventListener(
            "readystatechange",
            function () {
                if (this.readyState === 4) {
                    var parser = new DOMParser();
                    var xmlDoc = parser.parseFromString(this.responseText, "text/xml");
                    var json = JSON.parse(xmlDoc.getElementsByTagName("GetAreaByIDResult")[0].innerHTML);

                    $("#factoryID").val(json.Data[0].FactoryID);
                    $("#areaID").val(json.Data[0].AreaID);
                }
            }
        );

        xhr.open("POST", IUDServiceURL, false);
        xhr.setRequestHeader("content-type", "text/xml");
        xhr.send(data);
    },
    getFactoryOpion: function (factoryID, areaID) {
        var data = "<?xml version=\"1.0\" encoding=\"utf-8\"?>"
            + "<soap12:Envelope xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\" xmlns:soap12=\"http://www.w3.org/2003/05/soap-envelope\">"
            + "<soap12:Body>"
            + "<GetAllFactory xmlns=\"http://tempuri.org/\" />"
            + "</soap12:Body>"
            + "</soap12:Envelope>";

        var xhr = new XMLHttpRequest();
        xhr.withCredentials = false;
        xhr.addEventListener(
            "readystatechange",
            function () {
                if (this.readyState === 4) {
                    var parser = new DOMParser();
                    var xmlDoc = parser.parseFromString(this.responseText, "text/xml");
                    var json = JSON.parse(xmlDoc.getElementsByTagName("GetAllFactoryResult")[0].innerHTML);

                    $("#factoryID option").remove();

                    $("#factoryID").append($("<option></option>").attr("value", "").text("全部"));
                    for (i = 0; i < json.Data.length; i++) {
                        $("#factoryID").append($("<option></option>").attr("value", json.Data[i].FactoryID).text(unescape(json.Data[i].FactoryName)));
                    }

                    $("#factoryID").val(factoryID);

                    machine.getAreaOption(factoryID, areaID);
                }
            }
        );

        xhr.open("POST", IUDServiceURL, false);
        xhr.setRequestHeader("content-type", "text/xml");
        xhr.send(data);
    },
    getAreaOption: function (factoryID, areaID) {
        var data = "<?xml version=\"1.0\" encoding=\"utf-8\"?>"
            + "<soap12:Envelope xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\" xmlns:soap12=\"http://www.w3.org/2003/05/soap-envelope\">"
            + "<soap12:Body>"
            + "<GetAreaOption xmlns=\"http://tempuri.org/\">"
            + "<factoryID>" + factoryID + "</factoryID>"
            + "</GetAreaOption>"
            + "</soap12:Body>"
            + "</soap12:Envelope>";

        var xhr = new XMLHttpRequest();
        xhr.withCredentials = false;
        xhr.addEventListener(
            "readystatechange",
            function () {
                if (this.readyState === 4) {
                    var parser = new DOMParser();
                    var xmlDoc = parser.parseFromString(this.responseText, "text/xml");
                    var json = JSON.parse(xmlDoc.getElementsByTagName("GetAreaOptionResult")[0].innerHTML);

                    machine.hideAreaOption(factoryID);

                    $("#areaID option").remove();

                    $("#areaID").append($("<option></option>").attr("value", "").text("全部"));
                    for (i = 0; i < json.Data.length; i++) {
                        $("#areaID").append($("<option></option>").attr("value", json.Data[i].AreaID).text(unescape(json.Data[i].AreaName)));
                    }

                    $("#areaID").val(areaID);
                }
            }
        );

        xhr.open("POST", IUDServiceURL, false);
        xhr.setRequestHeader("content-type", "text/xml");
        xhr.send(data);
    },
    hideAreaOption: function (factoryID) {
        if (factoryID != "") {
            $("#areaSelDiv").attr("style", "");
        } else {
            $("#areaSelDiv").attr("style", "display: none;");
        }
    },
    gotoAdd: function () {
        var strUrl = location.search;
        var areaID = strUrl.split("?aid=");

        location.href = "MachineAdd.aspx?aid=" + areaID[1];
    },
    gotoMod: function (machineID) {
        var strUrl = location.search;
        var areaID = strUrl.split("?aid=");

        location.href = "MachineMod.aspx?aid=" + areaID[1] + "&id=" + machineID;
    },
    getMachine: function () {
        var strUrl = location.search.substr(1);
        var parameter = strUrl.split("&");
        var areaID = parameter[0].substr(4);
        var machineID = parameter[1].substr(3);

        var data = "<?xml version=\"1.0\" encoding=\"utf-8\"?>"
            + "<soap12:Envelope xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\" xmlns:soap12=\"http://www.w3.org/2003/05/soap-envelope\">"
            + "<soap12:Body>"
            + "<GetMachineByID xmlns=\"http://tempuri.org/\">"
            + "<machineID>" + machineID + "</machineID>"
            + "</GetMachineByID>"
            + "</soap12:Body>"
            + "</soap12:Envelope>";

        var xhr = new XMLHttpRequest();
        xhr.withCredentials = false;
        xhr.addEventListener(
            "readystatechange",
            function () {
                if (this.readyState === 4) {
                    var parser = new DOMParser();
                    var xmlDoc = parser.parseFromString(this.responseText, "text/xml");
                    var json = JSON.parse(xmlDoc.getElementsByTagName("GetMachineByIDResult")[0].innerHTML);

                    $("#factoryID").val(json.Data[0].FactoryID);
                    $("#areaID").val(json.Data[0].AreaID);
                    machine.getPlatformList(areaID, json.Data[0].PlatformID);
                    $("#machineID").val(json.Data[0].MachineID);
                    $("#slaveNo").val(json.Data[0].SlaveNo);
                    $("#channel").val(json.Data[0].Channel);
                    $("#coordinateX").val(json.Data[0].CoordinateX);
                    $("#coordinateY").val(json.Data[0].CoordinateY);
                }
            }
        );

        xhr.open("POST", IUDServiceURL, false);
        xhr.setRequestHeader("content-type", "text/xml");
        xhr.send(data);
    },
    addMachine: function (factoryID, areaID, platformID, machineID, slaveNo, channel, coordinateX, coordinateY, founder) {
        var data = "<?xml version=\"1.0\" encoding=\"utf-8\"?>"
            + "<soap12:Envelope xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\" xmlns:soap12=\"http://www.w3.org/2003/05/soap-envelope\">"
            + "<soap12:Body>"
            + "<AddMachine xmlns=\"http://tempuri.org/\">"
            + "<factoryID>" + factoryID + "</factoryID>"
            + "<areaID>" + areaID + "</areaID>"
            + "<platformID>" + platformID + "</platformID>"
            + "<machineID>" + machineID + "</machineID>"
            + "<slaveNo>" + slaveNo + "</slaveNo>"
            + "<channel>" + channel + "</channel>"
            + "<coordinateX>" + coordinateX + "</coordinateX>"
            + "<coordinateY>" + coordinateY + "</coordinateY>"
            + "<founder>" + founder + "</founder>"
            + "</AddMachine>"
            + "</soap12:Body>"
            + "</soap12:Envelope>";

        var xhr = new XMLHttpRequest();
        xhr.withCredentials = false;
        xhr.addEventListener(
            "readystatechange",
            function () {
                if (this.readyState === 4) {
                    var parser = new DOMParser();
                    var xmlDoc = parser.parseFromString(this.responseText, "text/xml");
                    var json = JSON.parse(xmlDoc.getElementsByTagName("AddMachineResult")[0].innerHTML);

                    alert(json.Data[0].Result + "!!!");
                    if (json.Data[0].Result == "新增成功") {
                        location.href = "MachineList.aspx?aid=" + areaID;
                    }
                }
            }
        );

        xhr.open("POST", IUDServiceURL, false);
        xhr.setRequestHeader("content-type", "text/xml");
        xhr.send(data);
    },
    modMachine: function (factoryID, areaID, platformID, machineID, slaveNo, channel, coordinateX, coordinateY, updater) {
        var data = "<?xml version=\"1.0\" encoding=\"utf-8\"?>"
            + "<soap12:Envelope xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\" xmlns:soap12=\"http://www.w3.org/2003/05/soap-envelope\">"
            + "<soap12:Body>"
            + "<ModMachine xmlns=\"http://tempuri.org/\">"
            + "<factoryID>" + factoryID + "</factoryID>"
            + "<areaID>" + areaID + "</areaID>"
            + "<platformID>" + platformID + "</platformID>"
            + "<machineID>" + machineID + "</machineID>"
            + "<slaveNo>" + slaveNo + "</slaveNo>"
            + "<channel>" + channel + "</channel>"
            + "<coordinateX>" + coordinateX + "</coordinateX>"
            + "<coordinateY>" + coordinateY + "</coordinateY>"
            + "<updater>" + updater + "</updater>"
            + "</ModMachine>"
            + "</soap12:Body>"
            + "</soap12:Envelope>";

        var xhr = new XMLHttpRequest();
        xhr.withCredentials = false;
        xhr.addEventListener(
            "readystatechange",
            function () {
                if (this.readyState === 4) {
                    var parser = new DOMParser();
                    var xmlDoc = parser.parseFromString(this.responseText, "text/xml");
                    var json = JSON.parse(xmlDoc.getElementsByTagName("ModMachineResult")[0].innerHTML);

                    alert(json.Data[0].Result + "!!!");
                    if (json.Data[0].Result == "修改成功") {
                        location.href = "MachineList.aspx?aid=" + areaID;
                    }
                }
            }
        );

        xhr.open("POST", IUDServiceURL, false);
        xhr.setRequestHeader("content-type", "text/xml");
        xhr.send(data);
    },
    delMachine: function (machineID) {
        if (confirm("確定刪除此成型機?")) {
            var data = "<?xml version=\"1.0\" encoding=\"utf-8\"?>"
                + "<soap12:Envelope xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\" xmlns:soap12=\"http://www.w3.org/2003/05/soap-envelope\">"
                + "<soap12:Body>"
                + "<DelMachine xmlns=\"http://tempuri.org/\">"
                + "<machineID>" + machineID + "</machineID>"
                + "</DelMachine>"
                + "</soap12:Body>"
                + "</soap12:Envelope>";

            var xhr = new XMLHttpRequest();
            xhr.withCredentials = false;

            xhr.open("POST", IUDServiceURL, false);
            xhr.setRequestHeader("content-type", "text/xml");
            xhr.send(data);

            alert("刪除成功!!!");
            window.location.reload();
        }
    },
    updateByPass: function (machineID, userID) {
        $('body').on("click", '#passcheck' + machineID, function () {
            var ischecked = $('#passcheck' + machineID).is(":checked");
            $.ajax({
                url: 'Handler_checkboxSetting.ashx',
                data: { Machine: machineID, UserID: userID, State: ischecked },
                type: 'GET',
                contentType: 'application/json; charset=utf-8',
                dataType: 'json',
                success: function () {
                    //alert('success! Machine:' + result.Machine);
                },
                error: function (result) {
                    //alert('Error :' + result.errMsg);
                }
            });
        });
    },
    refreshByPass: function () {
        $('body').on("click", '#btnRefresh', function () {
            //var ischecked = $('#passcheck' + machineID).is(":checked");
            $.ajax({
                url: 'Handler_getByPassState.ashx',
                data: {},
                type: 'GET',
                contentType: 'application/json; charset=utf-8',
                dataType: 'json',
                beforeSend: function () {
                    //$('#loading').show();
                },
                success: function (result) {
                    var Mydata = result.Dic;
                    $.each(Mydata, function (machineID, state) {
                        if (state == 1)
                            $('#passcheck' + machineID).prop("checked", true);
                        else
                            $('#passcheck' + machineID).prop("checked", false);
                    });
                },
                complete: function (result) {
                    //$('#loading').hide();
                },
                error: function (result) {
                    //alert('Error :' + result.errMsg);
                }
            });
        });
    },
    clickrefresh: function () {
        $('#btnRefresh').click();
    }
};

var plc = {
    checkAreaReflash: function (lastReflash, factoryID, areaID) {
        var data = "<?xml version=\"1.0\" encoding=\"utf-8\"?>"
            + "<soap12:Envelope xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\" xmlns:soap12=\"http://www.w3.org/2003/05/soap-envelope\">"
            + "<soap12:Body>"
            + "<CheckAreaReflash xmlns=\"http://tempuri.org/\">"
            + "<lastReflash>" + lastReflash + "</lastReflash>"
            + "<factoryID>" + factoryID + "</factoryID>"
            + "<areaID>" + areaID + "</areaID>"
            + "</CheckAreaReflash>"
            + "</soap12:Body>"
            + "</soap12:Envelope>";

        var xhr = new XMLHttpRequest();
        xhr.withCredentials = false;
        xhr.addEventListener(
            "readystatechange",
            function () {
                //if (this.readyState === 4) {
                var parser = new DOMParser();
                var xmlDoc = parser.parseFromString(this.responseText, "text/xml");
                var json = JSON.parse(xmlDoc.getElementsByTagName("CheckAreaReflashResult")[0].innerHTML);

                var a = "1";
                //}
            }
        );

        xhr.open("POST", HDServiceURL, true);
        xhr.setRequestHeader("content-type", "text/xml");
        xhr.send(data);
    },
    checkPlatformReflash: function (lastReflash, factoryID, areaID, platfromID) {
        var data = "<?xml version=\"1.0\" encoding=\"utf-8\"?>"
            + "<soap12:Envelope xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\" xmlns:soap12=\"http://www.w3.org/2003/05/soap-envelope\">"
            + "<soap12:Body>"
            + "<CheckPlatformReflash xmlns=\"http://tempuri.org/\">"
            + "<lastReflash>" + lastReflash + "</lastReflash>"
            + "<factoryID>" + factoryID + "</factoryID>"
            + "<areaID>" + areaID + "</areaID>"
            + "<platfromID>" + platfromID + "</platfromID>"
            + "</CheckPlatformReflash>"
            + "</soap12:Body>"
            + "</soap12:Envelope>";

        var xhr = new XMLHttpRequest();
        xhr.withCredentials = false;
        xhr.addEventListener(
            "readystatechange",
            function () {
                if (this.readyState === 4) {
                    var parser = new DOMParser();
                    var xmlDoc = parser.parseFromString(this.responseText, "text/xml");
                    var json = JSON.parse(xmlDoc.getElementsByTagName("CheckPlatformReflashResult")[0].innerHTML);

                    //if (json) {
                    plc.getPlatformState(factoryID, areaID, platfromID);
                    //}
                }
            }
        );

        xhr.open("POST", HDServiceURL, true);
        xhr.setRequestHeader("content-type", "text/xml");
        xhr.send(data);
    },
    checkPlatformReflash_New: function (lastReflash, factoryID, areaID, platfromID) {
        var data = "<?xml version=\"1.0\" encoding=\"utf-8\"?>"
            + "<soap12:Envelope xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\" xmlns:soap12=\"http://www.w3.org/2003/05/soap-envelope\">"
            + "<soap12:Body>"
            + "<CheckPlatformReflash_New xmlns=\"http://tempuri.org/\">"
            + "<lastReflash>" + lastReflash + "</lastReflash>"
            + "<factoryID>" + factoryID + "</factoryID>"
            + "<areaID>" + areaID + "</areaID>"
            + "<platfromID>" + platfromID + "</platfromID>"
            + "</CheckPlatformReflash_New>"
            + "</soap12:Body>"
            + "</soap12:Envelope>";

        var xhr = new XMLHttpRequest();
        xhr.withCredentials = false;
        xhr.addEventListener(
            "readystatechange",
            function () {
                if (this.readyState === 4) {
                    var parser = new DOMParser();
                    var xmlDoc = parser.parseFromString(this.responseText, "text/xml");
                    var json = JSON.parse(xmlDoc.getElementsByTagName("CheckPlatformReflash_NewResult")[0].innerHTML);

                    //if (json) {
                    plc.getPlatformState_New(factoryID, areaID, platfromID);
                    //}
                }
            }
        );

        xhr.open("POST", HDServiceURL, true);
        xhr.setRequestHeader("content-type", "text/xml");
        xhr.send(data);
    },
    checkMachineReflash: function (type, lastReflash, factoryID, areaID, machineID) {
        var data = "<?xml version=\"1.0\" encoding=\"utf-8\"?>"
            + "<soap12:Envelope xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\" xmlns:soap12=\"http://www.w3.org/2003/05/soap-envelope\">"
            + "<soap12:Body>"
            + "<CheckMachineReflash xmlns=\"http://tempuri.org/\">"
            + "<lastReflash>" + lastReflash + "</lastReflash>"
            + "<factoryID>" + factoryID + "</factoryID>"
            + "<areaID>" + areaID + "</areaID>"
            + "<machineID>" + machineID + "</machineID>"
            + "</CheckMachineReflash>"
            + "</soap12:Body>"
            + "</soap12:Envelope>";

        var xhr = new XMLHttpRequest();
        xhr.withCredentials = false;
        xhr.addEventListener(
            "readystatechange",
            function () {
                if (this.readyState === 4) {
                    var parser = new DOMParser();
                    var xmlDoc = parser.parseFromString(this.responseText, "text/xml");
                    var json = JSON.parse(xmlDoc.getElementsByTagName("CheckMachineReflashResult")[0].innerHTML);

                    //if (json) {
                    switch (type) {
                        case "detail":
                            plc.getMachineData(factoryID, areaID, machineID);
                            break;
                        case "plan":
                            plc.getMachinePlan(factoryID, areaID, machineID);
                            break;
                        case "news":
                            plc.getMachineNews(factoryID, areaID, machineID);
                            break;
                        case "bypass":
                            plc.getByPassMachineData(factoryID, areaID, machineID);
                            break;
                    }
                    //}
                }
            }
        );

        xhr.open("POST", HDServiceURL, true);
        xhr.setRequestHeader("content-type", "text/xml");
        xhr.send(data);
    },
    getMachineData: function (factoryID, areaID, machineID) {
        var data = "<?xml version=\"1.0\" encoding=\"utf-8\"?>"
            + "<soap12:Envelope xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\" xmlns:soap12=\"http://www.w3.org/2003/05/soap-envelope\">"
            + "<soap12:Body>"
            + "<GetMachineData xmlns=\"http://tempuri.org/\">"
            + "<factoryID>" + factoryID + "</factoryID>"
            + "<areaID>" + areaID + "</areaID>"
            + "<machineID>" + machineID + "</machineID>"
            + "</GetMachineData>"
            + "</soap12:Body>"
            + "</soap12:Envelope>";

        var xhr = new XMLHttpRequest();
        xhr.withCredentials = false;
        xhr.addEventListener(
            "readystatechange",
            function () {
                if (this.readyState === 4) {
                    var parser = new DOMParser();
                    var xmlDoc = parser.parseFromString(this.responseText, "text/xml");

                    //debugger;
                    //alert('開始執行');

                    var json = JSON.parse(xmlDoc.getElementsByTagName("GetMachineDataResult")[0].innerHTML);

                    var state = ["red", "green", "blue", "tan", "white", "gray"];
                    var light = ["", "red", "green", "yellow", "orange"];

                    var nowQty = json.ProductDetail.ProdQty;
                    var totalQty = json.ProductDetail.OrderQty;
                    var percent = parseFloat(nowQty) / parseFloat(totalQty) * 100;

                    $("#lastReflash" + machineID).val(json.ReflashTime);
                    $("#state" + machineID).attr("class", "area device_" + state[json.MachineState]);
                    $("#lamp" + machineID).attr("class", "device_status light_status_" + light[((json.MachineState == 0) ? 0 : json.LampState)]);
                    var use = "";
                    use += ((json.ProductDetail.MPlileSerial1 != "") ? json.ProductDetail.MPlileSerial1 : "");
                    use += ((use != "") ? "<br>" : "");
                    use += ((json.ProductDetail.MPlileSerial2 != "") ? json.ProductDetail.MPlileSerial2 : "");
                    use += ((use != "") ? "<br>" : "");
                    use += ((json.ProductDetail.MPlileSerial3 != "") ? json.ProductDetail.MPlileSerial3 : "");
                    $("#pileTable" + machineID).html(use);
                    $("#holeRatio" + machineID).html(((json.HoleID != "00") ? json.HoleID : "無") + "<br>" + ((json.ProductDetail.MRatio != "") ? json.ProductDetail.MRatio : "---"));
                    $("#productID" + machineID).html(((json.ProductDetail.ProductID != "") ? json.ProductDetail.ProductID : ""));
                    $("#weight" + machineID).html(((json.ProductDetail.ProductID != "" && json.ProductDetail.WeightUnit != "") ? json.ProductDetail.Weight + json.ProductDetail.WeightUnit.toUpperCase() : ""));

                    //var preorder = $("#orderID" + machineID).html().replace('工  單：','');
                    //if (preorder != json.OrderID && preorder != '') {
                    //    $.ajax({
                    //        url: 'Handler_ByPassClear.ashx',
                    //        data: { Machine: machineID, OrderID : preorder},
                    //        type: 'GET',
                    //        contentType: 'application/json; charset=utf-8',
                    //        dataType: 'json',
                    //        success: function () {

                    //        },
                    //        error: function (result) {
                    //            //alert('Error :' + result.errMsg);
                    //        }
                    //    });
                    //}
                    $("#orderID" + machineID).html(((json.OrderID != "") ? "工&emsp;&emsp;單：" + json.OrderID : ""));
                    if (totalQty != 0) {
                        $("#quantity" + machineID).html("目前產量：" + nowQty + " / " + totalQty + " (" + percent.toFixed(0) + "%)");
                    }
                }
            }
        );

        xhr.open("POST", HDServiceURL, true);
        xhr.setRequestHeader("content-type", "text/xml");
        xhr.send(data);
    },
    getByPassMachineData: function (factoryID, areaID, machineID) {
        var data = "<?xml version=\"1.0\" encoding=\"utf-8\"?>"
            + "<soap12:Envelope xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\" xmlns:soap12=\"http://www.w3.org/2003/05/soap-envelope\">"
            + "<soap12:Body>"
            + "<GetMachineData xmlns=\"http://tempuri.org/\">"
            + "<factoryID>" + factoryID + "</factoryID>"
            + "<areaID>" + areaID + "</areaID>"
            + "<machineID>" + machineID + "</machineID>"
            + "</GetMachineData>"
            + "</soap12:Body>"
            + "</soap12:Envelope>";

        var xhr = new XMLHttpRequest();
        xhr.withCredentials = false;
        xhr.addEventListener(
            "readystatechange",
            function () {
                if (this.readyState === 4) {
                    var parser = new DOMParser();
                    var xmlDoc = parser.parseFromString(this.responseText, "text/xml");

                    //debugger;
                    //alert('開始執行');
                    var json = JSON.parse(xmlDoc.getElementsByTagName("GetMachineDataResult")[0].innerHTML);

                    var state = ["red", "green", "blue", "tan", "white", "gray"];
                    var light = ["", "red", "green", "yellow", "orange"];

                    $("#lastReflash" + machineID).val(json.ReflashTime);
                    $("#state" + machineID).attr("class", "area device_" + state[json.MachineState]);
                    $("#lamp" + machineID).attr("class", "device_status light_status_" + light[((json.MachineState == 0) ? 0 : json.LampState)]);
                }
            }
        );

        xhr.open("POST", HDServiceURL, true);
        xhr.setRequestHeader("content-type", "text/xml");
        xhr.send(data);
    },
    getMachinePlan: function (factoryID, areaID, machineID) {
        var data = "<?xml version=\"1.0\" encoding=\"utf-8\"?>"
            + "<soap12:Envelope xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\" xmlns:soap12=\"http://www.w3.org/2003/05/soap-envelope\">"
            + "<soap12:Body>"
            + "<GetMachineData xmlns=\"http://tempuri.org/\">"
            + "<factoryID>" + factoryID + "</factoryID>"
            + "<areaID>" + areaID + "</areaID>"
            + "<machineID>" + machineID + "</machineID>"
            + "</GetMachineData>"
            + "</soap12:Body>"
            + "</soap12:Envelope>";

        var xhr = new XMLHttpRequest();
        xhr.withCredentials = false;
        xhr.addEventListener(
            "readystatechange",
            function () {
                if (this.readyState === 4) {
                    var parser = new DOMParser();
                    var xmlDoc = parser.parseFromString(this.responseText, "text/xml");
                    var json = JSON.parse(xmlDoc.getElementsByTagName("GetMachineDataResult")[0].innerHTML);

                    $("#lastReflash" + machineID).val(json.ReflashTime);

                    if (json.MachineState == "0") {
                        $("#msc" + machineID).attr("class", "device-num device_red");
                    } else if (json.MachineState == "1") {
                        $("#msc" + machineID).attr("class", "device-num device_green");
                    } else if (json.MachineState == "2") {
                        $("#msc" + machineID).attr("class", "device-num device_blue");
                    } else if (json.MachineState == "3") {
                        $("#msc" + machineID).attr("class", "device-num device_tan");
                    } else if (json.MachineState == "4") {
                        $("#msc" + machineID).attr("class", "device-num device_white");
                    } else {
                        $("#msc" + machineID).attr("class", "device-num device_gray");
                    }

                    if (json.LampState == "1" && json.MachineState != "0") {
                        $("#num" + machineID).attr("class", "the_device_num border_red");
                    } else if (json.LampState == "2" && json.MachineState != "0") {
                        $("#num" + machineID).attr("class", "the_device_num border_green");
                    } else if (json.LampState == "3" && json.MachineState != "0") {
                        $("#num" + machineID).attr("class", "the_device_num border_yellow");
                    } else if (json.LampState == "4" && json.MachineState != "0") {
                        $("#num" + machineID).attr("class", "the_device_num border_orange");
                    } else {
                        $("#num" + machineID).attr("class", "the_device_num border_abnormal");
                    }
                }
            }
        );

        xhr.open("POST", HDServiceURL, true);
        xhr.setRequestHeader("content-type", "text/xml");
        xhr.send(data);
    },
    getMachineNews: function (factoryID, areaID, machineID) {
        var data = "<?xml version=\"1.0\" encoding=\"utf-8\"?>"
            + "<soap12:Envelope xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\" xmlns:soap12=\"http://www.w3.org/2003/05/soap-envelope\">"
            + "<soap12:Body>"
            + "<GetMachineData xmlns=\"http://tempuri.org/\">"
            + "<factoryID>" + factoryID + "</factoryID>"
            + "<areaID>" + areaID + "</areaID>"
            + "<machineID>" + machineID + "</machineID>"
            + "</GetMachineData>"
            + "</soap12:Body>"
            + "</soap12:Envelope>";

        var xhr = new XMLHttpRequest();
        xhr.withCredentials = false;
        xhr.addEventListener(
            "readystatechange",
            function () {
                if (this.readyState === 4) {
                    var parser = new DOMParser();
                    var xmlDoc = parser.parseFromString(this.responseText, "text/xml");
                    var json = JSON.parse(xmlDoc.getElementsByTagName("GetMachineDataResult")[0].innerHTML);

                    var state = ["停機", "全自動", "半自動", "手動", "換模中", "未連線"];
                    var stateColor = ["bc_red", "bc_green", "bc_blue", "bc_tan", "bc_white", "bc_gray"];

                    var nowQty = json.ProductDetail.ProdQty;
                    var totalQty = json.ProductDetail.OrderQty;
                    var percent = parseFloat(nowQty) / parseFloat(totalQty) * 100;
                    var lastQty = parseInt(totalQty) - parseInt(nowQty);

                    var qtyColor = "";
                    var lampColor = "";

                    //$("#tr" + machineID).attr("class", stateColor[json.MachineState]);

                    $("#tr" + machineID).find("td").eq(2).text(((json.HoleID != "00") ? json.HoleID : ""));
                    $("#tr" + machineID).find("td").eq(3).text(state[json.MachineState]);
                    $("#tr" + machineID).find("td").eq(3).attr("class", stateColor[json.MachineState]);
                    $("#tr" + machineID).find("td").eq(4).text(json.OrderID);
                    $("#tr" + machineID).find("td").eq(5).text(json.ProductDetail.OrderType);
                    $("#tr" + machineID).find("td").eq(6).text(json.ProductDetail.OrderStatus);
                    /*var use = "";
                    use += ((json.ProductDetail.MPlileSerial1 != "") ? json.ProductDetail.MPlileSerial1 : "");
                    use += ((use != "") ? "<br>" : "");
                    use += ((json.ProductDetail.MPlileSerial2 != "") ? json.ProductDetail.MPlileSerial2 : "");
                    use += ((use != "") ? "<br>" : "");
                    use += ((json.ProductDetail.MPlileSerial3 != "") ? json.ProductDetail.MPlileSerial3 : "");
                    use += ((use != "") ? "<br>" : "");
                    use += ((json.ProductDetail.MRatio != "") ? "("+json.ProductDetail.MRatio+")" : "");
                    $("#tr" + machineID).find("td").eq(8).html(use);*/
                    $("#tr" + machineID).find("td").eq(7).html(json.ProductDetail.ProductID);
                    //var spec = json.ProductDetail.SpecMaterial.replace(/\,/g, "<br>");
                    var spec = "";
                    spec += ((json.ProductDetail.MPlileSerial1 != "") ? json.ProductDetail.MPlileSerial1 : "");
                    spec += ((json.ProductDetail.MPlileSerial2 != "") ? "<br>" + json.ProductDetail.MPlileSerial2 : "");
                    spec += ((json.ProductDetail.MPlileSerial3 != "") ? "<br>" + json.ProductDetail.MPlileSerial3 : "");
                    spec += ((json.ProductDetail.MRatio != "") ? "<br>(" + json.ProductDetail.MRatio + ")" : "");
                    $("#tr" + machineID).find("td").eq(8).html(spec);
                    $("#tr" + machineID).find("td").eq(9).html(((json.ProductDetail.WeightUnit != "") ? json.ProductDetail.Weight + json.ProductDetail.WeightUnit.toUpperCase() : ""));
                    $("#tr" + machineID).find("td").eq(10).text(totalQty);

                    if (percent >= 90) {
                        qtyColor = "bc_green";
                    } else if (percent < 90 && percent > 70) {
                        qtyColor = "bc_yellow2";
                    } else {
                        qtyColor = "bc_red";
                    }

                    $("#tr" + machineID).find("td").eq(11).text(nowQty);
                    $("#tr" + machineID).find("td").eq(11).attr("class", qtyColor);
                    $("#tr" + machineID).find("td").eq(12).text(lastQty);

                    if (json.LampState == 1) {
                        lampColor = "#ed1b24";
                    }
                    else if (json.LampState == 2) {
                        lampColor = "#00cb00";
                    }
                    else if (json.LampState == 3) {
                        lampColor = "#ffff11";
                    }
                    else if (json.LampState == 4) {
                        lampColor = "#ff7800";
                    }

                    if (json.MachineState != 0) {
                        $("#tr" + machineID).find("td").eq(13).html("<span class='light_status' style='background:" + lampColor + "'></span>");
                    }

                    //$("#tr"+machineID).find("td").eq(13).text(json.LampState);
                    $("#lastReflash" + machineID).val(json.ReflashTime);
                }
            }
        );

        xhr.open("POST", HDServiceURL, true);
        xhr.setRequestHeader("content-type", "text/xml");
        xhr.send(data);
    },
    getPlatformState: function (factoryID, areaID, platformID) {
        var data = "<?xml version=\"1.0\" encoding=\"utf-8\"?>"
            + "<soap12:Envelope xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\" xmlns:soap12=\"http://www.w3.org/2003/05/soap-envelope\">"
            + "<soap12:Body>"
            + "<GetPlatformData xmlns=\"http://tempuri.org/\">"
            + "<factoryID>" + factoryID + "</factoryID>"
            + "<areaID>" + areaID + "</areaID>"
            + "<platformID>" + platformID + "</platformID>"
            + "</GetPlatformData>"
            + "</soap12:Body>"
            + "</soap12:Envelope>";

        var xhr = new XMLHttpRequest();
        xhr.withCredentials = false;
        xhr.addEventListener(
            "readystatechange",
            function () {
                if (this.readyState === 4) {
                    var parser = new DOMParser();
                    var xmlDoc = parser.parseFromString(this.responseText, "text/xml");
                    var json = JSON.parse(xmlDoc.getElementsByTagName("GetPlatformDataResult")[0].innerHTML);

                    $("#lastReflash" + platformID).val(json.ReflashTime);

                    var light = ["red", "green"];

                    $("#state" + platformID + " .mat_title .mat_status").attr("class", "mat_status light_status_" + light[json.ConnectionStauts] + "")

                    $(".showHole" + platformID + " img").attr("src", "image/ball-gray.png");
                    $(".showHole" + platformID + " span").attr("class", "fn_white");

                    for (i = 0; i < json.Holes.length; i++) {
                        var statePic = "";

                        if (json.Holes[i].LampState == "1") {
                            statePic = "red";
                        } else if (json.Holes[i].LampState == "2") {
                            statePic = "green";
                        } else if (json.Holes[i].LampState == "3") {
                            statePic = "yellow";
                        } else if (json.Holes[i].LampState == "4") {
                            statePic = "orange";
                        } else {
                            statePic = "white";
                        }

                        $("#hole" + platformID + "_" + json.Holes[i].HoleID + " img").attr("src", "image/ball-" + statePic + ".png");
                        $("#holeText" + platformID + "_" + json.Holes[i].HoleID).attr("class", "hole_D5_txt");
                        $("#holeText" + platformID + "_" + json.Holes[i].HoleID).html(json.Holes[i].MachineID);
                    }

                    for (i = 0; i < json.MPiles.length; i++) {
                        $("#pile" + i + platformID).html(json.MPiles[i].PileSerial1 + "<br>" + json.MPiles[i].PileSerial2 + "<br>" + json.MPiles[i].PileSerial3);
                    }
                }
            }
        );

        xhr.open("POST", HDServiceURL, true);
        xhr.setRequestHeader("content-type", "text/xml");
        xhr.send(data);
    },
    getPlatformState_New: function (factoryID, areaID, platformID) {
        var data = "<?xml version=\"1.0\" encoding=\"utf-8\"?>"
            + "<soap12:Envelope xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\" xmlns:soap12=\"http://www.w3.org/2003/05/soap-envelope\">"
            + "<soap12:Body>"
            + "<GetPlatformData_New xmlns=\"http://tempuri.org/\">"
            + "<factoryID>" + factoryID + "</factoryID>"
            + "<areaID>" + areaID + "</areaID>"
            + "<platformID>" + platformID + "</platformID>"
            + "</GetPlatformData_New>"
            + "</soap12:Body>"
            + "</soap12:Envelope>";

        var xhr = new XMLHttpRequest();
        xhr.withCredentials = false;
        xhr.addEventListener(
            "readystatechange",
            function () {
                if (this.readyState === 4) {
                    var parser = new DOMParser();
                    var xmlDoc = parser.parseFromString(this.responseText, "text/xml");
                    var json = JSON.parse(xmlDoc.getElementsByTagName("GetPlatformData_NewResult")[0].innerHTML);

                    $("#lastReflash" + platformID).val(json.ReflashTime);

                    var light = ["red", "green"];

                    $("#state" + platformID + " .mat_title .mat_status").attr("class", "mat_status light_status_" + light[json.ConnectionStatus] + "")

                    $(".showHole" + platformID + " img").attr("src", "image/ball-gray.png");
                    $(".showHole" + platformID + " span").attr("class", "fn_white");
                    console.log(json);
                    for (i = 0; i < json.Holes.length; i++) {
                        var statePic = "";

                        if (json.Holes[i].LampState == "1") {
                            statePic = "red";
                        } else if (json.Holes[i].LampState == "2") {
                            statePic = "green";
                        } else if (json.Holes[i].LampState == "3") {
                            statePic = "yellow";
                        } else if (json.Holes[i].LampState == "4") {
                            statePic = "orange";
                        } else {
                            statePic = "white";
                        }
                        console.log(json.Holes[i].MHoleID);
                        console.log(json.MHoles[i].HoleSerial1);
                        console.log(json.MHoles[i].HoleSerial2);
                        console.log(json.MHoles[i].HoleSerial3);
                        $("#hole" + platformID + "_" + json.Holes[i].MHoleID + " img").attr("src", "image/ball-" + statePic + ".png");
                        $("#holeText" + platformID + "_" + json.Holes[i].MHoleID).attr("class", "hole_D5_txt");
                        $("#holeText" + platformID + "_" + json.Holes[i].MHoleID).html(json.Holes[i].MachineID + "</br>" + json.MHoles[i].HoleSerial1 + "</br>" + json.MHoles[i].HoleSerial2 + "</br>" + json.MHoles[i].HoleSerial3);

                    }

                    //for (i = 0; i < json.MPiles.length; i++) {
                    //    $("#pile" + i + platformID).html(json.MPiles[i].PileSerial1 + "<br>" + json.MPiles[i].PileSerial2 + "<br>" + json.MPiles[i].PileSerial3);
                    //}
                }
            }
        );

        xhr.open("POST", HDServiceURL, true);
        xhr.setRequestHeader("content-type", "text/xml");
        xhr.send(data);
    }
};

var search = {
    getSearchElement: function () {
        search.getFactoryOpion();
    },
    getFactoryOpion: function () {
        var data = "<?xml version=\"1.0\" encoding=\"utf-8\"?>"
            + "<soap12:Envelope xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\" xmlns:soap12=\"http://www.w3.org/2003/05/soap-envelope\">"
            + "<soap12:Body>"
            + "<GetAllFactory xmlns=\"http://tempuri.org/\" />"
            + "</soap12:Body>"
            + "</soap12:Envelope>";

        var xhr = new XMLHttpRequest();
        xhr.withCredentials = false;
        xhr.addEventListener(
            "readystatechange",
            function () {
                if (this.readyState === 4) {
                    var parser = new DOMParser();
                    var xmlDoc = parser.parseFromString(this.responseText, "text/xml");
                    var json = JSON.parse(xmlDoc.getElementsByTagName("GetAllFactoryResult")[0].innerHTML);

                    $("#factoryID option").remove();

                    $("#factoryID").append($("<option></option>").attr("value", "").text("全部"));
                    for (i = 0; i < json.Data.length; i++) {
                        $("#factoryID").append($("<option></option>").attr("value", json.Data[i].FactoryID).text(unescape(json.Data[i].FactoryName)));
                    }

                    $("#factoryID").val($("#factoryID option:first").val());

                    search.getAreaOption($("#factoryID").val());
                }
            }
        );

        xhr.open("POST", IUDServiceURL, false);
        xhr.setRequestHeader("content-type", "text/xml");
        xhr.send(data);
    },
    getAreaOption: function (factoryID) {
        var data = "<?xml version=\"1.0\" encoding=\"utf-8\"?>"
            + "<soap12:Envelope xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\" xmlns:soap12=\"http://www.w3.org/2003/05/soap-envelope\">"
            + "<soap12:Body>"
            + "<GetAreaOption xmlns=\"http://tempuri.org/\">"
            + "<factoryID>" + factoryID + "</factoryID>"
            + "</GetAreaOption>"
            + "</soap12:Body>"
            + "</soap12:Envelope>";

        var xhr = new XMLHttpRequest();
        xhr.withCredentials = false;
        xhr.addEventListener(
            "readystatechange",
            function () {
                if (this.readyState === 4) {
                    var parser = new DOMParser();
                    var xmlDoc = parser.parseFromString(this.responseText, "text/xml");
                    var json = JSON.parse(xmlDoc.getElementsByTagName("GetAreaOptionResult")[0].innerHTML);

                    $("#areaID option").remove();

                    $("#areaID").append($("<option></option>").attr("value", "").text("全部"));
                    for (i = 0; i < json.Data.length; i++) {
                        $("#areaID").append($("<option></option>").attr("value", json.Data[i].AreaID).text(unescape(json.Data[i].AreaName)));
                    }

                    $("#areaID").val($("#areaID option:first").val());

                    search.getPlatformOption(factoryID, $("#areaID").val());
                }
            }
        );

        xhr.open("POST", IUDServiceURL, false);
        xhr.setRequestHeader("content-type", "text/xml");
        xhr.send(data);
    },
    getPlatformOption: function (factoryID, areaID) {
        var data = "<?xml version=\"1.0\" encoding=\"utf-8\"?>"
            + "<soap12:Envelope xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\" xmlns:soap12=\"http://www.w3.org/2003/05/soap-envelope\">"
            + "<soap12:Body>"
            + "<GetPlatformOption xmlns=\"http://tempuri.org/\">"
            + "<factoryID>" + factoryID + "</factoryID>"
            + "<areaID>" + areaID + "</areaID>"
            + "</GetPlatformOption>"
            + "</soap12:Body>"
            + "</soap12:Envelope>";

        var xhr = new XMLHttpRequest();
        xhr.withCredentials = false;
        xhr.addEventListener(
            "readystatechange",
            function () {
                if (this.readyState === 4) {
                    var parser = new DOMParser();
                    var xmlDoc = parser.parseFromString(this.responseText, "text/xml");
                    var json = JSON.parse(xmlDoc.getElementsByTagName("GetPlatformOptionResult")[0].innerHTML);

                    $("#platformID option").remove();

                    $("#platformID").append($("<option></option>").attr("value", "").text("全部"));
                    for (i = 0; i < json.Data.length; i++) {
                        $("#platformID").append($("<option></option>").attr("value", json.Data[i].PlatformID).text(unescape(json.Data[i].PlatformName)));
                    }

                    $("#platformID").val($("#platformID option:first").val());

                    search.getMachineOption(factoryID, areaID, $("#platformID").val());
                }
            }
        );

        xhr.open("POST", IUDServiceURL, false);
        xhr.setRequestHeader("content-type", "text/xml");
        xhr.send(data);
    },
    getMachineOption: function (factoryID, areaID, platformID) {
        var data = "<?xml version=\"1.0\" encoding=\"utf-8\"?>"
            + "<soap12:Envelope xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\" xmlns:soap12=\"http://www.w3.org/2003/05/soap-envelope\">"
            + "<soap12:Body>"
            + "<GetMachineOption xmlns=\"http://tempuri.org/\">"
            + "<factoryID>" + factoryID + "</factoryID>"
            + "<areaID>" + areaID + "</areaID>"
            + "<platformID>" + platformID + "</platformID>"
            + "</GetMachineOption>"
            + "</soap12:Body>"
            + "</soap12:Envelope>";

        var xhr = new XMLHttpRequest();
        xhr.withCredentials = false;
        xhr.addEventListener(
            "readystatechange",
            function () {
                if (this.readyState === 4) {
                    var parser = new DOMParser();
                    var xmlDoc = parser.parseFromString(this.responseText, "text/xml");
                    var json = JSON.parse(xmlDoc.getElementsByTagName("GetMachineOptionResult")[0].innerHTML);

                    $("#machineID option").remove();

                    $("#machineID").append($("<option></option>").attr("value", "").text("全部"));
                    for (i = 0; i < json.Data.length; i++) {
                        $("#machineID").append($("<option></option>").attr("value", json.Data[i].MachineID).text(json.Data[i].MachineID));
                    }

                    $("#machineID").val($("#machineID option:first").val());
                }
            }
        );

        xhr.open("POST", IUDServiceURL, false);
        xhr.setRequestHeader("content-type", "text/xml");
        xhr.send(data);
    }
};

var mhistory = {
    getList: function (factoryID, areaID, platformID, machineID, startDate, endDate, orderID, pg) {
        var data = "<?xml version=\"1.0\" encoding=\"utf-8\"?>"
            + "<soap12:Envelope xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\" xmlns:soap12=\"http://www.w3.org/2003/05/soap-envelope\">"
            + "<soap12:Body>"
            + "<GetPageHistory xmlns=\"http://tempuri.org/\">"
            + "<factoryID>" + factoryID + "</factoryID>"
            + "<areaID>" + areaID + "</areaID>"
            + "<platformID>" + platformID + "</platformID>"
            + "<machineID>" + machineID + "</machineID>"
            + "<startDate>" + startDate + "</startDate>"
            + "<endDate>" + endDate + "</endDate>"
            + "<orderID>" + orderID + "</orderID>"
            + "<pg>" + pg + "</pg>"
            + "</GetPageHistory>"
            + "</soap12:Body>"
            + "</soap12:Envelope>";

        var xhr = new XMLHttpRequest();
        xhr.withCredentials = false;
        xhr.addEventListener(
            "readystatechange",
            function () {
                if (this.readyState === 4) {
                    var parser = new DOMParser();
                    var xmlDoc = parser.parseFromString(this.responseText, "text/xml");
                    var json = JSON.parse(xmlDoc.getElementsByTagName("GetPageHistoryResult")[0].innerHTML);

                    var state = ["停機", "全自動", "半自動", "手動", "換模中", "未連線"];
                    var stateColor = ["bc_red", "bc_green", "bc_blue", "bc_tan", "bc_white", "bc_gray"];

                    $("#my_table tbody tr").remove();
                    $("#my_table_sm tbody tr").remove();

                    var tbody = document.getElementById("my_table").getElementsByTagName("tbody")[0];

                    for (i = 0; i < json.Data.length; i++) {
                        var tr = tbody.insertRow(i);
                        for (j = 0; j < 9; j++) {
                            tr.insertCell(j);
                        }

                        var totalQty = json.Data[i].OrdQuantity;
                        var nowQty = json.Data[i].NowQuantity;
                        var percent = parseFloat(nowQty) / parseFloat(totalQty) * 100;

                        var qtyColor = "";

                        tbody.getElementsByTagName("tr")[i].getElementsByTagName("td")[0].innerHTML = unescape(json.Data[i].FactoryName);
                        tbody.getElementsByTagName("tr")[i].getElementsByTagName("td")[1].innerHTML = unescape(json.Data[i].AreaName);
                        tbody.getElementsByTagName("tr")[i].getElementsByTagName("td")[2].innerHTML = json.Data[i].MachineID;
                        //tbody.getElementsByTagName("tr")[i].getElementsByTagName("td")[3].innerHTML = state[json.Data[i].MachineState];
                        //tbody.getElementsByTagName("tr")[i].getElementsByTagName("td")[3].className = stateColor[json.Data[i].MachineState];
                        tbody.getElementsByTagName("tr")[i].getElementsByTagName("td")[3].innerHTML = json.Data[i].OrderID;
                        tbody.getElementsByTagName("tr")[i].getElementsByTagName("td")[4].innerHTML = json.Data[i].OrderType;
                        tbody.getElementsByTagName("tr")[i].getElementsByTagName("td")[5].innerHTML = json.Data[i].ProductID;
                        tbody.getElementsByTagName("tr")[i].getElementsByTagName("td")[6].innerHTML = totalQty;
                        tbody.getElementsByTagName("tr")[i].getElementsByTagName("td")[7].innerHTML = nowQty;

                        if (percent >= 90) {
                            qtyColor = "bc_green";
                        } else if (percent < 90 && percent > 70) {
                            qtyColor = "bc_yellow2";
                        } else {
                            qtyColor = "bc_red";
                        }
                        tbody.getElementsByTagName("tr")[i].getElementsByTagName("td")[7].className = qtyColor;
                        tbody.getElementsByTagName("tr")[i].getElementsByTagName("td")[8].innerHTML = "<button type='button' class='btn btn-primary' onclick='mhistory.gotoDetail(\"" + json.Data[i].MachineID + "\", \"" + json.Data[i].OrderID + "\")'>詳細</button>";
                    }

                    var tbody_sm = document.getElementById("my_table_sm").getElementsByTagName("tbody")[0];

                    for (i = 0; i < json.Data.length; i++) {
                        var tr = tbody_sm.insertRow(i);
                        for (j = 0; j < 3; j++) {
                            tr.insertCell(j);
                        }

                        tbody_sm.getElementsByTagName("tr")[i].getElementsByTagName("td")[0].innerHTML = json.Data[i].MachineID;
                        tbody_sm.getElementsByTagName("tr")[i].getElementsByTagName("td")[1].innerHTML = json.Data[i].OrderID;
                        tbody_sm.getElementsByTagName("tr")[i].getElementsByTagName("td")[2].innerHTML = "<button type='button' class='btn btn-primary' onclick='mhistory.gotoDetail(\"" + json.Data[i].MachineID + "\", \"" + json.Data[i].OrderID + "\")'>詳細</button>";
                    }

                    mhistory.getPagination(pg, json.Info[0].Total, json.Info[0].Pages, json.Info[0].Num);
                }
            }
        );

        xhr.open("POST", IUDServiceURL, true);
        xhr.setRequestHeader("content-type", "text/xml");
        xhr.send(data);
    },
    getPagination: function (now, total, pages, num) {
        $("#pagination li").remove();
        $("#tipbar").html("");

        var pagination = document.getElementById("pagination");
        var tipbar = document.getElementById("tipbar");

        var min = ((now - 1) * num) + 1;
        var max = (((now * num) >= total) ? total : (now * num));

        pagination.innerHTML += "<li><a href='" + ((parseInt(now) != 1) ? "javascript:setHistoryPage(\"1\")" : "###") + "'" + ((parseInt(now) != 1) ? "" : " style='pointer-events: none; background-color: #9c9c9c;color: #000000;'") + ">&lt;&lt;</a></li>";

        pagination.innerHTML += (((parseInt(now) + 1) > pages && (parseInt(now) - 4) > 0 && parseInt(pages) > 4) ? "<li><a href='javascript:setHistoryPage(\"" + (parseInt(now) - 4) + "\")'>" + (parseInt(now) - 4) + "</a></li>" : "");
        pagination.innerHTML += (((parseInt(now) + 2) > pages && (parseInt(now) - 3) > 0 && parseInt(pages) > 3) ? "<li><a href='javascript:setHistoryPage(\"" + (parseInt(now) - 3) + "\")'>" + (parseInt(now) - 3) + "</a></li>" : "");
        pagination.innerHTML += ((parseInt(now) > 2) ? "<li><a href='javascript:setHistoryPage(\"" + (parseInt(now) - 2) + "\")'>" + (parseInt(now) - 2) + "</a></li>" : "");
        pagination.innerHTML += ((parseInt(now) > 1) ? "<li><a href='javascript:setHistoryPage(\"" + (parseInt(now) - 1) + "\")'>" + (parseInt(now) - 1) + "</a></li>" : "");
        pagination.innerHTML += "<li><a href='###' style='pointer-events: none; background-color: #9c9c9c;color: #000000;'>" + parseInt(now) + "</a></li>";
        pagination.innerHTML += (((parseInt(now) + 1) <= pages) ? "<li><a href='javascript:setHistoryPage(\"" + (parseInt(now) + 1) + "\")'>" + (parseInt(now) + 1) + "</a></li>" : "");
        pagination.innerHTML += (((parseInt(now) + 2) <= pages) ? "<li><a href='javascript:setHistoryPage(\"" + (parseInt(now) + 2) + "\")'>" + (parseInt(now) + 2) + "</a></li>" : "");
        pagination.innerHTML += ((parseInt(now) <= 2 && (parseInt(now) + 3) <= pages && parseInt(pages) > 3) ? "<li><a href='javascript:setHistoryPage(\"" + (parseInt(now) + 3) + "\")'>" + (parseInt(now) + 3) + "</a></li>" : "");
        pagination.innerHTML += ((parseInt(now) <= 1 && (parseInt(now) + 4) <= pages && parseInt(pages) > 4) ? "<li><a href='javascript:setHistoryPage(\"" + (parseInt(now) + 4) + "\")'>" + (parseInt(now) + 4) + "</a></li>" : "");

        pagination.innerHTML += "<li><a href='" + ((parseInt(now) != pages) ? "javascript:setHistoryPage(\"" + pages + "\")" : "###") + "'" + ((parseInt(now) != pages) ? "" : " style='pointer-events: none; background-color: #9c9c9c;color: #000000;'") + ">&gt;&gt;</a></li>";

        tipbar.innerHTML = "｜第" + now + "頁 / 共" + pages + "頁｜顯示第" + min + " - " + max + "筆資料/共" + total + "筆資料｜";
    },
    gotoDetail: function (machineID, orderID) {
        location.href = "HistoryDetail.aspx?m=" + machineID + "&o=" + orderID;
    }
};

var mdetail = {
    getList: function (machineID, orderID, pg) {
        var data = "<?xml version=\"1.0\" encoding=\"utf-8\"?>"
            + "<soap12:Envelope xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\" xmlns:soap12=\"http://www.w3.org/2003/05/soap-envelope\">"
            + "<soap12:Body>"
            + "<GetPageDetail xmlns=\"http://tempuri.org/\">"
            + "<machineID>" + machineID + "</machineID>"
            + "<orderID>" + orderID + "</orderID>"
            + "<pg>" + pg + "</pg>"
            + "</GetPageDetail>"
            + "</soap12:Body>"
            + "</soap12:Envelope>";

        var xhr = new XMLHttpRequest();
        xhr.withCredentials = false;
        xhr.addEventListener(
            "readystatechange",
            function () {
                if (this.readyState === 4) {
                    var parser = new DOMParser();
                    var xmlDoc = parser.parseFromString(this.responseText, "text/xml");
                    var json = JSON.parse(xmlDoc.getElementsByTagName("GetPageDetailResult")[0].innerHTML);

                    var state = ["停機", "全自動", "半自動", "手動", "換模中", "未連線"];
                    var stateColor = ["bc_red", "bc_green", "bc_blue", "bc_tan", "bc_white", "bc_gray"];

                    var lampColor = "";

                    $("#my_table tbody tr").remove();

                    var tbody = document.getElementById("my_table").getElementsByTagName("tbody")[0];

                    for (i = 0; i < json.Data.length; i++) {
                        var tr = tbody.insertRow(i);
                        for (j = 0; j < 11; j++) {
                            tr.insertCell(j);
                        }

                        $("#my_table").find("tr").eq(i + 1).find("td").eq(0).html(unescape(json.Data[i].FactoryName) + "<br>" + unescape(json.Data[i].AreaName));
                        tbody.getElementsByTagName("tr")[i].getElementsByTagName("td")[1].innerHTML = json.Data[i].MachineID;
                        tbody.getElementsByTagName("tr")[i].getElementsByTagName("td")[2].innerHTML = json.Data[i].HoleID;
                        tbody.getElementsByTagName("tr")[i].getElementsByTagName("td")[3].innerHTML = state[json.Data[i].MachineState];
                        tbody.getElementsByTagName("tr")[i].getElementsByTagName("td")[3].className = stateColor[json.Data[i].MachineState];
                        tbody.getElementsByTagName("tr")[i].getElementsByTagName("td")[4].innerHTML = json.Data[i].OrderID;
                        tbody.getElementsByTagName("tr")[i].getElementsByTagName("td")[5].innerHTML = json.Data[i].OrderType;
                        $("#my_table").find("tr").eq(i + 1).find("td").eq(6).html(json.Data[i].MPlileList.replace(/&lt;/g, "<").replace(/&gt;/g, ">"));
                        tbody.getElementsByTagName("tr")[i].getElementsByTagName("td")[7].innerHTML = ((json.Data[i].WeightUnit != "") ? json.Data[i].Weight + json.Data[i].WeightUnit.toUpperCase() : "");
                        tbody.getElementsByTagName("tr")[i].getElementsByTagName("td")[8].innerHTML = json.Data[i].NowQuantity;

                        if (json.Data[i].LampState == 1) {
                            lampColor = "#ed1b24";
                        }
                        else if (json.Data[i].LampState == 2) {
                            lampColor = "#00cb00";
                        }
                        else if (json.Data[i].LampState == 3) {
                            lampColor = "#ffff11";
                        }
                        else if (json.Data[i].LampState == 4) {
                            lampColor = "#ff7800";
                        }

                        tbody.getElementsByTagName("tr")[i].getElementsByTagName("td")[9].innerHTML = "<span class='light_status' style='background: " + lampColor + "'></span>";
                        tbody.getElementsByTagName("tr")[i].getElementsByTagName("td")[10].innerHTML = json.Data[i].RecordDate;
                    }

                    mdetail.getPagination(pg, json.Info[0].Total, json.Info[0].Pages, json.Info[0].Num);
                }
            }
        );

        xhr.open("POST", IUDServiceURL, true);
        xhr.setRequestHeader("content-type", "text/xml");
        xhr.send(data);
    },
    getPagination: function (now, total, pages, num) {
        $("#pagination li").remove();
        $("#tipbar").html("");

        var pagination = document.getElementById("pagination");
        var tipbar = document.getElementById("tipbar");

        var min = ((now - 1) * num) + 1;
        var max = (((now * num) >= total) ? total : (now * num));

        pagination.innerHTML += "<li><a href='" + ((parseInt(now) != 1) ? "javascript:setDetailPage(\"1\")" : "###") + "'" + ((parseInt(now) != 1) ? "" : " style='pointer-events: none; background-color: #9c9c9c;color: #000000;'") + ">&lt;&lt;</a></li>";

        pagination.innerHTML += (((parseInt(now) + 1) > pages && (parseInt(now) - 4) > 0 && parseInt(pages) > 4) ? "<li><a href='javascript:setDetailPage(\"" + (parseInt(now) - 4) + "\")'>" + (parseInt(now) - 4) + "</a></li>" : "");
        pagination.innerHTML += (((parseInt(now) + 2) > pages && (parseInt(now) - 3) > 0 && parseInt(pages) > 3) ? "<li><a href='javascript:setDetailPage(\"" + (parseInt(now) - 3) + "\")'>" + (parseInt(now) - 3) + "</a></li>" : "");
        pagination.innerHTML += ((parseInt(now) > 2) ? "<li><a href='javascript:setDetailPage(\"" + (parseInt(now) - 2) + "\")'>" + (parseInt(now) - 2) + "</a></li>" : "");
        pagination.innerHTML += ((parseInt(now) > 1) ? "<li><a href='javascript:setDetailPage(\"" + (parseInt(now) - 1) + "\")'>" + (parseInt(now) - 1) + "</a></li>" : "");
        pagination.innerHTML += "<li><a href='###' style='pointer-events: none; background-color: #9c9c9c;color: #000000;'>" + parseInt(now) + "</a></li>";
        pagination.innerHTML += (((parseInt(now) + 1) <= pages) ? "<li><a href='javascript:setDetailPage(\"" + (parseInt(now) + 1) + "\")'>" + (parseInt(now) + 1) + "</a></li>" : "");
        pagination.innerHTML += (((parseInt(now) + 2) <= pages) ? "<li><a href='javascript:setDetailPage(\"" + (parseInt(now) + 2) + "\")'>" + (parseInt(now) + 2) + "</a></li>" : "");
        pagination.innerHTML += ((parseInt(now) <= 2 && (parseInt(now) + 3) <= pages && parseInt(pages) > 3) ? "<li><a href='javascript:setDetailPage(\"" + (parseInt(now) + 3) + "\")'>" + (parseInt(now) + 3) + "</a></li>" : "");
        pagination.innerHTML += ((parseInt(now) <= 1 && (parseInt(now) + 4) <= pages && parseInt(pages) > 4) ? "<li><a href='javascript:setDetailPage(\"" + (parseInt(now) + 4) + "\")'>" + (parseInt(now) + 4) + "</a></li>" : "");

        pagination.innerHTML += "<li><a href='" + ((parseInt(now) != pages) ? "javascript:setDetailPage(\"" + pages + "\")" : "###") + "'" + ((parseInt(now) != pages) ? "" : " style='pointer-events: none; background-color: #9c9c9c;color: #000000;'") + ">&gt;&gt;</a></li>";

        tipbar.innerHTML = "｜第" + now + "頁 / 共" + pages + "頁｜顯示第" + min + " - " + max + "筆資料/共" + total + "筆資料｜";
    }
}

var mstatus = {
    getList: function (factoryID, areaID, platformID, machineID, startDate, endDate, orderID, pg) {
        var data = "<?xml version=\"1.0\" encoding=\"utf-8\"?>"
            + "<soap12:Envelope xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\" xmlns:soap12=\"http://www.w3.org/2003/05/soap-envelope\">"
            + "<soap12:Body>"
            + "<GetPageStatus xmlns=\"http://tempuri.org/\">"
            + "<factoryID>" + factoryID + "</factoryID>"
            + "<areaID>" + areaID + "</areaID>"
            + "<platformID>" + platformID + "</platformID>"
            + "<machineID>" + machineID + "</machineID>"
            + "<startDate>" + startDate + "</startDate>"
            + "<endDate>" + endDate + "</endDate>"
            + "<orderID>" + orderID + "</orderID>"
            + "<pg>" + pg + "</pg>"
            + "</GetPageStatus>"
            + "</soap12:Body>"
            + "</soap12:Envelope>";

        var xhr = new XMLHttpRequest();
        xhr.withCredentials = false;
        xhr.addEventListener(
            "readystatechange",
            function () {
                if (this.readyState === 4) {
                    var parser = new DOMParser();
                    var xmlDoc = parser.parseFromString(this.responseText, "text/xml");
                    var json = JSON.parse(xmlDoc.getElementsByTagName("GetPageStatusResult")[0].innerHTML);

                    $("#my_table tbody tr").remove();

                    var tbody = document.getElementById("my_table").getElementsByTagName("tbody")[0];

                    for (i = 0; i < json.Data.length; i++) {
                        var tr = tbody.insertRow(i);
                        for (j = 0; j < 10; j++) {
                            tr.insertCell(j);
                        }

                        tbody.getElementsByTagName("tr")[i].getElementsByTagName("td")[0].innerHTML = unescape(json.Data[i].FactoryName);
                        tbody.getElementsByTagName("tr")[i].getElementsByTagName("td")[1].innerHTML = unescape(json.Data[i].AreaName);
                        tbody.getElementsByTagName("tr")[i].getElementsByTagName("td")[2].innerHTML = json.Data[i].MachineID;
                        tbody.getElementsByTagName("tr")[i].getElementsByTagName("td")[3].innerHTML = json.Data[i].OrderType;
                        tbody.getElementsByTagName("tr")[i].getElementsByTagName("td")[4].innerHTML = json.Data[i].OrderID;
                        tbody.getElementsByTagName("tr")[i].getElementsByTagName("td")[5].innerHTML = json.Data[i].RedCount;
                        tbody.getElementsByTagName("tr")[i].getElementsByTagName("td")[6].innerHTML = json.Data[i].GreenCount;
                        tbody.getElementsByTagName("tr")[i].getElementsByTagName("td")[7].innerHTML = json.Data[i].BlueCount;
                        tbody.getElementsByTagName("tr")[i].getElementsByTagName("td")[8].innerHTML = json.Data[i].OrangeCount;
                        tbody.getElementsByTagName("tr")[i].getElementsByTagName("td")[9].innerHTML = json.Data[i].WhiteCount;

                        mstatus.getPagination(pg, json.Info[0].Total, json.Info[0].Pages, json.Info[0].Num);
                    }
                }
            }
        );

        xhr.open("POST", IUDServiceURL, true);
        xhr.setRequestHeader("content-type", "text/xml");
        xhr.send(data);
    },
    getPagination: function (now, total, pages, num) {
        $("#pagination li").remove();
        $("#tipbar").html("");

        var pagination = document.getElementById("pagination");
        var tipbar = document.getElementById("tipbar");

        var min = ((now - 1) * num) + 1;
        var max = (((now * num) >= total) ? total : (now * num));

        pagination.innerHTML += "<li><a href='" + ((parseInt(now) != 1) ? "javascript:setStatusPage(\"1\")" : "###") + "'" + ((parseInt(now) != 1) ? "" : " style='pointer-events: none; background-color: #9c9c9c;color: #000000;'") + ">&lt;&lt;</a></li>";

        pagination.innerHTML += (((parseInt(now) + 1) > pages && (parseInt(now) - 4) > 0 && parseInt(pages) > 4) ? "<li><a href='javascript:setStatusPage(\"" + (parseInt(now) - 4) + "\")'>" + (parseInt(now) - 4) + "</a></li>" : "");
        pagination.innerHTML += (((parseInt(now) + 2) > pages && (parseInt(now) - 3) > 0 && parseInt(pages) > 3) ? "<li><a href='javascript:setStatusPage(\"" + (parseInt(now) - 3) + "\")'>" + (parseInt(now) - 3) + "</a></li>" : "");
        pagination.innerHTML += ((parseInt(now) > 2) ? "<li><a href='javascript:setStatusPage(\"" + (parseInt(now) - 2) + "\")'>" + (parseInt(now) - 2) + "</a></li>" : "");
        pagination.innerHTML += ((parseInt(now) > 1) ? "<li><a href='javascript:setStatusPage(\"" + (parseInt(now) - 1) + "\")'>" + (parseInt(now) - 1) + "</a></li>" : "");
        pagination.innerHTML += "<li><a href='###' style='pointer-events: none ;background-color: #9c9c9c;color: #000000;'>" + parseInt(now) + "</a></li>";
        pagination.innerHTML += (((parseInt(now) + 1) <= pages) ? "<li><a href='javascript:setStatusPage(\"" + (parseInt(now) + 1) + "\")'>" + (parseInt(now) + 1) + "</a></li>" : "");
        pagination.innerHTML += (((parseInt(now) + 2) <= pages) ? "<li><a href='javascript:setStatusPage(\"" + (parseInt(now) + 2) + "\")'>" + (parseInt(now) + 2) + "</a></li>" : "");
        pagination.innerHTML += ((parseInt(now) <= 2 && (parseInt(now) + 3) <= pages && parseInt(pages) > 3) ? "<li><a href='javascript:setStatusPage(\"" + (parseInt(now) + 3) + "\")'>" + (parseInt(now) + 3) + "</a></li>" : "");
        pagination.innerHTML += ((parseInt(now) <= 1 && (parseInt(now) + 4) <= pages && parseInt(pages) > 4) ? "<li><a href='javascript:setStatusPage(\"" + (parseInt(now) + 4) + "\")'>" + (parseInt(now) + 4) + "</a></li>" : "");

        pagination.innerHTML += "<li><a href='" + ((parseInt(now) != pages) ? "javascript:setStatusPage(\"" + pages + "\")" : "###") + "'" + ((parseInt(now) != pages) ? "" : " style='pointer-events: none; background-color: #9c9c9c;color: #000000;'") + ">&gt;&gt;</a></li>";

        tipbar.innerHTML = "｜第" + now + "頁 / 共" + pages + "頁｜顯示第" + min + " - " + max + "筆資料/共" + total + "筆資料｜";
    }
};

var group = {
    getList: function (check) {
        var data = "<?xml version=\"1.0\" encoding=\"utf-8\"?>"
            + "<soap12:Envelope xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\" xmlns:soap12=\"http://www.w3.org/2003/05/soap-envelope\">"
            + "<soap12:Body>"
            + "<GetAllGroups xmlns=\"http://tempuri.org/\" />"
            + "</soap12:Body>"
            + "</soap12:Envelope>";

        var xhr = new XMLHttpRequest();
        xhr.withCredentials = false;
        xhr.addEventListener(
            "readystatechange",
            function () {
                if (this.readyState === 4) {
                    var parser = new DOMParser();
                    var xmlDoc = parser.parseFromString(this.responseText, "text/xml");
                    var json = JSON.parse(xmlDoc.getElementsByTagName("GetAllGroupsResult")[0].innerHTML);

                    var tbody = document.getElementById("my_table").getElementsByTagName("tbody")[0];

                    for (i = 0; i < json.Data.length; i++) {
                        var tr = tbody.insertRow(i);
                        for (j = 0; j < 3; j++) {
                            tr.insertCell(j);
                        }

                        tbody.getElementsByTagName("tr")[i].getElementsByTagName("td")[0].innerHTML = json.Data[i].CreateDate;
                        tbody.getElementsByTagName("tr")[i].getElementsByTagName("td")[1].innerHTML = json.Data[i].GroupName;
                        tbody.getElementsByTagName("tr")[i].getElementsByTagName("td")[2].innerHTML = ((check == 2) ? "<button type='button' class='btn btn-primary' onclick='group.gotoMod(\"" + json.Data[i].GroupNo + "\")'>設定</button>\n<button type='button' class='btn btn-primary' onclick='group.gotoMember(\"" + json.Data[i].GroupNo + "\")'>成員</button>\n<button type='button' class='btn btn-primary' onclick='group.delGroups(\"" + json.Data[i].GroupNo + "\")'>刪除</button>" : "");
                    }
                }
            }
        );

        xhr.open("POST", IUDServiceURL, true);
        xhr.setRequestHeader("content-type", "text/xml");
        xhr.send(data);
    },
    getFactoryList: function (selectAllow) {
        var data = "<?xml version=\"1.0\" encoding=\"utf-8\"?>"
            + "<soap12:Envelope xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\" xmlns:soap12=\"http://www.w3.org/2003/05/soap-envelope\">"
            + "<soap12:Body>"
            + "<GetAllFactory xmlns=\"http://tempuri.org/\" />"
            + "</soap12:Body>"
            + "</soap12:Envelope>";

        var xhr = new XMLHttpRequest();
        xhr.withCredentials = false;
        xhr.addEventListener(
            "readystatechange",
            function () {
                if (this.readyState === 4) {
                    var parser = new DOMParser();
                    var xmlDoc = parser.parseFromString(this.responseText, "text/xml");
                    var json = JSON.parse(xmlDoc.getElementsByTagName("GetAllFactoryResult")[0].innerHTML);

                    var allowList = selectAllow.split(",");

                    for (i = 0; i < json.Data.length; i++) {
                        $("#allowAuth").append($("<option" + ((allowList.indexOf(json.Data[i].FactoryID) != -1) ? " selected" : "") + "></option>").attr("value", json.Data[i].FactoryID).text(unescape(json.Data[i].FactoryName)));
                    }
                }
            }
        );

        xhr.open("POST", IUDServiceURL, false);
        xhr.setRequestHeader("content-type", "text/xml");
        xhr.send(data);
    },
    gotoList: function () {
        location.href = "GroupList.aspx";
    },
    gotoAdd: function () {
        location.href = "GroupAdd.aspx";
    },
    gotoMod: function (GroupNo) {
        location.href = "GroupMod.aspx?no=" + GroupNo;
    },
    gotoSet: function (GroupNo) {
        location.href = "GroupSet.aspx?no=" + GroupNo;
    },
    gotoMember: function (GroupNo) {
        location.href = "GroupMember.aspx?no=" + GroupNo;
    },
    getGroups: function (groupNo) {
        var data = "<?xml version=\"1.0\" encoding=\"utf-8\"?>"
            + "<soap12:Envelope xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\" xmlns:soap12=\"http://www.w3.org/2003/05/soap-envelope\">"
            + "<soap12:Body>"
            + "<GetGroupsByNo xmlns=\"http://tempuri.org/\">"
            + "<groupNo>" + groupNo + "</groupNo>"
            + "</GetGroupsByNo>"
            + "</soap12:Body>"
            + "</soap12:Envelope>";

        var xhr = new XMLHttpRequest();
        xhr.withCredentials = false;
        xhr.addEventListener(
            "readystatechange",
            function () {
                if (this.readyState === 4) {
                    var parser = new DOMParser();
                    var xmlDoc = parser.parseFromString(this.responseText, "text/xml");
                    var json = JSON.parse(xmlDoc.getElementsByTagName("GetGroupsByNoResult")[0].innerHTML);

                    $("#groupNo").val(json.Data[0].GroupNo);
                    $("#groupName").val(json.Data[0].GroupName);
                    $("input[name='detailAuth'][value='" + json.Data[0].DetailAuth + "']").attr("checked", true);
                    $("input[name='infoAuth'][value='" + json.Data[0].InfoAuth + "']").attr("checked", true);
                    $("input[name='newsAuth'][value='" + json.Data[0].NewsAuth + "']").attr("checked", true);
                    $("input[name='historyAuth'][value='" + json.Data[0].HistoryAuth + "']").attr("checked", true);
                    $("input[name='statusAuth'][value='" + json.Data[0].StatusAuth + "']").attr("checked", true);
                    $("input[name='factoryAuth'][value='" + json.Data[0].FactoryAuth + "']").attr("checked", true);
                    $("input[name='areaAuth'][value='" + json.Data[0].AreaAuth + "']").attr("checked", true);
                    $("input[name='platformAuth'][value='" + json.Data[0].PlatformAuth + "']").attr("checked", true);
                    $("input[name='groupAuth'][value='" + json.Data[0].GroupAuth + "']").attr("checked", true);
                    $("#modDate").html(json.Data[0].Updater + "\n" + json.Data[0].AlterDate);

                    group.getFactoryList(json.Data[0].AllowAuth);

                    if (json.Data[0].InfoAuth == "2") {
                        $("#allowArea").attr("style", "");
                        $("#allowAuth").chosen();
                    } else {
                        $("#allowArea").attr("style", "display: none;");
                    }
                }
            }
        );

        xhr.open("POST", IUDServiceURL, false);
        xhr.setRequestHeader("content-type", "text/xml");
        xhr.send(data);
    },
    getPermission: function (groupNo) {
        var data = "<?xml version=\"1.0\" encoding=\"utf-8\"?>"
            + "<soap12:Envelope xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\" xmlns:soap12=\"http://www.w3.org/2003/05/soap-envelope\">"
            + "<soap12:Body>"
            + "<GetAllPermission xmlns=\"http://tempuri.org/\">"
            + "<groupNo>" + groupNo + "</groupNo>"
            + "</GetAllPermission>"
            + "</soap12:Body>"
            + "</soap12:Envelope>";

        var xhr = new XMLHttpRequest();
        xhr.withCredentials = false;
        xhr.addEventListener(
            "readystatechange",
            function () {
                if (this.readyState === 4) {
                    var parser = new DOMParser();
                    var xmlDoc = parser.parseFromString(this.responseText, "text/xml");
                    var json = JSON.parse(xmlDoc.getElementsByTagName("GetAllPermissionResult")[0].innerHTML);

                    var tbody = document.getElementById("my_table").getElementsByTagName("tbody")[0];

                    for (i = 0; i < json.Data.length; i++) {
                        var tr = tbody.insertRow(i);
                        for (j = 0; j < 3; j++) {
                            tr.insertCell(j);
                        }

                        tbody.getElementsByTagName("tr")[i].getElementsByTagName("td")[0].innerHTML = json.Data[i].CreateDate;
                        tbody.getElementsByTagName("tr")[i].getElementsByTagName("td")[1].innerHTML = json.Data[i].Username;
                        tbody.getElementsByTagName("tr")[i].getElementsByTagName("td")[2].innerHTML = "<button type='button' class='btn btn-primary' onclick='group.delPermission(\"" + json.Data[i].PermissionNo + "\")'>刪除</button>";
                    }
                }
            }
        );

        xhr.open("POST", IUDServiceURL, true);
        xhr.setRequestHeader("content-type", "text/xml");
        xhr.send(data);
    },
    addGroups: function (groupName, detailAuth, infoAuth, allowAuth, newsAuth, historyAuth, statusAuth, factoryAuth, areaAuth, platformAuth, groupAuth, founder) {
        var data = "<?xml version=\"1.0\" encoding=\"utf-8\"?>"
            + "<soap12:Envelope xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\" xmlns:soap12=\"http://www.w3.org/2003/05/soap-envelope\">"
            + "<soap12:Body>"
            + "<AddGroups xmlns=\"http://tempuri.org/\">"
            + "<groupName>" + groupName + "</groupName>"
            + "<detailAuth>" + detailAuth + "</detailAuth>"
            + "<infoAuth>" + infoAuth + "</infoAuth>"
            + "<allowAuth>" + allowAuth + "</allowAuth>"
            + "<newsAuth>" + newsAuth + "</newsAuth>"
            + "<historyAuth>" + historyAuth + "</historyAuth>"
            + "<statusAuth>" + statusAuth + "</statusAuth>"
            + "<factoryAuth>" + factoryAuth + "</factoryAuth>"
            + "<areaAuth>" + areaAuth + "</areaAuth>"
            + "<platformAuth>" + platformAuth + "</platformAuth>"
            + "<groupAuth>" + groupAuth + "</groupAuth>"
            + "<founder>" + founder + "</founder>"
            + "</AddGroups>"
            + "</soap12:Body>"
            + "</soap12:Envelope>";

        var xhr = new XMLHttpRequest();
        xhr.withCredentials = false;
        xhr.addEventListener(
            "readystatechange",
            function () {
                if (this.readyState === 4) {
                    var parser = new DOMParser();
                    var xmlDoc = parser.parseFromString(this.responseText, "text/xml");
                    var json = JSON.parse(xmlDoc.getElementsByTagName("AddGroupsResult")[0].innerHTML);

                    alert(json.Data[0].Result + "!!!");
                    if (json.Data[0].Result == "新增成功") {
                        location.href = "GroupList.aspx";
                    }
                }
            }
        );

        xhr.open("POST", IUDServiceURL, false);
        xhr.setRequestHeader("content-type", "text/xml");
        xhr.send(data);
    },
    modGroups: function (groupNo, groupName, detailAuth, infoAuth, allowAuth, newsAuth, historyAuth, statusAuth, factoryAuth, areaAuth, platformAuth, groupAuth, updater) {
        var data = "<?xml version=\"1.0\" encoding=\"utf-8\"?>"
            + "<soap12:Envelope xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\" xmlns:soap12=\"http://www.w3.org/2003/05/soap-envelope\">"
            + "<soap12:Body>"
            + "<ModGroups xmlns=\"http://tempuri.org/\">"
            + "<groupNo>" + groupNo + "</groupNo>"
            + "<groupName>" + groupName + "</groupName>"
            + "<detailAuth>" + detailAuth + "</detailAuth>"
            + "<infoAuth>" + infoAuth + "</infoAuth>"
            + "<allowAuth>" + allowAuth + "</allowAuth>"
            + "<newsAuth>" + newsAuth + "</newsAuth>"
            + "<historyAuth>" + historyAuth + "</historyAuth>"
            + "<statusAuth>" + statusAuth + "</statusAuth>"
            + "<factoryAuth>" + factoryAuth + "</factoryAuth>"
            + "<areaAuth>" + areaAuth + "</areaAuth>"
            + "<platformAuth>" + platformAuth + "</platformAuth>"
            + "<groupAuth>" + groupAuth + "</groupAuth>"
            + "<updater>" + updater + "</updater>"
            + "</ModGroups>"
            + "</soap12:Body>"
            + "</soap12:Envelope>";

        var xhr = new XMLHttpRequest();
        xhr.withCredentials = false;
        xhr.addEventListener(
            "readystatechange",
            function () {
                if (this.readyState === 4) {
                    var parser = new DOMParser();
                    var xmlDoc = parser.parseFromString(this.responseText, "text/xml");
                    var json = JSON.parse(xmlDoc.getElementsByTagName("ModGroupsResult")[0].innerHTML);

                    alert(json.Data[0].Result + "!!!");
                    if (json.Data[0].Result == "修改成功") {
                        location.href = "GroupList.aspx";
                    }
                }
            }
        );

        xhr.open("POST", IUDServiceURL, false);
        xhr.setRequestHeader("content-type", "text/xml");
        xhr.send(data);
    },
    delGroups: function (groupNo) {
        if (confirm("確定刪除此組別?")) {
            var data = "<?xml version=\"1.0\" encoding=\"utf-8\"?>"
                + "<soap12:Envelope xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\" xmlns:soap12=\"http://www.w3.org/2003/05/soap-envelope\">"
                + "<soap12:Body>"
                + "<DelGroups xmlns=\"http://tempuri.org/\">"
                + "<groupNo>" + groupNo + "</groupNo>"
                + "</DelGroups>"
                + "</soap12:Body>"
                + "</soap12:Envelope>";

            var xhr = new XMLHttpRequest();
            xhr.withCredentials = false;

            xhr.open("POST", IUDServiceURL, false);
            xhr.setRequestHeader("content-type", "text/xml");
            xhr.send(data);

            alert("刪除成功!!!");
            window.location.reload();
        }
    },
    addPermission: function (groupNo, username, founder) {
        var data = "<?xml version=\"1.0\" encoding=\"utf-8\"?>"
            + "<soap12:Envelope xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\" xmlns:soap12=\"http://www.w3.org/2003/05/soap-envelope\">"
            + "<soap12:Body>"
            + "<AddPermission xmlns=\"http://tempuri.org/\">"
            + "<groupNo>" + groupNo + "</groupNo>"
            + "<username>" + username + "</username>"
            + "<founder>" + founder + "</founder>"
            + "</AddPermission>"
            + "</soap12:Body>"
            + "</soap12:Envelope>";

        var xhr = new XMLHttpRequest();
        xhr.withCredentials = false;
        xhr.addEventListener(
            "readystatechange",
            function () {
                if (this.readyState === 4) {
                    var parser = new DOMParser();
                    var xmlDoc = parser.parseFromString(this.responseText, "text/xml");
                    var json = JSON.parse(xmlDoc.getElementsByTagName("AddPermissionResult")[0].innerHTML);

                    alert(json.Data[0].Result + "!!!");
                    if (json.Data[0].Result == "新增成功") {
                        location.href = "GroupMember.aspx?no=" + groupNo;
                    }
                }
            }
        );

        xhr.open("POST", IUDServiceURL, false);
        xhr.setRequestHeader("content-type", "text/xml");
        xhr.send(data);
    },
    delPermission: function (permissionNo) {
        if (confirm("確定刪除此帳號?")) {
            var data = "<?xml version=\"1.0\" encoding=\"utf-8\"?>"
                + "<soap12:Envelope xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\" xmlns:soap12=\"http://www.w3.org/2003/05/soap-envelope\">"
                + "<soap12:Body>"
                + "<DelPermission xmlns=\"http://tempuri.org/\">"
                + "<permissionNo>" + permissionNo + "</permissionNo>"
                + "</DelPermission>"
                + "</soap12:Body>"
                + "</soap12:Envelope>";

            var xhr = new XMLHttpRequest();
            xhr.withCredentials = false;

            xhr.open("POST", IUDServiceURL, false);
            xhr.setRequestHeader("content-type", "text/xml");
            xhr.send(data);

            alert("刪除成功!!!");
            window.location.reload();
        }
    }
};

var ratio = {
    getRatioList: function (ratioSel) {
        ratioSel = "";
        var data = "<?xml version=\"1.0\" encoding=\"utf-8\"?>"
            + "<soap12:Envelope xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\" xmlns:soap12=\"http://www.w3.org/2003/05/soap-envelope\">"
            + "<soap12:Body>"
            + "<GetAllRatio xmlns=\"http://tempuri.org/\" />"
            + "</soap12:Body>"
            + "</soap12:Envelope>";

        var xhr = new XMLHttpRequest();
        xhr.withCredentials = false;
        xhr.addEventListener(
            "readystatechange",
            function () {
                if (this.readyState === 4) {
                    var parser = new DOMParser();
                    var xmlDoc = parser.parseFromString(this.responseText, "text/xml");
                    var json = JSON.parse(xmlDoc.getElementsByTagName("GetAllRatioResult")[0].innerHTML);

                    $("#ratio").append($("<option></option>").attr("value", "").text("無混料"));
                    for (i = 0; i < json.Data.length; i++) {
                        $("#ratio").append($("<option></option>").attr("value", json.Data[i].Option).text(json.Data[i].Option));
                    }

                    if (ratioSel != "") {
                        $("#ratio").val(ratioSel);
                    } else {
                        $("#ratio").val($("#ratio option:first").val());
                    }
                }
            }
        );

        xhr.open("POST", IUDServiceURL, false);
        xhr.setRequestHeader("content-type", "text/xml");
        xhr.send(data);
    }
};