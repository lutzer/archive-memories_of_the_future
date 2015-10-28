define([
    'jquery',
	'underscore',
	'marionette',
	'models/TaskModel',
	'text!templates/items/taskListItemTemplate.html',
], function($, _, Marionette, TaskModel, template){
	
	var TaskListItemView = Marionette.ItemView.extend({
		
		template: _.template(template),
		
		serializeData: function(){
			var data = this.model.toJSON();
		    data.completionPercentage = Math.min(100,this.model.get('completed')/this.model.get('number')*100);
		    
		    return data;
		},
		
		className: 'list-item item waves-effect waves-dark',
		
		modelEvents: {
			"change": "render",
		},
		
		events: {
			'click .task-item' : "onTaskClicked"
		},
		
		onTaskClicked: function() {
			this.trigger('clicked');
		}
	});
	return TaskListItemView;
	
});