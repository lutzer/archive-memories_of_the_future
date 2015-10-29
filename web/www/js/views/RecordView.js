define([
	'jquery',
	'underscore',
	'marionette',
	'views/items/ResultListItemView',
	'text!templates/recordTemplate.html'
], function($, _, Marionette, ResultListItemView, template){
	
	var RecordView = Backbone.Marionette.CompositeView.extend({
	
		id: 'result-list',
		
		className: 'modal-dialog hidden transition',
		
		childView: ResultListItemView,
		
		childViewContainer: '#result-list-container',
		
		template: _.template(template),
		
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
	return RecordView;
	
});