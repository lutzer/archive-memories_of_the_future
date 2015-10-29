define([
	'jquery',
	'underscore',
	'marionette',
	'text!templates/menus/explorationMenuTemplate.html',
	'text!templates/menus/explorationMenuChildTemplate.html'
], function($, _, Marionette, template, childTemplate){
	
	var ExplorationMenuView = Backbone.Marionette.CompositeView.extend({
	
		id: 'menu',
		
		className: 'modal-dialog transition hidden',
		
		childView: Backbone.Marionette.ItemView.extend({
			template: _.template(childTemplate),
			tagName: 'li'
		}),
		
		childViewContainer: '#menu-list',
		
		template: _.template(template),
		
		events: {
			'click #closeButton' : 'onCloseButtonPressed',
			'click .recordLink' : 'onClickRecordLink'
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
		
		onClickRecordLink: function(event) {
			var recordId = event.target.dataset.recordId;
			this.trigger('show:record',recordId);
			return false;
		},
		
		onCloseButtonPressed: function() {
			this.destroy();
		}

	});
	// Our module now returns our view
	return ExplorationMenuView;
	
});