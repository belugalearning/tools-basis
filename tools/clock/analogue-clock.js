define (['clock', 'hand', 'constants'], function(Clock, Hand, constants) {
    'use strict';

    var HandTypes = constants['HandTypes'];

    var AnalogueClock = Clock.extend({

        hourHand:null,
        minuteHand:null,
        movingHand:null,
        previousAngle:null,

        ctor:function() {
            this._super();

            this.initWithFile(s_analogue_clockface);

            this.setupHands();
        },

        setupHands:function() {
            this.hourHand = new Hand();
            this.hourHand.initWithHandType(HandTypes.HOUR);
            this.hourHand.setZOrder(1);

            this.minuteHand = new Hand();
            this.minuteHand.initWithHandType(HandTypes.MINUTE);
            this.minuteHand.setZOrder(0);

            var clockSize = this.getContentSize();
            var clockCentre = cc.p(clockSize.width * 1/2, clockSize.height * 1/2);

            var hands = [this.hourHand, this.minuteHand];
            for (var i = 0; i < hands.length; i++) {
                var hand = hands[i];
                hand.setPosition(clockCentre);
                hand.clock = this;
                this.addChild(hand);
                hand.setupHandle();
            };

            var clockfacePin = new cc.Sprite();
            clockfacePin.initWithFile(s_clockface_pin);
            clockfacePin.setPosition(clockCentre);
            clockfacePin.setAnchorPoint(cc.p(0.5, 0.51));
            clockfacePin.setZOrder(2);
            this.addChild(clockfacePin);
        },

        displayTime:function() {
            var timeInMinutes = 60 * this.time.hours + this.time.minutes;
            this.minuteHand.setRotation(timeInMinutes * 6);
            this.hourHand.setRotation(timeInMinutes * 1/2);
        },

        processTouch:function(touchLocation) {
            var hands = [this.hourHand, this.minuteHand];
            for (var i = 0; i < hands.length; i++) {
                var hand = hands[i];
                if (hand.handleTouched(touchLocation)) {
                    this.movingHand = hand;
                    this.previousAngle = hand.getRotation();
                    return true;
                };
            };
        },

        processMove:function(touchLocation) {
            if (this.movingHand !== null) {
                var touchLocationAR = this.convertToNodeSpaceAR(touchLocation);
                var angle = Math.atan2(touchLocationAR.x, touchLocationAR.y);
                angle = cc.RADIANS_TO_DEGREES(angle);
                angle = numberInCorrectRange(angle, 0, 360);

                var type = this.movingHand.type;
                if (type === HandTypes.HOUR) {
                    var pmMultiplier = this.time.hours >= 12 ? 1 : 0;
                    var timeInMinutes = Math.floor(angle * 2);
                    if (this.handPassesVertical(this.previousAngle, angle)) {
                        pmMultiplier = 1 - pmMultiplier;
                    };
                    timeInMinutes += pmMultiplier * 12 * 60;
                    this.setTime(Math.floor(timeInMinutes/60), timeInMinutes % 60);
                } else if (type === HandTypes.MINUTE) {
                    this.addHours(this.handPassesVertical(this.previousAngle, angle));
                    var minutes = Math.floor(angle/6);
                    this.setTime(this.time.hours, minutes);
                };
                this.displayTime();
                this.previousAngle = angle;
                return true;
            };
        },

        handPassesVertical:function(previousAngle, thisAngle) {
            var change = 0;
            if (previousAngle < 90 && thisAngle > 270) {
                change = -1;
            } else if (previousAngle > 270 && thisAngle < 90) {
                change = 1;
            };
            return change;
        },

        processEnd:function(touchLocation) {
            this.movingHand = null;
        },
    });

return AnalogueClock;
})

var numberInCorrectRange = function(number, lowerBound, upperBound) {
    var result = number;
    var range = upperBound - lowerBound;
    if (number < lowerBound) {
        result = number + Math.floor((upperBound - number)/range) * range;
    } else if (number >= upperBound) {
        result = number - Math.floor((number - lowerBound)/range) * range;
    };
    return result;
};
