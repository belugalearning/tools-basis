    
var ExprMap = function() {
  this.message = 'dat.gui';
  this.speed = 0.8;
  this.displayOutline = false;
  this.test='testval';
};

var emapData=new Object();

window.onload = function() {
  this.gui = new dat.GUI();


  emapDefinition = emapDefaults;
  for(var p in emapDefinition)
  {
    emapData[p]=emapDefinition[p][0];

    if(emapDefinition[p].length>0) 
        addController(p, emapDefinition[p][1], emapDefinition[p][2], emapDefinition[p][3]);
    else addTextController(p, null, null, null);
  }

  emapData.log = function() {console.log(JSON.stringify(this)); };
  addController('log');

};

function addTextController(name)
{
    var c=this.gui.add(emapData, name);

    c.listen();

    c.onChange(function(value) {
        updateController(this, value);
    });    
}

function addController(name, minval, maxval, step)
{
    var c=this.gui.add(emapData, name, minval, maxval);
    if(step) c.step(step);

    c.listen();

    c.onChange(function(value) {
        updateController(this, value);
    });
}

function updateController(controller, value)
{
    console.log(controller.property + " value changed to: " + value);
}
