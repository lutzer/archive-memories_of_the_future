define([
        'underscore',
        'backbone',
        'values/constants'
], function(_, Backbone, Constants){

	var ExplorationModel = Backbone.Model.extend({
		
		urlRoot : Constants['web_service_url']+'explorations/',
		
		fetched : false,
		
		initialize: function() {
			this.on('sync', this.onSync);
		},
		
		onSync: function() {
			this.fetched = true;
		}
		
	});

	// Return the model for the module
	return ExplorationModel;

});