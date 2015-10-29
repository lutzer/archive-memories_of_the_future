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
			action: 'none',
			results : []
		},
	
		setResult: function(data) {
			var self = this;
			var result = new ResultModel({
				picture: data.picture, 
				recording: data.recording,
				note: data.note, 
				location: data.location,
				action: this.get('action')
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