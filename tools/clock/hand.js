define(['handhandle', 'constants'], function(HandHandle, constants) {
    'use strict';

    var HandTypes = constants['HandTypes'];

    var Hand = cc.Sprite.extend({
        type:null,
        handle:null,
        clock:null,

        initWithHandType:function(type) {
            this.type = type;
            var fileName;
            var anchorPoint;
            switch (this.type) {
                case HandTypes.HOUR:
                    fileName = s_hour_hand;
                    anchorPoint = cc.p(0.48, 0.02);
                    break;
                case HandTypes.MINUTE:
                    fileName = s_minute_hand;
                    anchorPoint = cc.p(0.5, 0.02);
                    break;
            }
            this.initWithFile(fileName);
            this.setAnchorPoint(anchorPoint);
        },

        setupHandle:function() {
            this.handle = new HandHandle();
            this.handle.initWithHandType(this.type);
            var size = this.getContentSize();
            this.handle.setPosition(size.width/2, size.height/2);
            this.handle.clock = this.clock;
            this.addChild(this.handle);
        },

        handleTouched:function(touchLocation) {
            /*
            This is a hack to get around the transform for rotated sprites being mis-set (it is rotated the wrong way, this function reflects
            the touchLocation in the x-axis so that it will correspond to the handle).
            */
            var handleX = this.clock.convertToWorldSpace(this.getPosition()).x;
            var difference = touchLocation.x - handleX;
            var touchLocationXCorrected = handleX - difference;
            var touchLocationCorrected = cc.p(touchLocationXCorrected, touchLocation.y);
            return this.handle.touched(touchLocationCorrected);
        },
    });

    return Hand;
})  
