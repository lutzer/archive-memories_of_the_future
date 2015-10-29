define([
        'underscore',
        'backbone',
        'models/RecordModel',
        'values/constants'
], function(_, Backbone, RecordModel, Constants){
	
	RecordCollection = Backbone.Collection.extend({
		model: RecordModel,
		
		url : Constants['web_service_url']+'records/',
		
		parse: function(response, options) {
			return response.records;
		}
	
	});
	
	return RecordCollection;
});