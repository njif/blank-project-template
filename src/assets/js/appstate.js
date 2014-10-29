;(function (ns) {

	var Mediator = function (owner, eventList) {
		this._owner = owner;
		this._callbacks = {};
		this._eventList = eventList;
	};

	Mediator.prototype = {
		on: function (owner, eventName, callback) {
			if (owner != this._owner)
				return;
			if (!this._callbacks[eventName])
				this._callbacks[eventName] = [];
			ns.jstools.subscribe(this, this._callbacks[eventName], callback); 
		},

		publish: function (owner, eventName, eventObject) {
			var eventName = this._eventList[eventName];
			if (owner != this._owner || !this._callbacks[eventName])
				return;
			ns.jstools.publish(this._callbacks[eventName], eventObject);
		}		
	}

	var AppState = function () {

		this._eventList = {};							// Control raise this event	 ======> Mediator publish this event
														// and AppState do something only if subscribed to this event
		this._mediator = new Mediator(this, this._eventList);
	};

	AppState.prototype = {
		registerEvent: function(controlEvent, mediatorEvent) {
			this._eventList[controlEvent] = mediatorEvent;
			return this;
		},
		on: function (eventName, callback) {
			this._mediator.on(this, eventName, callback);
			return this;
		},
		raise: function (eventName, eventObject) {
			this._mediator.publish(this, eventName, eventObject);
			return this;
		}
	};

	ns.AppState = AppState;

}(window.blankapp || window));