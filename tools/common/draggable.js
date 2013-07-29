require.config({
    paths: {}
});

define(['cocos2d', 'blbutton'], function (cc, BlButton) {
    'use strict';

    var Draggable = BlButton.extend({

        _lastPosition: undefined,

        ctor:function() {
            this._super();
        },

        returnToLastPosition: function () {
            this.setPosition(this._lastPosition);
        },

        onTouchBegan: function (touch, event) {
            if (this._super(touch, event)) {
                this._lastPosition = this.getPosition();
                return true;
            }
            return false;
        },

        onTouchMoved: function (touch, event) {
            this._super(touch, event);
            this.setPosition(touch.getLocation());
            this._onMoved.apply(this, [touch.getLocation(), this]);
        },

        onTouchEnded: function (touch, event) {
            this._super(touch, event);
            this._onMoveEnded.apply(this, [touch.getLocation(), this]);
        },

        _onMoved: function () {},
        onMoved: function (cb) {
            this._onMoved = cb;
        },

        _onMoveEnded: function () {},
        onMoveEnded: function (cb) {
            this._onMoveEnded = cb;
        }

    });

    return Draggable;

});
