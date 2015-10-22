/*var inputFormDiv = document.querySelector("#inputFormDiv");
var logInfoDiv = document.querySelector("#logInfoDiv");*/
var htmlNode = document.querySelector("html");
var bodyNode = document.querySelector("body");
var prefContainer = document.querySelector("#preferences-container");
/*var tokenForm = document.querySelector("#tokenForm");
var tokenInput = document.querySelector("#tokenInput");
var logoutButton = document.querySelector("#logoutButton");*/
//var zoomEnableCkecbox = document.querySelector("#zoom-enable-checkbox");
//var zoomLevel = document.querySelector("#zoom-level");
var invertColours = document.querySelector("#high-contrast-invert-colours");
var highContrastBlackWhite = document.querySelector("#high-contrast-black-white");
var highContrastWhiteBlack = document.querySelector("#high-contrast-white-black");
var highContrastYellowBlack = document.querySelector("#high-contrast-yellow-black");
var highContrastBlackYellow = document.querySelector("#high-contrast-black-yellow");
var noHighContrast = document.querySelector("#no-high-contrast");
var fontSizeNormal = document.querySelector("#font-size-normal");
var fontSizeLarge = document.querySelector("#font-size-large");
var fontSizeXLarge = document.querySelector("#font-size-x-large");
var fontFaceSelect = document.querySelector("#font-face-select");
var cursorSizeNormal = document.querySelector("#cursor-size-normal");
var cursorSizeLarge = document.querySelector("#cursor-size-large");
var cursorSizeXLarge = document.querySelector("#cursor-size-x-large");
var zoomUpButton = document.querySelector("#eZoomUpButton");
var zoomDownButton = document.querySelector("#eZoomDownButton");
var zoomDisplay = document.querySelector("#eZoomDisplay");
var linespaceUpButton = document.querySelector("#eLinespaceUpButton");
var linespaceDownButton = document.querySelector("#eLinespaceDownButton");
var linespaceDisplay = document.querySelector("#eLinespaceDisplay");
var synonymsen = document.querySelector("#synonyms-en-checkbox");

var currentToken = "";
var panelSizeCurrent = 435;
var fontFaceCurrent = "none";
var wmedium = 435;
var wlarge = 500;
var wxlarge = 580;
var zoom = 1;
var diference = 0;

self.port.on("setPreferencesForm", function(settings) {
	console.log("##### Entra en setPreferencesForm");
	setPreferencesForm(settings);
});

self.port.on("show", function(token) {

	/*if (token == "") {
		inputFormDiv.style.display = 'block';
		logInfoDiv.style.display = 'none';

		tokenInput.focus();

	} else {
		inputFormDiv.style.display = 'none';
		logInfoDiv.style.display = 'block';
		document.querySelector("#logInfoName").innerHTML = "Hi there, " + token;
	}*/

	/*logoutButton.addEventListener("click", function(e) {
		self.port.emit("logout");
	});*/

	/*self.port.on('network-error', function(response) {
		document.querySelector('#warning').innerHTML = "ERROR " + response.status + ": " + response.statusText;
		document.querySelector('#warning').style.display = 'block';

	});*/
	
	/*tokenInput.onkeyup = function(event) {
		document.querySelector('#warning').style.display = 'none';
		if (event.keyCode == 13) {
			text = tokenInput.value.replace(/(\r\n|\n|\r)/gm,""); 
			currentToken = token;
			self.port.emit("text-entered", text);
		}
	}*/

});

