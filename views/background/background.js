(function() {
	var receivers = {
		'options:open': function () {
			chrome.tabs.create({
				url: 'src/options/index.html'
			});
		},

		'options:get': function (data, sender, callback) {
			if (typeof options === 'undefined') options = storage.getItem('options');

			callback(options);
		},

		'options:set': function (data, sender, callback) {
			var option, options;

			option = {};
			option[data.name] = data.value;

			options = storage.updateItem('options', option);

			/*
			 if (data.enabled) {
			 chrome.contentSettings.plugins.set({
			 primaryPattern: '<all_urls>',
			 setting: 'block'
			 });
			 }
			 else {
			 chrome.contentSettings.plugins.clear({});
			 }
			 */

			callback(options);
		},

		rule: function (data) {
			chrome.contentSettings.plugins.set({
				primaryPattern: data.rule,
				setting: 'allow'
			});
		}
	};


	chrome.extension.onMessage.addListener(function (data, sender, callback) {
		var receiver, type;

		type = data.type;

		if (!receivers.hasOwnProperty(type)) {
			throw new Error('Invalid message type');
		}

		receiver = receivers[data.type];

		return receiver.apply(this, arguments);
	});


	/*
	chrome.runtime.onStartup.addListener(function () {
		options = storage.getItem('options');
		console.log(options);
	});
	*/


	chrome.runtime.onInstalled.addListener(function (details) {
		var manifest;

		if (details.reason === 'install') {
			console.log('Fresh install!');

			storage.setItem('options', {
				mode: 'whitelist',
				cookies: true,
				plugins: true,
				images: true,
				javascript: true
			});
		}
		else if (details.reason === 'update') {
			manifest = chrome.runtime.getManifest();

			console.log('Updated from ' + details.previousVersion + ' to ' + manifest.version + '!');
		}
	});
})();
