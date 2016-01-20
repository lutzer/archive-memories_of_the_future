define([
	'jquery',
	'underscore',
	'marionette',
	'models/ExplorationCollection',
	'text!templates/homeTemplate.html'
], function($, _, Marionette, ExplorationCollection, template){
	
	var HomeView = Backbone.Marionette.ItemView.extend({

		initialize: function() {
			this.collection = new ExplorationCollection();
			this.collection.fetch();
		},
		
		template: _.template(template),

		collectionEvents : {
			'sync' : 'render'
		}

	});
	// Our module now returns our view
	return HomeView;
	
});