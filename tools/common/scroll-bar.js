define(['draggable'], function(Draggable) {
	'use strict';

	var ScrollBar = Draggable.extend({
		ctor:function() {
			this._super();
			this.vertical;
			this.lowBound;
			this.highBound;
			this.fixedBound;
		},

		initWithOrientation:function(vertical) {
			this.vertical = vertical;
			var filenameInsert = vertical ? "vertical" : "horizontal";
			this.initWithFile(window.bl.getResource("scrollbar_" + filenameInsert + "_middle"));
			this.barSprite = this.getCurrentBackgroundSprite();

			this.top = new cc.Sprite();
			this.top.initWithFile(window.bl.getResource("scrollbar_" + filenameInsert + "_top"));
			this.addChild(this.top);
			this.bottom = new cc.Sprite();
			this.bottom.initWithFile(window.bl.getResource("scrollbar_" + filenameInsert + "_bottom"));
			this.addChild(this.bottom);

			this.setZoomOnTouchDown(false);
		},

		getHeight:function() {
			var property = this.vertical ? "height" : "width";
			var topHeight = this.top.getContentSize()[property];
			var middleHeight = this.barSprite.getBoundingBox().size[property];
			var bottomHeight = this.bottom.getContentSize()[property];
			return topHeight + middleHeight + bottomHeight;
		},

		setHeight:function(height) {
			// this.height = height;
			if (this.vertical) {
				var topHeight = this.top.getContentSize().height;
				var bottomHeight = this.bottom.getContentSize().height;
				this.barSprite.setScaleY((height - topHeight - bottomHeight)/this.barSprite.getContentSize().height);
				this.top.setPosition(0, height/2 - topHeight/2);
				this.bottom.setPosition(0, -height/2 + bottomHeight/2);
			} else {
				var topWidth = this.top.getContentSize().width;
				var bottomWidth = this.bottom.getContentSize().width;
				this.barSprite.setScaleX((height - topWidth - bottomWidth)/this.barSprite.getContentSize().width);
				this.top.setPosition(-height/2 + topWidth/2, 0);
				this.bottom.setPosition(height/2 - bottomWidth/2, 0);
			};
		},

		setBounds:function(lowBound, highBound, fixedBound) {
			this.lowBound = lowBound;
			this.highBound = highBound;
			this.fixedBound = fixedBound;
		},

		topHeight:function() {
			return this.vertical ? this.top.getContentSize().height : this.top.getContentSize().width;
		},

		bottomHeight:function() {
			return this.vertical ? this.bottom.getContentSize().height : this.bottom.getContentSize().width;
		},

		lowerLimit:function() {
			return this.lowBound + this.getHeight()/2;
		},

		upperLimit:function() {
			return this.highBound - this.getHeight()/2;
		},

		getProportionFromPosition:function() {
			var position = this.vertical ? this.getPosition().y : this.getPosition().x;
			var proportion;
			if (this.upperLimit() - this.lowerLimit() === 0) {
				proportion = 0;
			} else if (this.vertical) {
				proportion = (this.upperLimit() - position)/(this.upperLimit() - this.lowerLimit());
			} else {
				proportion = (position - this.lowerLimit())/(this.upperLimit() - this.lowerLimit());
			}
			return proportion;
		},

		setPositionFromProportion:function(proportion) {
			proportion = proportion.putInBounds(0,1);
			if (this.vertical) {
				var position = this.upperLimit() - proportion * (this.upperLimit() - this.lowerLimit());
				this.setPosition(cc.p(this.fixedBound, position));
			} else {
				var position = this.lowerLimit() + proportion * (this.upperLimit() - this.lowerLimit());
				this.setPosition(cc.p(position, this.fixedBound));
			};
		},

	});

	return ScrollBar;

})