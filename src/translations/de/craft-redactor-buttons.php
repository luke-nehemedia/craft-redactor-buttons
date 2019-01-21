<?php
/**
 * Craft Redactor Buttons plugin for Craft CMS 3.x
 *
 * Adds (bootstrap styled) buttons for links to the Redactor editor in Craftcms
 *
 * @link      http://luke.nehemedia.de
 * @copyright Copyright (c) 2019 Lucas Bares
 */

/**
 * @author    Lucas Bares
 * @package   CraftRedactorButtons
 * @since     1.0.0
 */
return [
    "Craft Redactor Buttons plugin loaded" => "Craft Redactor Buttons plugin geladen",

    // Settings forms
    'Button Styles' =>  'Schaltflächenvarianten',
    'Define the available button styles, e.g. primary, secondary, info, ...' => 'Definieren Sie die verfügbaren Stile wie zB. primary, secondary, info, ... Wenn keine Varianten angegeben werden, werden die <a href="https://getbootstrap.com/docs/4.1/components/buttons/" target="_blank">standard Bootstrap-Varianten</a> geladen.',
    'Add a button style' => 'Einen weiteren Button-Stil hinzufügen',
    'Style label' => 'Name des Stils',
    'Handle'    =>  'Kurzname',
    'CSS class' =>  'CSS Klassen',
    'Custom CSS' => 'Benutzerdefinierter CSS Code',
    'Define css rules for the buttons in the redactor-plugin editor' => 'Definieren Sie hier den CSS Code der die Buttons im Redactor Editor beschreibt. Dieser Code wird NICHT im Frontend geladen. Werden keine Definitionen angegeben, werden die standard Bootstrap Definitionen geladen.',
];
