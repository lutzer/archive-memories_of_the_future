define([
	'jquery',
	'underscore',
	'marionette',
	'vent',
	'models/Database',
	'models/RecordModel',
	'text!templates/setupTemplate.html'
], function($, _, Marionette, Vent, Database, RecordModel, template){
	
	var SetupView = Marionette.ItemView.extend({
		
		initialize: function(options) {
			
			var database = Database.getInstance();
			
			var collection = database.explorations;
			this.model = collection.get(options.id);
			
			this.listenTo(Vent,'backbutton:click', function() {
				window.location.hash="#";
			});
			
			this.page = 0;
			this.nextSubpage();
			
		},
		
		events: {
			'click #next' : "onNextButtonClicked",
			'click #start' : "onStartButtonClicked"
		},
		
		template : _.template(template),
		
		nextSubpage: function() {
			if (this.page > 0)
				this.$('#page-'+this.page).addClass("top");
			this.page++;
			this.$('#page-'+this.page).removeClass('bottom');
		},
		
		onStartButtonClicked: function() {
			
			console.log(this.model);
			record = new RecordModel();
			record.setup(this.model,$('#name').val());
			
			var database = Database.getInstance();
			database.records.add(record);
			// save to local storage
			record.save();
			
			window.location.hash = "#walk/"+record.id;
		},
		
		onNextButtonClicked: function() {
			this.nextSubpage();
		}
		
	});
	// Our module now returns our view
	return SetupView;
	
});