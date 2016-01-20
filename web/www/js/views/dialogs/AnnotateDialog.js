define([
	'jquery',
	'underscore',
	'marionette',
	'vent',
	'models/AttachmentModel',
	'text!templates/dialogs/annotateTemplate.html'
], function($, _, Marionette, Vent, AttachmentModel, template){
	
	var AnootateDialog = Backbone.Marionette.ItemView.extend({
		
		template: _.template(template),

		events: {
			'click #closeButton' : 'onClickCloseButton',
			'click #submitButton' : 'onClickSubmitButton',
			'change #file' : 'onFileChanged',
		},

		initialize: function(options) {
			this.image = false;
			this.model = options.model;
		},

		onRender: function() {
			
			var self = this;
			setTimeout(function() {
				self.$el.removeClass('hidden');
			},50);
			this.$el.on("webkitTransitionEnd transitionend", function(event) {
				self.$el.removeClass('modal-dialog');
				self.$el.off('webkitTransitionEnd transitionend');
			});
		},

		onClickCloseButton: function() {
			this.destroy();
		},

		onClickSubmitButton: function(event) {
			var self = this;

			event.preventDefault();

			var attachment = new AttachmentModel({
				result_id: self.model.get('id'),
				name: this.$('#name').val(),
				text: this.$('#text').val()
			});

			var options = {};

			if (this.image) {
				attachment.set({image : true});

				options.iframe = true;
				options.files = this.image;
				options.data = attachment.attributes;
				processData = false;

			}

			options['success'] = function(model,response) {
				if (response.error !== undefined) {
					console.log(response);
					alert('Error uploading attachment.')
				} else {
					Vent.trigger("reload:attachments");
					self.destroy();
				}
			},

			options['error'] = function(model,response) {
				console.log(response);
				alert('Error uploading attachment.')
			}
			
			attachment.save(attachment.attributes,options);
			
			console.log(attachment);
		},

		onFileChanged: function() {
			this.image = this.$('#file');
		}

	});
	// Our module now returns our view
	return AnootateDialog;
	
});