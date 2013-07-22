require.config({
	paths:{
		'toollayer': '../../tools/common/toollayer',
		'stackedsprite': '../../tools/common/stacked-sprite'
	}
});

define(['exports', 'cocos2d', 'toollayer', 'qlayer', 'stackedsprite'], function(exports, cocos2d, ToolLayer, QLayer, StackedSprite) {
	'use strict';

	window.bl.toolTag = 'sorting';
	var Tool = ToolLayer.extend({

		ctor:function() {
			this._super();
			var size = cc.Director.getInstance().getWinSize();
			this.stackedSprite = new StackedSprite();
			this.stackedSprite.setPosition(size.width/2, size.height/2);
			this.addChild(this.stackedSprite);
			this.objectDisplay = document.getElementById('objectDisplay');
			this.drawNode = new cc.DrawNode();
			this.drawNode.setPosition(300, 300);
			this.addChild(this.drawNode);

			this.setupSprite({layers:[]});

			return this;
		},

		setupSprite:function(instructions) {
			this.stackedSprite.setup(instructions);
		},




		update:function() {
			this._super();
			if (document.instructionsChanged) {
				this.changeStackedSprite();
			};
		},

		changeStackedSprite:function() {
			if (typeof this.stackedSprite === 'undefined') return;
			var object = JSON.parse(this.objectDisplay.innerHTML);
			this.stackedSprite.removeAllChildren();
			this.setupSprite(object);
			document.instructionsChanged = false;
		},

	})

	exports.ToolLayer = Tool;
});