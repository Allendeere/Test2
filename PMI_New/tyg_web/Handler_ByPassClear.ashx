<%@ WebHandler Language="C#" Class="Handler_ByPassClear" %>

using System;
using System.Data;
using System.Web;
using System.Data.SqlClient;

public class Handler_ByPassClear : IHttpHandler {

    public void ProcessRequest(HttpContext context)
    {
        //string sqlconn = "Data Source=172.17.3.106;Database=PMI;Uid=pmi;Pwd=pmidb!;";
                string sqlconn = @"Data Source=.\MSSQLSERVER_2022;Database=PMI;Integrated Security=True;";

        //取得傳入的參數
        string sMachine = context.Request.QueryString["Machine"];
        string sOrder = context.Request.QueryString["OrderID"];
        string serrMsg = string.Empty;
        string FactoryID = string.Empty;
        string AreaID = string.Empty;
        string PlatformID = string.Empty;
        bool AddByPassFlag = false;
        int OldByPassState = 2;

        using (SqlConnection MyConnection = new SqlConnection(sqlconn))
        {
            var CommandString = @"Select FactoryID, AreaID, PlatformID from Machine where  MachineID = @MachineID";
            DataTable ds = new DataTable();
            using (SqlCommand command = new SqlCommand(CommandString, MyConnection))
            {
                command.Parameters.AddWithValue("@MachineID", sMachine);
                MyConnection.Open();
                using (SqlDataAdapter myAdapter = new SqlDataAdapter(command))
                {
                    myAdapter.Fill(ds);
                    foreach (DataRow row in ds.Rows)
                    {
                        FactoryID = row["FactoryID"].ToString();
                        AreaID = row["AreaID"].ToString();
                        PlatformID = row["PlatformID"].ToString();
                    }
                }
            }

            CommandString = @"Select TOP (1) * from ByPassMachineRecord where  MachineID = @MachineID and OrderID = @OrderID and ByPassState = 1  Order by PassRecordNo desc";
            ds = new DataTable();
            using (SqlCommand command = new SqlCommand(CommandString, MyConnection))
            {
                command.Parameters.AddWithValue("@MachineID", sMachine);
                command.Parameters.AddWithValue("@OrderID", sOrder);
                using (SqlDataAdapter myAdapter = new SqlDataAdapter(command))
                {
                    myAdapter.Fill(ds);
                    if (ds.Rows.Count == 1)
                        AddByPassFlag = true;
                }
            }

            if (AddByPassFlag)
            {
                CommandString = @"insert ByPassMachineRecord (RecordDate, FactoryID, AreaID, PlatformID, MachineID, ByPassState, USERID, Description, OrderID) values (@RecordDate, @FactoryID, @AreaID, @PlatformID, @MachineID, @ByPassState, @USERID, @Description, @OrderID);";
                using (SqlCommand command = new SqlCommand(CommandString, MyConnection))
                {
                    var Description = "換工單自動關閉";
                    command.Parameters.AddWithValue("@RecordDate", DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss"));
                    command.Parameters.AddWithValue("@FactoryID", FactoryID);
                    command.Parameters.AddWithValue("@AreaID", AreaID);
                    command.Parameters.AddWithValue("@PlatformID", PlatformID);
                    command.Parameters.AddWithValue("@MachineID", sMachine);
                    command.Parameters.AddWithValue("@ByPassState", "0");
                    command.Parameters.AddWithValue("@USERID", "System");
                    command.Parameters.AddWithValue("@Description", Description);
                    command.Parameters.AddWithValue("@OrderID", sOrder);

                    var effectedRow = command.ExecuteNonQuery();
                    if (effectedRow == 0)
                        serrMsg = "錯誤：新增失敗!請聯繫資訊人員";
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