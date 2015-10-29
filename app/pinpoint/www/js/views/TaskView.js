define([
	'jquery',
	'underscore',
	'marionette',
	'vent',
	'helpers/GeoLocation',
	'text!templates/taskTemplate.html'
], function($, _, Marionette, Vent, GeoLocation, template){
	
	var TaskView = Marionette.ItemView.extend({
		
		initialize: function(options) {
			
			this.taskId = options.taskId === undefined ? null : options.taskId;
			
			this.picture = false;
			this.audio = false;
			this.location = false;
			
			// init with subpage 0
			this.page = 0;
			
			//listen to backbutton event
			this.listenTo(Vent,'backbutton:click',this.onBackButtonClicked);
		},
		
		template : _.template(template),
		
		events: {
			"click .categoryButton" : "onCategoryButtonPress",
			"click #takePicture" : "onTakePictureButtonPress",
			"click #doneButton" : "onDoneButtonPress",
			"click #recordAudio" : "onRecordAudioButtonPress",
			"webkitTransitionEnd .subpage" : 'onTransitionEnd',
			"transitionend .subpage" : 'onTransitionEnd'
		},
		
		onRender: function() {
			var self = this;
			setTimeout(function() {
				if (self.taskId != null) //skip page if there is allready a task id defined
					self.nextSubpage(1);
				else
					self.nextSubpage();
			},100);
			this.transitionCallback = function(event) {
				self.trigger('transition:show');
			};
		},
		
		transitionCallback: null,
		
		onTransitionEnd: function() {
			if (this.transitionCallback) {
				if ( !(_.contains( event.target.className.split(' '),'subpage')) )
					return;
			
				// trigger function only once
				this.transitionCallback();
				this.transitionCallback = null;
			}
		},
		
		onBackButtonClicked: function() {
			this.close();
		},
		
		close: function() {
			// slide up all bottom subpages
			this.$('.subpage:not(.top)').addClass("bottom");
			this.trigger('transition:close');
			
			//register transition end
			var self = this;
			this.transitionCallback = function(event) {
				//unbind all events & destroy view
				self.$el.unbind();
				self.destroy();
			};
		},
		
		//shows next Subpage
		nextSubpage: function(skip) {
			skip = skip ? skip : 0;
			
			if (this.page > 0)
				this.$('#page-'+this.page).addClass("top");
			this.page += skip + 1;
			this.$('#page-'+this.page).removeClass('bottom');
		},

		// first page
		onCategoryButtonPress : function(event) {
			this.taskId = event.target.dataset.taskId;
			
			//animate
			var self = this;
			setTimeout(function() {
				self.nextSubpage();
			},300);
		},

		//second page
		onRecordAudioButtonPress: function() {
			var self = this;

			var onSuccess = function(audioPath) {
	    		self.audio = audioPath[0].fullPath;
	    		self.nextSubpage();
	    	};

	    	var onFail = function() {
	    		// do nothing, user probably canceled camera app
	    	};
	    	
	    	//open camera app
	    	if (window.isDesktop) {
	    		self.onLocationCheck();
	    	} else
	    		navigator.device.capture.captureAudio(onSuccess, onFail, {
	    			duration: 300 //maximal 5 minutes audio recording
	    		});
		},
	
		onTakePictureButtonPress: function() {
			var self = this;

			var onSuccess = function(imagePath) {
	    		self.picture = imagePath[0].fullPath;
	    		self.onLocationCheck();
	    	};

	    	var onFail = function() {
	    		// do nothing, user probably canceled camera app
	    	};
	    	
	    	//open camera app
	    	if (window.isDesktop) {
	    		self.onLocationCheck();
	    	} else
	    		navigator.device.capture.captureImage(onSuccess, onFail);
		},
		
		// second page
		onLocationCheck: function() {
			
			this.nextSubpage();
			
			var self = this;
			GeoLocation.getCurrentLocation({
				success: function(pos) {
					console.log("found location");
					self.location = pos;
					self.setProgressBar(100);
					self.$('#done').html("Location found.");
					
					setTimeout(function() {
						self.nextSubpage();
					},1000);
				},
				error: function() {
					console.log("Error: Could not find location.");
					self.setProgressBar(0);
					self.$('#done').html("Could not fetch location. Is GPS enabled?");
					
					setTimeout(function() {
						self.nextSubpage();
					},3000);
				}
    		});
		},
		
		// fourth page
		onDoneButtonPress: function() {
			
			// save results
			var task  = this.model.get('tasks').at(this.taskId);
			task.setResult({
				picture: this.picture,
				recording: this.audio,
				note: this.$("#note").val(),
				location: this.location,
			});
			
			// update model
			this.model.sync("update", this.model);
			
			//close this view
			this.close();
		},
		
		setProgressBar: function(val) {
			self.$('#progressBar > div').removeClass("indeterminate");
			self.$('#progressBar > div').addClass("determinate");
			self.$('#progressBar > div').width(val+"%");
		}
		
		
	});
	// Our module now returns our view
	return TaskView;
	
});