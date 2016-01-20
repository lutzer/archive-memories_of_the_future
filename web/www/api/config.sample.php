<?php

	// CHANGE THESE SETTINGS TO POINT TO YOUR DATABASE 
	define('DB_USER', "user"); // db user
	define('DB_PASSWORD', "password"); // db password (mention your db password here)
	define('DB_DATABASE', "db"); // database name
	define('DB_SERVER', "localhost"); // db server
	
	// CHANGE THESE SETTINGS TO PROTECT YOUR DATA
	define('USE_ADMIN_LOGIN',false); // if there are problems with the authentification mechanism turn this to false
	define('ADMIN_USERNAME',"admin"); // username for admin interface
	define('ADMIN_PASSWORD',"password"); //password for admin interface

	/* 
		NO NEED TO CHANGE ANYTHING BELOW THIS LINE
	 	------------------------------------------
	*/
	
	define('DB_TABLE_EXPLORATIONS',"pp_explorations");
	define('DB_TABLE_RECORDS',"pp_records");
	define('DB_TABLE_RESULTS',"pp_results");
	define('DB_TABLE_ATTACHMENTS',"pp_attachments");

	define('DIR_RECORD_FILES',"../data/records/");
	define('DIR_ATTACHMENT_FILES',"../data/attachments/");
	
	
	ini_set('display_errors', 'On');
	error_reporting(E_ALL | E_STRICT);

