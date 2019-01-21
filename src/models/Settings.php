<?php
/**
 * Craft Redactor Buttons plugin for Craft CMS 3.x
 *
 * Adds (bootstrap styled) buttons for links to the Redactor editor in Craftcms
 *
 * @link      http://luke.nehemedia.de
 * @copyright Copyright (c) 2019 Lucas Bares
 */

namespace lucasbares\craftredactorbuttons\models;

use craft\base\Model;

/**
 * @author    Lucas Bares
 * @package   CraftRedactorButtons
 * @since     1.0.0
 */
class Settings extends Model
{
    // Public Properties
    // =========================================================================

    /**
     * @var string
     */
    public $buttonStyles = [];

    public $buttonCss = '';

    // Public Methods
    // =========================================================================

    public function init(){
        if(trim($this->buttonCss) === ''){
            $this->buttonCss = file_get_contents(__DIR__.'/../templates/defaultButtonStyles.css');
        }
    }

    /**
     * @inheritdoc
     */
    public function rules()
    {
        return [
            'buttonCss' => ['string'],
        ];
    }
}
