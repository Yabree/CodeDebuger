function AR_PluginManager(AR){

	var self, settings;

	settings = {
		plugins_dir : 'http://localhost:84/_debuger/plugins/'
	};

	function __Constructor(){

		this.loadConfig();


	}

	__Constructor.prototype = {

		constructor: __Constructor,

		loadConfig : function(){
			this.loadFile(settings.plugins_dir+'config');
		},

		loadPlugins : function(){

		},

		loadFile : function(fileURL, callback){
			$.getScript( fileURL+'.js', function( data, textStatus, jqxhr ) {
				AR.log('Plugins', 'config loaded', 0);
			});
		},

		isAvaible : function(){

		},

		registerPlugin : function(){

		},

	};

	return new __Constructor();
}