$(document).ready(function() {
	function noop() {}

	chrome.runtime.sendMessage({
		type: 'options:get'
	}, function(options) {
		$('input.option').prop('disabled', false);

		$.each(options, function(name, value) {
			var type, $input;

			$input = $('input.option[name="' + name + '"]');
			type = $input.attr('type');

			switch(type) {
				case 'checkbox':
					$input.prop('checked', value);
					break;
				case 'radio':
					$input.filter('[value="' + value + '"]').prop('checked', true);
					break;
				default:
					$input.val(value);
					break;
			}
		});
	});


	$(document).on('change', 'input.option', function(e) {
		var name, type, value, $this = $(this);

		e.preventDefault();

		name = $this.attr('name');
		type = $this.attr('type');

		switch(type) {
			case 'checkbox':
				value = $this.is(':checked');
				break;
			default:
				value = $this.val();
				break;
		}

		chrome.runtime.sendMessage({
			type: 'options:set',
			name: name,
			value: value
		}, noop);
	});
});