// Function that initializes the popup
function setPreferencesForm(npsetObject) {

	if (npsetObject.hasOwnProperty('token') && npsetObject.hasOwnProperty('preferences')) {
	// The needs and preferences object has a property 'token' and a property 'preferences'

		if (npsetObject['token'] == "") {
			// The preferences object is empty and the token is an empty string

			/*console.log('set of needs and preferences not stored locally');
			inputFormDiv.style.display = 'block';
			logInfoDiv.style.display = 'none';

			tokenInput.focus();*/
			// chrome.tts.speak("Welcome to Cloud For All. Press TAB for options.");

		} else {
			// Either the token is a valid string or there are actual preferences 
			console.log('set of needs and preferences stored locally');
		  
			// The preferences object is not empty
			var preferences = npsetObject['preferences'];
		
			if (preferences.hasOwnProperty("fontSize")) {
				console.log("FontSize: " + preferences["fontSize"]);
				var fontSize = preferences["fontSize"];
				if(fontSize == "M")
				{
					fontSizeHandler("M", "", 435, false);
					fontSizeNormal.checked = true;
				} 
				else if(fontSize == "L")
				{
					fontSizeHandler("L", "large-cp", 500, false);
					fontSizeLarge.checked = true;
				} 
				else if(fontSize == "XL")
				{
					fontSizeHandler("XL", "x-large-cp", 580, false);
					fontSizeXLarge.checked = true;
				} 
			}
			else
			{
				fontSizeHandler("M", "", 435, false);
				fontSizeNormal.checked = true;
			}
			
			if (preferences.hasOwnProperty("fontFace")) {
				console.log(
					"FONT FACE: " +
					preferences["fontFace"]
				);
				fontFaceSelect.value = preferences["fontFace"];
			}
			
			if (preferences.hasOwnProperty("magnification")) {
				console.log(
					"MAGNIFICATION: " +
					preferences["magnification"]
				);
				var zoomDisplayValue = preferences["magnification"];
				zoomDisplayValue = zoomDisplayValue.toFixed(2) * 100;
				zoomDisplay.value = zoomDisplayValue + "%";
			}
			else
			{
				zoomDisplay.value = "100%";
			}
			
			if (preferences.hasOwnProperty("lineheight")) {
				console.log(
					"LINEHEIGHT: " +
					preferences["lineheight"]
				);
				var lineheightDisplayValue = preferences["lineheight"];
				lineheightDisplayValue = lineheightDisplayValue.toFixed(2) * 100;
				linespaceDisplay.value = lineheightDisplayValue + "%";
			}
			else
			{
				linespaceDisplay.value = "100%";
			}
				
			//if(!zoomEnableCkecbox.checked) zoomLevel.disabled = true;

			if (preferences.hasOwnProperty("highContrastEnabled") && preferences["highContrastEnabled"] == true && preferences.hasOwnProperty("backgroundColour") && preferences.hasOwnProperty("foregroundColour")) {
				var background = preferences["backgroundColour"];
				var foreground = preferences["foregroundColour"];
				
				if(background == "#000000" && foreground == "#FFFFFF")
				{
					highContrastWhiteBlack.checked = true;
					highContrastHandler("#000000", "#FFFFFF", "wbcp", false);
				} 
				else if(background == "#FFFFFF" && foreground == "#000000")
				{
					highContrastBlackWhite.checked = true;
					highContrastHandler("#FFFFFF", "#000000", "bwcp", false);
				} 
				else if(background == "#000000" && foreground == "#FFFF00")
				{
					highContrastYellowBlack.checked = true;
					highContrastHandler("#000000", "#FFFF00", "ybcp", false);
				} 
				else if(background == "#FFFF00" && foreground == "#000000")
				{
					highContrastBlackYellow.checked = true;
					highContrastHandler("#FFFF00", "#000000", "bycp", false);
				} 
				else
				{
					noHighContrast.checked = true;
					highContrastHandler("", "", "", false);
				}
			}
			else
			{
				noHighContrast.checked = true;
				highContrastHandler("", "", "", false);
			}

			if (preferences.hasOwnProperty("invertColours") && preferences["invertColours"] == true) {
				console.log(
					"INVERT COLORS: " +
					preferences["invertColours"]
				);
				var inverted = preferences["invertColours"];
				invertColours.checked = inverted;
				if(inverted) invertColorHandler(false);
			}
			
			if (preferences.hasOwnProperty("synonyms")) {
				console.log(
					"SYNONYMS: " +
					preferences["synonyms"]
				);
				var synonyms = preferences["synonyms"];
				invertColours.checked = synonyms;
			}
			
			if (preferences.hasOwnProperty("cursorSize")) {
				console.log("CursorSize: " + preferences["cursorSize"]);
				var fontSize = preferences["cursorSize"];
				if(fontSize == "normal")
				{
					cursorSizeNormal.checked = true;
					htmlNode.removeAttribute('cs');
				} 
				else if(fontSize == "large")
				{
					cursorSizeLarge.checked = true;
					htmlNode.setAttribute('cs', "large-cp");
				} 
				else if(fontSize == "x-large")
				{
					cursorSizeXLarge.checked = true;
					htmlNode.setAttribute('cs', "x-large-cp");
				} 
			}
			else
			{
				cursorSizeNormal.checked = true;
				htmlNode.removeAttribute('cs');
			}
		
		} // The preferences object is empty and the token is an empty string
	} else {
	// The preferences object lacks the token property or the preferences property
	console.log('The JSON object is not well built');
	} 
}	

