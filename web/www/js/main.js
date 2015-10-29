require.config({
	baseUrl: "js",
	paths: {
		backbone: 'libs/backbone-min',
		underscore: 'libs/underscore-min',
		marionette: 'libs/backbone.marionette.min',
		text: 'libs/plugins/text',
	}
});

require(['app',], function(App){
	App.initialize();
});