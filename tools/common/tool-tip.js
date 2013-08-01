define([], function() {
	'use strict';

	var ToolTip = cc.Sprite.extend({
		ctor:function() {
			this._super();
			this.initWithFile(window.bl.getResource('tooltip'));
			this.label = new cc.LabelTTF.create("", "mikadoBold", 14);
			this.label.setColor(0,0,0);
			this.label.setPosition(32, 28);
			this.addChild(this.label);
			this.label.boundary = cc.SizeMake(40, 56);

			this.autoFontSize = false;
		},

		setLabelString:function(string) {
			if (this.autoFontSize) {
				this.label.setStringAutoFontSize(string, 30, 0.1);
			} else {
				this.label.setString(string);
			};
		},

		setAutoFontSize:function(autoSize) {
			this.autoFontSize = autoSize;
		},
	})

	return ToolTip;
})