/*zoomEnableCkecbox.addEventListener("click", function(e) {
	var magEnable = zoomEnableCkecbox.checked;
	if(magEnable)
	{
		var preferences = { magnifierEnabled : magEnable, magnification : zoomLevel.value };
		zoomLevel.disabled = false;
		self.port.emit("updatePreferences", preferences);
	}
	else
	{
		var preferences = { magnifierEnabled : magEnable, magnification : 1 };
		zoomLevel.disabled = true;
		self.port.emit("updatePreferences", preferences);
	}
	//console.log("Zoom cambiado: " + zoomLevel.value);
});*/

zoomUpButton.addEventListener("click", function(e) {
	updateZoom("+");
});

zoomDownButton.addEventListener("click", function(e) {
	updateZoom("-");
});

function updateZoom(op)
{
	//var scrolly = window.scrollY;
	var zoomDisplayValues = zoomDisplay.value.split("%");
	var zoomDisplayValue = parseInt(zoomDisplayValues[0]);
	if(zoomDisplayValue > 300) 
	{
		zoomDisplayValue = 300;
	}
	else if(zoomDisplayValue < 100) 
	{
		zoomDisplayValue = 100;
	}
	else if(zoomDisplayValue < 300 && op == "+")
	{
		zoomDisplayValue = zoomDisplayValue + 10;
		//scrolly = scrolly + 20;
	}
	else if(zoomDisplayValue > 100 && op == "-")
	{
		zoomDisplayValue = zoomDisplayValue - 10;
		//scrolly = scrolly - 20;
	}
	var zoomCoef = zoomDisplayValue/100;
	//zoomDisplayValue = perseInt(zoomCoef * 100);
	console.log("Zoom Display Values: " + zoomDisplayValues);
	zoomDisplay.value = zoomDisplayValue + "%";
	
	var preferences = { magnification : zoomCoef, magnifierEnabled : true };
	self.port.emit("updatePreferences", preferences);
	
	zoom = zoomCoef;
	
	document.body.style.transform = "scale(" + zoomCoef + ")";
	document.body.style.transformOrigin = "0 0";
	
	if(zoomCoef <= 2)
	{
		var size = panelSizeCurrent + (panelSizeCurrent * ((zoomCoef - 1))) + diference + (diference * (zoomCoef - 1));
		self.port.emit("width-panel", size);
	}
	
	/*document.documentElement.style.zoom = zoomCoef;
	window.scrollTo(500, scrolly);
	localPreferences.magnification = zoomCoef;
    chrome.storage.local.set({ preferences : localPreferences });
	
	//adjust cursor radio buttons	
	//var mtop = $('#cursor-size-x-large').css('margin-top').split('px');
	//var currentMtop = parseInt((parseInt(mtop[0]) / zoomCoef) * 100) / 100;
	var currentMtop = parseInt((35 / zoomCoef) * 100) / 100;
	var value = currentMtop + 'px';
	$('#cursor-size-x-large').css('margin-top', value);
	currentMtop = parseInt((18 / zoomCoef) * 100) / 100;
	value = currentMtop + 'px';
	$('#cursor-size-large').css('margin-top', value);*/
}

