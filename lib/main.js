//const widget = require("sdk/widget");
var { ToggleButton } = require('sdk/ui/button/toggle');
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
var uri = "com.ilunion.cloud4firefox";
var npserver = 'http://127.0.0.1:8081/';
//var npserver = 'http://flowmanager.gpii.net/';
var suffix = '/settings/%7B"OS":%7B"id":"web"%7D,"solutions":[%7B"id":"com.ilunion.cloud4firefox"%7D]%7D';
var magnificationPageMod,
	backgroundColorPageMod,
	foregroundColorPageMod,
	fontSizePageMod,
	simplifierPageMod;
var pageModeStyles;

var tabsModeMap = new Object();

var {Cc, Ci} = require("chrome");

var mozillaPrefs = Cc["@mozilla.org/preferences-service;1"].getService(Ci.nsIPrefService);

var branch = mozillaPrefs.getBranch("browser.display.");
var layout = mozillaPrefs.getBranch("layout.css.");

var cloud4allPopUp = panel.Panel({
  width: 435,
  height: 800,
  contentURL: self.data.url("html/popup.html"),
  contentScriptFile: self.data.url('js/popup.js'),
  onHide: handleHide
});

/*var cloud4allWidget = widget.Widget({
	id: "cloud4allWidget",
	label: "Click here to open Cloud4all",
	contentURL: self.data.url("images/icon19.png"),
	panel: cloud4allPopUp
});*/

var button = ToggleButton({
  id: "my-button",
  label: "my button",
  icon: {
    "16": self.data.url("images/icon16.png"),
    "32": self.data.url("images/icon38.png"),
    "64": self.data.url("images/icon48.png"),
  },
  onChange: handleChange
});

function handleChange(state) {
  if (state.checked) {
    cloud4allPopUp.show({
      position: button
    });
  }
}

function handleHide() {
  button.state('window', {checked: false});
}

