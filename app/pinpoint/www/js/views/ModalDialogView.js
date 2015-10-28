define([
    'jquery',
	'underscore',
	'marionette',
	'text!templates/dialogs/dialogProgressTemplate.html',
	'text!templates/dialogs/dialogMessageTemplate.html',
	'text!templates/dialogs/dialogQuestionTemplate.html'
], function($, _, Marionette, progressTemplate,messageTemplate,questionTemplate){
	
	var ModalDialogView = Marionette.ItemView.extend({
		
		initialize: function(options) {
			if (options.type == 'progress')
				this.template = _.template(progressTemplate);
			else if (options.type == 'message')
				this.template = _.template(messageTemplate);
			else if (options.type == 'question')
				this.template = _.template(questionTemplate);
			
			//register callback
			if (options.hasOwnProperty('callback'))
				this.callback = options.callback;
			else
				this.callback = false;
		},
		
		serializeData: function(){
			var data = {}
			data.title = this.options.title;
			data.text = this.options.text;
		    return data;
		},
		
		className: 'modal-background',
		
		events: {
			'click #acceptButton' : 'onAcceptButtonPress',
			'click #rejectButton' : 'onRejectButtonPress'
		},
		
		onRender: function() {
			setTimeout(this.show,100);
		},
		
		show: function() {
			this.$('#dialog').removeClass('hidden');
		},
		
		hide: function() {
			this.$('#dialog').addClass('hidden');
		},
		
		close: function() {
			if (this.$('#dialog').hasClass('hidden'))
				this.destroy();
			else {
				this.hide();
				//register transition end
				var self = this;
				this.$('#dialog').on("webkitTransitionEnd transitionend", function(event) {
					if (event.target.id != 'dialog')
						return;
					
					//unbind all events & destroy view
					self.$el.unbind();
					self.destroy();
				});
			}
		},
		
		done: function(msg) {
			this.$('#done').html(msg);
			this.setProgress(100);
		},
		
		setProgress: function(val) {
			if (!this.$('#progressBar > div').hasClass("determinate")) {
				this.$('#progressBar > div').removeClass("indeterminate");
				this.$('#progressBar > div').addClass("determinate");
			}
			this.$('#progressBar > div').width(val+"%");
		},
		
		onAcceptButtonPress: function() {
			if (this.callback)
				this.callback(true);
			
			this.close();
		},
		
		onRejectButtonPress: function() {
			if (this.callback)
				this.callback(false);
			
			this.close();
		}
		
	});
	return ModalDialogView;
	
});