define([
        'underscore',
        'backbone',
        'models/ExplorationModel',
        'values/constants'
], function(_, Backbone, ExplorationModel, Constants){
	
	ExplorationCollection = Backbone.Collection.extend({
		model: ExplorationModel,
		
		urlRoot : Constants['web_service_url']+'explorations/',
	
	});
	
	return ExplorationCollection;
});