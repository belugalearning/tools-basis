define(['cocos2d'], function(cc) {
    'use strict';

    var Clock = cc.Sprite.extend({

        linkedClock:null,
        time:null,

        ctor:function() {
            this._super();
        },

        setupTime:function(timeToSet) {
            this.time = timeToSet;
        },

        setTime:function(hours, minutes) {
            this.time.setTime(hours, minutes);
        },

        addHours:function(hoursToAdd) {
            this.setTime(this.time.hours + hoursToAdd, this.time.minutes);
        },

        addMinutes:function(minutesToAdd) {
            this.setTime(this.time.hours, this.time.minutes + minutesToAdd);
        },

        processTouch:function() {},
        processMove:function() {},
        processEnd:function() {},
        
        setHour24:function(hour24) {
            this.hour24 = hour24;
            this.displayTime();
        },
    });

    return Clock;
})
