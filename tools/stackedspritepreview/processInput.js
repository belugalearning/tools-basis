var processInput = function() {
	var form = document.getElementsByName('stackedSpriteForm')[0];
	var radios = form.layer;
	var imageSelected = radios[0].checked;
	var colorSelected = radios[1].checked;
	var newLayer = {};
	if (imageSelected) {
		newLayer['filename'] = form.filename.value;
	} else if (colorSelected) {
		var color = {};
		color['r'] = parseInt(form.red.value) || 0;
		color['g'] = parseInt(form.green.value) || 0;
		color['b'] = parseInt(form.blue.value) || 0;
		color['a'] = parseInt(form.alpha.value) || 255;
		newLayer['color'] = color;
	};
	newLayer['height'] = parseInt(form.height.value);
	newLayer['width'] = parseInt(form.width.value);
	newLayer['priority'] = parseInt(form.priority.value) || 0;
	var position = {x: parseInt(form.xPosition.value) || 0, y: parseInt(form.yPosition.value) || 0};
	newLayer['position'] = position;
	var objectDisplay = document.getElementById('objectDisplay');
	var objectSoFar = JSON.parse(objectDisplay.innerHTML);
	objectSoFar['layers'].push(newLayer);
	var string = JSON.stringify(objectSoFar);
	objectDisplay.innerHTML = JSON.stringify(objectSoFar);
	document.instructionsChanged = true;
	var inputsToClear = document.getElementsByClassName('clearInput');
	for (var i = 0; i < inputsToClear.length; i++) {
		inputsToClear[i].value = "";
	};



}