/**
 * Craft Redactor Buttons plugin for Craft CMS 3.x
 *
 * Adds (bootstrap styled) buttons for links to the Redactor editor in Craftcms
 *
 * @author    Lucas Bares
 * @link      http://luke.nehemedia.de
 * @copyright Copyright (c) 2019 Lucas Bares
 */
var redactorButtons = $.extend({}, Craft.Redactor.PluginBase, {
    linkOptions: [],
    existingText: '',
    hack: null,
    modalState: {
        selectedLink: {
            text: null,
            url: null
        }
    },

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

    showSelectModal: function(arguments, zIndex){
        let refHandle = arguments.refHandle,
            callback = arguments.callback;

        this.saveSelection(this.app);

		// Create a new one each time because Redactor creates a new one and we can't reuse the references.
        const modal = Craft.createElementSelectorModal(arguments.elementType, {
            storageKey: 'RedactorInput.LinkTo.' + arguments.elementType,
            sources: arguments.sources,
            criteria: arguments.criteria,
            defaultSiteId: this.elementSiteId,
            autoFocusSearchBox: false,
            onSelect: $.proxy(function(elements) {
                if (elements.length) {
                    const element = elements[0];
					
					var options = {
	                    title: 'Redactor Button', // the modal title
	                    name: 'redactorButtonsModal', // the modal variable in modals object
	                    commands: {
	                        cancel: { title: 'Cancel' }, // the cancel button in the modal
	                        insert: { title: 'Insert' }
	                    }
	                };
                
                    this.restoreSelection(this.app);

                    this.modalState.selectedLink = {
                        url: element.url + '#' + refHandle + ':' + element.id + '@' + element.siteId,
                        text: this.app.selection.getText().length > 0 ? this.app.selection.getText() : element.label
                    }

                    //this.app.api('module.link.open');
                    this.app.api('module.modal.build', options);
                }
            }, this),
            closeOtherModals: false,
        });
    },

    showURLModal: function (arguments, zIndex) {
        let refHandle = arguments.refHandle,
            callback = arguments.callback;

        this.saveSelection(this.app);
        
        var options = {
            title: 'Redactor Button', // the modal title
            name: 'redactorButtonsModal', // the modal variable in modals object
            commands: {
                cancel: { title: 'Cancel' }, // the cancel button in the modal
                insert: { title: 'Insert' }
            }
        };
		
		this.modalState.selectedLink = {
            text: this.app.selection.getText().length > 0 ? this.app.selection.getText() : element.label
        }
		
        this.app.api('module.modal.build', options);
    },


    // messages
    onmodal: {
        redactorButtonsModal: {

            // Preload fields
            open: function(modal, form){
	            // Prevent Redactor from aggressively refocusing, when we don't want it to.
                this.hack = modal.app.editor.focus;
                modal.app.editor.focus = () => null;
				
				$form = $(form.nodes);

                if (this.modalState.selectedLink.url) {
                    $form.find('input[name=url]').val(this.modalState.selectedLink.url);
                }

                if (this.modalState.selectedLink.text) {
                    $form.find('input[name=text]').val(this.modalState.selectedLink.text);
                }

                this.modalState.selectedLink = {
                    text: null,
                    url: null
                };
				
                // Fill select field with defined styles
                var select = jQuery(form.nodes[0].children[4]).find('select');
                jQuery(select).append(this._optionButtonStyles());
            },
            
            close: function (modal) {
                // Revert the functionality.
                modal.app.editor.focus = this.hack;
                this.hack = null;
            },

            insert: function($modal, $form)
            {
                var formData = $form.getData();

                // callback from selectElement modal
                if (this.modalState.selectedLink.text) {
                    this.app.selection.restore();
					//or: this.restoreSelection(this.app);
					
                    var data = {
                        url: formData.url,
                        text: this.modalState.selectedLink.text.length > 0 ? this.selectedText : formData.text,
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
            title: '## entry-button-label ##',
            api: 'plugin.redactorButtons.showSelectModal',
            args: {
                elementType: options.elementType,
                refHandle: options.refHandle,
                sources: options.sources,
                criteria: options.criteria
            }
        };

        newList['custom-b2'] = {
            title: '## url-button-label ##',
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
    
    
    _optionButtonStyles: function(){
        var optionHtml = '';

        $.each(craftRedactorButtonsSettings.buttonStyles, function(index, element) {
            optionHtml += '<option value="'+element.handle+'">'+element.label+'</option>';
        })

        return optionHtml;
    }
});


(function($R) {
    $R.add('plugin', 'redactorButtons', redactorButtons);
})(Redactor);

