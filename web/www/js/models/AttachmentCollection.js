define([
        'underscore',
        'backbone',
        'models/AttachmentModel',
        'values/constants'
], function(_, Backbone, AttachmentModel, Constants){
	
	AttachmentCollection = Backbone.Collection.extend({
		model: AttachmentModel,
		
		url : Constants['web_service_url']+'attachments/',
		
		parse: function(response, options) {
			return response.attachments;
		}
	
	});
	
	return AttachmentCollection;
});