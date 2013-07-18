define([], function() {
	'use strict';

	var StackedSprite = cc.Node.extend({
		ctor:function() {
			this._super();
		},

		setup:function(instructions) {
			var backingColor = instructions['backingColor'];
			if (backingColor) {
				var height = backingColor['height'];
				var width = backingColor['width'];
				var color = cc.c4b(backingColor['color'].r, backingColor['color'].g, backingColor['color'].b, 255);
				var colorLayer = new cc.LayerColor();
				colorLayer.init(color, height, width);
				colorLayer.setPosition(-height/2, -width/2);
				this.addChild(colorLayer);
			};
			var images = instructions['images'];
			for (var i = 0; i < images.length; i++) {
				var image = images[i];
				var filename = image['filename'];
				var resource = window.bl.getResource(filename);
				var sprite = new cc.Sprite();
				sprite.initWithFile(resource);
				this.addChild(sprite);
				var priority = image['priority'] || 0;
				sprite.setZOrder(priority);
				var position = image['position'];
				if (position) {
					sprite.setPosition(position['x'], position['y']);
				};
			};
		},
	})

	return StackedSprite;
})