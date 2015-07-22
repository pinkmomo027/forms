var YpEventTracker = (function (yet) {

	// Reference jQuery
	var ypSubmitterTypes = /^(?:submit|button|image|reset|file)$/i,
		ypSubmittable = /^(?:input|select|textarea|keygen)/i,
		ypCheckableType = (/^(?:checkbox|radio)$/i);

	// fn: FormName
	// fid: FormID
	// fu: FormURL
	// fb: FormSubmitButton

	
	

	function setupListeners () {
		var btn= document.getElementById('ws');
		btn.addEventListener('click', yet.track, false);
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
		var params = '';
		var tmp = [];
		for(i=0; i<document[FormName].elements.length; i++)
		{
		   var fieldName = document[FormName].elements[i].name;
		   var fieldValue = document[FormName].elements[i].value;
		   var elem = document[FormName].elements[i];
		   // if (ypSubmittable.test( elem.tagName ) && !ypSubmitterTypes.test( elem.type ) &&
		   // ( ) )

			if (ypSubmittable.test( elem.tagName ) && !ypSubmitterTypes.test( elem.type ))
				params += fieldName + '=' + fieldValue + '&';
		}
		return params;
	}


	yet.init = function () {
		yet.queryString = '';

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
		yet.queryString = queryString;
		
		return params = parseQuery(queryString);
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
		if (selector == 'furl')
			var form = document.querySelectorAll("[action='" + value + "'']")[0];

		// Select Form by button
		if (selector == 'fb') {
			var btn = document.getElementsByName(value)[0];
			var parent = btn.parentElement;
			while(parent != null) {
				if (parent.tagName == 'FORM')
					break;
				else
					parent = parent.parentElement;
			}
			// console.log(parent);
		}
		
		
		if (form != undefined && form.method == "post")
			form.addEventListener('submit', yet.track, false);

		// if NO valid forms found
		// if (form == undefined) {
		// }

	}

	// Request image pixel
	yet.track = function() {
		var params = serialize('myForm') 
					+ yet.queryString
					+ "&FORM_URL=" + window.location.host
					+ "&aid=1472960";
		// var url = "http://127.0.0.1:8080/rp-dataserver/ws/rpConfig?" + params;
		var url = "http://127.0.0.1:8080/rp-dataserver/ws/rpFormFill?" + params;
		var img = document.createElement('img');
		img.setAttribute('src', url);
		img.setAttribute('alt', 'tracking pixel');
		img.setAttribute('height', '1');
		img.setAttribute('width', '1');
		img.className = "trackingImg";
		console.log("TRACK", url);
		
		// Test URL ( to insert a form field : name )
		// var url = 'http://127.0.0.1:8080/rp-dataserver/ws/rpFormFill?aId=102220&fn=fn&fu=fu&kw=kw&name=liz'
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