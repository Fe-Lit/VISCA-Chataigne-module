/*
 ==============================================================================

  Chataigne Module for VISCA PTZ protocol

  Made by: Vayu Ittner, 2024

  ==============================================================================

Do whatever you want with this. But have fun while doing it.
*/

// https://bkuperberg.gitbook.io/chataigne-docs/scripting/scripting-reference

function init() {
  script.log("VISCA module init");
}

function set_zoom(speed,direction) {
  script.log("Set Zoom");
  // Zoom in 	01 00 00 05 FF FF FF FF 81 01 04 07 02 FF
  // Zoom out 	01 00 00 05 FF FF FF FF 81 01 04 07 3p FF
  // Zoom Stop  01 00 00 05 FF FF FF FF 81 01 04 07 00 FF
}
function set_focus(speed) {

}
function save_preset(presetNr) {
	//01 00 00 07 FF FF FF FF 81 01 04 3F 01 PresetNr FF
	//const save_command = 0x01000007FFFFFFFF8101043F01;
	
	var viscaCommand=0x01000007FFFFFFFF8101043F01;
	//var send_command=viscaCommand+(presetNr.toString(16))+"FF";
	//console.log(parseInt('ff', 16));
	local.send(viscaCommand);
	local.send(presetNr);
	local.send(0xFF);
	script.log("Saved Preset Nr."+presetNr);
	
}


function call_preset(presetNr) {
	script.log("Call Preset Nr."+presetNr);
	//01 00 00 07 FF FF FF FF 81 01 04 3F 02 PresetNR FF
	local.send(0x01000007FFFFFFFF8101043F0266FF);

}
function move_cam(direction,speed) {
	script.log("Move Cam to " + direction+" with speed"+speed);
if (direction=="up") {
	script.log("Move: UP");
	}
	else if (direction=="down") 
		{
			script.log("Move: DOWN");
			local.send("/atem/transition/type "+typeauto);
			local.send("/atem/transition/rate "+rate);
		}
			else if (direction=="left")
		{
			script.log("Move: DOWN");
		}
					else if (direction=="right")
		{
			script.log("Move: RIGHT");
		}

	else {local.send("/atem/"+type);}
}



// This is the callback function for the "Custom command" command
function customCmd(val) {
  script.log("Custom command called with value " + val);
  local.parameters.moduleParam.set(val);
}

// -------------------------------------------------
// Default Funktionen

function moduleParameterChanged(param) {
	// Eher nicht nötig, Grundeinstellungen vom Modul
	 if(param.isParameter())
    {}
  script.log(param.name + " parameter changed, new value: " + param.get());
}

function moduleValueChanged(value) {
  script.log(value.name + " value changed, new value: " + value.get());
  
    if (value.name=="Zoom"){
		set_zoom(100,value.get());
  }
  else if (value.name=="Focus"){
	  set_focus(value.get());
  }
    else if (value.name=="PAN"){
	  
  }
      else if (value.name=="cameraPower"){
		  script.log("CameraPower: " + value.get());
	  if (value.get()==1) local.send(0x8101040002FF);
	  else if (value.get()==0) local.send(0x8101040003FF);
  }
}

// Module Specific Function
function dataReceived(data) {
  //If mode is "Lines", you can expect data to be a single line String without the ending \n.
// Otherwise, the data will be an array of bytes containing the received data.

// local.values.state.set(data.split(">")[i].split("<")[0]);

  script.log("Data received : " + data);
  script.logError(local.name + " : " + data);
    if (data.charAt(0) === "1") {
    script.logError(local.name + " : " + data);
  }  
  if (data === "NAK\n\n") {
    script.logError("message not understood by VideoHub");
  }

  if (data.charAt(0) === "1") {
    script.logError(local.name + " : " + data);
  }  
  if (data === "NAK\n\n") {
    script.logError("message not understood by VideoHub");
  }
}



function Notizen(){
	var intValue = 255; // Example integer value
	var hexValue = intValue.toString(16); // Convert integer to hexadecimal
	console.log(hexValue); // Output: "ff"
	
	var fixedHex1 = "a0";
	var variableHex = "ff";
	var fixedHex2 = "b1";
	var finalHex = fixedHex1 + variableHex + fixedHex2;
	console.log(finalHex); // Output: "a0ffb1"
	
	console.log(parseInt('ff', 16));
// 255 (lower-case hexadecimal)
console.log(parseInt('0xFF', 16));
// 255 (upper-case hexadecimal with "0x" prefix)
	
	
	
	local.send("/string/", source); // String

// sendBytes(byte1, byte2, [bytes], ...);
// local.sendBytes(30,210, [255,0,0], 5);

	
}