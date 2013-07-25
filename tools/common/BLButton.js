require.config({
    paths: {}
});

define(['cocos2d'], function (cc) {
    'use strict';

    var BlButton = cc.ControlButton.extend({

        tag: '',
        _lastPosition: undefined,

        ctor:function() {
            this._super();
        },

        initWithResource: function (name) {
            this.initWithFile(bl.getResource(name));
            console.log(this);
            this.removeChild(this._titleLabel)
        },

        initWithFile: function (file) {
            var sprite = new cc.Sprite();
            sprite.initWithFile(file);
            var s = sprite.getBoundingBox().size;
            var label = new cc.LabelTTF();
            label.initWithString('');
            label.setOpacity(0);
            label.setDimensions(s);
            this.initWithLabelAndBackgroundSprite(label, sprite);
            this.setMargins(0, 0);
        },

        initWithSprite: function (sprite) {
            var s = sprite.getBoundingBox().size;
            var label = new cc.LabelTTF();
            label.initWithString('');
            label.setOpacity(0);
            label.setDimensions(s);
            this.initWithLabelAndBackgroundSprite(label, sprite);
            this.setMargins(0, 0);
        },

        onTouchBegan: function (touch, event) {
            if (this._super(touch, event)) {
                this._lastPosition = this.getPosition();
                return true;
            }
            return false;
        },

        onTouchEnded: function (touch, event) {
            this._super(touch, event);
            this._onTouchUp.apply(this, [touch.getLocation(), this]);
        },

        _onTouchUp: function () {},
        onTouchUp: function (cb) {
            this._onTouchUp = cb;
        }

    });

    BlButton.create = function (resource) {
        var blButton;
        if (arguments.length == 0) {
            blButton = new BlButton();
            if (blButton && blButton.init()) {
                return blButton;
            }
            return null;
        } else if (typeof resource === 'string') {
            blButton = new BlButton();
            blButton.initWithResource(resource);
            return blButton;
        } else {
            blButton = new BlButton();
            blButton.initWithSprite(resource);
            return blButton;
        }
    }

    return BlButton;

});
