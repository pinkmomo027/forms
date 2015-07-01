var YpEventTracker = (function (yet) {
	
	function track() {
		console.log('track request')
	}

	function setupListeners () {
		var btn= document.getElementById('ws');
		btn.addEventListener('click', track, false);
	}	

	yet.init = function () {
		setupListeners();
	}


	// extra query params from this JS file
	yet.parseParams = function () {
		var scripts = document.getElementsByTagName('script');
		var script  = scripts[scripts.length - 1];
		var queryString = script.src.replace(/^[^\?]+\??/,'');
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

		return params = parseQuery(queryString);
	}	

	// console.log( 'illwer' );
	// console.log( yet.parseParams("refactor.js?fn=contact_form&furl=/forms/post.php")) ;

	//  to send XMLRequest
	yet.send = function (data) {
    	var xmlhttp;
    	if (window.XMLHttpRequest) {// code for IE7+, Firefox, Chrome, Opera, Safari
		    xmlhttp=new XMLHttpRequest();
		} else {// code for IE6, IE5
			xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
		}
		xmlhttp.onreadystatechange = function() {
		    if (xmlhttp.readyState==4 && xmlhttp.status==200) 
		    	console.log("Hello It worked");
		        // document.getElementById("myDiv").innerHTML=xmlhttp.responseText;
		    }
		}

		xmlhttp.open('POST', 'post.html', true);
		xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
		xmlhttp.send("name=liz");
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

function run () {
	 // Non-Microsoft browsers
	if ( document.addEventListener ) {
		document.addEventListener("DOMContentLoaded", YpEventTracker.init, false);
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