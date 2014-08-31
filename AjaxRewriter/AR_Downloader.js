
function AR_Downloader(AR){

	var self, settings;

	function __Constructor(){

		self = this;

		this.initialize();
	}


	function downloadURL(url) {
		var hiddenIFrameID = 'hiddenDownloader',
			iframe = document.getElementById(hiddenIFrameID);
		if (iframe === null) {
			iframe = document.createElement('iframe');
			iframe.id = hiddenIFrameID;
			iframe.style.display = 'none';
			document.body.appendChild(iframe);
		}
		iframe.src = url;
	};

	__Constructor.prototype = {

		constructor: __Constructor,

		initialize : function(){
			this.bindEvents();
		},

		/** 
		* Bind plugin to main AR controller events
		*/
		bindEvents : function(){
			AR.on('onAjaxError', function(call, textStatus){
				if(call.filenameExt === 'tpl'){
					var url = AR.settings.externalUrl+call.old_url;
					self.addDownloadsQuee(url);
				}
			});		
		},

		addDownloadsQuee : function(url){
			if(!$('#ajaxRewriterOverlay').length)
			$('body').append('<div id="ajaxRewriterOverlay" style="width: 100%; height: 100%; top: 0px; left: 0px;  position: fixed; z-index: 9999998; background: black; opacity: 0.6;"></div>')
			if(!$('#ajaxRewriterPopup').length){
				$('body, html').css({width: '100%', height: '100%'});
				$('body').append('<div id="ajaxRewriterPopup" style="position: fixed; z-index: 9999999; border: 2px solid red; width: 600px; height: 200px; margin-left: -300px; margin-top: -100px; top: 50%; left: 50%; background:whitesmoke;"><div class="content" style="width: 100%; height: 100%; overflow: hidden; position: relative;"></div></div>');
				$('#ajaxRewriterPopup').find('.content').append('<div id="ajaxDownloadTpl" style="position: absolute; opacity: 0.4; top: 50%; left: 50%; margin-top: -25px; margin-left: -100px; width: 200px; height: 50px; background: red; border-radious: 5px; border: 1px solid black; font-size: 20px; line-height: 50px; color: white; text-align: center; font-weight: bold; cursor: pointer;">Loading ....</div>')
				$('#ajaxRewriterPopup').find('#ajaxDownloadTpl').on('click', function(){
					self.queeDownloads();
				});
			}
			
			this.downloadsQueeArray = ( this.downloadsQueeArray || []);
			this.downloadsQueeArray.push(url);
		},
		queeDownloads : function(){
			var filesCount = this.downloadsQueeArray.length;
			$.each(this.downloadsQueeArray, function(fineIndex, file){
				AR.log('download file', file, 'ok');
				downloadURL(file);
				alert('Click OK when finished saving file ( ' +(fineIndex+1) + '/'+filesCount+' )');
			})
		},


	};

	return new __Constructor();
};