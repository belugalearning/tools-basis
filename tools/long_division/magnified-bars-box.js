define(['canvasclippingnode', 'barsbox'], function(CanvasClippingNode, BarsBox) {
	'use strict';

	var MagnifiedBarsBox = cc.Sprite.extend({
		ctor:function(dividend, divisor) {
			this._super();
			this.initWithFile(bl.resources['images_long_division_magnifyingglass']);
			var clipperNode = new CanvasClippingNode();
			clipperNode.drawPathToClip = function() {
				this.ctx.arc(112, -117, 90, 0, 2 * Math.PI, false);
			}
			clipperNode.setPosition(0,0);
			clipperNode.setZOrder(-1);
			this.addChild(clipperNode);
			var testBox = new cc.Sprite();
			// testBox.initWithFile(bl.resources['images_long_division_testbigwhitebox']);
			// clipperNode.addChild(testBox);

			var magnifyFactor = 10;

			this.barsBox = new BarsBox(dividend / magnifyFactor, divisor);
			this.barsBox.setPosition(-260, 100);
			var dummyLeftEdge = (1 - magnifyFactor) * this.barsBox.getContentSize().width;
			this.barsBox.barsNode.setPosition(dummyLeftEdge, -4);
			this.barsBox.toolTipNode.setPosition(dummyLeftEdge, 8);
			clipperNode.addChild(this.barsBox);
			// this.addChild(this.barsBox);
		},

		setBars:function(digitValues) {
			this.barsBox.setBars(digitValues);
		},
	});

	return MagnifiedBarsBox;
})