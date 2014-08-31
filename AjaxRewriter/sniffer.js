/** SNIFFER TO USE IN Firebug Console */
/* NOT WORKING YET */


				$.ajaxSetup({
					global:true,
					beforeSend : function(call, ajaxSettings){
						console.log('--- sniffer ----');
						console.log(call);
					},

					complete : function(){

					},

					/**
					* Emit event & execute event function 
					*/
					error: function(call, textStatus){

					},
				});