define([
	'jquery',
	'underscore',
	'marionette',
	'views/items/TaskListItemView',
], function($, _, Marionette, TaskListItemView){
	
	var TaskListView = Marionette.CollectionView.extend({
		
		initialize: function(options) {
		},
		
		childView: TaskListItemView,
		
		childEvents: {
			'clicked' : 'onChildClicked'
		},
		
		onChildClicked: function(args) {
			this.trigger('clicked:task',args._index)
		}
		
	});
	// Our module now returns our view
	return TaskListView;
	
});