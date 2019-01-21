/**
 * Craft Redactor Buttons plugin for Craft CMS 3.x
 *
 * Adds (bootstrap styled) buttons for links to the Redactor editor in Craftcms
 *
 * @author    Lucas Bares
 * @link      http://luke.nehemedia.de
 * @copyright Copyright (c) 2019 Lucas Bares
 */


var redactorButtons = $R.extend(true,$R.plugins.craftEntryLinks.prototype, {
    refHandle: '',
    selectElement: {},

    modals: {
        // this is variable with modal HTML body
        'redactorButtonsModal': '<form action=""> \
                <div class="form-item"> \
                    <label for="modal-link-url">URL <span class="req">*</span></label> \
                    <input type="text" id="modal-link-url" name="url"> \
                </div> \
                <div class="form-item"> \
                    <label for="modal-link-text">## text ##</label> \
                    <input type="text" id="modal-link-text" name="text"> \
                </div> \
                <div class="form-item form-item-title"> \
                    <label for="modal-link-title">## title ##</label> \
                    <input type="text" id="modal-link-title" name="title"> \
                </div> \
                <div class="form-item form-item-target"> \
                    <label class="checkbox"> \
                        <input type="checkbox" name="target"> ## link-in-new-tab ## \
                    </label> \
                </div> \
                <div class="form-item">\
                    <label for="modal-link-text">## style ##</label>\
                    <select type="select" id="modal-link-style" name="style">\
                    </select>\
                </div>\
            </form>',
    },

    init: function(app) {
        this.app = app;
        this.selection = app.selection;

    },

    // messages
    onmodal: {
        redactorButtonsModal: {

            // Preload fields
            open: function($modal, $form){

                if(this.selectedText){
                    $form.setData({ text: this.selectedText });
                }

                if(this.selectElement.length){
                    $form.setData({ text: this.selectElement[0].label });
                }

                if(this.app.selection.getText().length){
                    $form.setData( {text: this.app.selection.getText() });
                }

                if(this.selectElement.length){
                    $form.setData({ url: this.selectElement[0].url });
                }

                // Fill select field with defined styles
                var select = jQuery($form.nodes[0].children[4]).find('select');
                jQuery(select).append(this._optionButtonStyles());
            },

            insert: function($modal, $form)
            {
                var formData = $form.getData();

                // callback from selectElement modal
                if (this.selectElement.length) {
                    this.app.selection.restore();

                    var data = {
                        url: formData.url,
                        text: this.selectedText.length > 0 ? this.selectedText : formData.text,
                    };

                    // insert link
                    this.app.api('module.link.insert', data);

                    // select from link modal
                }else{
                    // insert link
                    this.app.api('module.link.insert', formData);

                }

                // add classname
                $R.dom(this.selection.getElement()).attr('class', 'btn ' + this._getCssClass(formData.style));

            }

        },

    },

    _getCssClass: function(handle){
        return craftRedactorButtonsSettings.buttonStyles[handle].cssclass;
    },

    // Do nothing on start.
    start: function () {

        var button = this.app.toolbar.getButton('link'),
            items = button.getDropdown().items,
            newList = {};


        var options = $R.extend(true,Craft.RedactorInput.currentInstance.linkOptions[0]);
        newList['custom-b1'] = {
            title: 'Button Link to an entry',
            api: 'plugin.redactorButtons.showSelectModal',
            args: {
                elementType: options.elementType,
                refHandle: options.refHandle,
                sources: options.sources,
                criteria: options.criteria
            }
        };

        newList['custom-b2'] = {
            title: 'Button Link to a URL',
            api: 'plugin.redactorButtons.showURLModal',
            args: {
                elementType: options.elementType,
                refHandle: options.refHandle,
                sources: options.sources,
                criteria: options.criteria
            }
        }

        this.refHandle = options.refHandle;

        button.setDropdown($.extend(newList, items));


    },

    showSelectModal: function(arguments){
        this.showModal(arguments);
        this.app.selection.save();
        this.selectedText = this.app.selection.getText();


        // Define onSelect callback
        this['selectionModal_'+this.refHandle].onSelect = $.proxy(function(elements) {

            if (elements.length) {

                this.selectElement = elements;

                var options = {
                    title: 'Redactor Button', // the modal title
                    name: 'redactorButtonsModal', // the modal variable in modals object
                    commands: {
                        cancel: { title: 'Cancel' }, // the cancel button in the modal
                        insert: { title: 'Insert' }
                    }
                };

                this.app.selection.restore();
                this.app.api('module.modal.build', options);

            }
        }, this);

    },

    showURLModal: function(arguments){
        var options = {
            title: 'Redactor Button', // the modal title
            name: 'redactorButtonsModal', // the modal variable in modals object
            commands: {
                cancel: { title: 'Cancel' }, // the cancel button in the modal
                insert: { title: 'Insert' }
            }
        };

        this.app.api('module.modal.build', options);
    },

    _optionButtonStyles: function(){
        var optionHtml = '';

        $.each(craftRedactorButtonsSettings.buttonStyles, function(index, element) {
            optionHtml += '<option value="'+element.handle+'">'+element.label+'</option>';
        })

        return optionHtml;
    }
});


$R.addLang('en', {
    "style": "Style",
    "primary": "Primary",
    "secondary": "Secondary",
    "success": "Success",
    "danger": "Danger",
    "warning": "Warning",
    "info": "Info",
    "light": "Light",
    "dark": "Dark"
});

$R.addLang('de', {
    "style": "Stil",
    "primary": "Primärfarbe",
    "secondary": "Sekundärfarbe",
    "success": "Erfolg",
    "danger": "Gefahr",
    "warning": "Warnung",
    "info": "Info",
    "light": "Hell",
    "dark": "Dunkel"
});


(function($R) {
    $R.add('plugin', 'redactorButtons', redactorButtons);
})(Redactor);

