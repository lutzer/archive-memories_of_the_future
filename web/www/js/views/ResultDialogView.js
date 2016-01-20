define([
	'jquery',
	'underscore',
	'marionette',
	'views/items/ResultListItemView',
	'text!templates/resultTemplate.html'
], function($, _, Marionette, ResultListItemView, template){
	
	var ResultDialogView = Backbone.Marionette.LayoutView.extend({
		
		id: 'result',
			
		template: _.template(template),

		regions: {
    		itemRegion: '#result-item-container'
    	},

		className: 'modal-dialog hidden transition',
		
		events: {
			'click #closeButton' : 'onCloseButtonPressed'
		},
		
		onRender: function() {

			this.itemRegion.show(new ResultListItemView({model: this.model}))
			
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