define(['cocos2d', 'underscore'], function(cc, _) {
	'use strict';

	var StackedSprite = cc.Node.extend({
		ctor: function() {
			this._super();
            // Set the default anchor point
            this.ignoreAnchorPointForPosition(false);
            this.setAnchorPoint(cc.p(1, 1));
		},

		setup: function(instructions) {
			var self = this;
			var layers = instructions['layers'];
			_.each(layers, function (layer) {
				var l;
				var height = layer.height;
				var width = layer.width;
				if (layer.hasOwnProperty('shape')) {

					var color = cc.c4b(layer.color.r, layer.color.g, layer.color.b, layer.color.a);
					var layer = new BLDrawNode();
					self.addChild(layer);
					layer.drawShape(shape, color, 0, cc.c4f(0,0,0,1));

				if (layer.hasOwnProperty('color')) {
					var color = cc.c4b(layer.color.r, layer.color.g, layer.color.b, layer.color.a);
					l = new cc.LayerColor();
					l.init(color, width, height);
				} else {
					var filename = layer.filename;
					var resource = window.bl.getResource(filename);
					var l = new cc.Sprite();
					l.initWithFile(resource);
				}
				var position = layer.position;
				if (position) {
					l.setPosition(position['x'], position['y']);
				}
				var priority = layer.priority || 0;
				l.setZOrder(priority);
				self.addChild(l);
				self.setContentSize(l.getBoundingBox().size)
			});
		},
	})

	return StackedSprite;
})