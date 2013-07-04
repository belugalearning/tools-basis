define(['cocos2d', 'constants'], function(cc, constants) {
    'use strict';

    var HandTypes = constants['HandTypes'];

    var HandHandle = cc.Sprite.extend({
        type:null,
        clock:null,

        initWithHandType:function(type) {
            this.type = type;
            var fileName;
            switch (this.type) {
                case HandTypes.HOUR:
                    fileName = bl.resources['images_clock_hour_hand_handle'];
                    break;
                case HandTypes.MINUTE:
                    fileName = bl.resources['images_clock_minute_hand_handle'];
                    break;
            }
            this.initWithFile(fileName);
        },
    });

    return HandHandle
})
