# Tools Basis

## Handy Tools:

Run `./compile_resources.sh` to update the references in resource.js

## Releasing:

To update the teach.belugalearning.com page with the latest tools see: https://github.com/belugalearning/teach.belugalearning.com#update-to-latest

## Tool API Req:

### Controls

All configurable controls should be registered with the ToolLayer's `registerControl(id, control)` method.

References to tools can then be fetched by using `getControl(id)` or `getControls(pattern)`.


### State

All tools should respond to `setQuestion(question)` and `getState()`.


## Tools

### Sorting

#### Expected behaviour

Content service will send:
+ Array of dropzone images & locations
+ Array of dropzone paths & locations
+ Array of draggables & locations

Tool will be able to:
+ Tool will try to fit all draggables within an area when they have been dropped, scaling if necessary
+ Send back the positions of all dragables

#### Stacked sprite usage

Stacked sprite creates a node with sprites stacked on top of each other from an object in the following format:

	{
		backingColor (optional): {height: int, width: int, color:{r: int, g: int, b: int}},

		images:[
			{filename: string, priority (optional): int, position (optional):{x: int, y: int}},
			...
		],
	}

The filenames are those in resource.js
