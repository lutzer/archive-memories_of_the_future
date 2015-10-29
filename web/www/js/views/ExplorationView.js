define([
	'jquery',
	'underscore',
	'marionette',
	'models/ExplorationModel',
	'models/RecordCollection',
	'models/ResultCollection',
	'views/MapView',
	'views/ResultDialogView',
	'views/RecordView',
	'views/menus/ExplorationMenuView',
	'text!templates/explorationTemplate.html'
], function($, _, Marionette, ExplorationModel, RecordCollection, ResultCollection, MapView, ResultDialogView, RecordView, ExplorationMenuView, template){
	
	var ExplorationView = Backbone.Marionette.LayoutView.extend({
		
		initialize: function(options) {
			
			this.exploration = new ExplorationModel({id: options.id});
			this.records = new RecordCollection();
			this.results = new ResultCollection();
			
			this.mapView = null;
			
			// fetch exploration from server
			var self = this;
			this.exploration.fetch({
				success: function(model,response) {
					
					if (response.length == 0) {
						alert("No data for specified id");
						return;
					}
	                
					//fetch records from server
					self.records.fetch({
			            data: $.param({ exploration_id: options.id})
			        });
					self.results.fetch({
						data: $.param({ exploration_id: options.id})
					});
					
					//display map
					self.showMap();
					
					//open menu
					self.onShowMenu();
					
				},
				error: function() {
					alert('Cannot connect to server');
				}
			});
		},
		
		regions: {
			mapRegion : '#map-container',
			dialogRegion: '#dialog-container'
		},
		
		template: _.template(template),
		
		showMap: function() {
			view = new MapView({model: this.exploration, collection: this.results})
			view.on('show:result',this.onShowResult,this);
			view.on('show:menu',this.onShowMenu,this);
			this.on('view:focus',view.focusMarker,view);
			this.getRegion('mapRegion').show(view);
		},
		
		onShowResult: function(model) {
			var view = new ResultDialogView({model: model})
			this.listenTo(view,'destroy',this.unfocusMarker);
			this.getRegion('dialogRegion').show(view);
		},
		
		onShowMenu: function() {
			var view = new ExplorationMenuView({collection: this.records});
			view.on('show:record',this.onShowRecord,this)
			this.getRegion('dialogRegion').show(view);
		},
		
		onShowRecord: function(id) {
			var recordResults = this.results.where({record_id : id});
			if (recordResults.length > 0) {
				var view = new RecordView({collection: new Backbone.Collection(recordResults)});
				this.listenTo(view,'destroy',this.unfocusMarker);
				this.getRegion('dialogRegion').show(view);
				this.trigger('view:focus',recordResults)
			} else
				alert('No data for this record.')
		},
		
		unfocusMarker: function() {
			this.trigger('view:focus',[]);
		}
		
		
		
		
	});
	// Our module now returns our view
	return ExplorationView;
	
});