define([
	'jquery',
	'underscore',
	'marionette',
	'vent',
	'models/Database',
	'views/items/ExplorationListItemView',
	'text!templates/homeTemplate.html',
	'text!templates/items/explorationListEmptyTemplate.html'
], function($, _, Marionette, Vent, Database, ExplorationListItemView, template, emptyTemplate){
	
	var HomeView = Marionette.CompositeView.extend({
		
		initialize: function(options) {
			
			var database = Database.getInstance();
			this.collection = database.explorations;
			
		},
		
		events : {
			'click #refreshButton' : 'onClickRefreshButton',
			'click #records' : 'onClickRecordsButton'
		},
		
		template : _.template(template),
		
		childView: ExplorationListItemView,
		
		childViewContainer: '.exploration-list',
		
		emptyView: Backbone.Marionette.ItemView.extend({
			template: _.template(emptyTemplate)
		}),
		
		onClickRefreshButton: function() {
			this.collection.download(onSuccess,onError,onProgress);
			
			Vent.trigger('dialog:open',{title: 'Updating', text: 'Downloading explorations from server...', type: 'progress'});
			
			var self = this;
			
			function onSuccess() {
				setTimeout(function() {
					Vent.trigger('dialog:done','Explorations Downloaded');
				},1000);
				
			};
			
			function onError(error) {
				//TODO: add event 
				Vent.trigger('dialog:open',{title: 'Error', text: 'Could not connect to server.', type: 'message'});
			};
			
			function onProgress(val) {
				//TODO: add event 
				console.log(val);
			}
			
		},
		
		onClickRecordsButton: function() {
			window.location.hash = "#records";
		},
		
		showSpinner: function() {
			
		}
		
		
	});
	// Our module now returns our view
	return HomeView;
	
});