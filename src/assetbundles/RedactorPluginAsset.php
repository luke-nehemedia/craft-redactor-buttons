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

use craft\web\AssetBundle;
use craft\web\assets\cp\CpAsset;

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
        ];

        $this->js = [
        ];

        $this->css = [
            'redactor-plugin/redactorButtons/redactorButtons-cpStyles.css',
        ];

        parent::init();
    }
}
