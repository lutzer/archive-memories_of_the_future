define([
    'jquery',
	'underscore',
	'marionette',
	'vent',
	'text!templates/items/recordListItemTemplate.html',
], function($, _, Marionette, Vent, template){
	
	var RecordListItemView = Marionette.ItemView.extend({
		
		template: _.template(template),
		
		className: 'record-item',
		tagName: 'li',
		
		modelEvents: {
			"change": "render"
		},
		
		events: {
			"click #delete" : "onDeleteButtonClicked",
			"click #resume" : "onResumeButtonClicked",
			"click #upload" : "onUploadButtonClicked"
		},
		
		serializeData: function(){
			var data = this.model.toJSON();
			var date = new Date(this.model.get('time'))
		    data.date = date.toLocaleDateString()+' '+date.toLocaleTimeString();
		    
		    return data;
		},
		
		onDeleteButtonClicked: function() {
			var self = this;
			Vent.trigger('dialog:open', {
				title: "Delete Record", 
				text: "Are you sure you want to delete the record?", 
				type: 'question',
				callback: function(accept) {
					if (accept)
						self.model.destroy();
				}});
			
		},
		
		onResumeButtonClicked: function() {
			window.location.hash = "#walk/"+this.model.id;
		},
		
		onUploadButtonClicked: function() {
			
			Vent.trigger('dialog:open', {
				title: "Uploading", 
				text: "Uploading recorded data...", 
				type: 'progress'
			});
			
			var self = this;
			
			this.model.upload({
				success: function() {
					Vent.trigger('dialog:done','Data has been uploaded.');
					//self.model.destroy();
				},
				error: function(error) {
					Vent.trigger('dialog:open',{title: 'Error', text: error, type: 'message'});
					console.log(error);
				},
				progress: function(arg) {
					Vent.trigger('dialog:progress',arg*100);
				}
			});
		}
		
	});
	return RecordListItemView;
	
});