/*zoomLevel.addEventListener("click", function(e) {
	var zoom = zoomLevel.value;
	if(zoom > 3) {zoom = 3;}
	else if(zoom < 1) {zoom = 1;}
	zoomLevel.value = zoom;
	var preferences = { magnification : zoom, magnifierEnabled : true };
	self.port.emit("updatePreferences", preferences);
	//console.log("Zoom cambiado: " + zoomLevel.value);
});

zoomLevel.onkeyup = function(event) {
	var zoom = zoomLevel.value;
	if(zoom > 3) {zoom = 3;}
	else if(zoom < 1) {zoom = 1;}
	zoomLevel.value = zoom;
	var preferences = { magnification : zoom, magnifierEnabled : true };
	self.port.emit("updatePreferences", preferences);
};*/

fontSizeNormal.addEventListener("click", function(e) {
	fontSizeHandler("M", "", 435, true);
	/*var preferences = { fontSize : "M" };
	self.port.emit("updatePreferences", preferences);
	htmlNode.removeAttribute('ts');
	panelSizeCurrent = 435;
	panelSizeFontAdapt();*/
	//console.log("Zoom cambiado: " + zoomLevel.value);
});

fontSizeLarge.addEventListener("click", function(e) {
	fontSizeHandler("L", "large-cp", 500, true);
	/*var preferences = { fontSize : "L" };
	self.port.emit("updatePreferences", preferences);
	htmlNode.setAttribute('ts', 'large-cp');
	panelSizeCurrent = 500;
	panelSizeFontAdapt();*/
	//console.log("Zoom cambiado: " + zoomLevel.value);
});

fontSizeXLarge.addEventListener("click", function(e) {
	fontSizeHandler("XL", "x-large-cp", 580, true);
	/*var preferences = { fontSize : "XL" };
	self.port.emit("updatePreferences", preferences);
	htmlNode.setAttribute('ts', 'x-large-cp');
	panelSizeCurrent = 580;
	panelSizeFontAdapt();*/
	//console.log("Zoom cambiado: " + zoomLevel.value);
});

highContrastBlackWhite.addEventListener("click", function(e) {
	highContrastHandler("#FFFFFF", "#000000", 'bwcp', true);
	/*var preferences = { "invertColours" : false };
	self.port.emit("updatePreferences", preferences);
	var preferences = { "backgroundColour" : "#FFFFFF", "foregroundColour" : "#000000" };
	self.port.emit("updatePreferences", preferences);
	htmlNode.removeAttribute('ic');
	htmlNode.setAttribute('hc', 'bwcp');
	console.log("Black over white.");*/
});

highContrastWhiteBlack.addEventListener("click", function(e) {
	highContrastHandler("#000000", "#FFFFFF", 'wbcp', true);
	/*var preferences = { "invertColours" : false };
	self.port.emit("updatePreferences", preferences);
	var preferences = { "backgroundColour" : "#000000", "foregroundColour" : "#FFFFFF" };
	self.port.emit("updatePreferences", preferences);
	htmlNode.removeAttribute('ic');
	htmlNode.setAttribute('hc', 'wbcp');*/
	//console.log("Zoom cambiado: " + zoomLevel.value);
});

