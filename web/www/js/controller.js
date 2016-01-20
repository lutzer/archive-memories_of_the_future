define([
        'jquery',
        'marionette',
        'vent',
        'views/ExplorationView',
        'views/HomeView',
        'views/dialogs/AnnotateDialog'
], function($, Marionette, Vent, ExplorationView, HomeView, AnnotateDialog){
	
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

			Vent.on('open:attachDialog', this.openAttachDialog, this);
		},
		
			
		/* ROUTES */
		
		exploration: function(id) {
			this.app.containerRegion.show(new ExplorationView({id: id}))
			
		},
	
		defaultRoute: function() {
			this.app.containerRegion.show(new HomeView());
		},

		/* MODALS */

		openAttachDialog: function(model) {
			this.app.modalRegion.show(new AnnotateDialog({ model : model }));
		}
		
	});
	
	return Controller;
});