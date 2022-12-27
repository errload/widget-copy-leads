<?php
	ini_set('error_log', 'error_in_templates.log');
    date_default_timezone_set('Europe/Moscow');
    // header('Content-type: application/html;charset=utf8');
    header('Content-type: text/html; charset=utf8');
	header('Access-Control-Allow-Origin: *');

    include_once 'config.php';

    use AmoCRM\Collections\ContactsCollection;
    use AmoCRM\Collections\LinksCollection;
    use AmoCRM\Exceptions\AmoCRMApiException;
    use AmoCRM\Models\ContactModel;
    use AmoCRM\Models\CustomFieldsValues\ValueCollections\NullCustomFieldValueCollection;
    use AmoCRM\Models\LeadModel;
    use AmoCRM\Helpers\EntityTypesInterface;
    use AmoCRM\Collections\NotesCollection;
    use AmoCRM\Collections\TasksCollection;
    use AmoCRM\Models\TaskModel;
    use AmoCRM\Filters\TasksFilter;

    $Config = new Config();

    if ($_POST['method'] == 'settings') {
        // echo 'Блок первичных настроек Авторизации виджета <br>';
        echo '<div id="settings_WidgetCopypasteLeads">';
        $path = $Config->Set_Path_From_Domain($_POST['domain']);
        $settings = $_POST['settings'];
        $settings['secret'] =  $_POST['secret'];
        $Config->SaveSettings($settings);

        if (($_POST['settings']['active'] == 'Y') || ($_POST['settings']['status'] == 'installed')) {
            echo $Config->Authorization();
            if ($Config->CheckToken()) include_once 'templates/advancedsettings.html';
        } else {
            $Config->deleteToken();
            echo 'Виджет еще не установлен. Установите. <br>';
        }

        echo '</div>';
        exit;
    }

    $Config->GetSettings($_POST['domain']);
    if ($Config->CheckToken()) $apiClient = $Config->getAMO_apiClient();
    else {
        if ($_POST['method'] == 'advancedsettings') echo $Config->Authorization();
        exit;
    }

    /* ##################################################################### */