cloud4allPopUp.on("show", function() {
	/*console.log("Entra en botÛn...");
	if(sendPref) 
	{
		console.log("Entra en if botÛn... " + JSON.stringify(preferencesJson));
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

cloud4allPopUp.port.on("width-panel", function(value) {
	cloud4allPopUp.width = value;
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
	simplePrefs.prefs.fontSize = "M";
	simplePrefs.prefs.backgroundColor = "";
	simplePrefs.prefs.foregroundColor = "";
	simplePrefs.prefs.fontFace = "none";
	simplePrefs.prefs.cursorSize = "normal";
	simplePrefs.prefs.lineheight = "1.4"

	//branch.setBoolPref("use_system_colors", true);
	//branch.setBoolPref("use_document_colors", true);
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

	if (preferences.hasOwnProperty("highContrastEnabled") && preferences["highContrastEnabled"] == true && preferences.hasOwnProperty("backgroundColour")) {
		console.log(
			"BACKGROUND COLOR: " +
			preferences["backgroundColour"]
		);
		simplePrefs.prefs.backgroundColor = preferences["backgroundColour"];
	}
	else if (preferences.hasOwnProperty("highContrastEnabled") && preferences["highContrastEnabled"] == false)
	{
		simplePrefs.prefs.backgroundColor = "";
	}

	if (preferences.hasOwnProperty("highContrastEnabled") && preferences["highContrastEnabled"] == true && preferences.hasOwnProperty("foregroundColour")) {
		console.log(
			"FOREGROUND COLOR: " +
			preferences["foregroundColour"]
		);
		simplePrefs.prefs.foregroundColor = preferences["foregroundColour"];
	}
	else if (preferences.hasOwnProperty("highContrastEnabled") && preferences["highContrastEnabled"] == false)
	{
		simplePrefs.prefs.foregroundColor = "";
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
	
	if (preferences.hasOwnProperty("lineheight")) {
		console.log(" -------------------------------------- ");
		console.log("Lineheight: " + preferences["lineheight"]);
		console.log(" -------------------------------------- ");
		simplePrefs.prefs.lineheight = preferences["lineheight"].toString();
	}
	
	if (preferences.hasOwnProperty("synonyms")) {
		console.log(
			"SYNONYMS: " +
			preferences["synonyms"]
		);
		simplePrefs.prefs.synonyms = preferences["synonyms"];

	}
	
}


//------- 	WINDOWS ACTIONS ---------
var socketServer = 'http://localhost:8081/browserChannel';
var socket;

console.log("######## Starting....");

var pageWorker = pageWorkers.Page({
  contentScriptFile: [self.data.url('js/socket.io.js'), self.data.url('js/worker.js')],
  onMessage: function(message) {
    console.log(message);
  }
});

pageWorker.port.on("my-event", function(settings) {
	console.log("Page worker settings: " + settings);
});
	
pageWorker.port.on("pageAdaptor", function(settings) {
	var text = 'system';
	console.log("### pageAdaptor ..." + JSON.stringify(settings));
	if(settings == null) settings = "";
	resetPref();
	var preferencesJson = { token : text, preferences: settings };
	storePreferences(preferencesJson);
	cloud4allPopUp.port.emit("setPreferencesForm", preferencesJson);
	//sendPref = true;	
});

//------- 	END WINDOWS ACTIONS ---------


//-------	SYNONYMS ACTIONS	-----------

pageMod.PageMod({
  include: "*",
  contentScriptFile: [self.data.url('js/jquery-1.9.1.min.js'), self.data.url('js/synonyms.js')],
  contentStyleFile: self.data.url("css/content.css"),
  attachTo: ["existing", "top"],
  onAttach: function(worker) {
    console.log("OnAttach: " + worker.tab.url);
	
	tabsModeMap[tabs.activeTab.id] = worker;
	
	worker.port.on("getSynonyms", function(urlSyn) {
		console.log("### synonymsAdaptor... " + urlSyn);
		var syn = xmlHttpMessage(urlSyn);
		console.log("### Response of Synonyms... " + syn);
	});
	
	worker.port.emit("synonyms", { action : "enable synonyms", status : simplePrefs.prefs.synonyms });
  }
});

function xmlHttpMessage(urlTarget)
{
	var preferencesRequest = Request({
		url: urlTarget,
		contentType: 'application/json',
		onComplete: function(response) {
			if (response.status == 200) {
				console.log("Response ok: " + JSON.stringify(response.json));
				tabsModeMap[tabs.activeTab.id].port.emit("synonymsProcess", response.json);
			} else {
				console.log("Error: " + response.status);
			}
		}
	});	

	preferencesRequest.get();
}

//------- 	END SYNONYMS ACTIONS ---------



//----------- FORM ACTIONS ----------------
var pageModeSize = 0;

simplePrefs.on("invertColours", onInvertColoursChange);
simplePrefs.on("magnification", onMagnificationChange);
simplePrefs.on("fontSize", onFontSizeChange);
simplePrefs.on("fontFace", onFontFaceChange);
simplePrefs.on("backgroundColor", onBackgroundColorChange);
simplePrefs.on("foregroundColor", onForegroundColorChange);
simplePrefs.on("simplifier", onSimplifierChange); 
simplePrefs.on("cursorSize", onCursorSizeChange);
simplePrefs.on("lineheight", onLineheightChange);
simplePrefs.on("synonyms", onSynonymsChange);

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

function onLineheightChange() {
		console.log(" -------------------------------------- ");
	console.log("ENTRA EN LINEHEIGHT");
		console.log(" -------------------------------------- ");
	removeStyle("line-height");
	insertStyle("h1, h2, h3, h4, h5, p, span, a, input, label, div { line-height: " + simplePrefs.prefs.lineheight + " !important;}");
}

function onFontSizeChange() {
	console.log("1.- Font size set to " + simplePrefs.prefs.fontSize);
	switch (simplePrefs.prefs.fontSize) {
		case "M":
	console.log("2.- Tama√±o M - " + simplePrefs.prefs.fontSize);
			//layout.setCharPref("devPixelsPerPx", "0");			
			removeStyle("font-size");	
			break;
		case "L":
	console.log("2.- Tama√±o L - " + simplePrefs.prefs.fontSize);
			removeStyle("font-size");	
			var regla = "div, span, p, ul, h5, dt, a, table, th, tr, td, pre, code, article, nav, section { font-size: 1.6rem !important;}";
			insertStyle(regla);
			regla = "input[type='submit'], input[type='button'], button {font-size: 1.6rem !important; padding: 10px !important; height: initial !important;}";
			insertStyle(regla);
			regla = "input[type='text'], input[type='password'], select {font-size: 1.6rem !important; height: initial !important;}";
			insertStyle(regla);
			regla = "h1 {font-size: 3rem !important;}";
			insertStyle(regla);
			regla = "h2 {font-size: 2.2rem !important;}";
			insertStyle(regla);
			regla = "h3 {font-size: 1.8rem !important;}";
			insertStyle(regla);
			regla = "h4 {font-size: 1.7rem !important;}";
			insertStyle(regla);
			break;
		case "XL":
	console.log("2.- Tama√±o XL - " + simplePrefs.prefs.fontSize);
			removeStyle("font-size");	
			var regla = "div, span, p, ul, h5, dt, a, table, th, tr, td, pre, code, article, nav, section { font-size: 2rem !important;}";
			insertStyle(regla);
			regla = "input[type='submit'], input[type='button'], button {font-size: 2rem !important; padding: 10px !important; height: initial !important;}";
			insertStyle(regla);
			regla = "input[type='text'], input[type='password'], select {font-size: 2rem !important; height: initial !important;}";
			insertStyle(regla);
			regla = "h1 {font-size: 4.4rem !important;}";
			insertStyle(regla);
			regla = "h2 {font-size: 3.3rem !important;}";
			insertStyle(regla);
			regla = "h3 {font-size: 2.5rem !important;}";
			insertStyle(regla);
			regla = "h4 {font-size: 2.1rem !important;}";
			insertStyle(regla);
			break;
	}
	
	
	//mozillaPrefs.savePrefFile(null);
	console.log("3.- Font size set to " + simplePrefs.prefs.fontSize);
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
	removeStyle("background-color");
	if(background != "")
	{
		console.log("Entra en if Background color: " + "* { background-color: " + background + " !important;}");
		/*branch.setBoolPref("use_system_colors", false);
		branch.setBoolPref("use_document_colors", false);
		branch.setCharPref("background_color", background);*/
		insertStyle("* { background-color: " + background + " !important;}");
	}
	else
	{
		/*branch.setBoolPref("use_system_colors", true);
		branch.setBoolPref("use_document_colors", true);*/
		removeStyle("background-color");
	}

	//mozillaPrefs.savePrefFile(null);
}

