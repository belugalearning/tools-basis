
var QLayer = cc.Layer.extend({
    titleLabel:null,
    clc:null,
    lastcount:null,
    label:null,

    init:function () {

        this._super();
 
        var size = cc.Director.getInstance().getWinSize();

        this.titleLabel = cc.LabelTTF.create("Empty Tool!", "Helvetica", 38);
        this.titleLabel.setPosition(cc.p(size.width / 2, size.height - 40));
        this.addChild(this.titleLabel, 5);

        this.setupTool();

        return this;
    },

    setupTool:function(dt){

    },

    update:function (dt) {        
        if(emapData && emapData.question!=this.titleLabel.string)
        {
            this.titleLabel.setString(emapData.question);
        }
    },

    onEnter:function () {
        this._super();
    },

    onCleanup: function() {
        this.unscheduleUpdate();
    },

    onExit:function () {
        this._super();
    },

});




