define([
        'jquery'
], function($){
	
	var Utils = {
		
		// binds an event staying in the scopes context
		bind: function(scope, fn) {
		    return function () {
		        fn.apply(scope, arguments);
		    };
		},
		
		// check if a file exists
		fileExists: function(uri,callback) {
			
			//window.resolveLocalFileSystemURI(uri,exists,notExists);
			window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSystem) {
				fileSystem.root.getFile(uri, { create: false }, exists, notExists);
			},notExists);
			
			function exists() {
				callback(true);
			};
			
			function notExists() {
				callback(false);
			};
		},
		
		getFileInfo: function(uri,callback) {
			
			var path = uri.replace(/^file:/, '');
			
			window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSystem) {
				fileSystem.root.getFile(path, { create: false }, exists, notExists);
			},notExists);
			
			function exists(fileEntry) {
				fileEntry.getMetadata(function(metaData) {
					callback(true,metaData);
				},notExists);
			};
			
			function notExists() {
				callback(false);
			};
		},

		// Generate a pseudo-GUID by concatenating random hexadecimal.
		guid: function() {
			
			// Generate four random hex digits.
			function S4() {
			   return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
			};
			
			var uuid = S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4();
			return(uuid);
		},
		
	};
	
	return Utils;
});