define([
	'jquery',
	'underscore',
	'marionette',
	'vent',
	'text!templates/items/resultListItemTemplate.html'
], function($, _, Marionette, Vent, template){
	
	var ResultListItemView = Backbone.Marionette.ItemView.extend({
		
		template: _.template(template),
		
		className: 'result-item',

		events: {
			'click #attachButton' : 'onClickAttachButton'
		},

		onRender: function() {
			this.$el.css('background-color', this.model.get('color'));
		},
		
		serializeData: function() {
			var data = this.model.toJSON();
			data.imagePath = this.model.getImagePath();
			data.audioPath = this.model.getAudioPath();
			data.task = this.model.getTask();
		    return data;
		},

		onClickAttachButton: function() {
			Vent.trigger('open:attachmentView',this.model);
		}



	});
	// Our module now returns our view
	return ResultListItemView;
	
});