using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

public partial class _Default : System.Web.UI.Page
{
    public int DetailAuth = 2;
    public int InfoAuth = 2;
    public int NewsAuth = 2;
    public int HistoryAuth = 2;
    public int StatusAuth = 2;
    public int FactoryAuth = 2;
    public int AreaAuth = 2;
    public int PlatformAuth = 2;
    public int RIOAuth = 2;
    public int GroupAuth = 2;
    public int ByPassAuth = 2;
    public int WeightAuth = 2;

    protected void Page_Load(object sender, EventArgs e)
    {
        if (Session["user"] == null || Session["user"].ToString() == "")
        {
            Session["username"] = "guest";
            Session["user"] = "訪客";
        }

        ////string strCon = @"Data Source=172.17.3.106;Database=PMI;Uid=pmi;Pwd=pmidb!;";
        //string strCon = @"Data Source=.\MSSQLSERVER_2022;Database=PMI;Integrated Security=True;";
        //SqlConnection conn = new SqlConnection(strCon);
        //conn.Open();
        //string username = Session["username"].ToString();
        //string sqlstr = string.Format("select GroupPermission.Username, Groups.GroupName, Groups.DetailAuth, Groups.InfoAuth, Groups.NewsAuth, Groups.HistoryAuth, Groups.StatusAuth, Groups.FactoryAuth, Groups.AreaAuth, Groups.PlatformAuth, Groups.GroupAuth, Groups.ByPassAuth, Groups.WeightAuth from GroupPermission inner join Groups on GroupPermission.GroupNo = Groups.GroupNo where GroupPermission.Username = '{0}'", username);

        //SqlCommand cmd = new SqlCommand(sqlstr, conn);
        //SqlDataReader dr = cmd.ExecuteReader();
        //if (dr.Read())
        //{
        //    DetailAuth = Convert.ToInt32(dr["DetailAuth"].ToString());
        //    InfoAuth = Convert.ToInt32(dr["InfoAuth"].ToString());
        //    NewsAuth = Convert.ToInt32(dr["NewsAuth"].ToString());
        //    HistoryAuth = Convert.ToInt32(dr["HistoryAuth"].ToString());
        //    StatusAuth = Convert.ToInt32(dr["StatusAuth"].ToString());
        //    FactoryAuth = Convert.ToInt32(dr["FactoryAuth"].ToString());
        //    AreaAuth = Convert.ToInt32(dr["AreaAuth"].ToString());
        //    PlatformAuth = Convert.ToInt32(dr["PlatformAuth"].ToString());
        //    GroupAuth = Convert.ToInt32(dr["GroupAuth"].ToString());
        //    ByPassAuth = Convert.ToInt32(dr["ByPassAuth"].ToString());
        //    WeightAuth = Convert.ToInt32(dr["WeightAuth"].ToString());
        //}

        //cmd.Cancel();
        //dr.Close();
        //conn.Close();
        //conn.Dispose();

    }
}