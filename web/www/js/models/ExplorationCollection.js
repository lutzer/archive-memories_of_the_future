define([
        'underscore',
        'backbone',
        'models/ExplorationModel',
        'values/constants'
], function(_, Backbone, ExplorationModel, Constants){
	
	ExplorationCollection = Backbone.Collection.extend({
		model: ExplorationModel,
		
		url : Constants['web_service_url']+'explorations/',

		parse: function(response, options) {
			return response.explorations;
		}
	
	});
	
	return ExplorationCollection;
});