define([
	'jquery',
	'underscore',
	'marionette',
	'vent',
	'models/AttachmentCollection',
	'text!templates/items/attachmentItemTemplate.html',
	'text!templates/attachmentTemplate.html'
], function($, _, Marionette, Vent, AttachmentCollection, itemTemplate, template){
	
	var AttachmentView = Backbone.Marionette.CompositeView.extend({

		id: 'attachment-view',
		
		className: 'modal-dialog hidden transition',
		
		childViewContainer: '#attachment-list-container',

		childView: Backbone.Marionette.ItemView.extend({
			template: _.template(itemTemplate),
			className: 'attachment-item',
			templateHelpers: function() {
				return {
					imagePath : this.model.getImagePath()
				}
			}
		}),
		
		template: _.template(template),
		
		events: {
			'click #closeButton' : 'onCloseButtonPressed',
			'click #addButton' : 'onClickAddButton'
		},

		initialize: function(options) {
			var self = this;

			this.collection = new AttachmentCollection();
			this.collection.fetch({
				data: $.param({ result_id: options.model.get('id') })
			});

			this.listenTo(Vent,"reload:attachments", function() {
				self.collection.fetch({
					data: $.param({ result_id: options.model.get('id') })
				});
			});
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
		
		onCloseButtonPressed: function() {
			this.destroy();
		},

		onClickAddButton: function(event) {
			
			event.preventDefault();

			Vent.trigger('open:attachDialog',this.model);
		}

	});
	// Our module now returns our view
	return AttachmentView;
	
});