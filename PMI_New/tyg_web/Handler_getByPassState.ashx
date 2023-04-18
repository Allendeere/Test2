<%@ WebHandler Language="C#" Class="Handler_getByPassState" %>

using System;
using System.Data;
using System.Web;
using System.Collections.Generic;
using System.Data.SqlClient;

public class Handler_getByPassState : IHttpHandler {

    public void ProcessRequest(HttpContext context)
    {
        //string sqlconn = "Data Source=172.17.3.106;Database=PMI;Uid=pmi;Pwd=pmidb!;";
        string sqlconn = @"Data Source=.\MSSQLSERVER_2022;Database=PMI;Integrated Security=True;";
        //取得傳入的參數
        //string sUserID = context.Request.QueryString["UserID"];
        string serrMsg = string.Empty;
        Dictionary<string, string> sdic = new Dictionary<string, string>();

        using (SqlConnection MyConnection = new SqlConnection(sqlconn))
        {
            var CommandString = @"Select Distinct MachineID FROM [PMI].[dbo].[Machine] ";
            DataTable ds = new DataTable();
            using (SqlCommand command = new SqlCommand(CommandString, MyConnection))
            {
                MyConnection.Open();
                using (SqlDataAdapter myAdapter = new SqlDataAdapter(command))
                {
                    myAdapter.Fill(ds);
                }
            }

            foreach (DataRow row in ds.Rows)
            {
                CommandString = @"SELECT TOP (1) * FROM [PMI].[dbo].[ByPassMachineRecord] where MachineID = @MachineID  Order by PassRecordNo desc";
                DataTable dt = new DataTable();
                using (SqlCommand command = new SqlCommand(CommandString, MyConnection))
                {
                    var MachineID = row["MachineID"].ToString().Trim();
                    command.Parameters.AddWithValue("@MachineID", MachineID);

                    using (SqlDataAdapter myAdapter = new SqlDataAdapter(command))
                    {
                        myAdapter.Fill(dt);
                        if (dt.Rows.Count > 0)
                        {
                            foreach (DataRow rowA in dt.Rows)
                            {
                                var ByPassState = rowA["ByPassState"].ToString().Trim();
                                sdic.Add(MachineID, ByPassState);
                            }
                        }
                    }
                }
            }

        }

        //建立要回傳的物件
        objPerson objResult = new objPerson() { Dic = sdic ,errMsg = serrMsg };

        //將objResult物件序列化成JSON格式再回傳
        context.Response.ContentType = "application/json";
        context.Response.Charset = "utf-8";
        context.Response.Write(new System.Web.Script.Serialization.JavaScriptSerializer().Serialize(objResult));
    }

    private class objPerson
    {
        public Dictionary<string, string> Dic { get; set; }
        public string errMsg { get; set; }
    }

    public bool IsReusable
    {
        get { return false; }
    }

}