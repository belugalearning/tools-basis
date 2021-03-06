### Compiling Resources:

You'll need to install optipng first. `brew install optipng` if you have http://brew.sh/ installed.
This script requires base64 --version 1.5. You may need to install it using homebrew too.

Add/ remove any resources

Run `./compile_resources.sh` to update the references in resource.json


# Tool API Req:

### Controls

All configurable controls should be registered with the ToolLayer's `registerControl(id, control)` method.

References to tools can then be fetched by using `getControl(id)` or `getControls(pattern)`.


### State

All tools should respond to `setQuestion(question)` and `getState()`.


## Tools

### Creating a new Tool

+ Duplicate `tools/tests/tools_base` into it's own folder outside of the project
+ Rename it something suitable "tool-{{NAME}}"
+ Initialise it as a git repo `git init`
+ Create a repo on github.com, follow the instructions to push it to github
+ Switch back to tools-basis, run `git submodule add {{REPO_URL}} tools/{{TOOL_NAME}}`
+ Add it to the require paths in `tools-basis/web-client/host/main.js`
+ Add it to the if/else block in `tools-basis/web-client/host/main.js`
+ Commit & push your changes


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
		layers:[
			{
				filename (optional): string, 
				color (optional):{r: int, g: int, b: int, a},
					height (when color): int, 
					width (when color): int, 
				priority (optional): int, 
				position (optional):{x: int, y: int}
			},
			...
		],
	}

The filenames are those in resource.json
