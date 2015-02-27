var inputFormDiv = document.querySelector("#inputFormDiv");
var logInfoDiv = document.querySelector("#logInfoDiv");
var tokenForm = document.querySelector("#tokenForm");
var tokenInput = document.querySelector("#tokenInput");
var logoutButton = document.querySelector("#logoutButton");
var zoomEnableCkecbox = document.querySelector("#zoom-enable-checkbox");
var zoomLevel = document.querySelector("#zoom-level");
var invertColoursCheckbox = document.querySelector("#invert-colours-checkbox");
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

var currentToken = "";

self.port.on("setPreferencesForm", function(settings) {
	console.log("##### Entra en setPreferencesForm");
	setPreferencesForm(settings);
});

self.port.on("show", function(token) {

	if (token == "") {
		inputFormDiv.style.display = 'block';
		logInfoDiv.style.display = 'none';

		tokenInput.focus();

	} else {
		inputFormDiv.style.display = 'none';
		logInfoDiv.style.display = 'block';
		document.querySelector("#logInfoName").innerHTML = "Hi there, " + token;
	}

	logoutButton.addEventListener("click", function(e) {
		self.port.emit("logout");
	});

	/*self.port.on('network-error', function(response) {
		document.querySelector('#warning').innerHTML = "ERROR " + response.status + ": " + response.statusText;
		document.querySelector('#warning').style.display = 'block';

	});*/
	
	tokenInput.onkeyup = function(event) {
		document.querySelector('#warning').style.display = 'none';
		if (event.keyCode == 13) {
			text = tokenInput.value.replace(/(\r\n|\n|\r)/gm,""); 
			currentToken = token;
			self.port.emit("text-entered", text);
		}
	}

});

// Function that initializes the popup
function setPreferencesForm(npsetObject) {

	if (npsetObject.hasOwnProperty('token') && npsetObject.hasOwnProperty('preferences')) {
	// The needs and preferences object has a property 'token' and a property 'preferences'

	  if (npsetObject['token'] == "") {
		// The preferences object is empty and the token is an empty string
	  
		console.log('set of needs and preferences not stored locally');
		inputFormDiv.style.display = 'block';
		logInfoDiv.style.display = 'none';

		tokenInput.focus();
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
				fontSizeNormal.checked = true;
			} 
			else if(fontSize == "L")
			{
				fontSizeLarge.checked = true;
			} 
			else if(fontSize == "XL")
			{
				fontSizeXLarge.checked = true;
			} 
		}
		else
		{
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
			zoomEnableCkecbox.checked = preferences["magnifierEnabled"];
			zoomLevel.value = preferences["magnification"];
		}
		else
		{
			zoomEnableCkecbox.checked = false;
			zoomLevel.value = 1;
		}
			
		if(!zoomEnableCkecbox.checked) zoomLevel.disabled = true;

		if (preferences.hasOwnProperty("backgroundColour") && preferences.hasOwnProperty("foregroundColour")) {
			var background = preferences["backgroundColour"];
			var foreground = preferences["foregroundColour"];
			
			if(background == "#000000" && foreground == "#FFFFFF")
			{
				highContrastWhiteBlack.checked = true;
			} 
			else if(background == "#FFFFFF" && foreground == "#000000")
			{
				highContrastBlackWhite.checked = true;
			} 
			else if(background == "#000000" && foreground == "#FFFF00")
			{
				highContrastYellowBlack.checked = true;
			} 
			else if(background == "#FFFF00" && foreground == "#000000")
			{
				highContrastBlackYellow.checked = true;
			} 
			else
			{
				noHighContrast.checked = true;
			}
		}
		else
		{
			noHighContrast.checked = true;
		}

		if (preferences.hasOwnProperty("invertColours")) {
			console.log(
				"INVERT COLORS: " +
				preferences["invertColours"]
			);
			invertColoursCheckbox.checked = preferences["invertColours"];
		}
		
		if (preferences.hasOwnProperty("cursorSize")) {
			console.log("CursorSize: " + preferences["cursorSize"]);
			var fontSize = preferences["cursorSize"];
			if(fontSize == "normal")
			{
				cursorSizeNormal.checked = true;
			} 
			else if(fontSize == "large")
			{
				cursorSizeLarge.checked = true;
			} 
			else if(fontSize == "x-large")
			{
				cursorSizeXLarge.checked = true;
			} 
		}
		else
		{
			cursorSizeNormal.checked = true;
		}
		
	  } // The preferences object is empty and the token is an empty string
	} else {
	// The preferences object lacks the token property or the preferences property
	console.log('The JSON object is not well built');
	} 
}	

