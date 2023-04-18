<%@ WebHandler Language="C#" Class="Handler_getWeightSetting" %>

using System;
using System.Data;
using System.Web;
using System.Collections.Generic;
using System.Data.SqlClient;

public class Handler_getWeightSetting : IHttpHandler {

    readonly string sqlconn = "Data Source=172.17.3.106;Database=EMT_Sub;Uid=emtsub;Pwd=emtsubdbuser!;";

    public class RowData_List
    {
        public int count = 0;
        public List<RowData> items = new List<RowData> { };
        public string msg = "";
    }

    public class RowData
    {
        public string oGoodsID = "";
        public string oGoodsCode = "";
        public string oGoodsData = "";
        public string oUnit = "";
    }

    public void ProcessRequest(HttpContext context)
    {
        string serrMsg = string.Empty;
        RowData_List jList = new RowData_List();
        RowData jReturn = new RowData();

        using (SqlConnection MyConnection = new SqlConnection(sqlconn))
        {
            var CommandString = @"SELECT [GoodsID],[GoodsCode],[GoodsData],[Unit] FROM [EMT_Sub].[dbo].[MachineGoods1] ";
            DataTable ds = new DataTable();
            using (SqlCommand command = new SqlCommand(CommandString, MyConnection))
            {
                MyConnection.Open();
                using (SqlDataAdapter myAdapter = new SqlDataAdapter(command))
                {
                    myAdapter.Fill(ds);
                }
            }

            if(ds.Rows.Count > 0)
            {
                foreach (DataRow row in ds.Rows)
                {
                        jReturn = new RowData();
                        jReturn.oGoodsID = row["GoodsID"].ToString();
                        jReturn.oGoodsCode = row["GoodsCode"].ToString();
                        jReturn.oGoodsData = row["GoodsData"].ToString();
                        jReturn.oUnit = row["Unit"].ToString();
                        jList.items.Add(jReturn);
                }
            }
        }

            //建立要回傳的物件
            objPerson objResult = new objPerson() { tList = jList, errMsg = serrMsg };

            //將objResult物件序列化成JSON格式再回傳
            context.Response.ContentType = "application/json";
            context.Response.Charset = "utf-8";
            context.Response.Write(new System.Web.Script.Serialization.JavaScriptSerializer().Serialize(objResult));
    }

        private class objPerson
        {
            public RowData_List tList { get; set; }
            public string errMsg { get; set; }
        }

        public bool IsReusable
        {
            get { return false; }
        }

}