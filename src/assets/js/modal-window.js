;(function(ns, $){

	// PUBLIC API:

	var modalApi = {
		init: init,
		getHtml: getHtml
	};

	function init(state, templater, options) {

		var instance = getInstance(options);
		instance.init(state, templater); 
		return modalApi;
	}

	function getHtml(data) {

		var instance = getInstance();
		return instance.getHtml(data);
	}

	// =============================
	// PRIVATE:

	var catalogInstance = null;

	function getInstance(options) {

		if (!catalogInstance)		
			catalogInstance = new ModalWindow(options);
			
		getInstance = function() { return catalogInstance; };
		return catalogInstance;
	};

	var defaults = {
		modalSelector: '.modal__window',// .modal-content'
		events: {
			holderClick: 'modal.holder.clicked'
		}
	}

	var ModalWindow = function(options) {

		this._config = $.extend({}, defaults, options);
		this._appState = null;
		this._holder = null;
	};

	ModalWindow.prototype = {
		
		init: function(state, templater) {

			if (this._holder)
				return this;

			this._holder = $(this._config.modalSelector);
			this._appState = state;

			this._attachEvents();
		},
		
		getHtml: function(data) {

			return '<div class="modal__window_body-empty">Modal window text here: ' + data + '</div>';
		},

		_attachEvents: function() {

			var state = this._appState;
			var events = this._config.events;

			this._holder.on('click', '.modal__window_body', function(event) {

				state.raise(events.holderClick, event);
			});

		}
	};

	ns.modalWindow = modalApi;

}(window.blankapp || window, jQuery));