'use srtict';

(function(global, factory) {

	global.cm = factory();

})(this, function() {

	var cm = function(selector) {
		return new cm.prototype.init(selector);
	}

	cm.prototype.init = function(selector) {

		var nodes;

		if (!selector) {
			return this;
		} else if (typeof selector === 'string') {
			nodes =	document.querySelectorAll(selector);
		} else if (selector.nodeType) {
			this[0] = selector;
			this.length = 1;
			return this;
		} else {
			nodes = selector;
		}

		for (var i = 0; i < nodes.length; i++) {
			this[i] = nodes[i];
		}

		this.length = nodes.length;
	}

	cm.prototype.init.prototype = cm.prototype;

	var notSpace = (/[^\x20\t\r\n\f]+/g);

    cm.prototype._actClass = function(action, value) {
		var classes = value.match(notSpace);

    	var i = 0;
    	while(elem = this[i++]) {
    		classes.forEach(function(name) {
    			elem.classList[action](name);
    		})
    	}
    }
	cm.prototype.hasClass = function(value) {
		var name = new RegExp('(^| )'+ value +'( |$)');
		var i = 0;
		while (elem = this[i++]) {
			if (name.test(elem.className)) return true;
		}
		return false;
	}

	cm.prototype.removeClass = function(value) {
		this._actClass('remove', value);
		return this;
	};

	cm.prototype.addClass = function(value) {
		this._actClass('add', value);
		return this;
	};

	cm.prototype.toggleClass = function(value) {
		this._actClass('toggle', value);
		return this;
	};

	cm.prototype.replaceClass = function(oldName, newName) {
		this.removeClass(oldName);
		this.addClass(newName);
		return this;
	}

	return cm;
});
