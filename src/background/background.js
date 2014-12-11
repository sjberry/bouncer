var receivers = {
	options: function() {
		chrome.tabs.create({
			url: 'src/options/index.html'
		});
	},

	'options:plugins': function(data) {
		if (data.enabled) {
			chrome.contentSettings.plugins.set({
				primaryPattern: '<all_urls>',
				setting: 'block'
			});
		}
		else {
			chrome.contentSettings.plugins.clear({});
		}
	},

	save: function(data) {
		chrome.contentSettings.plugins.set({
			primaryPattern: data.rule,
			setting: 'allow'
		});
	}
};


chrome.extension.onMessage.addListener(function(message, sender, sendResponse) {
	var receiver, response;

	receiver = receivers[message.type];
	response = receiver(message);
	sendResponse(response);
});
