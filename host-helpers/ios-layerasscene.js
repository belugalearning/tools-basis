
emapData=new Object();

function run()
{
  emapDefinition = emapDefaults;
  for(var p in emapDefinition)
  {
    emapData[p]=emapDefinition[p][0];
  }

  director.runWithScene( ToolLayer.scene() );
}
 
run();