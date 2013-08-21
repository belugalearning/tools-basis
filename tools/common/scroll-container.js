define(['scrollbar'], function(ScrollBar) {

	var ScrollContainer = cc.Sprite.extend({
		ctor:function() {
			this._super();
			this.vertical;
			this.scrollNode;
			this.scrollBar = new ScrollBar();
			this.scrollBarSpace;

			this.scrollStart = function() {};
			this.scrollMove = function() {};
			this.scrollEnd = function() {};
		},

		setupWithOrientation:function(vertical) {
			this.vertical = vertical;
			this.scrollBar.initWithOrientation(vertical);
			this.addChild(this.scrollBar);
		},

		setScrollNode:function(scrollNode) {
			this.scrollNode = scrollNode;
		},

		setType:function(vertical) {
			this.vertical = vertical;
		},

		setScrollBarSpace:function(lowerVariable, upperVariable, fixed) {
			var lowEdge = lowerVariable + this.scrollBar.bottomHeight();
			var highEdge = upperVariable - lowerVariable - this.scrollBar.topHeight() - this.scrollBar.bottomHeight();
			this.scrollBar.setBounds(lowerVariable, upperVariable, fixed);
			if (this.vertical) {
				this.scrollBar.setDragAreaRect(cc.RectMake(fixed, lowEdge, 0, highEdge));
			} else {
				this.scrollBar.setDragAreaRect(cc.RectMake(lowEdge, fixed, highEdge, 0));
			};
			this.setScrollBarHeight();
			this.scrollToProportion(0);
		},

		scrollToProportion:function(proportion) {
			proportion = proportion.putInBounds(0,1);
			this.scrollBar.setPositionFromProportion(proportion);
			this.scrollSpaceNode();
		},

		setScrollBarFunctions:function() {
			var self = this;
			this.scrollBar.onTouchDown(function() {
				self.scrollSpaceNode();
				var proportion = self.scrollBar.getProportionFromPosition();
				self.scrollStart.call(self, proportion);
			});

			this.scrollBar.onMoved(function() {
				self.scrollSpaceNode();
				var proportion = self.scrollBar.getProportionFromPosition();
				self.scrollMove.call(self, proportion);
			});

			this.scrollBar.onMoveEnded(function() {
				var proportion = self.scrollBar.getProportionFromPosition();
				self.scrollEnd.call(self, proportion);
			});
		},

		onScrollStart:function(scrollStart) {
			this.scrollStart = scrollStart;
		},

		onScrollMove:function(scrollMove) {
			this.scrollMove = scrollMove;
		},

		onScrollEnd:function(scrollEnd) {
			this.scrollEnd = scrollEnd;
		},

		scrollSpaceNode:function() {
			var proportion = this.scrollBar.getProportionFromPosition();
			var position = proportion * (this.spacesNode.getTotalHeight() - this.spacesNode.getVisibleHeight());
			if (this.vertical) {
				this.scrollNode.setPosition(this.scrollNode.getPosition().x, position);
			} else {
				this.scrollNode.setPosition(position, this.scrollNode.getPosition().y);
			};
		},

		setScrollBarHeight:function() {
			var scrollBarSpace = this.scrollBar.highBound - this.scrollBar.lowBound;
			var height = (scrollBarSpace * this.scrollNode.getVisibleHeight() / this.scrollNode.getTotalHeight()).putInBounds(20, scrollBarSpace);
			this.scrollBar.setHeight(height);
		},

		getScrollNodeHeight:function() {
			var proportion = this.scrollBar.getProportionFromPosition();
			return proportion * (this.scrollNode.getTotalHeight() - this.scrollNode.getVisibleHeight());
		},

		scrollToNodeHeight:function(height) {
			var proportion
			if (this.scrollNode.getTotalHeight() === this.scrollNode.getVisibleHeight()) {
				proportion = 0;
			} else {
				proportion = height/(this.scrollNode.getTotalHeight() - this.scrollNode.getVisibleHeight());
			};
			this.scrollToProportion(proportion);
		},
	})

	return ScrollContainer;
})