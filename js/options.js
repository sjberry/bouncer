$(document).ready(function() {
	var actions = {
		'toggle-plugins': function() {
			return {
				type: 'options:plugins',
				enabled: $(this).is(':checked')
			};
		}
	};


	$(document).on('change', 'input', function(e) {
		var action, data, name, $this = $(this);

		e.preventDefault();

		name = $this.attr('name');
		action = actions[name];
		data = action.call(this, e);
		chrome.runtime.sendMessage(data, function() {});
	});
});
