/*
==============================================================================

Chataigne Module for VISCA PTZ protocol

Made by: Vayu Ittner, 2024

==============================================================================

Do whatever you want with this. But have fun while doing it.
 */

// https://bkuperberg.gitbook.io/chataigne-docs/scripting/scripting-reference
//toString geht nicht

var byteArray = []; // For conversion/Sending Hex Data

function init() {
    script.log("VISCA module init");
}

function set_zoom(speed, direction) {
    script.log("Set Zoom");
    // Zoom in 	01 00 00 05 FF FF FF FF 81 01 04 07 02 FF
    // Zoom out 	01 00 00 05 FF FF FF FF 81 01 04 07 3p FF
    // Zoom Stop  01 00 00 05 FF FF FF FF 81 01 04 07 00 FF
}

function set_focus(speed) {}

function save_preset(presetNr) {
    script.log("Called Function save_preset");
    //01 00 00 07 FF FF FF FF 81 01 04 3F 01 PresetNr FF

    var viscaCommand = "01000007FFFFFFFF8101043F01";
    //var send_command=viscaCommand+(parseInt(presetNr, 16).padStart(2,"0"))+"FF";

    if (presetNr < 16) {
        //var send_command = viscaCommand + "0" + (parseInt(presetNr, 16)) + "FF";
		var send_command = viscaCommand + "0" + presetNr.toHexString() + "FF";
    } else if (presetNr > 255) {
        script.logError("PresetNr to Big");
		return;
    } else {
        var send_command = viscaCommand + (parseInt(presetNr, 16)) + "FF";
    }

    script.log("Command: " + send_command);
    local.sendBytes(hexStringToByteArray(send_command));
    script.log("Saved Preset Nr." + presetNr);
}

function call_preset(presetNr) {
    //01 00 00 07 FF FF FF FF 81 01 04 3F 02 PresetNR FF

    var viscaCommand = "01000007FFFFFFFF8101043F02";
    var send_command = viscaCommand + (parseInt(presetNr, 16)) + "FF";
    local.sendBytes(hexStringToByteArray(send_command));
    script.log("Called Preset Nr." + presetNr);
}

function move_cam(direction, speed) {
    script.log("Move Cam to " + direction + " with speed" + speed);
    if (direction == "up") {
        script.log("Move: UP");
    } else if (direction == "down") {
        script.log("Move: DOWN");
        local.send("/atem/transition/type " + typeauto);
        local.send("/atem/transition/rate " + rate);
    } else if (direction == "left") {
        script.log("Move: DOWN");
    } else if (direction == "right") {
        script.log("Move: RIGHT");
    } else {
        local.send("/atem/" + type);
    }
}

function set_power(powerstate) {
    script.log("Power " + powerstate);
    if (powerstate == 1) {
        script.log("Power On");
        local.sendBytes(hexStringToByteArray("8101040002FF"));
        return;
    } else if (powerstate == 0) {
        script.log("Power Off");
        local.sendBytes(hexStringToByteArray("8101040003FF"));
        return;
    } else {
        script.log("Parameter not Valid");
        return;
    }
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
    if (param.isParameter()) {}
    script.log(param.name + " parameter changed, new value: " + param.get());
}

function moduleValueChanged(value) {
    script.log(value.name + " value changed, new value: " + value.get());

    if (value.name == "Zoom") {
        set_zoom(100, value.get());
    } else if (value.name == "Focus") {
        set_focus(value.get());
    } else if (value.name == "PAN") {}
    else if (value.name == "cameraPower") {
        script.log("CameraPower: " + value.get());
        if (value.get() == 1)
            set_power(1);
        else if (value.get() == 0)
            set_power(0);
    }
}

// Module Specific Function
function dataReceived(data) {
    //If mode is "Lines", you can expect data to be a single line String without the ending \n.
    // Otherwise, the data will be an array of bytes containing the received data.

    // local.values.state.set(data.split(">")[i].split("<")[0]);

    script.log("Data received : " + data);

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

function send_testdata() {
    script.log("Sending Data");
    //01 00 00 07 FF FF FF FF 81 01 04 3F 02 PresetNR FF

    var hexstring = "01000007FFFFFFFF8101043F01";
    var hexnumber = 0x01000007FFFFFFFF8101043F01;
    var parsedhexstring = parseInt(hexnumber, 16);

    //local.send("Normales Send");
    // endet jedes zeichen als asci wert. 255 ist also 32 35 35
    // Sendet string als String. Logisch. Also Asci Hex werte für Zahlen/Buchstaben
    // local.send(hexstring);


    local.send("HextoBytes2");
    local.sendBytes(0xFF, hexStringToByteArray(hexstring));
    local.sendBytes(255, 0, 130, 17);
    //local.sendBytes(30,210, [255,0,0], 5);
    local.sendBytes(30, 210, hexStringToByteArray("FF2277B2"), 17);
    //local.sendBytes("FFA1");
    local.sendBytes(hexStringToByteArray("17FF30"));

    //udp.sendHexData("FFB");
    /*
    local.sendBytes(
    lastTransactionId >> 8,
    lastTransactionId & 255,
    0x00,
    0x00,
    totalLenght >> 8,
    totalLenght & 255,
    device,
    messageType,
    data
    );
     */
    //	defManager->add(CommandDefinition::createDef(this, "", "Send hex data", &SendStreamStringCommand::create, CommandContext::BOTH)->addParam("mode", SendStreamStringCommand::DataMode::HEX));

    /*
    case HEX:
{
    StringArray hexValues;
    hexValues.addTokens(valString, " ");
    Array<uint8> values;

    if (hexValues.size() == 1 && valString.length() % 2 == 0) //no spaces, even number of characters, separate 2 by 2
{
    for (int i = 0; i < valString.length(); i += 2) values.add(valString.substring(i, i + 2).getHexValue32());
    streamingModule->sendBytes(values, getCustomParams(multiplexIndex));
    }
     */
}

// Convert a hex string to a dezimal byte array
function hexToDezArray(hex) {
    var bytes = [];
    for (var c = 0; c < hex.length; c += 2)
        bytes.push(parseInt(hex.substring(c, c + 2), 16));
    return bytes;
}

function hexStringToByteArray(hexString) {
    //Needs a Hex Number as String without leading "0x"
    if (hexString.length % 2 !== 0) {
        script.logError("ERROR: Characters are not a multiple of 2");
        return;
    }
    var numBytes = hexString.length / 2;
    //var byteArray = new Array(numBytes);
    byteArray = [];
    for (var i = 0; i < numBytes; i++) {
        var j = i * 2;
        //byteArray[i] = parseInt(hexString.substring(j, 2), 16);
        byteArray.push(parseInt(hexString.substring(j, j + 2), 16));
    }
    return byteArray;
}

function send_custom_data(data) {
    script.log("Sending Data: " + hexStringToByteArray(data));
    local.sendBytes(hexStringToByteArray(data));
}