const widget = require("sdk/widget");
const self = require("sdk/self");
const panel = require("sdk/panel");
const ss = require("sdk/simple-storage");
const simplePrefs = require("sdk/simple-prefs");
const Request = require('sdk/request').Request;
const notifications = require("sdk/notifications");
const pageMod = require('sdk/page-mod');
const tabs = require('sdk/tabs');
var pageWorkers = require("sdk/page-worker");

/*var preferencesJson;
var sendPref = false;*/
var mod = null;
var uri = "org.mozilla.cloud4firefox";
var npserver = 'http://127.0.0.1:8081/';
//var npserver = 'http://flowmanager.gpii.net/';
var suffix = '/settings/%7B"OS":%7B"id":"web"%7D,"solutions":[%7B"id":"org.mozilla.cloud4firefox"%7D]%7D';
var magnificationPageMod,
	backgroundColorPageMod,
	foregroundColorPageMod,
	fontSizePageMod,
	simplifierPageMod;

var {Cc, Ci} = require("chrome");

var mozillaPrefs = Cc["@mozilla.org/preferences-service;1"].getService(Ci.nsIPrefService);

var branch = mozillaPrefs.getBranch("browser.display.");
var layout = mozillaPrefs.getBranch("layout.css.");

var cloud4allPopUp = panel.Panel({
  width: 400,
  contentURL: self.data.url("html/popup.html"),
  contentScriptFile: self.data.url('js/popup.js')
});

var cloud4allWidget = widget.Widget({
	id: "cloud4allWidget",
	label: "Click here to open Cloud4all",
	contentURL: self.data.url("images/icon19.png"),
	panel: cloud4allPopUp
});

cloud4allPopUp.on("show", function() {
	/*console.log("Entra en botón...");
	if(sendPref) 
	{
		console.log("Entra en if botón... " + JSON.stringify(preferencesJson));
		cloud4allPopUp.port.emit("setPreferencesForm", preferencesJson);
		sendPref = false;
	}*/
	cloud4allPopUp.port.emit("show", simplePrefs.prefs.token);
});

cloud4allPopUp.port.on("text-entered", function(text) {
    console.log(npserver + text + suffix);
	var preferencesRequest = Request({
		url: npserver + text + suffix,
		onComplete: function(response) {
			if (response.status == 200) {
				console.log("TOKEN REQUEST. Response status: " + response.status);
				cloud4allPopUp.hide();
				notifications.notify({
					title: "Hi there " + text,
					text: "You are now logged in Cloud4all. If you want to key out, press the icon on the widget area",
					iconURL: self.data.url("images/logocloud_32.png")
				});
				console.log(response.text);
				//storePreferences(response.text);
				//storePreferences({ token : text, preferences: response.json[uri] });
				var settings = { token : text, preferences: response.json[uri] };
				storePreferences(settings);
				
				cloud4allPopUp.port.emit("setPreferencesForm", settings);

			} else {
				cloud4allPopUp.port.emit("network-error", {status: response.status, statusText: response.statusText});
			}
		}
	});	

	preferencesRequest.get();
});

cloud4allPopUp.port.on("logout", function() {
	
	resetPref();
	
	mozillaPrefs.savePrefFile(null);

	token = "";
	cloud4allPopUp.hide();
	notifications.notify({
		title: "You have keyed out from Cloud4all",
		text: "You are now logged out of Cloud4all. Remember Cloud4all is available for many other platforms and applications!",
		iconURL: self.data.url("images/logocloud_32.png")
	});
});

function resetPref()
{
	simplePrefs.prefs.token = "";
	simplePrefs.prefs.magnification = "1";
	simplePrefs.prefs.simplifier = false;
	simplePrefs.prefs.invertColours = false;
	layout.setCharPref("devPixelsPerPx", "0");

	branch.setBoolPref("use_system_colors", true);
	branch.setBoolPref("use_document_colors", true);
}

cloud4allPopUp.port.on("updatePreferences", function(preferences) {
	var settings = { token : simplePrefs.prefs.token, preferences: preferences };
	storePreferences(settings);
});

