;(function(ns, $){

	// PUBLIC API:

	var catalogApi = {
		init: init,
		render: render
	};

	function init(state, templater, options) {

		var instance = getInstance(options);
		instance.init(state, templater); 
		return catalogApi;
	}

	function render() {

		var instance = getInstance();
		instance.render(); 
		return catalogApi;
	}

	// =============================
	// PRIVATE:

	var catalogInstance = null;

	function getInstance(options) {

		if (!catalogInstance)		
			catalogInstance = new Catalog(options);
			
		getInstance = function() { return catalogInstance; };
		return catalogInstance;
	};

	var defaults = {
		dataUrl: 'data/items.json',
		selectors: {
			holder: '.page-catalog__items',
			item: '.page-catalog__item'
		},
		events: {
			itemClick: 'catalog_item.clicked'
		}
	};

	var Catalog = function(options) {

		this._config = $.extend({}, defaults, options);

		this._catalogData = null;
		this._templater = null;
		this._retryDelay = 200;
		this._holder = null;
	};

	Catalog.prototype = {
		
		init: function(state, templater) {

			if (this._holder)
				return this;

			this._holder = $(this._config.selectors.holder);

			this._appState = state;
			this._templater = templater;

			this._attachEvents();
		},
		
		render: function() {

			if (this._catalogData)
				return this._fillCatalog(this._catalogData);

			this._getData();
		},
		
		_fillCatalog: function(data) {

			if (!this._templater)
				return;

			var html = this._templater.fillCatalog(data);				// fill template
			this._holder.html(html);									// insert html into DOM
		},
		
		_getData: function() {											// load json file with catalog items

			var url = this._config.dataUrl;
			var onLoaded = $.proxy(this._onDataLoaded, this);
			var onError = $.proxy(this._onError, this);
			var options = { type: "GET", url: url, cache: false };

			$.ajax(options).done(onLoaded).fail(onError);
		},

		_onRequestFail: function( jqXHR, textStatus ) {
			
			this._retryRequest(this._getData, onLoaded, onError);
		},
		
		_retryRequest: function (requestHandler, url, onLoaded, onError) {

			setTimeout(function() {
				requestHandler(url, onLoaded, onError);
			}, this._retryDelay);
		},
		
		_onDataLoaded: function(data, textStatus, jqXHR) {

			this._catalogData = data;									// cached data
			this._fillCatalog(data);
		},
		
		_onError: function(jqXHR, textStatus, errorThrown) {

			this._holder.html(textStatus);								// show error
		},

		_attachEvents: function() {

			this._holder.on('click', this._config.selectors.item, $.proxy(this._catalogItemClick, this));
		},

		_catalogItemClick: function(event) {

			this._appState.raise(this._config.events.itemClick, event);
		}		
	};

	ns.catalog = catalogApi;

}(window.blankapp || window, jQuery));