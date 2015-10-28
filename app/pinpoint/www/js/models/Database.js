define([
        'models/ExplorationCollection',
        'models/RecordCollection'
], function (ExplorationCollection,RecordCollection) {
	
	var instance = null;
	 
    function Database(){
        if(instance !== null){
            throw new Error("Cannot instantiate more than one Singleton, use Database.getInstance()");
        } 
        
        this.initialize();
    };
    
    Database.prototype = {
        initialize: function(){
            
        	this.explorations = new ExplorationCollection();
        	this.records = new RecordCollection();
        	
        	//fetch data
        	this.explorations.fetch();
        	this.records.fetch();
        	
        },
        
        reset: function() {
        	instance = null;
        }
    };
    
    Database.getInstance = function(){
        if(instance === null){
            instance = new Database();
        }
        return instance;
    };
    
    return Database;
});