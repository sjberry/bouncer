$(document).ready(function() {
	var authority, path, protocol, rule, tab;
	var lhs, rhs, lhs_mask, rhs_mask;

	var $domainSlider = $('#domain-slider');
	var $siteSlider = $('#site-slider');
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


	function updateRule() {
		var left, right;

		rule = $protocol.is(':checked') ? protocol : '*://';

		if (left = lhs_mask.join('.')) {
			rule += left;
		}

		// FIXME: Specific paths not allowed by chrome.contentSettings.set(). Keep an eye on this.
		// https://developer.chrome.com/extensions/contentSettings#patterns.
		if (right = rhs_mask.join('/')) {
			rule += '/' + right;
		}

		$rule.text(rule);
	}


	$domainSlider.on('input change', function(e) {
		var val;

		val = $(this).val();
		lhs_mask = lhs.filter(function(el, i) {
			return val <= i;
		});

		if (lhs_mask.length < lhs.length) {
			lhs_mask.unshift('*');
		}

		updateRule();
	});

	$siteSlider.on('input change', function(e) {
		var val;

		val = $(this).val();
		rhs_mask = rhs.filter(function(el, i) {
			return val > i;
		});

		rhs_mask.push('*');

		updateRule();
	});

	$protocol.on('change', function(e) {
		updateRule();
	});

	$(document).on('click', '.trigger', function(e) {
		var action, data, type, $this = $(this);

		e.preventDefault();

		type = $this.data('type');
		action = actions[type];
		data = action.call(this, e);
		chrome.runtime.sendMessage(data, function() {});
	});

	chrome.tabs.query({
		currentWindow: true,
		active: true
	}, function(tabs) {
		var i, domain, gtld, match, width;

		tab = tabs[0];

		match = /^([^:\/?#]+:\/\/)?([^\/?#]*)?(?:\/([^?#]*))?/.exec(tab.url);

		protocol = match[1];
		authority = match[2];
		path = match[3];

		if (~(i = authority.indexOf(':'))) {
			authority = authority.slice(0, i);
		}

		lhs = authority.split('.');
		gtld = lhs.pop();
		domain = lhs.pop();
		lhs.push(domain ? (domain + '.' + gtld) : gtld);
		lhs_mask = lhs;

		rhs = path.split('/').filter(function(el, i) {
			return el.length > 0;
		});
		rhs_mask = rhs.slice();
		rhs_mask.push('*');

		width = $(document.body).width();
		$(document.body).width(width);

		$domainSlider
			.attr('max', lhs.length - 1)
			.attr('value', 0)
			.prop('disabled', lhs.length < 2);

		$siteSlider
			.data('components', rhs)
			.attr('max', rhs.length)
			.attr('value', rhs.length)
			.prop('disabled', rhs.length < 1);

		updateRule();
	});
});
