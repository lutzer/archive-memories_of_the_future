define([
        'underscore',
        'backbone',
        'localstorage',
        'models/RecordModel',
        'values/constants'
], function(_, Backbone, LocalStorage, RecordModel, constants){
	
	RecordCollection = Backbone.Collection.extend({
		model: RecordModel,
		
		localStorage: new Backbone.LocalStorage("records"),
	
	});
	
	return RecordCollection;
});