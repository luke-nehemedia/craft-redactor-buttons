<?php
/**
 * Craft Redactor Buttons plugin for Craft CMS 3.x
 *
 * Adds (bootstrap styled) buttons for links to the Redactor editor in Craftcms
 *
 * @link      http://luke.nehemedia.de
 * @copyright Copyright (c) 2019 Lucas Bares
 */

namespace lucasbares\craftredactorbuttons\assetbundles;

use Craft;
use craft\redactor\assets\redactor\RedactorAsset;
use craft\web\AssetBundle;
use craft\web\assets\cp\CpAsset;
use craft\web\View;

/**
 * @author    Lucas Bares
 * @package   CraftRedactorButtons
 * @since     1.0.0
 */
class RedactorPluginAsset extends AssetBundle
{
    // Public Methods
    // =========================================================================

    /**
     * @inheritdoc
     */
    public function init()
    {
        $this->sourcePath = __DIR__;

        $this->depends = [
            CpAsset::class,
            RedactorAsset::class,
        ];

        $this->js = [];

        $lang = Craft::$app->getTargetLanguage();
        $langFile = 'redactor-plugin/redactorButtons/redactorButtons.'.$lang.'.js';

        if(is_file($this->sourcePath.'/'.$langFile)){
            $this->js[999] = [$langFile, View::POS_END];
        }else{
            $this->js[999] = ['redactor-plugin/redactorButtons/redactorButtons.en.js', View::POS_READY];
        }


        $this->css = [
            // CSS styles for the editor
            'redactor-plugin/redactorButtons/redactorButtons-cpStyles.css',
        ];

        parent::init();
    }
}
