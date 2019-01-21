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

use Craft;
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

        // load default bootstrap styles if no styles are specified
        if(trim($this->buttonCss) === ''){
            $this->buttonCss = file_get_contents(__DIR__.'/../templates/defaultButtonStyles.css');
        }

        if(!count($this->buttonStyles)){
            $this->buttonStyles = [
                'primary' => ['label' => Craft::t('craft-redactor-buttons', 'Primary'), 'handle' => 'primary', 'cssclass' => 'btn-primary'],
                'secondary' => ['label' => Craft::t('craft-redactor-buttons', 'Secondary'), 'handle' => 'secondary', 'cssclass' => 'btn-secondary'],
                'success' => ['label' => Craft::t('craft-redactor-buttons', 'Success'), 'handle' => 'success', 'cssclass' => 'btn-success'],
                'info' => ['label' => Craft::t('craft-redactor-buttons', 'Info'), 'handle' => 'info', 'cssclass' => 'btn-info'],
                'warning' => ['label' => Craft::t('craft-redactor-buttons', 'Warning'), 'handle' => 'warning', 'cssclass' => 'btn-warning'],
                'danger' => ['label' => Craft::t('craft-redactor-buttons', 'Danger'), 'handle' => 'danger', 'cssclass' => 'btn-danger'],
                'light' => ['label' => Craft::t('craft-redactor-buttons', 'Light'), 'handle' => 'light', 'cssclass' => 'btn-light'],
                'dark' => ['label' => Craft::t('craft-redactor-buttons', 'Dark'), 'handle' => 'dark', 'cssclass' => 'btn-dark'],
            ];
        }
    }

    /**
     * @inheritdoc
     */
    public function rules()
    {
        return [
            [['buttonCss'], 'string'],
        ];
    }
}
