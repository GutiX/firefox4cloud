

function sendPreferences(preferences)
{
	addon.port.emit("pageAdaptor", preferences);
}