function init() {
  script.log("VISCA module init");
}

function sendCommand(command)
{
	local.send("/atem/", command);
}

function transitionCallback(type, tbar, typeauto, rate, preview)

{
	if (type=="bar") local.send("/atem/"+type+" "+tbar);
	if (type=="auto") 
		{
			local.send("/atem/transition/type "+typeauto);
			local.send("/atem/transition/rate "+rate);
		}

	if (type=="preview")
		{
			if (preview==0) local.send("/atem/preview false");
			if (preview==1) local.send("/atem/preview true");
		}

	else local.send("/atem/"+type);
}

function auxiliarysourceselectionCallback(aux, source)

{
	local.send("/atem/aux/"+aux+" "+source);
}


function moduleParameterChanged(param) {
  script.log(param.name + " parameter changed, new value: " + param.get());
}

function moduleValueChanged(value) {
  script.log(value.name + " value changed, new value: " + value.get());
}

// This is the callback function for the "Custom command" command
function customCmd(val) {
  script.log("Custom command called with value " + val);
  local.parameters.moduleParam.set(val);
}
