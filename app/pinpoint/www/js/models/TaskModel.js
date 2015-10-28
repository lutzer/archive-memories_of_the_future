define([
        'underscore',
        'backbone',
        'models/ResultModel',
        'helpers/Utils'
], function(_,Backbone,ResultModel,Utils){

	var TaskModel = Backbone.Model.extend({
		
		defaults: {
			completed : 0,
			number: 0,
			results : []
		},
	
		setResult: function(picture, note, location) {
			var self = this;
			var result = new ResultModel({
				file: picture, 
				note: note, 
				type: "picture",
				location: location
			});
			//console.log(result);
			this.get('results').push(result.toJSON());
			this.set({ completed: this.get('results').length}) ;
		},
		
		isComplete: function() {
			if (this.get('number') - this.get('completed') <= 0)
				return true;
			else
				return false;
		}
		
	});

	// Return the model for the module
	return TaskModel;

});