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
            this._dragAreaRect = null;
            this.changePositionOnTouchDown = true;
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
        
        returnToHomePosition: function () {
            this.setPosition(this._homePosition);
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

                if (this.changePositionOnTouchDown) {
                    var position = this.findPositionToSet(touch);
                    this.setPosition(position);
                };

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
            var position = this.findPositionToSet(touch);
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

        setDragAreaRect:function(rect) {
            this._dragAreaRect = rect;
        },

        setChangePositionOnTouchDown:function(change) {
            this.changePositionOnTouchDown = change;
        },

        findPositionToSet:function(touch) {
            var touchLocation = this.getParent().convertToNodeSpace(touch.getLocation());
            var xPos = touchLocation.x, yPos = touchLocation.y;
            if (this._dragAreaRect !== null) {
                var sprite = this.getCurrentBackgroundSprite();

                if (this._dragAreaRect.size.width <= sprite.getBoundingBox().width) {
                    xPos = this._dragAreaRect.origin.x + this._dragAreaRect.size.width/2;
                } else {
                    var leftToAnchor = sprite.getAnchorPointInPoints().x * sprite.getScaleX();
                    var rightToAnchor = sprite.getBoundingBox().size.width - leftToAnchor;
                    var lowX = this._dragAreaRect.origin.x + leftToAnchor;
                    var highX = this._dragAreaRect.origin.x + this._dragAreaRect.size.width - rightToAnchor;
                    xPos = xPos.putInBounds(lowX, highX);
                };

                if (this._dragAreaRect.size.height <= sprite.getBoundingBox().height) {
                    yPos = this._dragAreaRect.origin.y + this._dragAreaRect.size.height/2;
                } else {
                    var bottomToAnchor = sprite.getAnchorPointInPoints().y * sprite.getScaleY();
                    var topToAnchor = sprite.getBoundingBox().size.height - bottomToAnchor;
                    var lowY = this._dragAreaRect.origin.y + bottomToAnchor;
                    var highY = this._dragAreaRect.origin.y + this._dragAreaRect.size.height - topToAnchor;
                    yPos = yPos.putInBounds(lowY, highY);
                };
            };
            return cc.p(xPos, yPos);
        },

        distanceMoved:function() {
            return cc.pDistance(this.getPosition(), this._lastPosition);            
        },


    });

    return Draggable;

});
