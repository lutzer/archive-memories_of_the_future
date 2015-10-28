define([
    'jquery',
	'underscore',
	'marionette',
	'models/ExplorationModel',
	'text!templates/items/explorationListItemTemplate.html',
], function($, _, Marionette, ExplorationModel, template){
	
	var ExplorationListItemView = Marionette.ItemView.extend({
		
		template: _.template(template),
		
		className: 'exploration-item waves-effect waves-dark',
		tagName: 'li',
		
		modelEvents: {
			"change": "render"
		},
	
		events: {
			//'click #start' : "onStartButtonClicked",
			'click .list-item' : "onStartButtonClicked"
		},
		
		onStartButtonClicked: function() {
			window.location.hash = "setup/"+this.model.id;
		}
		
	});
	return ExplorationListItemView;
	
});