function onForegroundColorChange() {
	var foreground = simplePrefs.prefs.foregroundColor;
	console.log("Foreground color to " + foreground);
	
	removeStyle(" color");
	removeStyle("border");
	removeStyle("decoration");
	removeStyle("filter");
	
	if(foreground != "")
	{
		insertStyle("* { color: " + foreground + " !important;}");
		insertStyle("input{border: 1px solid " + foreground + " !important; }");
		insertStyle("a {text-decoration: underline !important;}");
		if(simplePrefs.prefs.foregroundColor == "#FFFFFF")
		{
			insertStyle("body{filter: grayscale(100%);}");
		}
		else
		{
			removeStyle("filter");
		}
	}
	/*else
	{
		removeStyle(" color");
		removeStyle("border");
		removeStyle("decoration");
		removeStyle("filter");
	}*/

	//mozillaPrefs.savePrefFile(null);
	
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
			insertStyle("body, div, p, img, h1, h2, h3, h4, h5, h6, h7, span, input, label, ul, ol, li { cursor: url(" + self.data.url("images/arrow_icon_large.png") + "), auto;}");
			insertStyle("a, button, label[for], select, input:not([disabled=true]) { cursor: url(" + self.data.url("images/hand_icon_large.png") + "), auto !important;}");
			break;
		case "x-large":
			//console.log("Cursor x-large");
			removeStyle("cursor");
			insertStyle("body, div, p, img, h1, h2, h3, h4, h5, h6, h7, span, input, label, ul, ol, li { cursor: url(" + self.data.url("images/arrow_icon_x_large.png") + "), auto;}");
			insertStyle("a, button, label[for], select, input:not([disabled=true]) { cursor: url(" + self.data.url("images/hand_icon_x_large.png") + "), auto !important;}");
			break;
	}

	console.log("Cursor size set to " + simplePrefs.prefs.cursorSize);
}

