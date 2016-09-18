var philipsHueInfo = require("./philipshueinfo.js");
//Settings please set these to the correct values for use with philips hue

/*
	The following information can be found by hitting http://<ip of your bridge>/api/<username>/lights
	To add multiple lights, duplicate this file and change "philipsHueLightNumber","philipsHueLightID","accessoryName" and the file name in order for it to work. The filename must end with _accessory.js in order to work.
	For hue lux lights it is important to set the model to the proper model as well.
*/

var philipsHueLightNumber = 2;  // Arbeitszimmer - The number of the light in the lights responses, this is shown as '"<number>" : {'
var philipsHueLightID = "00:17:88:01:00:d9:01:0c-0b";  //The value of the uniqueID of the light

var accessoryName = "Arbeitszimmer Licht"; //The name of the light
var model = "LCT001"; //The model id of the light, this is important to properly support hue lux lights
var serialNumber = philipsHueInfo.philipsHueManufacturer.toUpperCase() + model.toUpperCase() + '-' + philipsHueLightNumber.toString();

// HomeKit types required
var types = require("./types.js");
var exports = module.exports = {};

var execute = function(accessory,lightID,characteristic,value) {
	var http = require('http');
	var characteristic = characteristic.toLowerCase();
	var body = {};
	if(characteristic === "identify") {
		body = {alert:"select"};
	} else if(characteristic === "on") {
		body = {on:Boolean(value)};
	} else if(characteristic === "hue") {
    value = value/65535;
    value = value*360;
    value = Math.round(value);
		body = {hue:value};
	} else  if(characteristic === "brightness") {
		value = value/100;
		value = value*255;
		value = Math.round(value);
		body = {bri:value};
	} else if(characteristic === "saturation") {
		value = value/100;
		value = value*255;
		value = Math.round(value);
		body = {sat:value};
	}  
	
	var post_data = JSON.stringify(body); 
	
	// An object of options to indicate where to post to
	var post_options = {
	  host: philipsHueInfo.philipsHueIP,
	  port: '80',
	  path: '/api/' + philipsHueInfo.philipsHueUsername + '/lights/' + lightID + '/state',
	  method: 'PUT',
	  headers: {
	      'Content-Type': 'application/json',
	      'Content-Length': post_data.length
	  }
	};
	
	// Set up the request
	var post_req = http.request(post_options, function(res) {
	  res.setEncoding('utf8');
	  res.on('data', function (chunk) {
	      console.log('Response: ' + chunk);
	  });
	});
	
	// post the data
	post_req.write(post_data);
	post_req.end(); 
	console.log("executed accessory: " + accessory + ", and characteristic: " + characteristic + ", with value: " +  value + "."); 
}

exports.accessory = {
  displayName: accessoryName,
  username: philipsHueLightID,
  pincode: philipsHueInfo.philipsHueDevicePin,
  services: [{
    sType: types.ACCESSORY_INFORMATION_STYPE, 
    characteristics: [{
    	cType: types.NAME_CTYPE, 
    	onUpdate: null,
    	perms: ["pr"],
		format: "string",
		initialValue: accessoryName,
		supportEvents: false,
		supportBonjour: false,
		manfDescription: "Name of the accessory",
		designedMaxLength: 255    
    },{
    	cType: types.MANUFACTURER_CTYPE, 
    	onUpdate: null,
    	perms: ["pr"],
		format: "string",
		initialValue: philipsHueInfo.philipsHueManufacturer,
		supportEvents: false,
		supportBonjour: false,
		manfDescription: "Manufacturer",
		designedMaxLength: 255    
    },{
    	cType: types.MODEL_CTYPE,
    	onUpdate: null,
    	perms: ["pr"],
		format: "string",
		initialValue: model,
		supportEvents: false,
		supportBonjour: false,
		manfDescription: "Model",
		designedMaxLength: 255    
    },{
    	cType: types.SERIAL_NUMBER_CTYPE, 
    	onUpdate: null,
    	perms: ["pr"],
		format: "string",
		initialValue: serialNumber,
		supportEvents: false,
		supportBonjour: false,
		manfDescription: "SN",
		designedMaxLength: 255    
    },{
    	cType: types.IDENTIFY_CTYPE, 
    	onUpdate: function(value) { console.log("Change:",value); execute(accessoryName, philipsHueLightNumber, "identify", value); },
    	perms: ["pw"],
		format: "bool",
		initialValue: false,
		supportEvents: false,
		supportBonjour: false,
		manfDescription: "Identify Accessory",
		designedMaxLength: 1    
    }]
  },{
    sType: types.LIGHTBULB_STYPE, 
    characteristics: [{
    	cType: types.NAME_CTYPE,
    	onUpdate: null,
    	perms: ["pr"],
		format: "string",
		initialValue: accessoryName,
		supportEvents: false,
		supportBonjour: false,
		manfDescription: "Name of service",
		designedMaxLength: 255   
    },{
    	cType: types.POWER_STATE_CTYPE,
    	onUpdate: function(value) { console.log("Change:",value); execute(accessoryName, philipsHueLightNumber, "on", value); },
    	perms: ["pw","pr","ev"],
		format: "bool",
		initialValue: false,
		supportEvents: false,
		supportBonjour: false,
		manfDescription: "Turn On the Light",
		designedMaxLength: 1    
    },{
    	cType: types.HUE_CTYPE,
    	onUpdate: function(value) { console.log("Change:",value); execute(accessoryName, philipsHueLightNumber, "hue", value); },
    	perms: ["pw","pr","ev"],
		format: "int",
		initialValue: 0,
		supportEvents: false,
		supportBonjour: false,
		manfDescription: "Adjust Hue of Light",
		designedMinValue: 0,
		designedMaxValue: 65535,
		designedMinStep: 1,
		unit: "arcdegrees"
    },{
    	cType: types.BRIGHTNESS_CTYPE,
    	onUpdate: function(value) { console.log("Change:",value); execute(accessoryName, philipsHueLightNumber, "brightness", value); },
    	perms: ["pw","pr","ev"],
		format: "int",
		initialValue: 0,
		supportEvents: false,
		supportBonjour: false,
		manfDescription: "Adjust Brightness of Light",
		designedMinValue: 0,
		designedMaxValue: 100,
		designedMinStep: 1,
		unit: "%"
    },{
    	cType: types.SATURATION_CTYPE,
    	onUpdate: function(value) { console.log("Change:",value); execute(accessoryName, philipsHueLightNumber, "saturation", value); },
    	perms: ["pw","pr","ev"],
		format: "int",
		initialValue: 0,
		supportEvents: false,
		supportBonjour: false,
		manfDescription: "Adjust Saturation of Light",
		designedMinValue: 0,
		designedMaxValue: 100,
		designedMinStep: 1,
		unit: "%"
    }]
  }]
}