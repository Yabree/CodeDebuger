	/**
	 * Ajax Rewriter
	 * BT debuging tool
	 * @author rad.swiat
	 * @version 1.0.0
	 * @Description :	This is a ajax rewriter, it hijact ajax request from the javascript 
						and point it to the static data folder for debbuging purpose
	 * @Fetures:
		- ajax hijact
		- TODO: diffrernt data accounts
		- downloader of tpl file
		- TODO: downloader of data & html files				
	 */



	var AjaxRewriter = function(project, profile){
		var AR;
		var profile = getParameterByName('profile') ? getParameterByName('profile') : profile;
		var settings = {
			_project : project,
			_profile : profile,
			dataUrl : 'data/'+profile+'/',
			externalUrl : 'http://bt.com/',
			supportedExtensions : {
				js : {
					enabled		: false,
					external	: false
				},
				tpl : {
					enabled		: true,
					external	: true
				},
				do : {
					enabled		: true,
					external	: false
				}
			}
		};

		/**
		* Constructor of main class
		* - Get instances of main modules
		* - Executed only once !
		*/
		function __Constructor(){



			// set settings as public
			this.settings = settings;
			this.log('initialization', '', 'system');

			// Plugin manager controller.
			this.AR_PluginManager = new AR_PluginManager(this);
			this.log('', 'AR_PluginManager initialized', 'system');

			// Download manager
			this.AR_Downloader = new AR_Downloader(this);
			this.log('', 'AR_Downloader initialized', 'system');

			// Main controller. Setup hajackting, handle file downloads, handle responses, overwrite registerScript function
			this.AjaxRewriterController = new AjaxRewriterController(this);
			this.log('', 'AjaxRewriterController initialized', 'system');


		}

		var triggerEvents = function (events, args) {
			var ev, i = -1, l = events.length;
			while (++i < l) (ev = events[i]).callback.apply(ev.scope, args);
		};

		/**
		* Global functions, avaible throught all modules
		*/
		__Constructor.prototype = {
			
			constructor : __Constructor,

			on : function(eventName, callback, scope){
				if (!callback) return false;
				this._events || (this._events = {});
				var events = this._events[eventName] || (this._events[eventName] = []);
				events.push({
					callback : callback,
					scope : scope || this
				});
				return this;
			},

			trigger : function(name, callback, scope){
				if (!this._events) return this;
				var args = Array.prototype.slice.call(arguments, 1);
				var events = this._events[name];
				var allEvents = this._events.all;
				if (events) triggerEvents(events, args);
				if (allEvents) triggerEvents(allEvents, params);
				return this;
			},


			/**
			* Login function
			* colorfull console logging
			*/
			log : function(prefix, message, level){
				var cssRule = "color: rgb(252, 2, 98);" + "font-size: 12px;" + "font-weight: bold;" + "text-shadow: 1px 1px 5px rgb(249, 162, 34);";
				var cssRule2 = "color: rgb(2, 2, 98);" + "font-size: 12px;" + "font-weight: bold;" + "";
				if(level === 0)
				console.info("%cAR: %c"+prefix+" > " + message, cssRule, cssRule2);
				if(level === 1)
				console.info("%cAR: %c"+prefix+" > " + message, cssRule, cssRule2);
				if(level === 'ok'){
					cssRule2 = "color: rgb(72, 183, 3);" + "font-size: 12px;" + "font-weight: bold;" + "";
					console.info("%cAR: %c"+prefix+" > " + message, cssRule, cssRule2);
				}
				if(level === 'system'){
					cssRule2 = "color: rgb(252, 2, 98);" + "font-size: 12px;" + "font-weight: bold;" + "text-shadow: 0px 0px 0px rgb(249, 162, 34);";
					console.info("%cAR system: %c"+prefix+" " + message, cssRule, cssRule2);	
				}
			}
		};

		// Singleton
		return {
			initialize : function () {
				if (!AR) {
					AR = new __Constructor();
				}
				return AR;
			}
		};
	};



	var getParameterByName = function(name) {
	    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
	    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
	        results = regex.exec(location.search);
	    return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
	}