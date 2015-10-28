define([
        'underscore',
        'backbone',
        'localstorage',
        'models/ExplorationModel',
        'values/constants'
], function(_, Backbone, LocalStorage, ExplorationModel, constants){
	
	ExplorationCollection = Backbone.Collection.extend({
		model: ExplorationModel,
		
		localStorage: new Backbone.LocalStorage("explorations"),

		
		// download data from web db
		download: function(successCallback,errorCallback,progressCallback) {
			var self = this;
			
			request = $.ajax({
				url: constants['web_service_url']+"/explorations/",
				type: "get",
				dataType: "json",
				timeout: constants['settings_web_timeout'],
				success: onSuccess,
				error: onError
			});

			function onSuccess(response) {
				stopTimers();
				self.deleteAll();
				self.reset(response.explorations);
				self.save();
				successCallback();
			};

			function onError(error) {
				stopTimers();
				console.log(error)
				errorCallback(error);
			};

			function stopTimers() {
				clearTimeout(self.intervalTimer);
				clearTimeout(self.timeoutTimer);
			};

			// start progress timer
			self.runningTime = 0;
			self.intervalTimer = setInterval(function() {
				self.runningTime += 100;
				progressCallback(self.runningTime/constants['settings_web_timeout']);
			},100);

			// end timer;
			self.timeoutTimer = setTimeout(function() {
				clearTimeout(self.intervalTimer);
			},self.TIMEOUT+100);
			
		},
		
		save : function() {
			this.each(function(exploration) {
				exploration.save();
			});
		},
		
		deleteAll: function() {
			var model;
			while (model = this.first()) {
				model.destroy();
			}
		}
		
		
	
	});
	
	return ExplorationCollection;
});