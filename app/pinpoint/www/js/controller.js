define([
        'jquery',
        'marionette',
        'vent',
        'regions/TransitionRegion',
        'views/HomeView',
        'views/SetupView',
        'views/WalkView',
        'views/RecordsView',
        'views/ModalDialogView'
], function($, Marionette, Vent, TransitionRegion, HomeView, SetupView, WalkView, RecordsView, ModalDialogView){
	
	var Controller = Marionette.Controller.extend({
		
		initialize: function(app) {
			this.app = app;
			
			//register back button event
			document.addEventListener("backbutton", function() {
				Vent.trigger("backbutton:click");
			});
			
			//register dialog events
			Vent.on('dialog:open', this.openDialog, this);
			Vent.on('dialog:close', this.closeDialog, this);
			Vent.on('dialog:done', this.setDialogDone, this);
			Vent.on('dialog:progress', this.setDialogProgress, this);
			
			
			app.addRegions({
				containerRegion: {
					selector: "#container",
					regionClass: TransitionRegion
				},
				modalRegion: {
					selector: "#modal-container"
				}
			});
		},
		
		isOnHomeView: false,
		
			
		/* ROUTES */
		
		home: function() {
			this.isOnHomeView = true;
			this.app.containerRegion.swap(new HomeView(), { transition: 'slideright'});
			
		},
		
		setup: function(id) {
			this.isOnHomeView = false;
			this.app.containerRegion.swap(new SetupView({id: id}), {transition: 'slideleft'});
		},
		
		walk: function(id) {
			this.isOnHomeView = false;
			this.app.containerRegion.swap(new WalkView({id : id}), {transition: 'slideleft'});
		},
		
		records: function() {
			slidedirection = 'slideleft';
			if (!this.isOnHomeView)
				slidedirection = 'slideright';
			this.app.containerRegion.swap(new RecordsView(), { transition: slidedirection});
			this.isOnHomeView = true;
		},
	
		defaultRoute: function() {
			this.home();
		},
		
		/* DIALOGS */
		
		openDialog: function(options) {
			this.app.modalRegion.show(new ModalDialogView(options));
		},
		
		closeDialog: function() {
			if (this.app.modalRegion.hasView())
				this.app.modalRegion.currentView.close();
		},
		
		setDialogDone: function(msg) {
			if (this.app.modalRegion.hasView())
				this.app.modalRegion.currentView.done(msg);
		},
		
		setDialogProgress: function(progress) {
			if (this.app.modalRegion.hasView())
				this.app.modalRegion.currentView.setProgress(progress);
		}
		
	});
	
	return Controller;
});