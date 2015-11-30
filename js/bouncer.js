(function(root, factory) {
	return factory.call(root);
})(this, function() {
	'use strict';

	var options;


	function getOptions() {
		if (typeof options === 'undefined') {
			options = storage.getItem('options');
		}

		return options;
	}


	function getOption(name) {


		return options[name];
	}


	function removeRule(pattern) {

	}


	function setOption(name, value) {
		if (typeof options === 'undefined') {
			options = storage.getItem('options');
		}

		options[name] = value;

		storage.setItem('options', options);
	}


	function setRule(pattern, types) {

	}


	return {
		removeRule: removeRule,
		setOption: setOption,
		setRule: setRule
	};
});
