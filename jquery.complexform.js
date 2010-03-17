/*
 * Changeable
 * For a given element set returns the element set that should be watched.
 * E.g. input -> input itself, option -> select,
 * input[type=radio] -> set of inputs with the same name.
 */
jQuery.fn.changeable = function() {
	var res = [],
		append = function(items) {
			$(items).each(function(i, x) {
				if (res.indexOf(x) == -1)
					res.push(x)
				})
		}
	
	for(var i = this.length - 1; i >= 0; i--) {
		if ('radio' == this[i].type)
			append(this[i].form[this[i].name])
		else if ('OPTION' == this[i].tagName)
			append($(this[i]).parent())
		else
			append(this[i])
	}
	return $(res)
};

jQuery.fn.valOrChecked = function() {
	if (this.is('[type=radio]')) {
		if (this.length > 1)
			return this.filter(':checked').val()
		return this.is(':checked')
	}
	
	if (this.is('[type=checkbox]'))
		return this.is(':checked')
	
	if (this.is('option'))
		return this.is(':selected')
	
	return this.val()
};

jQuery.fn.cond = function() { // example: positive = function(x) { return x > 0 }
	if (arguments[1] == undefined) { // either it's (tgt) or (cond, tgt)
		var tgt = arguments[0],
		cond = function(x) { return x ? true : false } // default comparison function: non-empty
	}
	else {
		var cond = arguments[0],
		tgt = arguments[1]
	}
	
	tgt = $(tgt)
	if (tgt.length == 0)
		return this
	
	if (typeof(cond) != 'function') {
		var functions = { // comparison functions.
			'==': function (x, y) { return x == y }, // longer first!
			'>=': function (x, y) { return x >= y },
			'<=': function (x, y) { return x <= y },
			'!=': function (x, y) { return x != y },
			'=': function (x, y) { return x = y },
			'<': function (x, y) { return x < y },
			'>': function (x, y) { return x > y }
		}, _cond = String(cond)
		
		cond = function(x, y) { return functions['=='](x, _cond) }
		for (var i in functions) // find the 1st matching function and use it
			if (_cond.indexOf(i) == 0) {
				cond = function(x) { return functions[i](x, _cond.substr(i.length)) }
				break
			}
	}
	
	var _this = this
	this.changeable().change(function() {
		var _tgt = $(tgt),
			check = cond($(_this).valOrChecked()) // get the value and get true/false from condition function
		
		/* .changeable() in condition is a hack for Opera 10 */
		if (check && (_this.changeable().is(':visible') || _this.is('[type=hidden]')) && _tgt.is(':hidden')) {
			_tgt.show(200)
			_tgt.trigger('change')
		}
		else if ((!check || (_this.is('[type!=hidden]') && _this.changeable().is(':hidden'))) && _tgt.is(':visible')) {
			_tgt.hide() // safe this way
			_tgt.trigger('change')
		}
	})
	this.trigger('change') // some elements need to be hidden right away
	return this
};

jQuery.fn.depend = function() {
	if (arguments[1] == undefined) { // either it's (tgt) or (cond, tgt)
		var src = arguments[0],
		cond = function(x) { return x ? true : false } // default comparison function: non-empty
	}
	else {
		var cond = arguments[0],
		src = arguments[1]
	}

	return $(src).cond(cond, this)
};

