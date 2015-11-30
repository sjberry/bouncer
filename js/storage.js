(function(root, factory) {
	root.storage = factory.call(root);
})(this, function() {
	'use strict';


	function clear() {
		return localStorage.clear();
	}

	function getItem(key) {
		var val;

		val = localStorage.getItem(key);

		return (typeof val === 'undefined' || val === 'undefined') ? void(0) : JSON.parse(val);
	}

	function removeItem(key) {
		return localStorage.removeItem(key);
	}

	function setItem(key, value) {
		return localStorage.setItem(key, JSON.stringify(value));
	}


	return {
		clear: clear,
		getItem: getItem,
		removeItem: removeItem,
		setItem: setItem
	}
});
