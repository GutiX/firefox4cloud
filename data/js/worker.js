var socketServer = 'http://localhost:8081/browserChannel',
	uri = "com.ilunion.cloud4firefox",
	connect = false;
var socket;

console.log("Page-Worker... inside js folder");
//self.port.emit("my-event", "hello world inside js folder");



//SOCKET.IO SERVER

console.log("Socket.io connection ....");

if (socket == null) {
    console.log("### Connecting for the first time");
    connectToGPII();
}

setInterval(function () {
    if (!connect || socket == null || !socket.socket.connected) {
        connect = false;
        connectToGPII();
    }
}, 10000);

function connectToGPII () {
    socket = io.connect(socketServer, {'force new connection': true});
    socketListeners();
}

function socketListeners () {
	socket.on('connect', function (data) {
		console.log('Socket connected: ');
		console.log("### Sending uri");
		socket.send(uri);
		connect = true;
	});
	
	socket.on("connectionSucceeded", function (settings) {
		console.log("## Received connectionSucceeded...");
		processSettings(settings);
	});

	socket.on("onBrowserSettingsChanged", function(settings){
		console.log("## Received onBrowserSettingsChanged...");
		processSettings(settings);
	});
	
	socket.on('getPref', function(request){
		console.log('Get preferences');
		/*chrome.storage.local.get({ 'token' : "", 'preferences' : {} }, function(results) {
			if (!(chrome.runtime.lastError)) {
				if (!(isEmpty(results['preferences']))) {
					var prefe = '{"' + uri + '":' + JSON.stringify(results['preferences']) + '}';
					console.log('--- Get preferences: ' + prefe);
					socket.emit('getpreferences', prefe);
				}
			}
		});*/ 
	});
	
	socket.socket.on('disconnect', function (request){
		console.log('Disconnect: ' + request);
		connect = false;
		self.port.emit("pageAdaptor", "");
	});
	
	socket.on('error', function (err){
		console.log('Connection Error. ' + err);
		connect = false;
	});
}

function processSettings(settings)
{
	console.log("## Received the following settings: " + JSON.stringify(settings));
	//self.port.emit("my-event", JSON.stringify(settings));
	//sendPreferences(settings);
	self.port.emit("pageAdaptor", settings);
}
