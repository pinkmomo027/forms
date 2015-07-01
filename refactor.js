var YpEventTracker = (function (yet) {
	
	function track() {
		console.log('track request')
	}

	function setupListeners () {
		var btn= document.getElementById('ws');
		btn.addEventListener('click', track, false);
	}	

	function parseQuery ( query ) {
	   var Params = new Object ();
	   if ( ! query ) return Params; // return empty object
	   var Pairs = query.split(/[;&]/);
	   for ( var i = 0; i < Pairs.length; i++ ) {
	      var KeyVal = Pairs[i].split('=');
	      if ( ! KeyVal || KeyVal.length != 2 ) continue;
	      var key = unescape( KeyVal[0] );
	      var val = unescape( KeyVal[1] );
	      val = val.replace(/\+/g, ' ');
	      Params[key] = val;
	   }
	   return Params;
	}


	yet.init = function () {
		setupListeners();
	}

	// extra query params from this JS file
	yet.parseParams = function () {
		var scripts = document.getElementsByTagName('script');
		var script  = scripts[scripts.length - 1];
		var queryString = script.src.replace(/^[^\?]+\??/,'');
		
		return params = parseQuery(queryString);
	}	

	// to get All form fields 
	yet.get = function () {
		var inputs, index;
		inputs = document.getElementsByTagName('input');
		for (index = 0; index < inputs.length; ++index) {
		    // deal with inputs[index] element.
		}
	}

	return yet;

})(YpEventTracker || {});


// console.log( 'illwer' );
// console.log( yet.parseParams("refactor.js?fn=contact_form&furl=/forms/post.php")) ;
	


function run () {
	 // Non-Microsoft browsers
	if ( document.addEventListener ) {
		document.addEventListener("DOMContentLoaded", YpEventTracker.init, false)
        document.removeEventListener( "DOMContentLoaded", arguments.callee, false );

	 // Microsoft
	} else if ( document.attachEvent ){
		document.attachEvent( 'onreadystatechange', function () {
			if ( document.readyState === "complete" ) {
				document.detachEvent("onreadystatechange", arguments.callee);
				YpEventTracker.init();
			}
		});
	}
}

run();