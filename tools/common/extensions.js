cc.Sprite.prototype.touched = function(touchLocation) {
    var parent = this.getParent();
    var touchRelativeToParent = parent.convertToNodeSpace(touchLocation);
    var boundingBox = this.getBoundingBox();
    var contains = cc.rectContainsPoint(boundingBox, touchRelativeToParent);
    return contains;
}

cc.Sprite.prototype.touchClose = function(touchLocation) {
    var closeDistance = 20;
    var parent = this.getParent();
    var touchRelativeToParent = parent.convertToNodeSpace(touchLocation);
    var position = this.getPosition();
    var distance = cc.pDistance(touchRelativeToParent, position);
    return distance < closeDistance;
}

Array.prototype.indexWraparound = function(index) {
    var arraySize = this.length;
    index = index % arraySize;
    if (index < 0) {
        index += arraySize;
    };
    return this[index];
}

cc.DrawNode.prototype.drawSector = function(position, radius, startAngle, throughAngle, anticlockwise, fillColour, borderWidth, borderColour) {
    var vertices = [];
    for (var i = 0; i <= 100; i++) {
        var multiplier = anticlockwise ? 1 : -1;
        var angle = startAngle + multiplier * (throughAngle * i)/100;
        var xPosition = position.x + radius * Math.sin(angle);
        var yPosition = position.y + radius * Math.cos(angle);
        var vertex = cc.p(xPosition, yPosition);
        vertices.push(vertex);
    };
    vertices.push(position);
    this.drawPoly(vertices, fillColour, 1, borderColour);
}

cc.MenuItemImage.prototype.propertyHighlight = function(highlight) {
    if (highlight !== this.highlight) {
        var position;
        if (highlight) {
            position = cc.p(-15, this.getPosition().y);
            this.label.setColor(cc.c3b(0,0,0));
            this.highlight = true;
        } else {
            position = cc.p(0, this.getPosition().y);
            this.label.setColor(cc.c3b(255,255,255));
            this.highlight = false;
        };
        var moveAction = cc.MoveTo.create(0.3, position);
        this.runAction(moveAction);
    };
}
