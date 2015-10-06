var active = false;
var bhl_url = "http://words.bighugelabs.com/api/2/0791f67e8212761406e388ef91856024/";
var sel_x = 0, sel_y = 0;
var word = '';
var help_paragraph_en = $('<p></p>').addClass('help-paragraph').text("Click the mouse or any key to close");
var error_paragraph_en = $('<p></p>').text("Sorry, no synonyms found");

console.log("###### Active Status: " + active);

	
self.port.on("synonyms", function(req){
	console.log("Synonyms PageWorker js: " + JSON.stringify(req));
	if (req.action == "enable synonyms") {
		active = req.status;
		
		if (active == true) {
			$(document).bind('dblclick', onDoubleClickEn);
			console.log("Activating synonyms");
		} else {
			$(document).unbind('dblclick', onDoubleClickEn);
			console.log("Deactivating synonyms");
		}
	}
	console.log("###### Active Status 2: " + active);

});

self.port.on("synonymsProcess", function(synonymsJSON){
	console.log("synonymsProcess: " + JSON.stringify(synonymsJSON));
	showTooltipEn(synonymsJSON);
});

function onDoubleClickEn(e) {
    word = get_selection_en();
	console.log("Word: " + word);
    if (word.length > 0) {
        
		self.port.emit("getSynonyms", bhl_url + word + "/json");

    }
}

function get_selection_en() {
    var txt = '';

    if (window.getSelection) {

        txt = window.getSelection();
        var selection = txt.getRangeAt(0);
		var bodyRect = document.body.getBoundingClientRect();
        var sel_xx = selection.getBoundingClientRect().left; 
        var sel_yy = selection.getBoundingClientRect().top; 
		sel_x = sel_xx - bodyRect.left; 
        sel_y = sel_yy - bodyRect.top;

    } else if (document.getSelection) {

        txt = document.getSelection();
        var selection = txt.getRangeAt(0);
        var bodyRect = document.body.getBoundingClientRect();
        var sel_xx = selection.getBoundingClientRect().left; 
        var sel_yy = selection.getBoundingClientRect().top; 
		sel_x = sel_xx - bodyRect.left; 
        sel_y = sel_yy - bodyRect.top;

    } else if (document.selection) {

        txt = document.selection.createRange().text;

    }
	
	console.log("Position X: " + sel_x + " - Y: " + sel_y);

    return $.trim(txt.toString());
}

function showTooltipEn(synonymsJSON) {

    //var synonyms = JSON.parse(synonymsJSON);
	var synonyms = synonymsJSON;
    var tooltipDiv = $("<div class='tooltip'></div>");
    $(tooltipDiv).css("top", sel_y);
    $(tooltipDiv).css("left", sel_x);
	
	var superTitle = $("<h2></h2>").text('Synonyms of "' + word + '"');
	$(tooltipDiv).append(superTitle);

    if (synonyms.hasOwnProperty("noun")) {
        if ((synonyms.noun.hasOwnProperty("syn")) && (synonyms.noun.syn.length > 0) ) {
            var synonymsList = synonyms.noun.syn.join(", ");
        }
        var title = $("<h3></h3>").text("Noun");
        var par = $("<p></p>").text(synonymsList);
        $(tooltipDiv).append(title);
        $(tooltipDiv).append(par);
    }

    if (synonyms.hasOwnProperty("verb")) {
        if ((synonyms.verb.hasOwnProperty("syn")) && (synonyms.verb.syn.length > 0) ) {
            var synonymsList = synonyms.verb.syn.join(", ");
        }
        var title = $("<h3></h3>").text("Verb");
        var par = $("<p></p>").text(synonymsList);
        $(tooltipDiv).append(title);
        $(tooltipDiv).append(par);
    }

    if (synonyms.hasOwnProperty("adjective")) {
        if ((synonyms.adjective.hasOwnProperty("syn")) && (synonyms.adjective.syn.length > 0) ) {
            var synonymsList = synonyms.adjective.syn.join(", ");
        }
        var title = $("<h3></h3>").text("Adjective");
        var par = $("<p></p>").text(synonymsList);
        $(tooltipDiv).append(title);
        $(tooltipDiv).append(par);
    }
	
	if (synonyms.hasOwnProperty("adverb")) {
        if ((synonyms.adverb.hasOwnProperty("syn")) && (synonyms.adverb.syn.length > 0) ) {
            var synonymsList = synonyms.adverb.syn.join(", ");
        }
        var title = $("<h3></h3>").text("Adverb");
        var par = $("<p></p>").text(synonymsList);
        $(tooltipDiv).append(title);
        $(tooltipDiv).append(par);
    }

    $(tooltipDiv).append(help_paragraph_en);

    $('body').append(tooltipDiv);
}

function showErrorTooltipEn() {
    var tooltipDiv = $("<div class='tooltip'></div>");
    $(tooltipDiv).css("top", sel_y);
    $(tooltipDiv).css("left", sel_x);
    $(tooltipDiv).append(error_paragraph_en);
    $(tooltipDiv).append(help_paragraph_en);
    $('body').append(tooltipDiv);
}

$(document).keyup(function(e) {
    $(".tooltip").remove();
});

$(document).mousedown(function(e) {
    $(".tooltip").remove();
});

/*function onDoubleClickEn(e) {
	var txt = "nada";
	if (window.getSelection) {

        txt = window.getSelection();
        var selection = txt.getRangeAt(0);
		var bodyRect = document.body.getBoundingClientRect();
        var sel_xx = selection.getBoundingClientRect().left; 
        var sel_yy = selection.getBoundingClientRect().top; 
		sel_x = sel_xx - bodyRect.left; 
        sel_y = sel_yy - bodyRect.top;

    } else if (document.getSelection) {

        txt = document.getSelection();
        var selection = txt.getRangeAt(0);
        var bodyRect = document.body.getBoundingClientRect();
        var sel_xx = selection.getBoundingClientRect().left; 
        var sel_yy = selection.getBoundingClientRect().top; 
		sel_x = sel_xx - bodyRect.left; 
        sel_y = sel_yy - bodyRect.top;

    } else if (document.selection) {

        txt = document.selection.createRange().text;

    }
	console.log("Palabra seleccionada. " + txt);
}*/

