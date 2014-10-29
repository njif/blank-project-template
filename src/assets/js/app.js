;(function(ns, $) {

	// THE CORE OF BLANK APPLICATION.

	var BlankApp = function() {

		this._state = null;
		this._templater = null;

		this._controls = { catalog: null, button: null };

		this._init();
	};

	BlankApp.prototype = {

		_init: function () {

			// Initialization here
			this._initAppState();
			this._initTemplater();
			this._initControls();
			this._attachPubSubEvents();
		},

		_initAppState: function() {

			var state = new ns.AppState();

			state
				.registerEvent('catalog_item.clicked', 'clicked:catalog-item')
				.registerEvent('main.button.clicked', 'clicked:main.button')
				.registerEvent('header.button.clicked', 'clicked:header.button')
				.registerEvent('modal.holder.clicked', 'clicked:modal.button')

			this._state = state;			
		},

		_initTemplater: function() {

			this._templater = ns.templater.init();
		},

		_initControls: function() {

			var controls = this._controls;
			var state = this._state;

			controls.catalog = ns.catalog.init(this._state, this._templater).render();
			controls.modalWindow = ns.modalWindow.init(this._state, this._templater);
			controls.button = $('.cc_button_scrollto_catalog').on('click', function(event) {
				
				state.raise('main.button.clicked', event);
			});
			controls.button = $('.navbar__header-button').on('click', function(event) {

				state.raise('header.button.clicked', event);
			});
		},

		_attachPubSubEvents: function() {

			// Attach pub/sub events here

			var controls = this._controls;
			var state = this._state;
			var app = this;

			state // subscribe to

				.on('clicked:catalog-item', function(event) {
					// do something with element
					if (!event)
						return;
					var $el = $(event.target || event.srcElement);
					$el.css({ color: 'red' });
				})
				.on('clicked:main.button', function() {
					// scroll to page catalog
					var scrollTop = $('.page-catalog').offset().top - $('.navbar-fixed-top').height();
					$("body").animate({ scrollTop: scrollTop }, 400, 'swing');
					return false;
				})
				.on('clicked:header.button', function() {

					var html = ns.templater.fillWindow({});
					var holder = $('.modal__window').html(html);
					var tableHtml = controls.modalWindow.getHtml('Some data');
					holder.find('.modal__window_body').html(tableHtml);
					holder.find('.modal').modal('show');
					return false;
				}).
				on('clicked:header.button', function(event) {
					// do something with element
					if (!event)
						return;
					var $el = $(event.target || event.srcElement);
					$el.css({ 'backgroung-color': 'lightgray' });

				});
		}
	};

	ns.BlankApp = BlankApp;

}(window.blankapp || window, jQuery));