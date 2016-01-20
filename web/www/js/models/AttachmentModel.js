define([
        'underscore',
        'backbone',
        'values/constants'
], function(_, Backbone, Constants){

	var AttachmentModel = Backbone.Model.extend({

		urlRoot : Constants['web_service_url']+'attachments/',
		
		defaults: {
			image: false,
			text: false,
			name: false
		},
		
		getImagePath: function() {
			if (!this.has('image') || this.get('image') == false)
				return null;
			
			return Constants['web_attachments_folder']+this.get('id')+"/"+this.get('image');
		}
		
	});

	return AttachmentModel;

});