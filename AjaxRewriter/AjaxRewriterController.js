	function AjaxRewriterController(AR){
		var self;
		var runningAjaxCalls = null;
		var usedJSScripts = [];

		/** STATIC FUNCTIONS **/

		/** 
		* Get File From URL string
		* return object { name : name, ext : extension }
		*/
		function getFileFromString(string){
			var filenameExt = string.substr(string.lastIndexOf('/') + 1, string.length);

			// clean extra get variables  from filename
			if(filenameExt.indexOf('?') !== -1){
				filenameExt = filenameExt.substr(0, filenameExt.indexOf('?')); 
			}
			
			var splited = filenameExt.split('.');
			return { name : splited[0], ext : splited[1]};
		}

		/***
		* Constructor
		*/
		function __Constructor(){

			// set up this to local scope
			self = this;

			this.lastAjaxUrl;

			this.initialize();
		};



		/** 
		* Prototype
		*/
		__Constructor.prototype = {

			constructor : AjaxRewriter,

			initialize : function(){

				this.overwriteScripts();

				this.emitAjaxReady();

				this.setupAjax();

			},


			/** When page is ready event **/
			onAjaxsReady : function(){

					/**
					var arr = $('#content').find('script')
						for (var n = 0; n < arr.length; n++){
						jQuery.globalEval(arr[n].innerHTML)//run script inside div
					}
					*/
					//$('#ajaxRewriterPopup').find('#ajaxDownloadTpl').css({opacity: 1}).html('Download all missing tpl');
			},

			onAjaxError : function(call, textStatus){

			},

			/**
			* On every single ajax complete
			*/
			onAjaxComplete : function(call){
				runningAjaxCalls--;
			},

			/** 
			* Emit onAjaxReady
			* - when all ajax are completed
			* execute OnAjaxsReady function
			*/
			emitAjaxReady : function(){
				if(runningAjaxCalls <= 0 && runningAjaxCalls !== null){					
					AR.on('onAjaxsReady', function(params){
						self.onAjaxsReady.call(this, params);
					});
					AR.trigger('onAjaxsReady');			
					return;
				}
				setTimeout(function(){
					self.emitAjaxReady();
				}, 1000);
			},

			/**
			* Check if extension is supported
			* and if is enabled ( disabled is same as not supported )
			*/
			isSupportedExtension : function(extension){
				if(typeof AR.settings.supportedExtensions[extension] === 'undefined')
					return false;

				if(AR.settings.supportedExtensions[extension].enabled !== true)
					return false;

				return true;
			},

			rewriteUrl : function(filename){
				return AR.settings.dataUrl+filename.name+'.'+filename.ext;
			},

			overwriteScripts : function(){
				window.registerScript = function(_src) {
					var filename = getFileFromString(_src);
					if(_src == '/static/includes/account/mybt/js/omniture.js') return;

					$.getScript( _src, function( data, textStatus, jqxhr ) {
						AR.log('Script loaded', filename.name, 'ok');
					});
				};
			},
			setupAjax : function(){

				$.ajaxSetup({
					global:true,
					beforeSend : function(call, ajaxSettings){

						console.log(AR.AR_Downloader);
						//AR.AR_Downloader.addDownloadsQuee('test');
						
						// count active ajax calls
						// works only on global calls
						// todo: make it working for all						
						if(ajaxSettings.global)
							runningAjaxCalls++;

						var filename = getFileFromString(ajaxSettings.url);

						// break if not supported extension
						if(self.isSupportedExtension(filename.ext)){


							if(filename.name === 'overview'){
								filename.ext = 'dohtml';
							}

							if(filename.name === 'showMYBTVasTiles'){
								filename.ext = 'dohtml';
							}

							call.old_url = ajaxSettings.url;
							ajaxSettings.url = self.rewriteUrl(filename);
							ajaxSettings.type = 'GET';
							ajaxSettings.dataType = 'JSON';

							call.filename = filename.name;
							call.filenameExt = filename.ext;
						}
					},

					complete : function(){
						$('.myProductsAndServices').css({height: 'auto'});
					},

					/**
					* Emit event & execute event function 
					*/
					error: function(call, textStatus){
						AR.on('onAjaxError', function(call, textStatus){
							self.onAjaxError.apply(this, [call, textStatus]);
						});			
						AR.trigger('onAjaxError', call, textStatus);
					},
				});

				/**
				* Emit event & execute event function 
				*/
				$(document).ajaxComplete(function(call){
					AR.trigger('onAjaxComplete', [call]);
					AR.on('onAjaxComplete', function(){
						self.onAjaxComplete.call(this, [call]);
					});					
				});	
			},

		}

		return new __Constructor();
	};