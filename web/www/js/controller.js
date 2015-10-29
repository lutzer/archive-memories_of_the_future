define([
        'jquery',
        'marionette',
        'vent',
        'views/ExplorationView'
], function($, Marionette, Vent, ExplorationView){
	
	var Controller = Marionette.Controller.extend({
		
		initialize: function(app) {
			this.app = app;
			
			app.addRegions({
				containerRegion: {
					selector: "#container",
				},
				modalRegion: {
					selector: "#modal-container"
				}
			});
		},
		
			
		/* ROUTES */
		
		exploration: function(id) {
			this.app.containerRegion.show(new ExplorationView({id: id}))
			
		},
	
		defaultRoute: function() {
			alert('default');
		},
		
	});
	
	return Controller;
});