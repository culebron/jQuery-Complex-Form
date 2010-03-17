/*jQuery.fn.depend = function(obj, cond) {
	if (typeof(obj) != "object")
		return this
	
	if (undefined == condition) { // просто проверить, что объект не пуст или что выбран
		var checkboxes = $(obj).filter('input').filter('[type=checkbox],[type=radio]') // checked
		var options = $(obj).filter('option') // option selected
		var other = $(obj).not(checkboxes).not(options) // the rest
	}
};*/

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
	var _this = this
	if (arguments[1] == undefined) { // either it's (tgt) or (cond, tgt)
		var tgt = arguments[0],
		cond = function(x) { return x ? true : false } // default comp. function: non-empty
	}
	else {
		var cond = arguments[0],
		tgt = arguments[1]
	}
	
	tgt = $(tgt)
	if (tgt.length == 0)
		return this
	
	if (typeof(cond) != 'function') { // if cond is already a function, proceed.
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
	this.changeable().bind('change', function() {
		var _tgt = $(tgt),
			check = cond($(_this).valOrChecked()) // get the value and get true/false from condition function
		
		if (check && _tgt.is(':hidden')) { _tgt.show() }
		else if (!check && _tgt.is(':visible')) { _tgt.hide() }
	})
	this.trigger('change') // some elements need to be hidden right away
};
