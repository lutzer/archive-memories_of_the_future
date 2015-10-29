define([
	'jquery',
	'underscore',
	'marionette',
	'text!templates/resultTemplate.html'
], function($, _, Marionette, template){
	
	var ResultDialogView = Backbone.Marionette.ItemView.extend({
		
		id: 'result',
			
		template: _.template(template),
		
		className: 'modal-dialog hidden transition',
		
		serializeData: function() {
			var data = this.model.toJSON();
			data.imagePath = this.model.getImagePath();
			data.audioPath = this.model.getAudioPath();
			data.task = this.model.getTask();
		    return data;
		},
		
		events: {
			'click #closeButton' : 'onCloseButtonPressed'
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
		}

	});
	// Our module now returns our view
	return ResultDialogView;
	
});