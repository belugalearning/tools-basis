define(['exports', 'cocos2d'], function (exports, cc) {
    'use strict';

    var ToolLayer = cc.Layer.extend({

        ctor: function () {
            this._super();
        },

        getState: function () {
            console.log('getState');
        },

        setQuestion: function () {
            console.log('setQuestion');
        },

        emptyFunction: function() {}

    });

    return ToolLayer;

});
