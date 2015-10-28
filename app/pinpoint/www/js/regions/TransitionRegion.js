define([
        'jquery',
        'marionette',
], function($, Marionette){
	
	var TransitionRegion = Backbone.Marionette.Region.extend({
		
		swap: function(view, options) {
			
			var showOptions = options || {};
			
			//make transition
			if (this.currentView !== undefined && showOptions.hasOwnProperty('transition')) {

				var self = this;
				
				var dir1 = "";
				var dir2 = "";
				if (showOptions.transition == 'slideright') {
					dir1 = "left";
					dir2 = "right";
				} else if (showOptions.transition == 'slideleft') {
					dir1 = "right";
					dir2 = "left";
				}
					
				var currentView = this.currentView;
				
				//prepare transition
				view.$el.addClass("page "+dir1+" transition");
				currentView.$el.addClass("page transition");
				
				//render new view to region
				this.$el.append(view.render().el);
				view.trigger("show");
				
				//run transition
				setTimeout(function(){
					currentView.$el.addClass("page "+dir2+" transition");
					view.$el.removeClass(dir1);
				},100);
				
				//register transition end
				currentView.$el.on("webkitTransitionEnd transitionend", function(event) {
					if (event.target.className != currentView.el.className)
						return;
					
					//unbind all events & destroy view
					currentView.$el.unbind();
					currentView.destroy();
					
					//set new view
					view.once('destroy', self.empty, this);
					view.$el.removeClass('page transition')
					self.currentView = view;
				});
				
				
			
			// show view if there is no other before
			} else {
				this.show(view,options);
			}
			
		}
	});
	
	return TransitionRegion;
});