jQuery.fn.depend = function(obj, cond) {
	if (typeof(obj) != "object")
		return this
	
	if (undefined == condition) { // просто проверить, что объект не пуст или что выбран
		var checkboxes = $(obj).filter('input').filter('[type=checkbox],[type=radio]') // checked
		var options = $(obj).filter('option') // option selected
		var other = $(obj).not(checkboxes).not(options) // the rest
	}
	
};

jQuery.fn.cond = function(cond, tgt) {
	var _this = this
		
	if (typeof(cond) != 'function') { // if cond is already a function, proceed.
		var _cond = String(cond) // otherwise, make a new function
		
		if (0 == _cond.length) // if no condition specified, check if non-empty
			cond = function(x) { return _this.val() ? true : false }
		else { // or check for equality if 
			cond = function(x) { return functions['='](_cond) }
			var functions = {
				'==': function(x) { return _this.val() == x },
				'>=': function(x) { return _this.val() >= x },
				'<=': function(x) { return _this.val() <= x },
				'=': function(x) { return _this.val() == x },
				'<': function(x) { return _this.val() < x },
				'>': function(x) { return _this.val() > x }
			}
			
			for(var i in functions)
				if (_cond.indexOf(i) == 0) {
					cond = function() { return functions[i](_cond.substring(i.length)) }
					break
				}
		}
	}

	this.bind('change', function() {
		var _tgt = $(tgt)
		if (cond() && _tgt.is(':hidden')) { _tgt.show() }
		else if (!cond() && _tgt.is(':visible')) { _tgt.hide() }
	})
	
	this.trigger('change')
};
