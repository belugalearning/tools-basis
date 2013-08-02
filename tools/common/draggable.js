require.config({
    paths: {}
});

define(['cocos2d', 'blbutton'], function (cc, BlButton) {
    'use strict';

    var Draggable = BlButton.extend({

        _lastPosition: undefined,
        _homePosition: undefined,
        _preDragAnchorPoint: undefined,
        
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

                var cs = this.getContentSize();
                this._preDragAnchorPoint = this._anchorPoint;

               //move anchor point to touch position
                this._anchorPointInPoints = cc.p(
                    (touch._point.x - (this._lastPosition.x - (cs.width * this._scaleX) / 2)) / this._scaleX,
                    (touch._point.y - (this._lastPosition.y - (cs.height * this._scaleY) / 2)) / this._scaleY
                );
                
                this._anchorPoint = cc.p(
                    this._anchorPointInPoints.x / cs.width,
                    this._anchorPointInPoints.y / cs.height
                );

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

            //restore central anchor point
            this.setAnchorPoint(this._preDragAnchorPoint);
        },

        _onMoved: function () {},
        onMoved: function (cb) {
            this._onMoved = cb;
        },

        _onMoveEnded: function () {},
        onMoveEnded: function (cb) {
            this._onMoveEnded = cb;
        },

    });

    return Draggable;

});
