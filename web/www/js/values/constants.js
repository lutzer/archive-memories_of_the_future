define([], function(){
	var constants = {

			/*
			 *  server settings 
			 */
			"web_service_url": "api/",
			"settings_web_timeout" : 2000,
			"max_file_size" : 25 * 1024 * 1024, //in bytes
			//"web_data_folder" : "data/records/"
			"web_data_folder" : "data/records/",
			"web_attachments_folder" : "data/attachments/"
	};
	return constants;
});