function onSynonymsChange(){
	console.log("Synonyms set to " + simplePrefs.prefs.synonyms);
	
	for(var i = 0; i < tabs.length; i++)
	{
		if(tabsModeMap[tabs[i].id] != null)
		{
			console.log("TAB ID: " + tabs[i].id);
			tabsModeMap[tabs[i].id].port.emit("synonyms", { action : "enable synonyms", status : simplePrefs.prefs.synonyms });
		}
	}
}


function onDoubleClickEn(e) {
	console.log("Palabra seleccionada.");
}

function onSimplifierChange() {
	console.log("Simplifier set to " + simplePrefs.prefs.simplifier);
}

//-------------------------------------------------------------
//-----------  Apply adaptations to the browser ---------------
//-------------------------------------------------------------

function refreshPageModStyles()
{
	removeAllStyles();
	
	refresh();
}

function deactivateStyles()
{
	
	var { Ci } = require('chrome');
	var utils = require('sdk/window/utils');
	var browserWindow = utils.getMostRecentBrowserWindow();
	var window = browserWindow.content; // `window` object for the current webpage
	utils.getToplevelWindow(window) == browserWindow // => true
	
	var { attachTo, detachFrom } = require("sdk/content/mod");
	var Style = require("sdk/stylesheet/style").Style;
	var style = Style({
	  source: pageModeStyles
	});
	if(browserWindow != null && window != null)
	{
		detachFrom(style, browserWindow);
		detachFrom(style, window);
	}
}

function activateStyles()
{
	var { Ci } = require('chrome');
	var utils = require('sdk/window/utils');
	var browserWindow = utils.getMostRecentBrowserWindow();
	var window = browserWindow.content; // `window` object for the current webpage
	utils.getToplevelWindow(window) == browserWindow // => true
	
	var { attachTo, detachFrom } = require("sdk/content/mod");
	var Style = require("sdk/stylesheet/style").Style;

	var style = Style({
	  source: pageModeStyles
	});

	// assuming window points to the content page we want to modify
	if(browserWindow != null && window != null)
	{
		console.log("window isn't null");
		attachTo(style, browserWindow);
		attachTo(style, window);
	}
	else
	{console.log("window is null");}
}

function refresh()
{
	var { Ci } = require('chrome');
	var utils = require('sdk/window/utils');
	var browserWindow = utils.getMostRecentBrowserWindow();
	var window = browserWindow.content; // `window` object for the current webpage
	utils.getToplevelWindow(window) == browserWindow // => true
	
	var { attachTo, detachFrom } = require("sdk/content/mod");
	var Style = require("sdk/stylesheet/style").Style;

	var style = Style({
	  source: pageModeStyles
	});

	// assuming window points to the content page we want to modify
	if(window != null && pageModeSize > 0)
	{	
		detachFrom(style, browserWindow);
		detachFrom(style, window);
		attachTo(style, window);
		attachTo(style, browserWindow);
	}
	
	
}

function insertStyle(style)
{
	deactivateStyles();
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
			//console.log("Style " + i + ": " + aux[i]);
			pageModeStyles[i] = aux[i];
		}
		pageModeStyles[pageModeSize - 1] = style;
		//console.log("Style " + (pageModeSize - 1) + ": " + style);
	}
	//refreshPageModStyles();
	activateStyles();
}

function removeStyle(style)
{
	deactivateStyles();
	//console.log("1.- removeStyle - " + style + " - " + pageModeStyles);
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
	//console.log("2.- removeStyle - " + style + " - " + pageModeStyles);
		//refreshPageModStyles();
		activateStyles();
	//console.log("3.- removeStyle - " + style + " - " + pageModeSize);
	}
}

tabs.on('ready', function(tab) {
	//tabsModeMap[tab.id] = tab.url;
	console.log('$$$$$$$$ tab is ready', tab.id, tab.url);
	refresh();
});

tabs.on('activate', function(tab) {
	console.log('$$$$$$$$ tab is activate: ', tab.id, tab.url);	
	refresh();
	
	if(simplePrefs.prefs.synonyms == true)
	{
		//tabs.activeTab.reload();
	}
});

/*tabs.on('open', function(tab){
	tabsModeMap[tab.id] = tab.url;
	console.log("$$$$ tab opened: ", tab.id, tabsModeMap[tab.id])
});*/

//-------------------------------------------------------------
//-----------  Apply adaptations to the browser ---------------
//-------------------------------------------------------------

//----------- END FORM ACTIONS ------------