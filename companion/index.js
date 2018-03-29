import { geolocation } from "geolocation";
import * as messaging from "messaging";
import { locale } from "user-settings";
import { settingsStorage } from "settings";

import * as variables from "../common/variables.js";
import * as util from "../common/utils.js";

var index = 1;
var current_favourite_number = -1;

console.log("App started");

var GPSoptions = {
  enableHighAccuracy: false,
  maximumAge: 60000
};

function locationError(error) {
  console.log("Error fetching location");
  sendResponse({error:true,message:"no_location"});
}

function getStations(position) {
  var latitude, longitude;
  
  latitude = position.coords.latitude;
  longitude = position.coords.longitude;
  
  //@Test
  /*var location_chosen = 0;
  latitude = [53.323288, 53.398299][location_chosen];
  longitude = [-6.261120, -6.242622][location_chosen];*/
  
  console.log("Location: "+latitude+", "+longitude);
  var url = variables.getURLStationNames(latitude, longitude);
  //console.log("Loading data from "+url);
  fetch(url).then(function (response) {
      response.text()
      .then(function(data) {
        var data = JSON.parse(data);
        var searched_index = 0;
        for(var i = 0;i<data["stations"].length;i++){
          if(data["stations"][i]["id"]!=undefined){
             searched_index++;
          }
          if(data["stations"][i]["id"]!=undefined && searched_index >= index){
            fetchStop(data["stations"][i]["id"], data["stations"][i]["name"]);
            break;
          }
        }
      });
  })
  .catch(function (err) {
    console.log("Error fetching: " + err);
  });
}

function getFavourite(setting){
  try{
    return fetchStop(setting.value, setting.name);
  }catch(e){
    console.log("Test:"+e);
    return null;
  }
}

function fetchStop(id, name){
  var url2 = variables.getURLStationDetails(id);
  console.log(url2);
  fetch(url2)
  .then(function (response2) {
      response2.text()
      .then(function(data2) {
        var data2 = JSON.parse(data2);
        var data_response = {
          name: name,
          to:[],
          departures:[],
          number:[],
          operators:[],
          platforms:[],
          categories:[]
        }

        for(var ia=0;ia<data2["stationboard"].length;ia++){
          //console.log(ia+": "+data2["stationboard"][ia]["to"]);
          try{
            data_response.to[ia] = data2["stationboard"][ia]["to"];
            data_response.departures[ia] = data2["stationboard"][ia]["stop"]["departureTimestamp"];
            data_response.number[ia] = data2["stationboard"][ia]["number"];
            data_response.operators[ia] = data2["stationboard"][ia]["operator"];
            data_response.platforms[ia] = data2["stationboard"][ia]["passList"][0]["platform"];
            data_response.categories[ia] = data2["stationboard"][ia]["category"];
          }catch(e){

          }
        }
        
        data_response.settings = {};
        data_response.settings.minutesFirst = settingsStorage.getItem("minutesFirst");

        sendResponse(data_response);
      });
  }).catch(function (err) {
    console.log("Error fetching data from internet: " + err);
  });
}

function sendResponse(response){
  if (messaging.peerSocket.readyState === messaging.peerSocket.OPEN) {
    // Send a command to the device
    console.log("Sending response");
    console.log(response);
    messaging.peerSocket.send(response);
  } else {
    console.log("Error: Connection is not open");
  }
}

messaging.peerSocket.onopen = function() {
  console.log("Socket open");
}

// Listen for messages from the device
messaging.peerSocket.onmessage = function(evt) {
  //Locations
  if(evt.data.key=="changeStationDown" && evt.data.menu == 1){
    index++;
    geolocation.getCurrentPosition(getStations, locationError, GPSoptions);
  }else if(evt.data.key=="changeStationUp" && evt.data.menu == 1){
    index--;
    geolocation.getCurrentPosition(getStations, locationError, GPSoptions);
  } else if(evt.data.menu == 1){
    index = 1;
    geolocation.getCurrentPosition(getStations, locationError, GPSoptions);
  }
  //Favourites
  else if(evt.data.key=="changeStationDown" && evt.data.menu == 0){
    try{
      getFavourite(JSON.parse(settingsStorage.getItem("favourite_2")));
    }catch(e){
      
    }
  }else if(evt.data.key=="changeStationUp" && evt.data.menu == 0){
    try{
      getFavourite(JSON.parse(settingsStorage.getItem("favourite_1")));
    }catch(e){
      
    }
  }else{
    index = 1;
    try{
      getFavourite(JSON.parse(settingsStorage.getItem("favourite_1")));
    }catch(e){
      
    }
  }
}

// Listen for the onerror event
messaging.peerSocket.onerror = function(err) {
  // Handle any errors
  console.log("Connection error: " + err.code + " - " + err.message);
}

/*
----------------------------------
--------  Settings  --------------
----------------------------------
*/

translate(locale.language, "show_minutes_first","Zeige Minuten zuerst","Show minutes first");
translate(locale.language, "other_settings","Andere Einstellungen","Other settings");

translate(locale.language, "add_stop","Haltestelle hinzufügen","Add stop/station");
translate(locale.language, "search_stops","Haltestelle suchen","Search stops/stations");

translate(locale.language, "favourite_stops","Favorisierte Haltestellen","Favourite stops/stations");
translate(locale.language, "first_favourite_stop","Erste Haltestelle","First stop/station");
translate(locale.language, "second_favourite_stop","Zweite Haltestelle","Second stop/station");

translate(locale.language, "favourite_stops_description","Lege hier fest, welche Haltestellen du unter Favoriten anzeigen möchtest.","Set here the stops/stations which you want to display in the favourite section.");

settingsStorage.onchange = function(evt) {
  if (evt.key === "searchStations"){
    loadResults(evt.newValue);
  }
}

function loadResults(value){
  var autoValues = [];
 
  var url = "https://transport.opendata.ch/v1/locations?query="+value;
  fetch(url).then(function (response) {
      response.text()
      .then(function(data) {
        console.log("Data:"+data);
        var data = JSON.parse(data);
        for(var i=0;i<data["stations"].length;i++){
          if(data["stations"][i]["id"]!=null){
            autoValues.push({name: data["stations"][i]["name"],value: data["stations"][i]["id"]});
          }
        }
        settingsStorage.setItem('resultStations', JSON.stringify(autoValues));
      });
  });
}

function translate(current_language, key, value_de, value_en){
  switch(current_language){
    case 'de_DE':
    case 'de_de':
    case 'de-de':
    case 'de-DE':
    case 'de-CH':
    case 'de-AT':
    case 'de-De':
    case 'de_De':
      settingsStorage.setItem("t_"+key, value_de);
      break;
    default:
      console.log(current_language);
      settingsStorage.setItem("t_"+key, value_en);
      break;
  }
}