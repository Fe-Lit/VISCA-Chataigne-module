/*
==============================================================================

Chataigne Module for VISCA PTZ protocol

Made by: Vayu Ittner, 2024

==============================================================================

Do whatever you want with this. But have fun while doing it.
 */
 
 /*

https://bkuperberg.gitbook.io/chataigne-docs/scripting/scripting-reference
https://benkuper.notion.site/The-Amazing-Chataigne-Documentation-079bd5a0b7e648bbbfe34c3c869a3985
https://benkuper.notion.site/Module-Scripts-3f47b4f6127f498baa0567afb5ca150f

*/


//toString geht nicht

// parseInt radix geht nicht, macht immer base10

//looking at the juce javascript parseInt function, it seems that parseInt("0xFF05C6") should work
//it needs to start with 0x to be recognized as hex


// right now the only function is util.hexStringToInt which takes only 1 byte at a time

/*
The parseInt function interprets your number "032" as a number in the octal number system (probably due to the leading zero) and not in the decimal system -> the function does a conversion from octal to decimal (octal 32 is the same as decimal 26, see screenshot from zak45)

You can have a look at my Shure SLXD module, I created a function that first removes all leading zeros from a string before passing the remaining bits to parsInt, I think I called the function toInt or something.


send(message): send the string passed in as ASCII characters.
	- local.send("This is my message");


sendBytes(byte1, byte2, [bytes], ...):send all the bytes passed in as they are. The bytes can be packed into arrays or just laid out one by one, or a mix of arrays and bytes.
	- local.sendBytes(30,210, [255,0,0], 5);
*/

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
        var send_command = viscaCommand + "0" + (dechex(presetNr)) + "FF";
        //var send_command = viscaCommand + "0" + presetNr.toHexString() + "FF";
    } else if (presetNr > 255) {
        script.logError("PresetNr to Big");
        return;
    } else {
        var send_command = viscaCommand + (dechex(presetNr)) + "FF";
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
    } else if (value.name == "Pan") {
		
	}
	else if (value.name == "Tilt") {
		
	}
    else if (value.name == "Camera Power") {
        script.log("Camera Power: " + value.get());
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

    // local.send("Normales Send");
    // sendet jedes zeichen als asci wert. 255 ist also 32 35 35
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
        //byteArray.push(parseInt(hexString.substring(j, j + 2), 16));
        byteArray.push(parseInt("0x" + hexString.substring(j, j + 2)));
    }
    return byteArray;
}

function send_custom_data(data) {
    script.log("Sending Data: " + hexStringToByteArray(data));
    local.sendBytes(hexStringToByteArray(data));
}

function aaa_tester(data) {
    script.log("Input: " + data);
    //script.log("Output: " + parseInt(data, 8));
    //script.log("Output2: " + data.toString(16));
    //script.log("Output3: " + data.parseHexLiteral()); //funktion nicht vorhanden
    script.log("Output3: " + hexStringToByteArray(data));

}

/*
function convertBase(value, from_base, to_base) {
var range = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ+/'.split('');
var from_range = range.slice(0, from_base);
var to_range = range.slice(0, to_base);

var dec_value = value.split('').reverse().reduce(function (carry, digit, index) {
if (from_range.indexOf(digit) === -1) throw new Error('Invalid digit `'+digit+'` for base '+from_base+'.');
return carry += from_range.indexOf(digit) * (Math.pow(from_base, index));
}, 0);

var new_value = '';
while (dec_value > 0) {
new_value = to_range[dec_value % to_base] + new_value;
dec_value = (dec_value - (dec_value % to_base)) / to_base;
}
return new_value || '0';
}
 */

function toBase(num, radix) { // only i64 numbers
    var keys = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];
    if (!(radix >= 2 && radix <= keys.length)) {
        //throw new RangeError("toBase() radix argument must be between 2 and " + keys.length);
        script.logError("toBase() radix argument must be between 2 and " + keys.length);
        return;
    }

    if (num < 0) {
        var isNegative = true;
    }

/*
    if (isNaN(num = Math.abs(+num))) {
        return NaN;
    }
	*/

    var output = [];
    do {
        var index = num % radix;
        output.unshift(keys[index]);
        num = Math.trunc(num / radix);
    } while (num != 0);
    if (isNegative)
        output.unshift('-');
        return output.join("");
}


function convertDecimalToHexadecimal(inputNumber){
	script.log("Decimal Number: "+ inputNumber);
	inputNumber=parseInt(inputNumber);
    var remainder = 0;
    var answer = "";
	
    //if(!isNaN(inputNumber)){
		if(true){
        while(inputNumber != 0){
            remainder = inputNumber % 16;
            inputNumber = ((inputNumber - remainder) / 16);
            if(remainder == 10){
                answer = 'A' + answer;
            }else if(remainder == 11){
                answer = 'B' + answer;
            }else if(remainder == 12){
                answer = 'C' + answer;
            }else if(remainder == 13){
                answer = 'D' + answer;
            }else if(remainder == 14){
                answer = 'E' + answer;
            }else if(remainder == 15){
                answer = 'F' + answer;
            }else{
                answer =  remainder + answer;
            }
        }
    }
	else{
		script.logError("This is not decimal number!");
		return;
    }
	script.log("in Hex: " +answer);
    return answer;
}      


function convertHexadecimalToDecimal(inputNumber){
    inputNumber = inputNumber.toString();
    var numberLen = inputNumber.length;
    var position = numberLen;
    var answer = 0;
    for(var i = 0; i < numberLen; i++){
        var num = inputNumber[i];
        if(num == 'A'){
            num = 10;
        }else if(num == 'B'){
            num = 11;
        }else if(num == 'C'){
            num = 12;
        }else if(num == 'D'){
            num = 13;
        }else if(num == 'E'){
            num = 14;
        }else if(num == 'F'){
            num = 15;
        }else if(num >= '0' && num <= '9'){
            //num = Number(num);
        }else{
			script.logError("This is not Hexadecimal number!");
            return;
        }
        position--; 
        answer = answer + (num* Math.pow(16,position));
    }
	 script.log(inputNumber+ "in Hex: " +answer);
    return answer;
}    


function dechex(number){
	script.log("Decimal Number: "+ number);
	number=parseInt(number);
var hexCharacters = ["A", "B", "C", "D", "E", "F"]; //Digits for 10-15, eliminates having case statements
var hexString = "";


while (number > 0) {
  var mod = number % 16; //Get the remainder
  //Fehler in floor?
  //number = Math.floor(number / 16); //round to closesd int, Update number
  number = number / 16; //round to closesd int, Update number
  number = Math.floor(number);

  //Prepend the corresponding digit
  if (mod > 9) {
    hexString = hexCharacters[mod - 10] + hexString; //Get the digits for 10-15 from the array
  } else {
    hexString = mod + hexString;
  }
}
	script.log(hexString);
	return hexString;
}