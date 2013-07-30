require.config({
    paths: {}
});

define(['cocos2d'], function(cc) {
    'use strict';

    var BlButton = cc.Control.extend({
        _adjustBackgroundImage: false,
        _zoomOnTouchDown: false,
        _preferredSize: new cc.Size(0, 0),
        _backgroundSprite: null,
        _opacity: 0,
        _pushed: false,
        _backgroundSpriteDispatchTable: null,

        _marginV: 0,
        _marginH: 0,

        ctor: function() {
            this._super();
            this._preferredSize = new cc.Size(0, 0);
            this._backgroundSpriteDispatchTable = {};
        },

        init: function(isDirectCall) {
            if ((isDirectCall != null) && (isDirectCall == true))
                return this._super();
            return this.initWithSprite(cc.Scale9Sprite.create());
        },

        needsLayout: function() {
            // Hide the background
            this._backgroundSprite.setVisible(false);

            // Update the background sprite
            this._backgroundSprite = this.getBackgroundSpriteForState(this._state);
            // Set the content size
            var maxRect = this._backgroundSprite.getBoundingBox();
            this.setContentSize(cc.SizeMake(maxRect.size.width, maxRect.size.height));

            this._backgroundSprite.setPosition(cc.p(0,0));

            // Make visible the background
            this._backgroundSprite.setVisible(true);
        },

        initWithSprite: function(backgroundSprite) {
            if (this.init(true)) {
                cc.Assert(backgroundSprite != null, "backgroundSprite must not be nil");

                this.ignoreAnchorPointForPosition(false);
                this.setAnchorPoint(cc.p(0.5, 0.5));

                this.setTouchEnabled(true);
                this._pushed = false;
                this._zoomOnTouchDown = true;
                this._state = cc.CONTROL_STATE_INITIAL;

                // Adjust the background image by default
                this._adjustBackgroundImage = true;

                // Zooming button by default
                this._zoomOnTouchDown = true;

                // Set the nodes
                this._backgroundSprite = backgroundSprite;

                // Initialize the button state tables
                this._backgroundSpriteDispatchTable = {};

                this.setBackgroundSpriteForState(backgroundSprite, cc.CONTROL_STATE_NORMAL);

                this._state = cc.CONTROL_STATE_NORMAL;

                //default margins
                this._marginH = 0;
                this._marginV = 0;

                // Layout update
                this.needsLayout();

                return true;
            } //couldn't init the CCControl
            else
                return false;
        },

        initWithResource: function(name) {
            this.initWithFile(bl.getResource(name));
        },

        initWithFile: function(file) {
            var sprite = new cc.Sprite();
            sprite.initWithFile(file);
            this.initWithSprite(sprite);
            this.setMargins(0, 0);
        },

        /** Adjust the background image. YES by default. If the property is set to NO, the
     background will use the prefered size of the background image. */
        getAdjustBackgroundImage: function() {
            return this._adjustBackgroundImage;
        },
        setAdjustBackgroundImage: function(adjustBackgroundImage) {
            this._adjustBackgroundImage = adjustBackgroundImage;
            this.needsLayout();
        },

        /** Adjust the button zooming on touchdown. Default value is YES. */
        getZoomOnTouchDown: function() {
            return this._zoomOnTouchDown;
        },
        setZoomOnTouchDown: function(zoomOnTouchDown) {
            return this._zoomOnTouchDown = zoomOnTouchDown;
        },

        /** The prefered size of the button */
        getPreferredSize: function() {
            return this._preferredSize;
        },
        setPreferredSize: function(preferredSize) {
            if (preferredSize.width == 0 && preferredSize.height == 0) {
                this._adjustBackgroundImage = true;
            } else {
                this._adjustBackgroundImage = false;
                for (var itemKey in this._backgroundSpriteDispatchTable) {
                    this._backgroundSpriteDispatchTable[itemKey].setPreferredSize(preferredSize);
                }

                this._preferredSize = preferredSize;
            }
            this.needsLayout();
        },

        /* Override setter to affect a background sprite too */
        getOpacity: function() {
            return this._opacity;
        },

        setOpacity: function(opacity) {
            this._opacity = opacity;

            var controlChildren = this.getChildren();

            for (var i = 0; i < controlChildren.length; i++) {
                if (controlChildren[i] && controlChildren[i].RGBAProtocol) {
                    controlChildren[i].setOpacity(opacity);
                }
            }
            for (var itemKey in this._backgroundSpriteDispatchTable) {
                this._backgroundSpriteDispatchTable[itemKey].setOpacity(opacity);
            }
        },

        /** Flag to know if the button is currently pushed.  */
        getIsPushed: function() {
            return this._pushed;
        },

        /* Define the button margin for Top/Bottom edge */
        getVerticalMargin: function() {
            return this._marginV;
        },
        /* Define the button margin for Left/Right edge */
        getHorizontalOrigin: function() {
            return this._marginH;
        },
        //set the margins at once (so we only have to do one call of needsLayout)
        setMargins: function(marginH, marginV) {
            this._marginV = marginV;
            this._marginH = marginH;
            this.needsLayout();
        },

        setEnabled: function(enabled) {
            this._super(enabled);
            this.needsLayout();
        },
        setSelected: function(enabled) {
            this._super(enabled);
            this.needsLayout();
        },
        setHighlighted: function(enabled) {
            this._super(enabled);
            var action = this.getActionByTag(cc.CONTROL_ZOOM_ACTION_TAG);
            if (action) {
                this.stopAction(action);
            }
            this.needsLayout();
            if (this._zoomOnTouchDown) {
                var scaleValue = (this.isHighlighted() && this.isEnabled() && !this.isSelected()) ? 1.1 : 1.0;
                var zoomAction = cc.ScaleTo.create(0.05, scaleValue);
                zoomAction.setTag(cc.CONTROL_ZOOM_ACTION_TAG);
                this.runAction(zoomAction);
            }
        },

        onTouchBegan: function(touch, event) {
            if (!this.isTouchInside(touch) || !this.isEnabled()) {
                return false;
            }

            this._state = cc.CONTROL_STATE_HIGHLIGHTED;
            this._pushed = true;
            this.setHighlighted(true);
            this.sendActionsForControlEvents(cc.CONTROL_EVENT_TOUCH_DOWN);
            return true;
        },

        onTouchMoved: function(touch, event) {
            if (!this._enabled || !this._pushed || this._selected) {
                if (this._highlighted) {
                    this.setHighlighted(false);
                }
                return;
            }

            var isTouchMoveInside = this.isTouchInside(touch);
            if (isTouchMoveInside && !this._highlighted) {
                this._state = cc.CONTROL_STATE_HIGHLIGHTED;
                this.setHighlighted(true);
                this.sendActionsForControlEvents(cc.CONTROL_EVENT_TOUCH_DRAG_ENTER);
            } else if (isTouchMoveInside && this._highlighted) {
                this.sendActionsForControlEvents(cc.CONTROL_EVENT_TOUCH_DRAG_INSIDE);
            } else if (!isTouchMoveInside && this._highlighted) {
                this._state = cc.CONTROL_STATE_NORMAL;
                this.setHighlighted(false);
                this.sendActionsForControlEvents(cc.CONTROL_EVENT_TOUCH_DRAG_EXIT);
            } else if (!isTouchMoveInside && !this._highlighted) {
                this.sendActionsForControlEvents(cc.CONTROL_EVENT_TOUCH_DRAG_OUTSIDE);
            }
        },
        onTouchEnded: function(touch, event) {
            this._state = cc.CONTROL_STATE_NORMAL;
            this._pushed = false;
            this.setHighlighted(false);

            if (this.isTouchInside(touch)) {
                this.sendActionsForControlEvents(cc.CONTROL_EVENT_TOUCH_UP_INSIDE);
                // this._onTouchUp.apply(this, [touch.getLocation(), this]);
            } else {
                this.sendActionsForControlEvents(cc.CONTROL_EVENT_TOUCH_UP_OUTSIDE);
            }
        },

        onTouchCancelled: function(touch, event) {
            this._state = cc.CONTROL_STATE_NORMAL;
            this._pushed = false;
            this.setHighlighted(false);
            this.sendActionsForControlEvents(cc.CONTROL_EVENT_TOUCH_CANCEL);
        },

        /**
         * Returns the background sprite used for a state.
         *
         * @param state The state that uses the background sprite. Possible values are
         * described in "CCControlState".
         */
        getBackgroundSpriteForState: function(state) {
            if (this._backgroundSpriteDispatchTable.hasOwnProperty(state) && this._backgroundSpriteDispatchTable[state]) {
                return this._backgroundSpriteDispatchTable[state];
            }
            return this._backgroundSpriteDispatchTable[cc.CONTROL_STATE_NORMAL];
        },

        /**
         * Sets the background sprite to use for the specified button state.
         *
         * @param sprite The background sprite to use for the specified state.
         * @param state The state that uses the specified image. The values are described
         * in "CCControlState".
         */
        setBackgroundSpriteForState: function(sprite, state) {
            if (this._backgroundSpriteDispatchTable.hasOwnProperty(state)) {
                var previousSprite = this._backgroundSpriteDispatchTable[state];
                if (previousSprite) {
                    this.removeChild(previousSprite, true);
                }
            }

            this._backgroundSpriteDispatchTable[state] = sprite;
            sprite.setVisible(false);
            this.addChild(sprite);

            if (this._preferredSize.width != 0 || this._preferredSize.height != 0) {
                sprite.setPreferredSize(this._preferredSize);
            }

            // If the current state if equal to the given state we update the layout
            if (this.getState() == state) {
                this.needsLayout();
            }
        },

        /**
         * Sets the background spriteFrame to use for the specified button state.
         *
         * @param spriteFrame The background spriteFrame to use for the specified state.
         * @param state The state that uses the specified image. The values are described
         * in "CCControlState".
         */
        setBackgroundSpriteFrameForState: function(spriteFrame, state) {
            var sprite = cc.Scale9Sprite.createWithSpriteFrame(spriteFrame);
            this.setBackgroundSpriteForState(sprite, state);
        }

    });

    BlButton.create = function(resource) {
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