<%@ WebHandler Language="C#" Class="Handler_updateWeightData" %>

using System;
using System.Data;
using System.Web;
using System.Data.SqlClient;

public class Handler_updateWeightData : IHttpHandler {

    readonly string sqlconn = "Data Source=172.17.3.106;Database=EMT_Sub;Uid=emtsub;Pwd=emtsubdbuser!;";

    public void ProcessRequest(HttpContext context)
    {
        //取得傳入的參數
        string sGoodsID= context.Request.Form["GoodsID"];
        string sGoodsCode = context.Request.Form["GoodsCode"];
        string sGoodsData= context.Request.Form["GoodsData"];
        string sUnit = context.Request.Form["Unit"];
        string serrMsg = string.Empty;

        if(sGoodsID != "")
        {
            using (SqlConnection MyConnection = new SqlConnection(sqlconn))
            {
                var CommandString = @"update [EMT_Sub].[dbo].[MachineGoods1] Set GoodsData = @GoodsData where GoodsID =@GoodsID And GoodsCode = @GoodsCode; ";
                using (SqlCommand command = new SqlCommand(CommandString, MyConnection))
                {
                    MyConnection.Open();
                    command.Parameters.AddWithValue("@GoodsData", sGoodsData);
                    command.Parameters.AddWithValue("@GoodsID", sGoodsID);
                    command.Parameters.AddWithValue("@GoodsCode", sGoodsCode);
                    var effectedRow = command.ExecuteNonQuery();
                }

            }
        }

        //建立要回傳的物件
        objPerson objResult = new objPerson() {errMsg = serrMsg };

        //將objResult物件序列化成JSON格式再回傳
        context.Response.ContentType = "application/json";
        context.Response.Charset = "utf-8";
        context.Response.Write(new System.Web.Script.Serialization.JavaScriptSerializer().Serialize(objResult));
    }

    private class objPerson
    {
        public string errMsg { get; set; }
    }

    public bool IsReusable
    {
        get { return false; }
    }

}