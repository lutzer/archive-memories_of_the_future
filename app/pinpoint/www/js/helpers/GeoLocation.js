define([
        'values/constants'
], function(Constants){
	
	var GeoLocation = {
		getCurrentLocation: function(options) {
			function onSuccess(position) {
				var newPos = { 
    					"longitude" : position.coords.longitude, 
    					"latitude" : position.coords.latitude,
    					"gpstime" : position.timestamp,
    					"heading" : position.coords.heading,
    					"accuracy" : position.coords.accuracy
				};
				options.success(newPos);
			};
			navigator.geolocation.getCurrentPosition(onSuccess, options.error,Constants.geo_options);
		}	
	};
	
	return GeoLocation;
});