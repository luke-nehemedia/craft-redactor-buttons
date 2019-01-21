<?php
/**
 * Craft Redactor Buttons plugin for Craft CMS 3.x
 *
 * Adds (bootstrap styled) buttons for links to the Redactor editor in Craftcms
 *
 * @link      http://luke.nehemedia.de
 * @copyright Copyright (c) 2019 Lucas Bares
 */

namespace lucasbares\craftredactorbuttons;

use craft\helpers\Json;
use craft\redactor\events\RegisterPluginPathsEvent;
use craft\redactor\Field;
use Craft;
use craft\base\Plugin;

use lucasbares\craftredactorbuttons\assetbundles\RedactorPluginAsset;
use lucasbares\craftredactorbuttons\models\Settings;
use yii\base\Event;

/**
 * Class CraftRedactorButtons
 *
 * @author    Lucas Bares
 * @package   CraftRedactorButtons
 * @since     1.0.0
 *
 */
class CraftRedactorButtons extends Plugin
{

    // Static Properties
    // =========================================================================

    /**
     * @var CraftRedactorButtons
     */
    public static $plugin;

    // Public Properties
    // =========================================================================

    /**
     * @var string
     */
    public $schemaVersion = '1.0.0';

    public $hasCpSettings = true;

    public $options = [];


    // Public Methods
    // =========================================================================

    /**
     * @inheritdoc
     */
    public function init()
    {
        parent::init();
        self::$plugin = $this;

        // Register redactor-plugin plugin in CpRequests
        if(Craft::$app->getRequest()->isCpRequest){

            Event::on(
                Field::class,
                Field::EVENT_REGISTER_PLUGIN_PATHS,
                function (RegisterPluginPathsEvent $event) {
                    $event->paths[] = __DIR__ . "/assetbundles/redactor-plugin/";
                    return $event;
                }
            );

            Craft::$app->getView()->registerAssetBundle(RedactorPluginAsset::class);

            Craft::$app->getView()->registerJs('craftRedactorButtonsSettings = ' .
                Json::encode($this->getSettings(), JSON_UNESCAPED_UNICODE));

            Craft::$app->getView()->registerCss($this->getSettings()->buttonCss);
        }




        Craft::info(
            Craft::t(
                'craft-redactor-buttons',
                '{name} plugin loaded',
                ['name' => $this->name]
            ),
            __METHOD__
        );

    }

    /**
     * @inheritdoc
     */
    protected function createSettingsModel()
    {
        return new Settings();
    }

    /**
     * @inheritdoc
     */
    protected function settingsHtml(): string
    {

        $rows = $this->getSettings()->buttonStyles;

        if(empty($rows) or count($rows) == 0){
            $rows = [[
                'label' => 'Primary',
                'handle' => 'primary',
                'cssclass' => 'btn-primary']];
        }

        $stylesField = Craft::$app->getView()->renderTemplateMacro('_includes/forms', 'editableTableField',
            [

                [
                    'label' => 'Button Styles',
                    'instructions' => Craft::t('app', 'Define the available options.'),
                    'id' => 'buttonStyles',
                    'name' => 'buttonStyles',
                    'addRowLabel' => Craft::t('app', 'Add a button style'),
                    'cols' => [
                        'label' => [
                            'heading' => Craft::t('app', 'Button Label'),
                            'type' => 'singleline',
                            'autopopulate' => 'handle',
                        ],
                        'handle' => [
                            'heading' => Craft::t('app', 'Handle'),
                            'type' => 'singleline',
                            'class' => 'code',
                            'autopopulate' => 'cssclass'
                        ],
                        'cssclass' => [
                            'heading' => Craft::t('app', 'CSS class'),
                            'type' => 'singleline',
                            'class' => 'code'
                        ],
                    ],
                    'rows' => $rows
                ]
            ]);

        return Craft::$app->getView()->renderTemplate('craft-redactor-buttons/settings.twig',[
            'settings' => $this->getSettings(),
            'stylesField' => $stylesField,
        ]);

    }

    /**
     * @inheritdoc
     */
    public function beforeSaveSettings(): bool
    {
        $unorderedSettings = $this->settings->buttonStyles;
        $orderedSettings = [];
        foreach($unorderedSettings as $row){
            $orderedSettings[$row['handle']] = $row;
        }

        $this->settings->buttonStyles = $orderedSettings;

        return true;
    }

    // Protected Methods
    // =========================================================================

}
