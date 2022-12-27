<style id="WidgetCopyLeadsModal_Style">
#WidgetCopyLeads_Modal {
  width: 298px; height: 218px;
  padding: 18px 9px;
  border-radius: 4px;
  background: #fafafa;
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  margin: auto;
  display: none;
  opacity: 0;
  z-index: 10041;
  /* text-align: center; */
}
#WidgetCopyLeads_Modal #WidgetCopyLeads_Modal__close {
  width: 21px; height: 21px;
  position: absolute;
  font-size: 29px;
  top: 1px; right: 11px;
  cursor: pointer;
  display: block;
  
}
#WidgetCopyLeads_Overlay {
  z-index: 10040;
  position: fixed;
  background: rgba(0,0,0,.7);
  width: 100%; height: 100%;
  top: 0; left: 0;
  cursor: pointer;
  display: none;
}
#WidgetCopyLeads_Modal_Content{
  overflow: auto;
  height: 100%;
}
</style>
<script id="WidgetCopyLeadsModal_Script">
    function ShowMessage_WidgetCopyLeads(msg, width = 300, height= 70, align = "center"){
        WriteModal_WidgetCopyLeads();
        $('#WidgetCopyLeads_Modal').width(width + 'px');
        $('#WidgetCopyLeads_Modal').height(height + 'px');
        
        msg = '<br>' + msg + '<br>'+
        '<a href="#" onclick="$(\'#WidgetCopyLeads_Modal\').remove(); $(\'#WidgetCopyLeads_Overlay\').remove(); return false;" style="text-decoration: none;font-weight:bold;">OK</a>';
        msg = '<div align="'+align+'">' + msg + '</div>';
        $('#WidgetCopyLeads_Modal_Content_Body').html(msg);
    }

    function ShowDialog_WidgetCopyLeads(msg, function_ok){
        WriteModal_WidgetCopyLeads();
        $('#WidgetCopyLeads_Modal').width(300 + 'px');
        $('#WidgetCopyLeads_Modal').height(70 + 'px');
        
        msg = '<br>' + msg + '<br>'+
        '<a href="#" onclick="$(\'#WidgetCopyLeads_Modal\').remove(); $(\'#WidgetCopyLeads_Overlay\').remove(); return false;" style="text-decoration: none;font-weight:bold;">Отменить</a>&nbsp;&nbsp;&nbsp;&nbsp;'+
        '<a href="#" onclick="'+function_ok+' $(\'#WidgetCopyLeads_Modal\').remove(); $(\'#WidgetCopyLeads_Overlay\').remove(); return false;" style="text-decoration: none;font-weight:bold;">OK</a>';
        msg = '<div align="center">' + msg + '</div>';
        $('#WidgetCopyLeads_Modal_Content_Body').html(msg);
    }

    function WriteModal_WidgetCopyLeads(){
        $('#WidgetCopyLeads_Modal').remove();
        $('#WidgetCopyLeads_Overlay').remove();
        var html = '<div id="WidgetCopyLeads_Modal">\
        <div id="WidgetCopyLeads_Modal_Content"><div id="WidgetCopyLeads_Modal_Content_Body">Загрузка...</div></div>\
        <span id="WidgetCopyLeads_Modal__close" class="close" onclick="return false;">ₓ</span>\
        </div>\
        <div id="WidgetCopyLeads_Overlay"></div>';
        $('body').append(html);
        $('#WidgetCopyLeads_Modal__close, #WidgetCopyLeads_Overlay').on('click', function() {
            $(this).css('display', 'none');
            $('#WidgetCopyLeads_Overlay').fadeOut(296);
            $('#WidgetCopyLeads_Modal').remove();
            $('#WidgetCopyLeads_Overlay').remove();
        });

        $('#WidgetCopyLeads_Overlay').fadeIn(296,	function(){
            $('#WidgetCopyLeads_Modal, #WidgetCopyLeads_Overlay')
                .css('display', 'block')
                .animate({opacity: 1}, 198);

        });
    }
    
    var Url_WidgetCopyLeads = '<?php echo WEB_WIDGET_URL; ?>templates.php';
    $(document).ready(function() {});

    $(document).on('page:changed', function () {
        // сработает, когда пользователь перейдет на другую страницу
        if (AMOCRM.isCard()) {}
    });
</script>