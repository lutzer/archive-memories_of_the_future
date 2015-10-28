define([
	'jquery',
	'underscore',
	'marionette',
	'vent',
	'models/Database',
	'views/lists/TaskListView',
	'views/TaskView',
	'text!templates/walkTemplate.html'
], function($, _, Marionette, Vent, Database, TaskListView, TaskView, template){
	
	var HomeView = Marionette.LayoutView.extend({
		
		initialize: function(options) {
			
			var database = Database.getInstance();
			
			this.model = database.records.get(options.id);
			this.collection = this.model.get('tasks');
			
			//listen to backbutton event
			this.hidden = false;
			
			this.listenTo(this.model,'completed',this.onExplorationCompleted); 
		},
		
		regions: {
		    listRegion: "#task-list",
		    taskRegion: "#task-container"
		},
		
		events : {
			"click #pinPoint" : "onPinPointButtonClicked",
			"click #backButton" : "onBackButtonClicked"
		},
		
		template : _.template(template),
		
		onRender: function() {
			
			// render tasks
			view = new TaskListView({ collection: this.collection });
			
			var self = this;
			this.listenTo(view,'clicked:task',function(index) {
				self.openTaskView(index);
			})
			
			this.listRegion.show(view);
		},
		
		hideList: function() {
			this.hidden = true;
			this.$('#list-container').hide();
		},
		
		showList: function() {
			this.hidden = false;
			this.$('#list-container').show();
		},
		
		openTaskView: function(taskId) {
			var self = this;
			
			// show Overlay
			if (taskId !== undefined )
				view = new TaskView({ model: this.model, taskId: taskId});
			else
				view = new TaskView({ model: this.model});
			this.taskRegion.show(view);
			
			//tell view that its not visible
			view.on('transition:show', function() {
				self.hideList();
			});
			
			//tell view to become visible again
			view.on('transition:close', function() {
				self.showList();
			});
		},
		
		
		onPinPointButtonClicked : function() {
			this.openTaskView();
		},
		
		onBackButtonClicked: function() {
			if (!this.hidden)
				window.location.hash = "#records";
		},
		
		onExplorationCompleted: function() {
			Vent.trigger('dialog:open',{title: 'Completed', text: 'All tasks are completed. Please return and upload your pictures by clicking on the cloud icon.', type: 'message'})
			window.location.hash= "#records";
		}
		
	});
	// Our module now returns our view
	return HomeView;
	
});