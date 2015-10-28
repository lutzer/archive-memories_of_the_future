define([], function(){
	var constants = {

			/*
			 *  server settings 
			 */
			
			//"web_service_url": "data/",
			"web_service_url": "http://pinpoint.community-infrastructuring.org/map/api",
			"settings_web_timeout" : 2000,
			"max_file_size" : 25 * 1024 * 1024, //in bytes
			
			"geo_options" : { maximumAge: 4000, timeout: 20000, enableHighAccuracy: true }

	};
	return constants;
});