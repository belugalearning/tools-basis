
var ToolLayer = cc.Layer.extend({
    isMouseDown:false,
    helloImg:null,
    titleLabel:null,
    circle:null,
    sprite:null,
    clc:null,
    lastcount:null,
    lastb:null,
    objlayer:null,
    allpsprites:new Array(),
    touchSprite:null,
    touching:false,
    drawnode:null,

    init:function () {

        this._super();
        // this.init();

        // if( 'touches' in sys.capabilities )
            this.setTouchEnabled(true);
        // else if( 'mouse' in sys.capabilities )
            // this.setMouseEnabled(true);

        var size = cc.Director.getInstance().getWinSize();

        clc=cc.LayerColor.create(cc.c4b(70,70, 70,255));
        this.addChild(clc,0);

        // this.titleLabel = cc.LabelTTF.create("Empty Tool", "Helvetica", 38);
        // this.titleLabel.setPosition(cc.p(size.width / 2, size.height - 40));
        // this.addChild(this.titleLabel, 5);
        
        this.objlayer=cc.Layer.create();
        this.addChild(this.objlayer, 1);

        this.drawnode=cc.DrawNode.create();
        this.addChild(this.drawnode, 0);

        this.space = new cp.Space();

        var space = this.space ;
        var staticBody = space.staticBody;

        // Walls
        var walls = [ new cp.SegmentShape( staticBody, cp.v(0,0), cp.v(size.width,0), 0 ),               // bottom
                new cp.SegmentShape( staticBody, cp.v(0,size.height), cp.v(size.width,size.height), 0),    // top
                new cp.SegmentShape( staticBody, cp.v(0,0), cp.v(0,size.height), 0),             // left
                new cp.SegmentShape( staticBody, cp.v(size.width,0), cp.v(size.width,size.height), 0)  // right
                ];
        for( var i=0; i < walls.length; i++ ) {
            var shape = walls[i];
            shape.setElasticity(1);
            shape.setFriction(1);
            space.addStaticShape( shape );
        }

        space.gravity = cp.v(0, 0);
        space.damping=0.05;

        this.setupTool();

        return this;
    },

    setupTool:function(dt){
        // cc.log("setting up tool");
// 

        var newc=emapData.a * emapData.b;
        var oldc=this.lastcount * this.lastb;

        cc.log("newc: " + newc + "  oldc: " + oldc);

        // if(newc<oldc)
        // {
        //     cc.log("removing objects");
        //     for(var r=0; r<(oldc-newc); r++)
        //     {
        //         var ps=this.allpsprites[0];
        //         this.space.removeConstraint(ps.spring);
        //         this.space.removeConstraint(ps.slide);

                
        //         this.space.removeShape(ps._body.shapeList[0]);
        //         this.space.removeBody(ps._body);


        //         this.objlayer.removeChild(ps, false);
        //         this.allpsprites.pop(ps);
        //     }
        // }
        // else
        // {


            for(var i=0; i<this.allpsprites.length; i++)
            {
                var ps=this.allpsprites[i];
                this.space.removeShape(ps._body.shapeList[0]);
                this.space.removeBody(ps._body);

                this.objlayer.removeChild(ps, false);
            }

            //only while we're removing everything from the array, else we could just pop the one we don't
            this.allpsprites=new Array();

            for(b=0; b<emapData.b; b++)
            {
                asprites=new Array();
                for(i=0; i<emapData.a; i++)
                {
                    var x=Math.random()*924 + 50;
                    var y=Math.random()*569 + 50;

                    var s=this.createPhysicsSprite(cc.p(x,y));

                    this.objlayer.addChild(s, 1);   

                    // cc.log(" allps is " + this.allpsprites.length);
                    this.allpsprites.push(s);    
                    asprites.push(s);     
                }

                //attach all the bodies to eachother
                for(var i=0; i<asprites.length; i++)
                {
                    var ps1=asprites[i];
                    
                    // for(var j=i; j<2; j++)
                    // {
                    var k=(i+1)%(asprites.length);

                    cc.log(i + " .... " + k);
                    var ps2=asprites[k];

                    if(ps1!=ps2 && ps1!=null && ps2!=null)
                    {
                        var slide=new cp.SlideJoint(ps1.refBody, ps2.refBody, cp.vzero, cp.vzero, 200,300);
                        this.space.addConstraint(slide);

                        var spring=new cp.DampedSpring(ps1.refBody, ps2.refBody, cp.vzero, cp.vzero, 0, 3, 0.05);
                        this.space.addConstraint(spring);

                        ps1.slide=slide;
                        ps1.spring=spring;
                        ps1.otherps=ps2;
                    }
                    // }
                    
                }

            //close b loop
            }

        //close else to removing objects
        // }

        this.lastcount=emapData.a;
        this.lastb=emapData.b;
    },

    update:function (dt) {

        this.space.step( dt );

        if(this.lastcount!=emapData.a || this.lastb!=emapData.b)
        {
            this.setupTool();
        }

        //draw stuff
        this.drawnode.clear();

        for(var i=0; i<this.allpsprites.length; i++)
        {
            var ps1=this.allpsprites[i];

            this.drawnode.drawSegment(ps1.getPosition(), ps1.otherps.getPosition(), 5, cc.c4b(255, 255, 255, 1));
        }
        

    },

    onEnter:function () {
        this._super();

        // this.setTouchEnabled(true);
        // this.setMouseEnabled(true);

        // cc.log(sys.capabilities);

        // if( 'touches' in sys.capabilities )
        //     this.setTouchEnabled(true);
        // else if( 'mouse' in sys.capabilities )
        //     this.setMouseEnabled(true);

        // sys.dumpRoot();
        // sys.garbageCollect();
    },

    onCleanup: function() {
        // Not compulsory, but recommended: cleanup the scene
        this.unscheduleUpdate();
    },

    onExit:function () {
        this._super();
    },

    onTouchesBegan: function(touches, event) {
        // cc.log("touching at " + touches[0].getLocation().x + ", " + touches[0].getLocation().y);

        this.touching=true;
        this.touchSprite=null;
        for(var i=0; i<this.allpsprites.length; i++)
        {
            var ps=this.allpsprites[i];
            if(cc.rectContainsPoint(ps.getBoundingBox(), touches[0].getLocation()))
            {
                this.touchSprite=ps;
                break;
            }
        }

        if(this.touchSprite!=null)
        {
            cc.log("touched " + ps);
        }
    },

    onTouchesEnded: function( touches, event ) {

        this.touching=false;
        this.touchSprite=null;
    },

    onTouchesMoved: function(touches, event) {
        if(this.touchSprite!=null)
        {
            this.touchSprite.setPosition(touches[0].getLocation());
        }
    },


    createPhysicsSprite: function( pos ) {
        var body = new cp.Body(1, cp.momentForBox(1, 103, 103) );
        body.setPos( pos );
        this.space.addBody( body );
        var shape = new cp.BoxShape( body, 103, 103);
        shape.setElasticity( 0.5 );
        shape.setFriction( 0.5 );
        this.space.addShape( shape );

        var sprite = cc.PhysicsSprite.create(s_imagePath + "object.png");
        sprite.setBody( body );
        sprite.refBody=body;
        return sprite;
    },

    // addSprite: function( pos ) {
    //     var sprite =  this.createPhysicsSprite( pos );
    //     this.addChild( sprite );
    // },
});




