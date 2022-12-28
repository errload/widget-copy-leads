// copy leads
define(['jquery', 'underscore', 'twigjs', 'lib/components/base/modal'], function($, _, Twig, Modal) {
    var CustomWidget_WidgetCopyLeads = function() {
        var self = this,
            system = self.system,
            url_link_t = "https://integratorgroup.k-on.ru/andreev/copy_leads/templates.php";

        /* ######################################################################### */

        // функция добавления пункта меню
        const addItemMenu = function(mutationsList) {
            $(function () {
                // если мы в контактах
                if (AMOCRM.getWidgetsArea() !== 'contacts') return;
                if (!AMOCRM.data.current_list || !AMOCRM.data.current_list.url) return;
                if (AMOCRM.data.current_list.url !== '/ajax/contacts/list/contacts/') return;

                $.each(mutationsList, function () {
                    if (this.type === 'childList') {
                        // если пункт меню уже создан, пропускаем
                        if ($('.list__top__actions .button-input__context-menu .add__leads').length) return;

                        $('.list__top__actions .button-input__context-menu').append(`
                            <li class="button-input__context-menu__item  element__ " id="" style="display:inherit">
                                <a href="" 
                                    class="js-navigate-link button-input__context-menu__item__link button-input__context-menu__item__inner
                                    add__leads">
                                    
                                    <span class="button-input__context-menu__item__icon-container">
                                        <svg class="svg-icon" viewBox="0 0 20 20">
                                            <path d="M15.475,6.692l-4.084-4.083C11.32,2.538,11.223,2.5,11.125,2.5h-6c-0.413,0-0.75,
                                                0.337-0.75,0.75v13.5c0,0.412,0.337,0.75,0.75,0.75h9.75c0.412,0,0.75-0.338,0.75-0.75V6.94C15.609,
                                                6.839,15.554,6.771,15.475,6.692 M11.5,3.779l2.843,2.846H11.5V3.779z M14.875,
                                                16.75h-9.75V3.25h5.625V7c0,0.206,0.168,0.375,0.375,0.375h3.75V16.75z">
                                            </path>
                                        </svg>
                                    </span>
                                    <span class="button-input__context-menu__item__text">
                                        Создать сделки
                                    </span>
                                </a>
                            </li>            
                        `);

                        $('.list__top__actions .button-input__context-menu .add__leads').bind('click', self.addLeads);
                    }
                });

            });
        }

        // запускаем прослушку элементов
        this.observerAddItemMenu = new MutationObserver(addItemMenu);

        // функция создания сделок
        this.addLeads = function (e) {
            e.preventDefault();

            // добавляем модалку с параметрами создания сделки
            new Modal({
                class_name: 'modal-copy',
                init: function ($modal_body) {
                    var $this = $(this);
                    $modal_body
                        .trigger('modal:loaded')
                        .html(`
                        <div class="modal__main-block" style="width: 100%; min-height: 310px;">
                            <h2 class="modal-body__caption head_2">Создать сделки</h2>
                        </div>
                    `)
                        .trigger('modal:centrify')
                        .append('');
                },
                destroy: function () {}
            });

            // выбор контактов для создания сделок
            var radioAll = Twig({ref: '/tmpl/controls/radio.twig'}).render({
                    prefix: 'selectContacts',
                    class_name: 'modal__radio-contacts',
                    label: 'выделенных контактов',
                    name: 'modal-radio-contacts',
                    value: 'selectContacts',
                    selected: true
                }),
                radioSelect = Twig({ref: '/tmpl/controls/radio.twig'}).render({
                    prefix: 'allContacts',
                    class_name: 'modal__radio-contacts',
                    label: 'всех контактов на странице',
                    name: 'modal-radio-contacts',
                    value: 'allContacts'
                });

            $('.modal__main-block').append(`
                <div class="modal__radio__wrapper" style="width: 100%;">
                    <span style="width: 100%; margin-bottom: 10px;">Применить действие для:</span>
                    ${ radioAll }
                    ${ radioSelect }
                </div>
            `);

            // по умолчанию выбранный первый вариант radio
            $('.modal__radio__wrapper .control-radio').first().addClass('icon-radio-checked');

            // воронки и статусы
            $('.modal__main-block .modal__radio__wrapper').after(`
                <div class="modal__pipelines__wrapper" style="width: 100%; margin-top: 20px;">
                    <span style="width: 100%;">Воронки, этапы:</span>
                </div>
            `);

            $.ajax({
                url: '/api/v4/leads/pipelines',
                success: function (data) {
                    var pipelines = [];

                    $.each(data._embedded.pipelines, function () {
                        var pipeline_ID = this.id,
                            pipeline_name = this.name;

                        // добавляем воронки
                        pipelines.push({ id: pipeline_ID, name: pipeline_name, statuses: [] });

                        $.each(this._embedded.statuses, function () {
                            if (this.type == 1) return;

                            var status_ID = this.id,
                                status_name = this.name,
                                status_color = this.color;

                            // добавляем к воронкам статусы
                            $.each(pipelines, function () {
                                if (this.id !== pipeline_ID) return;

                                this.statuses.push({
                                    id: status_ID,
                                    name: status_name,
                                    color: status_color
                                });
                            });
                        });
                    });

                    // pipelines select
                    var pipelines = Twig({ ref: '/tmpl/controls/pipeline_select/index.twig' }).render({
                        has_pipelines: true,
                        items: pipelines,
                        multiple: true,
                        class_name: 'modal__pipelines-leads',
                        id: 'pipelinesLeads'
                    });

                    $('.modal__main-block .modal__pipelines__wrapper span').after(pipelines);
                    $('.modal__pipelines-leads').css('margin-top', '3px');
                },
                timeout: 2000
            });

            // ответственный в сделках
            var checkbox = Twig({ ref: '/tmpl/controls/checkbox.twig' }).render({
                class_name: 'modal__responsible-leads',
                checked: false,
                value: 'Выбрать ответственного',
                input_class_name: 'modal__responsible__leads-item',
                name: 'modal-responsible-leads',
                text: 'Выбрать ответственного'
            });

            $('.modal__main-block .modal__pipelines__wrapper').after(`
                <div class="modal__responsible__wrapper" style="width: 100%; margin-top: 20px;">
                    ${ checkbox }
                </div>
            `);

            // выбор ответственного
            $('.modal__responsible__wrapper .control-checkbox').unbind('change');
            $('.modal__responsible__wrapper .control-checkbox').bind('change', function () {
                // если чекбокс не checked, удаляем список ответственных
                if (!$('.modal__responsible__wrapper .control-checkbox').hasClass('is-checked')) {
                    $('.modal__main-block .modal__select__wrapper').remove();
                } else {
                    // иначе добавляем
                    var managers = [];

                    $.each(AMOCRM.constant('managers'), function () {
                        managers.push({ id: this.id, option: this.title });
                    });

                    var select = Twig({ ref: '/tmpl/controls/select.twig' }).render({
                        items: managers,
                        class_name: 'modal__select-leads'
                    });

                    $('.modal__main-block .modal__responsible__wrapper .modal__responsible-leads').after(`
                        <div class="modal__select__wrapper" style="width: 100%; margin-top: 10px;">
                            ${ select }                    
                        </div>
                    `);

                    $('.modal__main-block .modal__select-leads .control--select--button').css('width', '100%');
                    $('.modal__main-block .modal__select-leads ul').css({
                        'margin-left': '13px',
                        'width': 'auto',
                        'min-width': $('.modal__main-block').outerWidth() - 13
                    });
                }
            });

            // кнопки Сохранить и Отменить
            var createBtn = Twig({ ref: '/tmpl/controls/button.twig' }).render({
                    class_name: 'modal__createBtn-leads',
                    text: 'Создать'
                }),
                cancelBtn = Twig({ ref: '/tmpl/controls/cancel_button.twig' }).render({
                    class_name: 'modal__cancelBtn-leads',
                    text: 'Отменить'
                });

            $('.modal__main-block .modal__responsible__wrapper').after(`
                <div class="modal-body__actions" style="width: 100%; text-align: left;">
                    ${ createBtn }
                    ${ cancelBtn }
                </div>
            `);

            $('.modal-body__actions').css('margin-top', '20px');

            // нажатие на кнопку Создать
            $('.modal__main-block .modal__createBtn-leads').unbind('click');
            $('.modal__main-block .modal__createBtn-leads').bind('click', function () {
                var settings = {},
                    is_error = false;

                // возвращаем воронкам естесственный цвет
                $('.modal__pipelines__wrapper .pipeline-select-wrapper__inner__container').unbind('click');
                $('.modal__pipelines__wrapper .pipeline-select-wrapper__inner__container').bind('click', function () {
                    $('.modal__pipelines__wrapper .pipeline-select').css('border-color', 'rgba(146,152,155,.4)');
                });

                // выбор контактов
                var radio = $('.modal__radio__wrapper .control-radio'),
                    contacts = [];

                $.each(radio, function () {
                    if ($(this).hasClass('icon-radio-checked')) {
                        settings['contacts'] = $(this).find('input[name="modal-radio-contacts"]').val();
                    }
                });

                $.each($('.list-contacts .list__table div'), function () {
                    if (!$(this).attr('data-id')) return;

                    // если выбраны все контакты, добавляем все на странице
                    if (settings['contacts'] === 'allContacts') contacts.push($(this).attr('data-id'));
                    else {
                        // иначе только те, что выбраны
                        if ($(this).find('.list-row__cell-id').hasClass('multiactions_inited'))
                            contacts.push($(this).attr('data-id'));
                    }
                });

                settings['contacts'] = contacts;

                // выбор воронок
                var pipelinesSelect = $('.modal__pipelines__wrapper .pipeline-select'),
                    pipelines = [],
                    status_ID = null;

                $.each(pipelinesSelect, function () {
                    $.each($(this).find('li label'), function () {
                        if (!$(this).hasClass('is-checked')) return;
                        status_ID = $(this).find('input').attr('id');
                        if (!pipelines.includes(status_ID)) pipelines.push(status_ID);
                    });
                });

                if (pipelines.length === 0) {
                    $('.modal__pipelines__wrapper .pipeline-select').css('border-color', '#f57d7d');
                    is_error = true;
                } else settings['pipelines'] = pipelines;

                // выбор ответственного
                if ($('.modal__responsible__wrapper .control-checkbox').hasClass('is-checked')) {
                    settings['responsible'] = $('.modal__select__wrapper .control--select--button').attr('data-value');
                } else settings['responsible'] = false;

                if (!is_error) {
                    // если контактов нет, просто закрываем модалку
                    if (settings['contacts'].length === 0) {
                        $('.modal-copy').remove();
                    } else {
                        // иначе отправляем запрос на создание сделок
                        $.ajax({
                            url: url_link_t,
                            method: 'POST',
                            data: {
                                'domain': document.domain,
                                'method': 'leads_create',
                                'settings': settings
                            },
                            dataType: 'json',
                            success: function (data) {}
                        });

                        // закрываем модалку
                        $('.modal-copy').remove();
                    }
                }
            });
        }

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
                // запускаем прослушку элементов
                self.observerAddItemMenu.observe($('body')[0], {
                    childList: true,
                    subtree: true,
                    attributes: true
                });

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

// https://integratorgroup.k-on.ru/andreev/copy_leads/token_get.php