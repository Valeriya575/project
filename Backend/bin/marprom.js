var path = require('path');
var request = require('request');
var http = require('http');
var cheerio = require('cheerio');
var fs = require('fs');
Pdf2Json = require('pdf2json');
var async = require('async');

const mongoose = require('mongoose');
var MbStation = require('../models/mb-station');
var MbDepartures = require('../models/mb-departures');
var MbLine = require('../models/mb-line');

//var LjStation = require('../models/lpp-station');

//connect to db
mongoose.connect('mongodb://localhost:27017/buslines', { useNewUrlParser: true })
var db = mongoose.connection;

//var MbStation = mongoose.model('MbStation').schema;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {

	//download bus schedules to the pdfPath
	//request HTML
	var getPdfs = request.get(MariborURL, function(err, res){
		
		if(err) throw err;
			
		//load response HTML to cheerio (reverse jQuery)
		var $ = cheerio.load(res.body, {decodeEntities: false});

		var pdfLinks = [];
		
		//check each link in HTML if it contains "/Linija"
		//those links lead to the desired pdfs
		$('a').each(function(){
			
			var ahref = $(this).attr('href');
			
			if(ahref.includes("/Linija")){
				//append to base url
				ahref = "http://www.marprom.si/" + ahref;
				pdfLinks.push(ahref);
			}		
		});
		
		//setup download folder
		if(!fs.existsSync(pdfPath))
			fs.mkdirSync(pdfPath)
			
		//download every link to the pdfPath
		for(var i = 0; i < pdfLinks.length; i++){
			
			var filename = pdfPath+"\\VozniRed"+(i)+".pdf";
			let fileStream = fs.createWriteStream(filename);

			//request pdf file
			http.get(pdfLinks[i], function(res){
									
				//write to disk
				res.pipe(fileStream);
				
				res.on('end', function(){
					c++;

					//when all requests return
					if(c == pdfLinks.length){
						fs.readdir(pdfPath, (err, files) => {
							
							//parse pdf files to txt
							files.forEach(file =>{
								pdfToText(file, function(data){
									parseText(data);
								});
							});
						});
					}
				});
			});
		}
	});

});

//directory name for saving parsed data
var pdfPath = path.join(__dirname, "pdf");
var txtPath = path.join(__dirname, "txt");

var MariborURL = "http://www.marprom.si/vozni-redi/";

//counters
var outputC = 0;
var c = 0;
//make a seperate pdf2Json for each file
//parse pdf to txt files
function pdfToText(file, cb){
	
	let pdfParser = new Pdf2Json(this, 1);
	//pdf2json callbacks
	pdfParser.on("pdfParser_dataError", errData => console.error(errData));
	pdfParser.on("pdfParser_dataReady", pdfData =>{
		//save text to txt folder
		if(!fs.existsSync(txtPath))
			fs.mkdirSync(txtPath)
		path = txtPath+"\\VozniRed"+outputC+".txt";
		//sync function to make sure the file is written entirely
		fs.writeFileSync(path, pdfParser.getRawTextContent());
		outputC++;
		//send the file path of a written file
		cb(path);		
	});
	
	pdfParser.loadPDF(pdfPath+"\\"+file);
}

//function for writing station departure times in the database
function writeToDB(lineName, from, to, times, days){
	var stationFrom = new MbStation();
	var stationTo = new MbStation();
	var line = new MbLine();
	var departures = new MbDepartures();

	stationFrom.stationName = from;
	stationTo.stationName = to;
		
	departures.times = times;
	departures.days = days;
	departures.to = stationTo;
	departures.from = stationFrom;
	departures.line = line;
	
	line.lineName = lineName;
	line.departures = departures;
	
	//write departures to db
	departures.save(function(err, docs){
		if(err) console.error(err);
	});
	
	//write to and from stations to db if they dont exist	
	MbStation.findOneAndUpdate({stationName: from}, stationFrom, {upsert: true},  function(err, docs){
		if(err) console.error(err);

	});
	MbStation.findOneAndUpdate({stationName: to}, stationTo, {upsert: true},  function(err, docs){
		if(err) console.error(err);

	});
	
	//write line to db if it doesent exist, otherwise update array
	MbLine.findOneAndUpdate({lineName: lineName}, {$push: {departures: departures}}, {upsert: true}, function(err, docs){
		if(err) console.error(err);
	});
	
	
	
}

//function that parses information about stations and saves them to DB
function parseStations(inputText, lineName, days){
	
	//find station names
	var names = /ODHODI IZ POSTAJE (.*) ZA SMER (.*)((\n|\s)+(\d{2}:\d{2}))+/g;

	var from, to;
	var timesStr = [];
	
	do{
		var m = names.exec(inputText);
		
		if(m){
			
			from = m[1];
			to = m[2];
			//console.log(m[1], m[2]);
					
			//parse departure times
			var times = /\d{2}:\d{2}/g
			do{
				var n = times.exec(m[0]);
				if(n){
					timesStr.push(n[0]);
					//console.log(n[0]);
				}
			}while(n);
		}
		writeToDB(lineName, from, to, timesStr, days);

	}while(m);	
	//mongoose.connection.close();

}


//parse information from text files using regex
function parseText(file){
	var cleartext = fs.readFileSync(file, "utf-8");	
	var lineNameR = /LINIJA \d+\s/g;
	var lineName = lineNameR.exec(cleartext);
	
	//check if line is active on saturday
	var dayReg = /S O B O T A/g;	
	var days;
	//only active on workdays
	if(!dayReg.test(cleartext)){		
		days = 'workdays';
		parseStations(cleartext, lineName[0], days);	
	}
	else{		
		var index, dayDepartures;		
		//check if the line is active on sunday
		dayReg = /N E D E L/g;		
		//not active on sundays
		if(!dayReg.test(cleartext)){
			
			dayDepartures = cleartext.split("S O B O T A");
			
			days = "workdays";
			parseStations(dayDepartures[0], lineName[0], days);

			days = "saturday"
			parseStations(dayDepartures[1], lineName[0], days);		
		}	
		//active throughout the week
		else{
			
			dayDepartures = cleartext.split("S O B O T A");
			
			days = "workdays";
			parseStations(dayDepartures[0], lineName[0], days);				
			dayDepartures = dayDepartures[1].split("N E D E L");
			days = "saturday";
			parseStations(dayDepartures[0], lineName[0], days);					
			days = "sunday";
			parseStations(dayDepartures[1], lineName[0], days);
		}
	}
}

