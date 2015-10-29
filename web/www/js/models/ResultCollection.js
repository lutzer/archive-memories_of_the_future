define([
        'underscore',
        'backbone',
        'models/ResultModel',
        'values/constants'
], function(_, Backbone, ResultModel, Constants){
	
	ResultCollection = Backbone.Collection.extend({
		model: ResultModel,
		
		url : Constants['web_service_url']+'records/',
		
		parse: function(response, options) {
			return response.results;
		}
	
	});
	
	return ResultCollection;
});