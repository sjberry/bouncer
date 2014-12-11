$(document).ready(function() {
	var authority, components, mask, protocol, rule, tab;

	var $domainSlider = $('#domain-slider');
	var $protocol = $('#protocol');
	var $rule = $('#rule');

	var actions = {
		options: function() {
			return {
				type: 'options'
			};
		},

		save: function() {
			return {
				type: 'save',
				rule: rule
			}
		}
	};

	function init(tabs) {
		var i, domain, gtld, match;

		tab = tabs[0];

		$(document).on('click', '.trigger', function (e) {
			var action, data, type, $this = $(this);

			e.preventDefault();

			type = $this.data('type');
			action = actions[type];
			data = action.call(this, e);
			chrome.runtime.sendMessage(data, function () {
			});
		});


		match = /^([^:\/?#]+:\/\/)?([^\/?#]*)?(?:\/([^?#]*))?/.exec(tab.url);
		protocol = match[1];

		if (/^https?:\/\/$/.test(protocol)) {
			authority = match[2];

			if (~(i = authority.indexOf(':'))) {
				authority = authority.slice(0, i);
			}

			components = authority.split('.');
			gtld = components.pop();
			domain = components.pop();
			components.push(domain ? (domain + '.' + gtld) : gtld);
			mask = components;

			$domainSlider
				.attr('max', components.length - 1)
				.attr('value', 0)
				.prop('disabled', components.length < 2);

			$domainSlider.on('input change', function (e) {
				var val;

				val = $(this).val();
				mask = components.filter(function (el, i) {
					return val <= i;
				});

				if (mask.length < components.length) {
					mask.unshift('*');
				}

				updateRule();
			});

			$protocol.on('change', function (e) {
				updateRule();
			});

			updateRule();

			$(document.body).css({
				'min-width': $rule.width() + 30
			});
		}
		else {
			$('#main').html('<div>Bouncer only supports <b>http</b> and <b>https</b> protocols.</div>');
		}
	}

	function updateRule() {
		rule = $protocol.is(':checked') ? protocol : '*://';
		rule += mask.join('.');
		rule += '/*';

		$rule.text(rule);
	}


	chrome.tabs.query({
		currentWindow: true,
		active: true
	}, init);
});
