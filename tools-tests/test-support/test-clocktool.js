
var ToolLayer = cc.Layer.extend({
    titleLabel:null,
    clc:null,
    lastcount:null,
    label:null,

    init:function () {

        this._super();
 
        this.setTouchEnabled(true);
 
        var size = cc.Director.getInstance().getWinSize();

        clc=cc.LayerColor.create(cc.c4b(70,70,70,255));
        this.addChild(clc,0);

        this.clock1 = new AnalogueClock();
        this.clock1.init();
        this.clock1.setPosition(size.width * 1/4, size.height/2);
        this.addChild(this.clock1);

        this.clock2 = new DigitalClock();
        this.clock2.init();
        this.clock2.setPosition(size.width * 3/4, size.height/2);
        this.addChild(this.clock2);

        var time = new Time();
        time.setTime(3,15);
        this.clock1.setTime(time);
        this.clock1.displayTime(time);

        return this;
    },

    onTouchesBegan:function(touches, event) {
        var touch = touches[0];
        var touchLocation = this.convertTouchToNodeSpace(touch);
        this.clock1.processTouch(touchLocation);
    },

    onTouchesMoved:function(touches, event) {
        var touch = touches[0];
        var touchLocation = this.convertTouchToNodeSpace(touch);
        this.clock1.processMove(touchLocation);
    },

    onTouchesEnded:function(touches, event) {
        var touch = touches[0];
        var touchLocation = this.convertTouchToNodeSpace(touch);
        this.clock1.processEnd(touchLocation);
    },
});

var Clock = cc.Sprite.extend({
    linkedClock:null,
    time:null,

    setTime:function(timeToSet) {
        this.time = timeToSet;
    }
});

var AnalogueClock = Clock.extend({
    hourHand:null,
    minuteHand:null,
    movingHand:null,
    previousAngle:null,

    init:function() {
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
                break;
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
                var timeInMinutes = Math.floor(angle * 2);
                timeInMinutes += this.handPassesVertical(this.previousAngle, angle) * 12 * 60;
                this.time.setTime(Math.floor(timeInMinutes/60), timeInMinutes % 60);
            } else if (type === HandTypes.MINUTE) {
                this.time.addHours(this.handPassesVertical(this.previousAngle, angle));
                var minutes = Math.floor(angle/6);
                this.time.setTime(this.time.hours, minutes);
            };
            this.displayTime();
            this.previousAngle = angle;
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
                anchorPoint = cc.p(0.5, 0.02);
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

var HandHandle = cc.Sprite.extend({
    type:null,
    clock:null,

    initWithHandType:function(type) {
        this.type = type;
        var fileName;
        switch (this.type) {
            case HandTypes.HOUR:
                fileName = s_hour_handle;
                break;
            case HandTypes.MINUTE:
                fileName = s_minute_handle;
                break;
        }
        this.initWithFile(fileName);
    },
});

var DigitalClock = Clock.extend({
    digits:null,

    init:function() {
        this._super();
        this.initWithFile(s_digital_background);
        this.setupDigits();
    },

    setupDigits:function() {
        this.digits = [];
        for (var i = 0; i < 4; i++) {
            var digit = new cc.Sprite();
            digit.initWithFile(s_digits[0]);
            this.digits.push(digit);
            this.addChild(digit);
        };

        this.digits[0].setPosition(80, 80);
        this.digits[1].setPosition(170, 80);
        this.digits[2].setPosition(270, 80);
        this.digits[3].setPosition(360, 80);
    },

    displayTime:function(timeToSet) {
        var hours = this.time.hours;
        var minutes = this.time.minutes;
        
        var firstDigit = Math.floor(hours/10);
        if (firstDigit === 0) {
            this.setBlankDigit(1);
        };
    },
});

var Time = function() {
    this.hours = null;
    this.minutes = null;
    this.hoursInDay = 24;
    this.minutesInHour = 60;

    this.setTime = function(hoursToSet, minutesToSet) {
        if (minutesToSet < 0) {
            hoursToSet += (minutesToSet + 1)/this.minutesInHour - 1;
            minutesToSet += this.minutesInHour;
        } else {
            hoursToSet += Math.floor(minutesToSet/this.minutesInHour);
            minutesToSet = minutesToSet % this.minutesInHour;
        };

        if (hoursToSet < 0) {
            hoursToSet += this.hoursInDay;
            hoursToSet = hoursToSet % this.hoursInDay;
        };

        this.hours = hoursToSet;
        this.minutes = minutesToSet;
    };

    this.addHours = function(hoursToAdd) {
        this.setTime(this.hours + hoursToAdd, this.minutes);
    };

    this.addMinutes = function(minutesToAdd) {
        this.setTime(this.hours, this.minutes + minutesToAdd);
    }
};

var HandTypes = {
    HOUR:"hour",
    MINUTE:"minute",
};

cc.Sprite.prototype.touched = function(touchLocation) {
    var parent = this.getParent();
    var touchRelativeToParent = parent.convertToNodeSpace(touchLocation);
    var boundingBox = this.getBoundingBox();
    var contains = cc.rectContainsPoint(boundingBox, touchRelativeToParent);
    return contains;
};

var numberInCorrectRange = function(number, lowerBound, upperBound) {
    var result = number;
    var range = upperBound - lowerBound;
    if (number < lowerBound) {
        result = number + Math.floor((upperBound - number)/range) * range;
    } else if (number >= upperBound) {
        result = number - Math.floor((number - lowerBound)/range) * range;
    };
    return result;
}