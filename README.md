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