function storePreferences(preferencesJson) {
	console.log("storePreferences: " + JSON.stringify(preferencesJson));
	var prefix = "http://registry.gpii.org/common/";
	var token = preferencesJson["token"];
	console.log("## Token: " + token);
	var preferences = preferencesJson["preferences"];
	console.log("## preferences: " + preferences);
	 
	simplePrefs.prefs.token = preferencesJson["token"];

	if (preferences.hasOwnProperty("fontSize")) {
		console.log("FontSize: " + preferences["fontSize"]);
		simplePrefs.prefs.fontSize = preferences["fontSize"];
	}
	
	if (preferences.hasOwnProperty("fontFace")) {
		console.log("FontFace: " + preferences["fontFace"]);
		simplePrefs.prefs.fontFace = preferences["fontFace"];
	}
	
	if (preferences.hasOwnProperty("magnification")) {
		console.log(
			"MAGNIFICATION: " +
			preferences["magnification"]
		);
		//simplePrefs.prefs.magnification = Math.round(preferences["magnification"]);
		if(preferences.hasOwnProperty("magnification") && preferences["magnifierEnabled"])
		{
			simplePrefs.prefs.magnification = preferences["magnification"].toString();
		}
		else
		{
			simplePrefs.prefs.magnification = "1";
		}			
	}

	if (preferences.hasOwnProperty("backgroundColour")) {
		console.log(
			"BACKGROUND COLOR: " +
			preferences["backgroundColour"]
		);
		simplePrefs.prefs.backgroundColor = preferences["backgroundColour"];
	}

	if (preferences.hasOwnProperty("foregroundColour")) {
		console.log(
			"FOREGROUND COLOR: " +
			preferences["foregroundColour"]
		);
		simplePrefs.prefs.foregroundColor = preferences["foregroundColour"];
	}

	if (preferences.hasOwnProperty("invertColours")) {
		console.log(
			"INVERT COLORS: " +
			preferences["invertColours"]
		);
		simplePrefs.prefs.invertColours = preferences["invertColours"];

	}
	
	if (preferences.hasOwnProperty("cursorSize")) {
		console.log("CursorSize: " + preferences["cursorSize"]);
		simplePrefs.prefs.cursorSize = preferences["cursorSize"];
	}
	
	/*if (preferences.hasOwnProperty(prefix + "fontSize")) {
		console.log(
			"FONT SIZE: " +
			preferences[prefix + "fontSize"][0]["value"]
		);

		if ((preferences[prefix + "fontSize"][0]["value"]) < 14) {
			simplePrefs.prefs.fontSize = "M";	
		} else if ((preferences[prefix + "fontSize"][0]["value"]) < 24) {
			simplePrefs.prefs.fontSize = "L";
		} else {
			simplePrefs.prefs.fontSize = "XL";
		}
	}

	if (preferences.hasOwnProperty(prefix + "magnification")) {
		console.log(
			"MAGNIFICATION: " +
			preferences[prefix + "magnification"][0]["value"]
		);
		simplePrefs.prefs.magnification = Math.round(preferences[prefix + "magnification"][0]["value"]);
	}
	
	if (preferences.hasOwnProperty(prefix + "backgroundColour")) {
		console.log(
			"BACKGROUND COLOR: " +
			preferences[prefix + "backgroundColour"][0]["value"]
		);
		simplePrefs.prefs.backgroundColor = "#" + preferences[prefix + "backgroundColour"][0]["value"];
	}

	if (preferences.hasOwnProperty(prefix + "foregroundColour")) {
		console.log(
			"FOREGROUND COLOR: " +
			preferences[prefix + "foregroundColour"][0]["value"]
		);
		simplePrefs.prefs.foregroundColor = "#" + preferences[prefix + "foregroundColour"][0]["value"];
	}

	if (preferences.hasOwnProperty(prefix + "invertColours")) {
		console.log(
			"INVERT COLORS: " +
			preferences[prefix + "invertColours"][0]["value"]
		);
		simplePrefs.prefs.invertColours = preferences[prefix + "invertColours"][0]["value"];

	}*/
	
}


//------- 	WINDOWS ACTIONS ---------
var socketServer = 'http://localhost:8081/browserChannel';
var socket;

console.log("######## Starting....");

var pageWorker = pageWorkers.Page({
  //contentScriptFile: self.data.url("js/worker.js"),
  contentURL: self.data.url('worker.html'),
  //contentScriptFileWhen: "ready",
  onMessage: function(message) {
    console.log(message);
  }
});

pageWorker.port.on("pageAdaptor", function(settings) {
	var text = 'system';
	console.log("### pageAdaptor ..." + JSON.stringify(settings));
	resetPref();
	var preferencesJson = { token : text, preferences: settings };
	storePreferences(preferencesJson);
	cloud4allPopUp.port.emit("setPreferencesForm", preferencesJson);
	//sendPref = true;	
});

//------- 	END WINDOWS ACTIONS ---------



//----------- FORM ACTIONS ----------------
var pageModeSize = 0;
var pageModeStyles;

simplePrefs.on("invertColours", onInvertColoursChange);
simplePrefs.on("magnification", onMagnificationChange);
simplePrefs.on("fontSize", onFontSizeChange);
simplePrefs.on("fontFace", onFontFaceChange);
simplePrefs.on("backgroundColor", onBackgroundColorChange);
simplePrefs.on("foregroundColor", onForegroundColorChange);
simplePrefs.on("simplifier", onSimplifierChange); 
simplePrefs.on("cursorSize", onCursorSizeChange);

function onInvertColoursChange() {
	if (simplePrefs.prefs.invertColours) {
		console.log("Invert Colours set to true");	
		insertStyle("html { background-color: black;}");
		insertStyle("html { filter: invert(100%);}");		
	} else {
		console.log("Invert Colours set to false");	
		removeStyle("background");	
		removeStyle("invert");
	}
}

function onMagnificationChange() {
	console.log("ENTRA EN MAGNIFICATION");
	/*var magnificationPageMod = pageMod.PageMod({
		include: "*",
		contentStyle: "body { -moz-transform: scale(" + simplePrefs.prefs.magnification + "); -moz-transform-origin: 0 0;",
		attachTo: ["existing", "top", "frame"]
	});*/
	
	layout.setCharPref("devPixelsPerPx", simplePrefs.prefs.magnification);
}

