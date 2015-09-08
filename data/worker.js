//const self = require("sdk/self");


/*function sendPreferences(preferences)
{
	addon.port.emit("pageAdaptor", preferences);
}*/
console.log("Page-Worker... outside js folder");
self.port.emit("my-event", "hello world outside js folder");