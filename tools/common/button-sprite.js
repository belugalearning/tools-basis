define([], function() {

	var ButtonSprite = cc.Sprite.extend({
		ctor:function() {
			this._super();
			this.pressFunction = null;
			this.target;
		},

		processTouch:function(touchLocation) {
			if (this.touched(touchLocation)) {
				this.pressFunction.call(this.target);
			};
		},

		pressFunction:function() {
			throw ("No press function. Override me!");
		},
	})

	return ButtonSprite;

})