function onFontSizeChange() {
	switch (simplePrefs.prefs.fontSize) {
		case "M":
			layout.setCharPref("devPixelsPerPx", "0");
			break;
		case "L":
			layout.setCharPref("devPixelsPerPx", "1.5");
			break;
		case "XL":
			layout.setCharPref("devPixelsPerPx", "2");
			break;
	}

	mozillaPrefs.savePrefFile(null);
	console.log("Font size set to " + simplePrefs.prefs.fontSize);
}

function onFontFaceChange(){
	var font = simplePrefs.prefs.fontFace;
	console.log("Font face set to " + font);
	if(font != "none")
	{
		console.log("Font face inserted: " + font);
		removeStyle("font-family");
		insertStyle("body, div, p, input, span, h1, h2, h3, h4, h5, h6, button, a { font-family: " + font + ", Times, serif !important;}");
	}
	else
	{
		console.log("Font face removed");
		removeStyle("font-family");
	}
}

function onBackgroundColorChange() {
	var background = simplePrefs.prefs.backgroundColor;
	console.log("Background color to " + background);
	if(background != "")
	{
		branch.setBoolPref("use_system_colors", false);
		branch.setBoolPref("use_document_colors", false);
		branch.setCharPref("background_color", simplePrefs.prefs.backgroundColor);
	}
	else
	{
		branch.setBoolPref("use_system_colors", true);
		branch.setBoolPref("use_document_colors", true);
	}

	mozillaPrefs.savePrefFile(null);
}

function onForegroundColorChange() {
	var foreground = simplePrefs.prefs.foregroundColor;
	console.log("Foreground color to " + foreground);
	if(foreground != "")
	{
		branch.setBoolPref("use_system_colors", false);
		branch.setBoolPref("use_document_colors", false);
		branch.setCharPref("foreground_color", simplePrefs.prefs.foregroundColor);
		branch.setCharPref("color", simplePrefs.prefs.foregroundColor);
	}
	else
	{
		branch.setBoolPref("use_system_colors", true);
		branch.setBoolPref("use_document_colors", true);
	}

	mozillaPrefs.savePrefFile(null);
	
	console.log("Foreground color set to " + simplePrefs.prefs.foregroundColor);
}

function onCursorSizeChange() {
	switch (simplePrefs.prefs.cursorSize) {
		case "normal":
			console.log("Cursor normal");
			removeStyle("cursor");
			break;
		case "large":
			//console.log("Cursor large: " + self.data.url("images/arrow_icon_large.png"));
			removeStyle("cursor");
			insertStyle("html, label { cursor: url(" + self.data.url("images/arrow_icon_large.png") + "), auto;}");
			insertStyle("a, button, input, select, label[for] { cursor: url(" + self.data.url("images/hand_icon_large.png") + "), auto !important;}");
			break;
		case "x-large":
			//console.log("Cursor x-large");
			removeStyle("cursor");
			insertStyle("html, label { cursor: url(" + self.data.url("images/arrow_icon_x_large.png") + "), auto;}");
			insertStyle("a, button, input, select, label[for] { cursor: url(" + self.data.url("images/hand_icon_x_large.png") + "), auto !important;}");
			break;
	}

	console.log("Cursor size set to " + simplePrefs.prefs.cursorSize);
}

function onSimplifierChange() {
	console.log("Simplifier set to " + simplePrefs.prefs.simplifier);
}

function refreshPageModStyles()
{
	if(mod != null) mod.destroy();
	
	mod = pageMod.PageMod({
		include: "*",
		contentStyle: pageModeStyles,
		attachTo: ["existing", "top", "frame"]
	});
}

function insertStyle(style)
{
	if(pageModeSize == 0)
	{
		pageModeStyles = [style];
		pageModeSize++;
	}
	else
	{
		pageModeSize++;
		var aux = pageModeStyles;
		pageModeStyles = new Array(pageModeSize);
		for(i = 0; i < pageModeSize - 1; i++)
		{
			pageModeStyles[i] = aux[i];
		}
		pageModeStyles[pageModeSize - 1] = style;
	}
	refreshPageModStyles();
}

function removeStyle(style)
{
	if(pageModeSize > 0)
	{
		//pageModeSize--;
		var aux = pageModeStyles;
		var j = 0;
		var auxSize = pageModeSize;
		pageModeStyles = new Array(pageModeSize);
		for(i = 0; i < auxSize; i++)
		{
			if(aux[i].indexOf(style) == -1)
			{
				pageModeStyles[j] = aux[i];
				j++;
			}
			else
			{
				pageModeSize--;
			}
		}
		aux = pageModeStyles;
		pageModeStyles = new Array(pageModeSize);
		for(i = 0; i < pageModeSize; i++)
		{
			pageModeStyles[i] = aux[i];
		}
		refreshPageModStyles();
	}
}
//----------- END FORM ACTIONS ------------