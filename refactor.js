var YpEventTracker = (function (yet) {

	var ypSubmitterTypes = /^(?:submit|button|image|reset|file)$/i,
		ypSubmittable = /^(?:input|select|textarea|keygen)/i;

	// fn: FormName
	// fid: FormID
	// fu: FormURL
	// fb: FormSubmitButton

	
	// Request image pixel
	function track() {
		var url = "http://127.0.0.1:8080/rp-dataserver/ws/rpConfig";
		var img = document.createElement('img');
		img.setAttribute('src', url);
		img.setAttribute('alt', 'tracking pixel');
		img.setAttribute('height', '1');
		img.setAttribute('width', '1');
		img.className = "trackingImg";
		console.log("TRACK");
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

	function serialize (FormName) {
		var params;
		for(i=0; i<document.FormName.elements.length; i++)
		{
		   var fieldName = document.FormName.elements[i].name;
		   var fieldValue = document.FormName.elements[i].value;
		   params += fieldName + '=' + fieldValue + '&';
		}
		return params;
	}


	yet.init = function () {
		var params = yet.parseParams();
		for (selector in params) {
			yet.selectForms(selector, params[selector])
		}

		yet.selectForms('fb', 'submit')
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

	yet.selectForms = function (selector, value) {
		console.log(selector, value);
		if (value == undefined)
			return;
		var form;
		// Select Form by fname
		if (selector == 'fn')
			var form = document.getElementsByName(value)[0];

		// Select Form by ID
		if (selector == 'fid')
			var form = document.getElementById(value);

		// Select Form by URL
		if (selector == 'fu')
			var form = document.querySelectorAll("[action='" + value + "'']")[0];

		// Select Form by button
		if (selector == 'fb') {
			var btn = document.getElementById(value);
			var parent = btn.parentElement;
			while(parent != null) {
				if (parent.tagName == 'FORM')
					break;
				else
					parent = parent.parentElement;
			}
			console.log(parent);
		}
		
		
		if (form != undefined && form.method == "post")
			form.addEventListener('submit', track, false);

	}

	return yet;

})(YpEventTracker || {});

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