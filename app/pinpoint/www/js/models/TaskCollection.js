define([
        'underscore',
        'backbone',
        'models/TaskModel'
], function(_, Backbone, TaskModel){
	
	TaskCollection = Backbone.Collection.extend({
		model: TaskModel,
		
		checkComplete: function() {
			
			var completed = true;
			for (i = 0;i<this.length;i++) {
				var task = this.at(i);
				if (!task.isComplete())
					completed = false;
			}
			return completed;
		},
		
		createJSON: function() {
			var json = [];
			_.each(this.models,function(model) {
				json.push(model.toJSON());
			})
			return json;
		}

	});
	
	return TaskCollection;
});