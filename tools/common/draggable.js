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
            if (this._posCount === 0) {
                this._homePosition = pos;
            }
            this._posCount++;
            this._super.apply(this, [pos]);
        },

        returnToLastPosition: function (animate) {
            if (animate) {
                var action = cc.Sequence.create(cc.MoveTo.create(0.2, this._lastPosition));
                this.runAction(action);
                return;
            }
            this.setPosition(this._lastPosition);
        },
        
        onTouchBegan: function (touch, event) {
            if (this._super(touch, event)) {
                
                this._lastPosition = this.getPosition();
                this._preDragAnchorPoint = this.getAnchorPoint();

                var cs = this.getContentSize();
                var x = (touch._point.x - (this._lastPosition.x - (cs.width * this._scaleX) / 2)) / this._scaleX;
                var y = (touch._point.y - (this._lastPosition.y - (cs.height * this._scaleY) / 2)) / this._scaleY;
                
                this.setAnchorPoint(cc.p(
                    x / cs.width,
                    y / cs.height
                ));

                var position = this.getParent().convertToNodeSpace(touch.getLocation());
                this.setPosition(position);

                this._onTouchDown.apply(this, [position, this]);
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
            var position = this.getParent().convertToNodeSpace(touch.getLocation());
            this.setPosition(position);
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
