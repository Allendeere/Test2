
//設定詳細資料的底色
function setBGColor(target , color_name)
{
    $(document).ready(function() 
    {
        $(target).toggleClass(color_name);
    });
}

//設定平面圖的成型機位置
function setPosition(target , top , left)
{
    $(document).ready(function() 
    {
        $(target).css({"top": top+"px", "left": left+"px"});
    });
}

//設定平面圖的成型機狀態 (1.綠框 border_green  2.無框 border_white)
function setStatusBorder(target , border_name)
{
    $(document).ready(function() 
    {
        $(target).toggleClass(border_name);
    });
}