zoomEnableCkecbox.addEventListener("click", function(e) {
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
});

zoomLevel.addEventListener("click", function(e) {
	var zoom = zoomLevel.value;
	var preferences = { magnification : zoom, magnifierEnabled : true };
	self.port.emit("updatePreferences", preferences);
	//console.log("Zoom cambiado: " + zoomLevel.value);
});

zoomLevel.onkeyup = function(event) {
	var zoom = zoomLevel.value;
	var preferences = { magnification : zoom, magnifierEnabled : true };
	self.port.emit("updatePreferences", preferences);
}

fontSizeNormal.addEventListener("click", function(e) {
	var preferences = { fontSize : "M" };
	self.port.emit("updatePreferences", preferences);
	//console.log("Zoom cambiado: " + zoomLevel.value);
});

fontSizeLarge.addEventListener("click", function(e) {
	var preferences = { fontSize : "L" };
	self.port.emit("updatePreferences", preferences);
	//console.log("Zoom cambiado: " + zoomLevel.value);
});

fontSizeXLarge.addEventListener("click", function(e) {
	var preferences = { fontSize : "XL" };
	self.port.emit("updatePreferences", preferences);
	//console.log("Zoom cambiado: " + zoomLevel.value);
});

highContrastBlackWhite.addEventListener("click", function(e) {
	var preferences = { backgroundColour : "#FFFFFF", "foregroundColour" : "#000000" };
	self.port.emit("updatePreferences", preferences);
	//console.log("Zoom cambiado: " + zoomLevel.value);
});

highContrastWhiteBlack.addEventListener("click", function(e) {
	var preferences = { backgroundColour : "#000000", "foregroundColour" : "#FFFFFF" };
	self.port.emit("updatePreferences", preferences);
	//console.log("Zoom cambiado: " + zoomLevel.value);
});

highContrastYellowBlack.addEventListener("click", function(e) {
	var preferences = { backgroundColour : "#000000", "foregroundColour" : "#FFFF00" };
	self.port.emit("updatePreferences", preferences);
	//console.log("Zoom cambiado: " + zoomLevel.value);
});

highContrastBlackYellow.addEventListener("click", function(e) {
	var preferences = { backgroundColour : "#FFFF00", "foregroundColour" : "#000000" };
	self.port.emit("updatePreferences", preferences);
	//console.log("Zoom cambiado: " + zoomLevel.value);
});

noHighContrast.addEventListener("click", function(e) {
	var preferences = { backgroundColour : "", "foregroundColour" : "" };
	self.port.emit("updatePreferences", preferences);
	//console.log("Zoom cambiado: " + zoomLevel.value);
});

invertColoursCheckbox.addEventListener("click", function(e) {
	
	var magEnable = invertColoursCheckbox.checked;
	if(magEnable)
	{
		var preferences = { invertColours :  true};
		self.port.emit("updatePreferences", preferences);
	}
	else
	{
		var preferences = {  invertColours : false };
		self.port.emit("updatePreferences", preferences);
	}
});

fontFaceSelect.addEventListener("change", function(e) {
	var preferences = { fontFace : fontFaceSelect.value };
	self.port.emit("updatePreferences", preferences);
});

cursorSizeNormal.addEventListener("click", function(e) {
	var preferences = { cursorSize : "normal" };
	self.port.emit("updatePreferences", preferences);
	//console.log("Zoom cambiado: " + zoomLevel.value);
});

cursorSizeLarge.addEventListener("click", function(e) {
	var preferences = { cursorSize : "large" };
	self.port.emit("updatePreferences", preferences);
	//console.log("Zoom cambiado: " + zoomLevel.value);
});

cursorSizeXLarge.addEventListener("click", function(e) {
	var preferences = { cursorSize : "x-large" };
	self.port.emit("updatePreferences", preferences);
	//console.log("Zoom cambiado: " + zoomLevel.value);
});
