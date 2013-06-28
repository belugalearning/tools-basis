define([], function() {
    'use strict';

    var Time = function() {
        this.hours = null;
        this.minutes = null;
        this.hoursInDay = 24;
        this.minutesInHour = 60;

        this.setTime = function(hoursToSet, minutesToSet) {
            if (minutesToSet < 0) {
                hoursToSet += Math.floor(minutesToSet/this.minutesInHour);
                minutesToSet += this.minutesInHour;
            } else {
                hoursToSet += Math.floor(minutesToSet/this.minutesInHour);
                minutesToSet = minutesToSet % this.minutesInHour;
            };

            hoursToSet = hoursToSet % this.hoursInDay;
            if (hoursToSet < 0) {
                hoursToSet += this.hoursInDay;
            };

            this.hours = hoursToSet;
            this.minutes = minutesToSet;
        };
    };

    return Time;
})
