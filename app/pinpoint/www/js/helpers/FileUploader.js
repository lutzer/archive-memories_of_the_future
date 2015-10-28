define([
	'jquery',
	'underscore',
	'values/constants',
	'helpers/Utils'
], function($, _, Constants, Utils){
	
	var FileUploader = {
		
		// uploads multiple files
		uploadFiles: function(files,uploadAddress,callbacks) {
			var self = this;
			
			if (files.length <= 0)
				callbacks.success();
			
			var fileIndex = 0;
			loopFileArray(files);
			
			function loopFileArray(arr) {
				 //update progress
				callbacks.progress(fileIndex/files.length);
				
				if(fileIndex >= arr.length) {
					callbacks.success();
		        	return;
		        }
				
				// first check if file is ok
				self.checkFile(arr[fileIndex].uri, function(result) {
					if (result) {
						self.uploadFile(arr[fileIndex],uploadAddress, {
							success: function() {
								//proceed to next file
								fileIndex++;
								loopFileArray(arr);
							},
							error: function(error) {
								callbacks.error(error);
							},
							progress: function(fileProgress) {
								callbacks.progress((fileIndex + fileProgress)/arr.length);
							}
						});
					} else { // proceed to next file without doing anything
						fileIndex++;
						loopFileArray(arr);
					}
				});
			}
		},
		
		//uploads a single file
		uploadFile: function(file,uploadAddress,callbacks) {
			
			console.log("uploading "+file.uri);
			
			transfer = new window.FileTransfer();
			
			var options = new FileUploadOptions();
			options.fileKey="file";
            options.fileName=file.name;
			options.chunkedMode = true;
			options.headers = {Connection: "close"};
            
            //start transfer
            transfer.upload(file.uri, uploadAddress, success, fail, options);
            transfer.onprogress = function(progressEvent) {
                if (progressEvent.lengthComputable) {
                	callbacks.progress(progressEvent.loaded/progressEvent.total);
                }
            };
            
            function success(result) {
            	callbacks.success();
            };
            
            function fail(error) {
				console.log(error);
				callbacks.error("File upload of "+file.uri+" failed.");
            };
			
		},
		
		//checks if file exists and file size is not too big
		checkFile: function(file,callback) {
			Utils.getFileInfo(file,function(exists,fileData) {
				if (exists) {
					if (fileData.size < Constants['max_file_size']) {
						callback(true)
						return;
					}
				}
				callback(false);
			});
			
		}
	
	};
	
	return FileUploader;
});