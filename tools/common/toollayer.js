define(['exports', 'cocos2d'], function (exports, cc) {
    'use strict';

    var ToolLayer = cc.Layer.extend({

        ctor: function () {
            this._super();
        },

        getState: function () {
            throw {name : "NotImplementedError", message : "This needs implementing"};
        },

        setQuestion: function (question) {
            throw {name : "NotImplementedError", message : "This needs implementing"};
        },

        noop: function() {}

    });

    return ToolLayer;

});
