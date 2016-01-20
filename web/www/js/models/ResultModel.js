define([
        'underscore',
        'backbone',
        'values/constants'
], function(_, Backbone, Constants){

	var ResultModel = Backbone.Model.extend({
		
		defaults: {
			properties : {},
			idName: '',
			location: 'false'
		},
		
		toGeoJSON: function() {
			if (!this.has('location') || this.get('location') == 'false')
				return null;
			var self = this;
			var json = {
				"type": "Feature",
				"geometry": {
					"type": "Point",
					"coordinates": [self.get('location').longitude, self.get('location').latitude ]
				},
				"properties": {
					"id": self.get('id'),
					"className": "marker "+self.get('id'),
					"color": self.get('color'),
					"attachments": self.get('attachments'),
					"type": "marker",
					"size": 24 + self.get('attachments') * 3
				}					
			};
			return json;
		},
		
		getImagePath: function() {
			if (!this.has('picture') || this.get('picture') == 'false')
				return null;
			
			return Constants['web_data_folder']+this.get('record_id')+"/"+this.get('picture');
		},

		getAudioPath: function() {
			if (!this.has('recording') || this.get('recording') == 'false')
				return null;
			
			return Constants['web_data_folder']+this.get('record_id')+"/"+this.get('recording');
		},
		
		getTask: function() {
			return this.get('tasks')[this.get('task_id')];
		}
		
	});

	return ResultModel;

});