highContrastYellowBlack.addEventListener("click", function(e) {
	highContrastHandler("#000000", "#FFFF00", 'ybcp', true);
	/*var preferences = { "invertColours" : false };
	self.port.emit("updatePreferences", preferences);
	var preferences = { "backgroundColour" : "#000000", "foregroundColour" : "#FFFF00" };
	self.port.emit("updatePreferences", preferences);
	htmlNode.removeAttribute('ic');
	htmlNode.setAttribute('hc', 'ybcp');*/
	//console.log("Zoom cambiado: " + zoomLevel.value);
});

highContrastBlackYellow.addEventListener("click", function(e) {
	highContrastHandler("#FFFF00", "#000000", 'bycp', true);
	/*var preferences = { "invertColours" : false };
	self.port.emit("updatePreferences", preferences);
	var preferences = { "backgroundColour" : "#FFFF00", "foregroundColour" : "#000000" };
	self.port.emit("updatePreferences", preferences);
	htmlNode.removeAttribute('ic');
	htmlNode.setAttribute('hc', 'bycp');*/
	//console.log("Zoom cambiado: " + zoomLevel.value);
});

noHighContrast.addEventListener("click", function(e) {
	//highContrastHandler("", "", '', true);
	var preferences = { "invertColours" : false };
	self.port.emit("updatePreferences", preferences);
	preferences = { "backgroundColour" : "", "foregroundColour" : "",  "highContrastEnabled": true };
	self.port.emit("updatePreferences", preferences);
	
	//var preferences = { "backgroundColour" : "", "foregroundColour" : "", "invertColours" : false };
	//self.port.emit("updatePreferences", preferences);
	htmlNode.removeAttribute('hc');
	htmlNode.removeAttribute('ic');
	//console.log("Zoom cambiado: " + zoomLevel.value);
});

invertColours.addEventListener("click", function(e) {
	invertColorHandler(true);
	/*var magEnable = invertColoursCheckbox.checked;
	if(magEnable)
	{*/
		/*var preferences = { "backgroundColour" : "", "foregroundColour" : "", invertColours :  true};
		self.port.emit("updatePreferences", preferences);
		htmlNode.removeAttribute('hc');
		htmlNode.setAttribute('ic', 'invertcp');*/
	/*}
	else
	{
		var preferences = {  invertColours : false };
		self.port.emit("updatePreferences", preferences);
	}*/
});

linespaceUpButton.addEventListener("click", function(e) {
	updateLinespace("+");
});

linespaceDownButton.addEventListener("click", function(e) {
	updateLinespace("-");
});

function updateLinespace(op)
{
	var linespaceDisplayValues = linespaceDisplay.value.split('%');
	var linespaceDisplayValue = parseInt(linespaceDisplayValues[0]);
	if(linespaceDisplayValue > 300) 
	{
		linespaceDisplayValue = 300;
	}
	else if(linespaceDisplayValue < 100) 
	{
		linespaceDisplayValue = 100;
	}
	else if(linespaceDisplayValue < 300 && op == "+")
	{
		linespaceDisplayValue = linespaceDisplayValue + 10;
	}
	else if(linespaceDisplayValue > 100 && op == "-")
	{
		linespaceDisplayValue = linespaceDisplayValue - 10;
	}
	var linespaceCoef = linespaceDisplayValue/100;
	linespaceCoef = linespaceCoef.toFixed(2);
	//zoomDisplayValue = perseInt(zoomCoef * 100);
	linespaceDisplay.value = linespaceDisplayValue + "%";
	
	var preferences = {  lineheight : linespaceCoef };
	self.port.emit("updatePreferences", preferences);
}

fontFaceSelect.addEventListener("change", function(e) {
	var fontFaceValue = fontFaceSelect.value;
	var fontFaceClass = fontFaceValue.replace(" ", "-").replace(" ", "-").toLowerCase()  + "-cp";
	if(fontFaceValue == 'none')
	{
		htmlNode.removeAttribute('ft');
	}
	else
	{
		htmlNode.setAttribute('ft', fontFaceClass);
	}
	var preferences = { fontFace : fontFaceValue };
	self.port.emit("updatePreferences", preferences);
	fontFaceCurrent = fontFaceClass;
	panelSizeFontAdapt();
});

