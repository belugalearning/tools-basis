define([], function() {

	var ButtonSprite = cc.Sprite.extend({
		ctor:function() {
			this._super();
			this.pressFunction = null;
			this.target;
		},

		processTouch:function(touchLocation) {
			if (this.touched(touchLocation)) {
				var argumentsToPass = _.rest(arguments)[0];
				this.pressFunction.call(this.target, argumentsToPass);
			};
		},

		pressFunction:function() {
			throw ("No press function. Override me!");
		},
	})

	return ButtonSprite;

})