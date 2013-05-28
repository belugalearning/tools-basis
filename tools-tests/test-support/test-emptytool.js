
var ToolLayer = cc.Layer.extend({
    titleLabel:null,
    clc:null,
    lastcount:null,
    label:null,

    init:function () {

        this._super();
 
        this.setTouchEnabled(true);
 
        var size = cc.Director.getInstance().getWinSize();

        clc=cc.LayerColor.create(cc.c4b(70,70, 70,255));
        this.addChild(clc,0);

        this.label = cc.LabelTTF.create(emapData.a, "Helvetica", 70);
        this.label.setPosition(cc.p(size.width / 2, size.height / 2));
        this.addChild(this.label, 5);

        this.setupTool();

        return this;
    },

    setupTool:function(dt){

        this.label.setString(emapData.a);
        lastcount=emapData.a;
    },

    update:function (dt) {        
        if(lastcount!=emapData.a)
        {
            this.setupTool();
        }
    },

    onTouchesEnded: function( touches, event ) {
        cc.log("touch down");
        emapData.a++;
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




