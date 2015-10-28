define([
	'jquery',
	'underscore',
	'marionette',
	'vent',
	'models/Database',
	'views/items/RecordListItemView',
	'text!templates/recordsTemplate.html'
], function($, _, Marionette, Vent, Database, RecordListItemView, template){
	
	var RecordsView = Marionette.CompositeView.extend({
		
		initialize: function(options) {
			var database = Database.getInstance();
			this.collection = database.records;
			
			this.listenTo(Vent,'backbutton:click',this.onBackButtonClicked);
		},
		
		events: {
			'click #backButton' : 'onBackButtonClicked'
		},
		
		
		template : _.template(template),
		
		childView: RecordListItemView,
		
		childViewContainer: '.records-list',
		
		onBackButtonClicked: function() {
			window.location.hash="#";
		}
		
		
	});
	// Our module now returns our view
	return RecordsView;
	
});