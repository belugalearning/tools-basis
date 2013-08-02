define(['cocos2d', 'underscore', 'bldrawnode'], function(cc, _, BLDrawNode) {
	'use strict';

	var StackedSprite = cc.Sprite.extend({
		ctor: function() {
			this._super();
			this.initWithFile(bl.getResource('transparent')); // we need to init the sprite with a transparent png to stop it from drawing a bg colour of white
		},

		setup: function(instructions) {
			var self = this;
			var layers = instructions['layers'];
			var mx_width = _.max(layers, function (layer) { return layer.width }).width;
			var mx_height = _.max(layers, function (layer) { return layer.height }).height;

			_.each(layers, function (layer) {
				var l;
				var height = layer.height;
				var width = layer.width;
				if (layer.hasOwnProperty('shape')) {
					var color = cc.c4FFromccc4B(cc.c4b(layer.color.r, layer.color.g, layer.color.b, layer.color.a));
					l = new BLDrawNode(mx_width, mx_height, width, height);
					l.drawShape(layer.shape, color, 0, cc.c4f(0,0,0,0));
					l.setContentSize(cc.SizeMake(width, height));
				} else if (layer.hasOwnProperty('color')) {
					var color = cc.c4b(layer.color.r, layer.color.g, layer.color.b, layer.color.a);
					l = new cc.LayerColor();
					l.init(color, width, height);
				} else {
					var filename = layer.filename;
					var resource = window.bl.getResource(filename);
					var l = new cc.Sprite();
					l.initWithFile(resource);
				}
				
				if (layer.hasOwnProperty('position')) {
					var position = layer.position;
					l.setPosition(position['x'], position['y']);
				}
				if (layer.hasOwnProperty('rotation')) {
					l.setRotation(layer.rotation);
				}
				var priority = layer.priority || 0;
				l.setZOrder(priority);
				self.addChild(l);
			});
			self.setContentSize(cc.SizeMake(mx_width, mx_height))
		},
	})

	return StackedSprite;
})