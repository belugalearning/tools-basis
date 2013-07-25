require.config({
	paths: {
		'buttonsprite': '../../tools/common/button-sprite'
	}
})

define(['buttonsprite'], function(ButtonSprite) {

	backgroundFilename:null;
	settingsButtonPosition:null;

	var SettingsLayer = cc.Layer.extend({
		ctor:function() {
			this._super();

			this.setTouchEnabled(true);
			this.setTouchPriority(-200);

			this.active = false;
			this.touchProcessors = [];

			var size = cc.Director.getInstance().getWinSize();
			this.size = size;

			var background = new cc.Sprite();
			background.initWithFile(window.bl.getResource(this.backgroundFilename));
			background.setPosition(size.width/2, size.height* 3/2);
			background.setZOrder(100);
			this.addChild(background);
			this.background = background;

            this.closeButton = new ButtonSprite();
            this.closeButton.initWithFile(window.bl.getResource('settings_free_form_closebutton'));
            this.closeButton.setPosition(960, 710);
            this.closeButton.pressFunction = this.processCloseSettings;
            this.closeButton.target = this;
            background.addChild(this.closeButton);

            this.onPosition = cc.p(size.width/2, size.height/2);
            this.offPosition = cc.p(size.width/2, size.height * 3/2);
            // this.closeButtonPosition = cc.p

            var settingsButtonBase = new cc.Sprite();
            settingsButtonBase.initWithFile(window.bl.getResource('settings_button_base'));
            settingsButtonBase.setPosition(this.settingsButtonPosition);
            this.addChild(settingsButtonBase);

            this.settingsButton = new ButtonSprite();
            this.settingsButton.initWithFile(window.bl.getResource('settings_button'));
            this.settingsButton.pressFunction = this.moveSettingsOn;
            this.settingsButton.target = this;
            this.settingsButton.setPosition(cc.pAdd(settingsButtonBase.getAnchorPointInPoints(), cc.p(8, -2)));
            settingsButtonBase.addChild(this.settingsButton);
		},

		registerWithTouchDispatcher:function() {
			cc.Director.getInstance().getTouchDispatcher.addTargetedDelegate(this, this._touchPriority, true);
		},

		onTouchBegan:function(touch, event) {
			var touchLocation = this.convertTouchToNodeSpace(touch);
			if (this.active) {
				for (var i = 0; i < this.touchProcessors.length; i++) {
					var touchProcessor = this.touchProcessors[i];
					touchProcessor.processTouch(touchLocation);
				};
			} else {
				this.settingsButton.processTouch(touchLocation);
			};
			return this.active;
		},

        moveSettingsOn:function() {
            var moveOn = cc.MoveTo.create(0.3, this.onPosition);
            this.background.runAction(moveOn);
            this.active = true;
        },

        moveSettingsOff:function() {
            var moveOff = cc.MoveTo.create(0.3, this.offPosition);
            this.background.runAction(moveOff);
            this.active = false;
        },

		processCloseSettings:function() {
			this.moveSettingsOff();
		},

		freakOut:function() {
			this.freakOutsRemaining = 100;
			this.oneRandom();
		},

		oneRandom:function() {
			if (!this.moving) {			
				if (this.freakOutsRemaining > 0) {
					var randomX = Math.floor(Math.random() * 10 - 5);
					var randomY = Math.floor(Math.random() * 10 - 5);
					var action = cc.MoveTo.create(0.01, cc.p(this.size.width/2 + randomX, this.size.height/2 + randomY));
					this.background.runAction(action);
					var that = this;
					var timeOut = setTimeout(function() {that.oneRandom()}, 50);
					this.freakOutsRemaining--;
				};
			}
		},
	})
	
	return SettingsLayer;

})