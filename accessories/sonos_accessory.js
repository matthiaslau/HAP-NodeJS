// HomeKit types required
var types = require("./types.js");
var sonos = require('sonos');

var exports = module.exports = {};
var https = require('https');
var fs = require('fs');
var querystring = require('querystring');
var post_data = querystring.stringify({'' : ''});

var execute = function(value) {
	/*if (value === 1) {
		key = 'poweron';
	}else{
		key = 'poweroff';	
	}
	var post_options = 
  	{
    	host: 'homecontrol-internal',
        port: '443',
        path: '/api/tv-livingroom/transmit.php?token=58a6ce442b60c68e4a6f028920f408f7&key='+key,
        method: 'GET',
        headers: 
        {
        	'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': post_data.length
        }
    };
    post(post_options);*/
	
  console.log("switching " + value);
}

function post(post_options){
  var post_req = https.request(post_options, function(res) {
     // res.setEncoding('utf8');
      res.on('data', function (chunk) {
      });
  });
  post_req.write(post_data);
  post_req.end();
}

exports.accessory = {
  displayName: "Sonos",
  username: "1A:2B:3C:4D:LR:TV",
  pincode: "031-45-133",
  services: [{
    sType: types.ACCESSORY_INFORMATION_STYPE, 
    characteristics: [{
    	cType: types.NAME_CTYPE, 
    	onUpdate: null,
    	perms: ["pr"],
		format: "string",
		initialValue: "Sonos",
		supportEvents: true,
		supportBonjour: true,
		manfDescription: "Bla",
		designedMaxLength: 255    
    },{
    	cType: types.MANUFACTURER_CTYPE, 
    	onUpdate: null,
    	perms: ["pr"],
		format: "string",
		initialValue: "Sonos",
		supportEvents: true,
		supportBonjour: true,
		manfDescription: "Bla",
		designedMaxLength: 255    
    },{
    	cType: types.MODEL_CTYPE,
    	onUpdate: null,
    	perms: ["pr"],
		format: "string",
		initialValue: "Switch",
		supportEvents: true,
		supportBonjour: true,
		manfDescription: "Bla",
		designedMaxLength: 255    
    },{
    	cType: types.SERIAL_NUMBER_CTYPE, 
    	onUpdate: null,
    	perms: ["pr"],
		format: "string",
		initialValue: "A1S2NASF01TV",
		supportEvents: true,
		supportBonjour: true,
		manfDescription: "Bla",
		designedMaxLength: 255    
    },{
    	cType: types.IDENTIFY_CTYPE, 
    	onUpdate: null,
    	perms: ["pw"],
		format: "bool",
		initialValue: false,
		supportEvents: true,
		supportBonjour: true,
		manfDescription: "Identify Accessory",
		designedMaxLength: 1    
    }]
  },{
    sType: types.SWITCH_STYPE, 
    characteristics: [{
    	cType: types.NAME_CTYPE,
    	onUpdate: null,
    	perms: ["pr"],
		format: "string",
		initialValue: "Sonos",
		supportEvents: true,
		supportBonjour: true,
		manfDescription: "Bla",
		designedMaxLength: 255   
    },{
    	cType: types.POWER_STATE_CTYPE,
    	onUpdate: function(value) { execute(value); },
    	perms: ["pw","pr","ev"],
		format: "bool",
		initialValue: false,
		supportEvents: true,
		supportBonjour: true,
		manfDescription: "Turn Off Sonos",
		designedMaxLength: 1    
    }]
  }]
}