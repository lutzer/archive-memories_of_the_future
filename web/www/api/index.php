<?php

    require 'config.php';
    require 'Slim/Slim.php';
    require 'BasicAuth.php';

    use \Slim\Slim;
    use \Slim\Extras\Middleware\HttpBasicAuth;

    Slim::registerAutoloader();

    $app = new Slim();
        
    //exploration routes
    $app->get('/explorations/', 'listExplorations');
    $app->get('/explorations/:id', 'getExploration');
    $app->put('/explorations/:id', 'saveExploration');
    $app->post('/explorations/', 'saveExploration');
    //$app->delete('/explorations/:id', 'deleteExploration');


    //record routes
    $app->get('/records/:arg', 'getRecord');
    $app->get('/records/', function() use ($app) {
        $req = $app->request->params('exploration_id');
        listRecords($req); 
    });
    $app->delete('/records/:arg', 'deleteRecord');
    $app->post('/records/', 'submitRecord');  //upload record data
    $app->post('/records/upload/:id', 'uploadRecordFile'); //upload record files

    //attachment routes
    $app->get('/attachments/', function() use ($app) {
        $req = $app->request->params('result_id');
        listAttachments($req); 
    });
    $app->get('/attachments/:id', 'getAttachment');
    $app->post('/attachments/', 'saveAttachment');

    $app->run();

    
    /* Exploration Methods */

    function getExploration($arg) {
        try {
            $db = getConnection();
            $stmt = $db->prepare("SELECT * FROM ".DB_TABLE_EXPLORATIONS." WHERE id = :id");
            $stmt->execute(array(':id' => $arg));
            $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
            $db = null;
            _arrayToUtf8($result);
            _convertJsonColumns($result,array('tasks','location','groups'));
            if (sizeof($result)<1)
                _sendData();
            _sendData($result[0],200);
        } catch(PDOException $e) {
            _sendData($e->getMessage(),500); 
        }
    }

    function listExplorations() {
        try {
            $db = getConnection();
            $stmt = $db->query("SELECT * FROM ".DB_TABLE_EXPLORATIONS." WHERE visible = 1 ORDER BY id DESC");
            $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
            $db = null;
            _arrayToUtf8($result);
            _convertJsonColumns($result,array('tasks','location','groups'));
            _sendData(array("explorations" => $result));
        } catch(PDOException $e) {
            _sendData($e->getMessage(),404); 
        }
    }

    function saveExploration($arg = null) {

        $app = Slim::getInstance();
        $body = $app->request->getBody();
        
        $data = (array) json_decode($body);

        $json = json_encode($data['json']);

        try {
            $db = getConnection();
            if ($arg != null) {
                $stmt = $db->prepare("REPLACE INTO ".DB_TABLE_EXPLORATIONS." (id,name,json,visible)
                    VALUES (:id,:name,:json,:visible)");
                $insertData = array(
                    'id' => $data['id'],
                    'name' => $data['name'],
                    'json' => $json,
                    'visible' => $data['visible']
                );
                $stmt->execute($insertData);
            } else {
                $stmt = $db->prepare("INSERT INTO ".DB_TABLE_EXPLORATIONS." (name,json,visible)
                    VALUES (:name,:json,:visible)");
                $insertData = array(
                    'name' => $data['name'],
                    'json' => $json,
                    'visible' => $data['visible']
                );
                $stmt->execute($insertData);
            }
            $db = null;
            //_saveToLog($json);
            _sendData("data inserted",200,true);
        } catch(PDOException $e) {
            //_saveToLog($e->getMessage());
            _sendData($e->getMessage(),500); 
        }
    }

    function deleteExploration($arg) {

         try {
            $db = getConnection();
            $stmt = $db->prepare("DELETE FROM ".DB_TABLE_EXPLORATIONS." WHERE id = :id");
            $stmt->execute(array('id' => $arg));
            $db = null;
            _sendData("exploration deleted."); 
        } catch(PDOException $e) {
            _sendData($e->getMessage(),404); 
        }
    }



    /* Record Methods */

    function getRecord($arg) {
        try {
            $db = getConnection();
            $query = "SELECT * FROM ".DB_TABLE_RECORDS." WHERE id=:id";
            $stmt = $db->prepare($query);
            $stmt->execute(array('id' => $arg));
            $result = $stmt->fetchAll(PDO::FETCH_ASSOC);

            $db = null;

            _arrayToUtf8($result);
            _convertJsonColumns($result,array('tasks','location'));

            _sendData($result[0],200);
        } catch(PDOException $e) {
            _sendData($e->getMessage(),500); 
        }
    }

    function listRecords($arg = null) {
        try {
            $db = getConnection();
            if ($arg != null) {
            	
            	// first fetch records
                $stmt = $db->prepare("SELECT * FROM ".DB_TABLE_RECORDS." WHERE exploration_id=:exploration_id");
                $stmt->execute(array('exploration_id' => $arg));
                $records = $stmt->fetchAll(PDO::FETCH_ASSOC);
                
                //secondly fetch results
                $stmt = $db->prepare("
                		SELECT results.*,explorer,tasks,color FROM ".DB_TABLE_RECORDS." AS records
                		RIGHT JOIN ".DB_TABLE_RESULTS." AS results ON records.id=results.record_id 
                		WHERE records.exploration_id=:exploration_id
                		ORDER BY explorer,time DESC");
                $stmt->execute(array('exploration_id' => $arg));
                $results = $stmt->fetchAll(PDO::FETCH_ASSOC);
                
            } else
                _sendData();
            
            $db = null;
            
            _arrayToUtf8($records);
            _convertJsonColumns($records,array('tasks'));
            _arrayToUtf8($results);
            _convertJsonColumns($results,array('location','tasks'));
            
            _sendData(array("records" => $records,"results" => $results));
        } catch(PDOException $e) {
            _sendData($e->getMessage(),500); 
        }
    }

    function deleteRecord($arg) {
        try {
            $db = getConnection();
            $stmt = $db->prepare("DELETE FROM ".DB_TABLE_RECORDS." WHERE id = :id");
            $stmt->execute(array('id' => $arg));
            $db = null;
            _sendData("record deleted."); 
        } catch(PDOException $e) {
            _sendData($e->getMessage(),404); 
        }
    }

    /* Upload Record Methods */
 
    function submitRecord() {
        try {
            // get and decode JSON request body
            $app = Slim::getInstance();
            $request = $app->request();
            $record = $request->post('record');

            if ($record == null)
                _sendData("no record data submitted",405);

            try {
	            //check which files need to be uploaded and result array
	            $results = array();
	            $files = array();
	            foreach ($record['tasks'] as $taskId => &$task) {
	                if (!empty($task['results'])) {
	                    foreach ($task['results'] as &$result) {
	                        if (array_key_exists("picture",$result) && $result['picture'] != 'false') {
                                $file = $result["picture"];
                                $files[] = array( "uri" => $file, "name" => basename($file));
                            }
                            if (array_key_exists("recording",$result) && $result['recording'] != 'false') {
                                $file = $result["recording"];
                                $files[] = array( "uri" => $file, "name" => basename($file));
                            }
	                        $result['taskId'] = $taskId;
	                        $result['recordId'] = $record['id'];
	                        $results[] = $result;

	                    }
	                    //clear from record
	                    $task['results'] = array();
	                }
	            }

	            //check if record already exists, if not create it in the database
                $db = getConnection();
                $stmt = $db->prepare("REPLACE INTO ".DB_TABLE_RECORDS." 
                    (id,exploration_id,explorer,tasks,time,color)
                    VALUES (:id,:exploration_id,:explorer,:tasks,:time,:color)");

                $insertData = array(
                    "id" => $record['id'],
                    "exploration_id" => $record['exploration_id'],
                    "explorer" => $record['explorer'],
                    "tasks" => json_encode($record['tasks']),
                    "time" => $record['time'],
                    "color" => $record['color']
                );

                $stmt->execute($insertData);

                //insert results
                $insertData = array();
                $queryArgs = array();
                foreach($results as $row) {
                    $rowdata = array(
                        "id" => $row['id'],
                        "record_id" => $row['recordId'],
                        "task_id" => $row['taskId'],
                        "action" => $row['action'],
                        "picture" => basename($row['picture']),
                        "recording" => basename($row['recording']),
                        "note" => $row['note'],
                        "location" => json_encode($row['location']),
                        "time" => $row['time']
                    );
                    $queryArgs[] = "(".implode(',', array_fill(0,count($rowdata),'?')).")";
                    $insertData = array_merge($insertData, array_values($rowdata));
                }
                

                
                $query = "REPLACE INTO ".DB_TABLE_RESULTS." 
                    (id,record_id,task_id,action,picture,recording,note,location,time)
                    VALUES ".implode(',',$queryArgs);

                // DEBUGGING
                //_sendData(array("results" => $results, "data" => $insertData, "query" => $query));

                $stmt = $db->prepare($query);
                $stmt->execute($insertData);

                $db = null;
            } catch (Exception $e) {
                _sendData($e->getMessage(),500);
            }
            

            //check if upload dir exists, else create it
            $upload_dir = DIR_RECORD_FILES.'/'.$record['id'];
                if(!is_dir($upload_dir))  {
                    mkdir($upload_dir,0755);
                    chmod($upload_dir,0777);
                }

            //compare with the files already uploaded
            foreach ($files as $key => $file) {
                if (file_exists($upload_dir.'/'.$file['name']))
                    unset($files[$key]);
            }

            //tell app which files need to be uploaded
            _sendData(array("files" => array_values($files)));
        } catch (Exception $e) {
            _sendData($e->getMessage(),500); 
        }
    }

    function uploadRecordFile($arg) {
        // get and decode JSON request body
        //$app = Slim::getInstance();
        //$request = $app->request();
        $record_id = $arg;
       
        //check if entry already exists in database
        try {
            $db = getConnection();
            $stmt = $db->prepare("SELECT * FROM ".DB_TABLE_RECORDS." WHERE id = :id");
            $stmt->execute(array('id' => $record_id));
            $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
            $db = null;
            if (sizeof($result) < 1)
                _sendData("Record entry for upload file does not exist",404);

            // check if any file got submitted
            if (!isset($_FILES['file']))
                sendData("No file submitted",404);
            $file = $_FILES['file'];

            //move file to records directory
            $upload_dir = DIR_RECORD_FILES.'/'.$record_id;
            if (is_uploaded_file($file['tmp_name'])) {
                //_sendData($file['tmp_name']." uploaded successfully.",500);
                move_uploaded_file($file['tmp_name'], $upload_dir.'/'.$file['name']);
                _sendData();
            } else
                _sendData("Error saving file to server.",404);

        } catch (Exception $e) {
            _sendData($e->getMessage(),500);
        }
    }


    /* Attachment Methods */

    function getAttachment($arg) {
        try {
            $db = getConnection();
            $stmt = $db->prepare("SELECT * FROM ".DB_TABLE_ATTACHMENTS." WHERE id = :id");
            $stmt->execute(array(':id' => $arg));
            $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
            $db = null;
            _arrayToUtf8($result);
            if (sizeof($result)<1)
                _sendData();
            _sendData($result[0],200);
        } catch(PDOException $e) {
            _sendData($e->getMessage(),500); 
        }
    }

    function listAttachments($arg = null) {
        try {
            $db = getConnection();
            $stmt = $db->prepare("SELECT * FROM ".DB_TABLE_ATTACHMENTS." WHERE result_id = :result_id");
            $stmt->execute(array('result_id' => $arg));
            $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
            $db = null;
            _arrayToUtf8($result);
            _sendData(array("attachments" => $result));
        } catch(PDOException $e) {
            _sendData($e->getMessage(),404); 
        }
    }

    function saveAttachment() {

        $app = Slim::getInstance();
        $body = $app->request->getBody();
        
        $data = (array) json_decode($body);

        //create data object for file post
        if (isset($_FILES['image'])) {
            $data = array(
                "result_id" => $_POST["result_id"],
                "name" => $_POST['name'],
                "text" => $_POST['text'],
                "image" => $_FILES['image']['name']
            );
        }

        try {
            //insert into database
            $db = getConnection();
            $stmt = $db->prepare("INSERT INTO ".DB_TABLE_ATTACHMENTS." (result_id,name,text,image)
                VALUES (:result_id,:name,:text,:image)");
            $stmt->execute($data);

            if (isset($_FILES['image'])) {
                //get id of new inserted record
                $id = $db->lastInsertId();

                $file = $_FILES['image'];

                $upload_dir = DIR_ATTACHMENT_FILES.'/'.$id;
                //check if upload dir exists, else create it
                if(!is_dir($upload_dir))  {
                    mkdir($upload_dir,0755);
                    chmod($upload_dir,0777);
                }

                //copy file
                if (is_uploaded_file($file['tmp_name']))
                    move_uploaded_file($file['tmp_name'], $upload_dir.'/'.$file['name']);
            }

            updateAttachmentCount($data["result_id"]);
            
            _sendData("data inserted",200,true);
        } catch(Exception $e) {
            //_saveToLog($e->getMessage());
            _sendData($e->getMessage(),500); 
        }
    }

    function updateAttachmentCount($resultId) {

        try {
            //get count
            $db = getConnection();
            $stmt = $db->prepare("SELECT COUNT(*) FROM ".DB_TABLE_ATTACHMENTS." WHERE result_id = :result_id");
            $stmt->execute(array('result_id' => $resultId));
            $count = $stmt->fetchColumn(); 
            
            //update result
            $stmt = $db->prepare("UPDATE ".DB_TABLE_RESULTS." SET attachments=:count WHERE id=:result_id");
            $stmt->execute(array(
                'count' => $count,
                'result_id' => $resultId
            ));

            $db = null;
        } catch(PDOException $e) {
            ;
        }

        return;
    }

    /* Helper Methods */

    function _convertJsonColumns(&$data,$columns) {
        foreach($data as $key => &$row) {
            foreach($columns as $col)
                $row[$col] = json_decode($row[$col]);
                //echo stripslashes($row[$col]);
        }
    }

    function _attachUrl($array,$record_id) {

        foreach ($array as $key => &$value) {

            if (is_array($value) || is_object($value))
                _attachUrl($value,$record_id);
            else if ($key === 'fileName') {
                $value = DIR_RECORD_URL.$record_id.'/'.$value;
                
            }
        }
    }
    
    function _toUtf8(&$element,$key) {
    	$element = utf8_encode($element);
    }
    
    function _arrayToUtf8(&$array) {
        array_walk_recursive($array,'_toUtf8');
    }

    //sends a message with the data
    function _sendData($data = array(), $status = 200) {
        // headers for not caching the results
        header('Cache-Control: no-cache, must-revalidate');
        header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');

        // allow all requests
        header("Access-Control-Allow-Orgin: *");
        header("Access-Control-Allow-Methods: *");
        
        // headers to tell that result is JSON
        header('Content-type: application/json');

        //send status
        header("HTTP/1.1 " . $status . " " . _requestStatus($status));
        

        //echo var_dump($data);
        
        // send the result now
        if (empty($data))
            echo json_encode(array());
        else
            echo json_encode($data);

        //end script
        exit(); 
    }

    function _requestStatus($code) {
        $status = array(  
            200 => 'OK',
            404 => 'Not Found',   
            405 => 'Method Not Allowed',
            500 => 'Internal Server Error',
        ); 
        return ($status[$code])?$status[$code]:$status[500]; 
    }

    function getConnection() {
        $dbhost=DB_SERVER;
        $dbuser=DB_USER;
        $dbpass=DB_PASSWORD;
        $dbname=DB_DATABASE;
        $dbh = new PDO("mysql:host=$dbhost;dbname=$dbname", $dbuser, $dbpass);  
        $dbh->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        return $dbh;
    }

    // Log data
    function _saveToLog($data) {
        $file = 'log/log.txt';
        $current = file_get_contents($file);
        $current .= "Time: ".date("r")."\n Data:".$data."\n";
        file_put_contents($file, $current);
    }
