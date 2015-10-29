define([
	'jquery',
	'underscore',
	'backbone',
	'marionette',
	'controller'
], function($, _, Backbone, Marionette, Controller) {
	
	var App = new Backbone.Marionette.Application();

	var initialize = function(){
		
		App.addInitializer(function(options){
			  Backbone.history.start();
			  
			  // support cross origin sharing
			  $.support.cors=true;
		});
		
		App.Router = new Marionette.AppRouter({
			controller: new Controller(App),
			appRoutes: {
				'exploration/:id': 'exploration',
				'*actions': 'defaultRoute'
			}
		});
		
		App.start();
		
	};

	return {
		initialize: initialize,
	};
	
});