cursorSizeNormal.addEventListener("click", function(e) {
	var preferences = { cursorSize : "normal" };
	self.port.emit("updatePreferences", preferences);
		htmlNode.removeAttribute('cs');
	//console.log("Zoom cambiado: " + zoomLevel.value);
});

cursorSizeLarge.addEventListener("click", function(e) {
	var preferences = { cursorSize : "large" };
	self.port.emit("updatePreferences", preferences);
	htmlNode.setAttribute('cs', "large-cp");
	//console.log("Zoom cambiado: " + zoomLevel.value);
});

cursorSizeXLarge.addEventListener("click", function(e) {
	var preferences = { cursorSize : "x-large" };
	self.port.emit("updatePreferences", preferences);
	htmlNode.setAttribute('cs', "x-large-cp");
	//console.log("Zoom cambiado: " + zoomLevel.value);
});

synonymsen.addEventListener("click", function(e) {
	var active = synonymsen.checked;
	var preferences = { synonyms : active };

	self.port.emit("updatePreferences", preferences);
});

// --- events handler ---

function fontSizeHandler(fontSizeValue, fontSizeClass, panelSize, store)
{
	if(store)
	{
		var preferences = { fontSize : fontSizeValue };
		self.port.emit("updatePreferences", preferences);
	}
	if(fontSizeValue == 'M')
	{
		htmlNode.removeAttribute('ts');
	}
	else
	{
		htmlNode.setAttribute('ts', fontSizeClass);
	}	
	panelSizeCurrent = panelSize;
	panelSizeFontAdapt();
}

function highContrastHandler(backgroundValue, foregroundValue, highContrastClass, store)
{
	if(store)
	{
		var preferences = { "invertColours" : false };
		self.port.emit("updatePreferences", preferences);
		preferences = { "backgroundColour" : backgroundValue, "foregroundColour" : foregroundValue,  "highContrastEnabled": true };
		self.port.emit("updatePreferences", preferences);
	}
	htmlNode.removeAttribute('ic');
	if(highContrastClass == '')
	{
		htmlNode.removeAttribute('hc');
	}
	else
	{
		htmlNode.setAttribute('hc', highContrastClass);
	}
}

function invertColorHandler(store)
{
	if(store)
	{
		var preferences = { "backgroundColour" : "", "foregroundColour" : "", "highContrastEnabled": false};
		self.port.emit("updatePreferences", preferences);
		preferences = { "invertColours" :  true };
		self.port.emit("updatePreferences", preferences);
	}
	htmlNode.removeAttribute('hc');
	htmlNode.setAttribute('ic', 'invertcp');
}

function panelSizeFontAdapt()
{
	diference = 0;
	if(fontFaceCurrent == "verdana-cp")
	{
		if(panelSizeCurrent == wmedium){diference = 35;}
		else if(panelSizeCurrent == wlarge) {diference = 55;}
		else if(panelSizeCurrent == wxlarge) {diference = 90;}
	}
	else if(fontFaceCurrent == "courier-cp")
	{
		if(panelSizeCurrent == wmedium){diference = 140;}
		else if(panelSizeCurrent == wlarge) {diference = 155;}
		else if(panelSizeCurrent == wxlarge) {diference = 200;}
	}
	else if(fontFaceCurrent == "comic-sans-ms-cp")
	{
		if(panelSizeCurrent == wmedium){diference = 15;}
		else if(panelSizeCurrent == wlarge) {diference = 25;}
		else if(panelSizeCurrent == wxlarge) {diference = 40;}
	}
	var size = (panelSizeCurrent + getAddedToDiference(panelSizeCurrent)) + (diference + getAddedToDiference(diference));
	self.port.emit("width-panel", size);
}

function getAddedToDiference(dif)
{
	return dif * (zoom - 1);
}