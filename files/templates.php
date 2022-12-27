<?php
	ini_set('error_log', 'error_in_templates.log');
    date_default_timezone_set('Europe/Moscow');
    header('Content-type: application/json;charset=utf8');
//    header('Content-type: text/html; charset=utf8');
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

    if ($_POST["method"] === "leads_create" && $Config->CheckToken()) {
        // перебираем статусы для новый сделок
        foreach ($_POST['settings']['pipelines'] as $pipeline) {
            $pipeline = explode('_', $pipeline);
            $pipeline_ID = (int) $pipeline[1];
            $status_ID = (int) $pipeline[2];

            // перебираем полученные контакты
            foreach ($_POST['settings']['contacts'] as $contact_ID) {
                try {
                    $contact = $apiClient->contacts()->getOne((int) $contact_ID);
                    usleep(200);
                } catch (AmoCRMApiException $e) {}

                // если ответственный не выбран, вытаскиваем из контакта
                $_POST['settings']['responsible'] === 'false' ?
                    $responsible_ID = $contact->getResponsibleUserId() :
                    $responsible_ID = (int) $_POST['settings']['responsible'];

                // создаем сделку
                $lead = new LeadModel();
                $lead->setResponsibleUserId($responsible_ID);
                $lead->setPipelineId($pipeline_ID);
                $lead->setStatusId($status_ID);

                try {
                    $lead = $apiClient->leads()->addOne($lead);
                    usleep(200);
                } catch (AmoCRMApiException $e) {}

                // привязываем контакт к сделке
                $links = new LinksCollection();
                $links->add($contact);

                try {
                    $apiClient->leads()->link($lead, $links);
                    usleep(200);
                } catch (AmoCRMApiException $e) {}
            }
        }
    }

