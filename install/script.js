// copy leads
define(['jquery', 'underscore', 'twigjs', 'lib/components/base/modal'], function($, _, Twig, Modal) {
    var CustomWidget_WidgetCopyLeads = function() {
        var self = this,
            system = self.system,
            url_link_t = "https://integratorgroup.k-on.ru/andreev/copy_leads/templates.php";

        /* ######################################################################### */

        this.callbacks = {
            settings: function() {
                // Блок первичных настроек и авторизации
                var _settings = self.get_settings();
                var data = '<div id="settings_WidgetCopyLeads">Загружается...</div>';
                $('[id="settings_WidgetCopyLeads"]').remove();
                $('#' + _settings.widget_code + '_custom_content').parent().after(data);
                var _secret = $('p.js-secret').attr('title');
                var _data = {};
                _data["domain"] = document.domain;
                _data["settings"] = _settings;
                _data["secret"] = _secret;
                _data["method"] = "settings";
                $.ajax({
                    url: url_link_t,
                    method: 'post',
                    data: _data,
                    dataType: 'html',
                    success: function(data) {
                        $('[id="settings_WidgetCopyLeads"]').remove();
                        $('#' + _settings.widget_code + '_custom_content').parent().after(data);
                    }
                });
            },
            init: function() {
                return true;
            },
            bind_actions: function() {
                return true;
            },
            render: function() {
                return true;
            },
            contacts: {
                selected: function () {}
            },
            companies: {
                selected: function () {},
            },
            leads: {
                selected: function () {}
            },
            tasks: {
                selected: function() {}
            },
            destroy: function() {},
            onSave: function() {
                var _settings = self.get_settings();
                var data = '<div id="settings_WidgetCopyLeads">Загружается...</div>';
                $('[id="settings_WidgetCopyLeads"]').remove();
                $('#' + _settings.widget_code + '_custom_content').parent().after(data);
                var _secret = $('p.js-secret').attr('title');
                var _data = {};
                _data["domain"] = document.domain;
                _data["settings"] = _settings;
                _data["settings"]["active"] = "Y";
                _data["secret"] = _secret;
                _data["method"] = "settings";
                $.ajax({
                    url: url_link_t,
                    method: 'post',
                    data: _data,
                    dataType: 'html',
                    success: function(data) {
                        $('[id="settings_WidgetCopyLeads"]').remove();
                        $('#' + _settings.widget_code + '_custom_content').parent().after(data);
                    }
                });

                return true;
            },
            advancedSettings: function() {}
        };
        return this;
    };
    return CustomWidget_WidgetCopyLeads;
});

// https://integratorgroup.k-on.ru/andreev/copypaste/token_get.php