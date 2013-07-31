require.config({
    paths: {}
});

define(['cocos2d', 'blbutton'], function (cc, BlButton) {
    'use strict';

    var Draggable = BlButton.extend({

        _lastPosition: undefined,
        _homePosition: undefined,
        _length: undefined,

        ctor:function() {
            this._super();
            
        },

        _posCount: 0,
        setPosition: function (pos, anchorBottomLeft) {
            if (anchorBottomLeft) {
                var size = this.getContentSize();
                pos.x += size.width * 0.5;
                pos.y += size.height * 0.5;
            }
            if (this._posCount == 0) {
                this._homePosition = pos;
            }
            this._posCount++;
            this._super.apply(this, [pos]);
        },

        returnToLastPosition: function () {
            this.setPosition(this._lastPosition);
        },
        
        returnToHomePosition: function () {
            this.setPosition(this._homePosition);
        },

        onTouchBegan: function (touch, event) {
            if (this._super(touch, event)) {
                this._lastPosition = this.getPosition();
                this.setPosition(touch.getLocation());
                this._onTouchDown.apply(this, [touch.getLocation(), this]);
                return true;
            }
            return false;
        },

        _onTouchDown :function () {},
        onTouchDown:function(cb) {
            this._onTouchDown = cb;
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
