window.onload = function() {

	// Patch
	String.prototype.capitalize = function () {
		return this.charAt(0).toUpperCase() + this.slice(1);
	}
	// Turn "abc-def" to "Abc Def"
	String.prototype.humanize = function () {
		var result = this.split("-");
		for (var i=0; i<result.length; i++) {
			result[i] = result[i].capitalize();
		}
		return result.join(" ");
	}

	// Form MetaData
	window.form = {
		currentPage : "form1",
		pages: ['form1', 'form2', 'report1', 'report2'],
		errors      : [],
		valid       : true,
		fields      : {
			'first-name' : 'text',
			'last-name'  : 'text',
			'middle-name': 'text',
			'gender'     : 'radio',
			'dob'        : 'text',
			'age'        : 'radio',
			'hair-color' : 'select',
			'hair-condition'  : 'checkbox',
			'hair-product'    : 'checkbox',
			'hair-style'      : 'checkbox',
			'hair-brand'      : 'checkbox',
			'self-description': 'text',
			'favorite-color'  : 'text',
			'favorite-brand'  : 'text',
			'favorite-music'  : 'text',
			'favorite-food'   : 'text',
  			'salon-often'     : 'radio',
			'hair-salon-freqency' : 'select',
			'long-hair'       : 'radio',
			'hair-length-selection' : 'select'
		},
		data : [],
		invalid : function () {
			form.valid = false;
		},
		//  Get value of field
		get: function (field, type) {
			// get TEXT field value
			if (type == 'text')
				return document.getElementById(field).value;
			// get RADIO value
			if (type == 'radio') {
				var value;
				var radios = document.getElementsByName(field);
				for (var i = 0, length = radios.length; i < length; i++) {
				    if (radios[i].checked) {
        				value = radios[i].value;
    	    			break;
	    			}
				}
				return value;
			}
			// get CHECKBOX value
			if (type == 'checkbox') {
				var value = [];
				var checkboxes = document.getElementsByName(field);
				for (var i=0;i<checkboxes.length;i++) {
					if (checkboxes[i].checked)
						value.push(checkboxes[i].value);
				}
				return value;
			}
			// get SELECT value
			if (type == 'select') {
				var select = document.getElementById(field);
				var index;
				if (select) {
					if (!select.selectedIndex) {
						index = 0;
					} else {
						index = select.selectedIndex;
					}
					return select.options[index].value;
				} else {
					return "";
				}
				
			}

		},
		clearErrors: function () {
			form.errors = [];
		},
		clearInput: function() {
			for(var field in form.fields) {
				var type = form.fields[field];
				if (type == 'text')
					document.getElementById(field).value = '';
				if (type == 'radio' || type == 'checkbox') {
					var radios = document.getElementsByName(field);
					for (var i=0;i<radios.length;i++)
						radios[i].checked = false;
				}
				if (type == 'select'){
					var dom = document.getElementById(field);
					if (dom) 
						document.getElementById(field).selectedIndex = 0;
				}
			}
		},
		showErrors: function () {
			document.getElementById('errors').innerHTML = form.errors.join("</br>");

			var errorDiv = document.getElementById('error');
			errorDiv.classList.remove('underlay');
			errorDiv.classList.add('overlay');

			var emptyDic = document.getElementById('empty-container');
			emptyDic.classList.remove('underlay');
			emptyDic.classList.add('overlay-50');
		},
		hideErrors: function () {
			var errorDiv = document.getElementById('error');
			errorDiv.classList.remove('overlay');
			errorDiv.classList.add('underlay');

			var emptyDic = document.getElementById('empty-container');
			emptyDic.classList.remove('overlay-50');
			emptyDic.classList.add('underlay');
		},
		goForward: function () {
			var index = form.pages.indexOf( form.currentPage );

			if (index < 3) {
				var nextPage = form.pages[index + 1];
				form.goToPage(nextPage);
			}
			if (form.currentPage == 'report1')
				form.generateSummaryReport();
		},
		goBack: function () {

		},
		goToPage: function (page){

			form.clearErrors();

			if (form.currentPage != page){
				document.getElementById(form.currentPage).classList.add('hidden');
				
				document.getElementById(page).classList.remove('hidden');
				form.currentPage = page;
			}

			document.getElementById('continue').disabled = ( page == 'report1' || page == 'report2')
			document.getElementById('go-form1').disabled = (page == 'form2');
			
		},
		saveData: function () {
			var record = {};
			for(var i in form.fields) {
				record[i] = form.get(i, form.fields[i]);
			}
			form.data.push(record);
			form.clearInput();
		},
		getToday: function() {
			var today = new Date();
			var dd = today.getDate();
			var mm = today.getMonth()+1; //January is 0!
			var yyyy = today.getFullYear();

			if(dd<10) {
			    dd='0'+dd
			} 

			if(mm<10) {
			    mm='0'+mm
			} 

			return yyyy+mm+dd;
		},
		validateForm1: function () {
			var required = ['first-name', 'last-name', 'gender', 'age', 'hair-condition', 'hair-color'];
			form.validateRequiredFields(required);

			var dob = document.getElementById('dob').value;
			var dobPattern = /^([0-9]{2})\/([0-9]{2})\/([0-9]{4})$/;
			if( !dobPattern.test(dob)) {
				form.errors.push('DOB must be a valid date of format month/day/year');
			}

			if (form.errors.length > 0)
				form.showErrors();
			else
				form.goForward();
			console.log( form.errors );
		},
		validateForm2: function () {
			var required = ['long-hair', 'salon-often'];
			form.validateRequiredFields(required);
			if (form.errors.length > 0)
				form.showErrors();
			else{
				form.saveData();
				form.goForward();
			}
			console.log( form.errors );
		},
		validateRequiredFields : function (fields) {
			for ( var i=0; i < fields.length; i++) {
				var field = fields[i];
				var val = form.get(field, form.fields[field]);

				if( val == null || val == "") {
					form.invalid();
					form.errors.push( field.humanize() + " is required");
				}
			}
			
		},
		generateSummaryReport: function () {
			var html = [];
			for( var i=0;i<form.data.length;i++) {
				var datum = form.data[i];
				var tmp = "<li> Name: " + datum['first-name'] 
							+ ", " + datum['last-name']
							+ " | Age: " + datum['age']
							+ " | Gender: " + datum['gender']
							+ '  | <span class="detail-link" onClick="window.form.loadDetailReport(' + i + ');" >' 
							+ 'Details' + "</span></li>";
				html.push(tmp);
			}
			document.getElementById('summary-report').innerHTML = html.join('');
		},
		loadDetailReport: function(index) {
			form.goForward();
			var datum = form.data[index];
			var html = "";
			
			for( var field in datum) {
				html += "<ul>" + field.humanize()
						+ " : " + datum[field]
						+ "</ul>";
			}

			document.getElementById('detail-report').innerHTML = html;
		}
	}

	// Side Nav
	document.getElementById('fun2').addEventListener('click', function(){ form.goToPage('report1')} );
	document.getElementById('fun3').addEventListener('click', function(){ form.goToPage('form1')} );

	// Register EventListener
    document.getElementById("continue").addEventListener("click", validateForm);
    document.getElementById("close-error").addEventListener("click", form.hideErrors);
    document.getElementById("go-form1").addEventListener("click", function(){ form.goToPage('form1')});
    document.getElementById("go-report1").addEventListener("click", function(){ form.goToPage('report1')});

    // for ( document.getElementsByTagName('form') i++ ){
    	
    // }
	var isLongHairRadios= document.getElementsByName('long-hair');

    for( var i=0; i<isLongHairRadios.length; i++) {
    	isLongHairRadios[i].onclick = function () {
    		if (this.value == 'yes') {
    			var html = generateSelection('hair-length-selection', ['10 inches','20 inches','30 inches','40 inches','50 inches']);
    			html += ' LONG HAIR';
    		}
    		if (this.value == 'no') {
    			var html = generateSelection('hair-length-selection', ['1 inch','2 inches','3 inches','4 inches','5 inches']);
    			html += ' SHORT HAIR';
    		}
    		document.getElementById('hair-length').innerHTML = html;
    	}
    }

    var isSalonOftenRadios = document.getElementsByName('salon-often');
    for( var i=0; i<isSalonOftenRadios.length;i++) {
    	isSalonOftenRadios[i].onclick = function () {
    		if (this.value == 'yes') {
    			var html = generateSelection('hair-salon-freqency', ['1 day', '2 days', '3 days', '4 days', '5 days'])
    			html += " OFTEN";
    		}
    		if (this.value == 'no') {
    			var html = generateSelection('hair-salon-freqency', ['1 month', '2 months', '3 months', '4 months', '5 months'])    			
    			html += " NOT OFTEN";
    		}
    		document.getElementById('hair-salon').innerHTML = html;
    	}
    }

    function validateForm() {
    	form.clearErrors();
    	if( form.currentPage == 'form1') {
    		form.validateForm1();
    	} else if ( form.currentPage == 'form2') {
    		form.validateForm2();
    	}
    }

    function show(id) {
    	document.getElementById(id).classList.remove('hidden');
    }
    function hide(id) {
    	document.getElementById(id).classList.add('hidden');
    }

    function generateSelection (name, vals) {
    	var result = "<select name='" + name + "' id='" + name + "'>";
    	for ( var i=0;i<vals.length;i++) {
    		result += "<option value='" + vals[i] + "'>" + vals[i] + "</option>";
    	}
    	result += "</select>";
    	return result;
    }
};