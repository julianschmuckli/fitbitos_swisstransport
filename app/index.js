import document from "document";
import * as messaging from "messaging";
import { vibration } from "haptics";
import { geolocation } from "geolocation";
import { locale } from "user-settings";

import * as util from "../common/utils.js";
import * as operator from "../common/operators.js";

console.log("App Started");

var message_received = false;
var displayInMinutes = false;
var language = locale.language;

var current_menu = -1; //-1 -> Start pre_select; 0 -> Favourites; 1 -> Location

var index = 1;
var GPSoptions = {
  enableHighAccuracy: true,
  maximumAge: 60000
};

let name = document.getElementById("name");
let stationboard = document.getElementById("stationboard");
let scrollview = document.getElementById('scrollview');

let time_changer = document.getElementById("time_changer");

let pre_select = document.getElementById("pre_select");

let time_one__background_number = document.getElementById("time_one-background_number");
let time_one__number = document.getElementById("time_one-number");
let time_one__destination = document.getElementById("time_one-destination");
let time_one__platform = document.getElementById("time_one-platform");
let time_one__time = document.getElementById("time_one-time");

let time_two__background_number = document.getElementById("time_two-background_number");
let time_two__number = document.getElementById("time_two-number");
let time_two__destination = document.getElementById("time_two-destination");
let time_two__platform = document.getElementById("time_two-platform");
let time_two__time = document.getElementById("time_two-time");

let time_three__background_number = document.getElementById("time_three-background_number");
let time_three__number = document.getElementById("time_three-number");
let time_three__destination = document.getElementById("time_three-destination");
let time_three__platform = document.getElementById("time_three-platform");
let time_three__time = document.getElementById("time_three-time");

let time_four__background_number = document.getElementById("time_four-background_number");
let time_four__number = document.getElementById("time_four-number");
let time_four__destination = document.getElementById("time_four-destination");
let time_four__platform = document.getElementById("time_four-platform");
let time_four__time = document.getElementById("time_four-time");

let distance_between_time_and_details = time_four__time.x;

translateScreen("Lädt...", "", "Loading...", "");
scrollview.height = 150;

messaging.peerSocket.onopen = function() {
  console.log("Started");
  getStations();
}

messaging.peerSocket.onerror = function(err) {
  // Handle any errors
  stationboard.text = "Fehler. Erneut versuchen."
  console.log("Connection error: " + err.code + " - " + err.message);
}

function getStations() {  
  translateScreen("Bitte warten...", "Station in deiner Nähe wird abgefragt...\n\nBitte habe etwas Geduld.", "Please wait...", "Retrieving the timetable of a stop near you.");
  scrollview.height = 150;
}

var data;
messaging.peerSocket.onmessage = function(evt) {
  if (evt.data!=undefined) {
    message_received = true;
    if(displayInMinutes){ //Reset time changer
       showTimeDisplay();
    }
       
    if(evt.data.error){
      if(evt.data.message=="no_location"){        
        translateScreen("Kein Standort", "Möglicherweise ist dein Standort auf deinem Smartphone deaktiviert oder nicht empfangbar.",
                        "No location", "Perhaps the GPS on your smartphone is deactivated.");
        
        scrollview.height = 150;
      }
    }else{
      data = evt.data;

      var data_name = (evt.data.name).split(", ")[1]+", "+(evt.data.name).split(", ")[0];
      if(data_name.indexOf("undefined") !== -1){
        data_name = evt.data.name;
      }
      name.text = data_name;
      time_changer.onclick = function(e){
        changeTimeDisplay();
      }
      
      hideTimeTable();
      stationboard.style.display = "none";

      var data_result="";
      for(var i = 0;i<evt.data.to.length;i++){
        if(i==0){
          time_one__background_number.style.display = "inline";
          time_one__number.style.display = "inline";
          time_one__destination.style.display = "inline";
          time_one__platform.style.display = "inline";
          time_one__time.style.display = "inline";
        }
        if(i==1){
          time_two__background_number.style.display = "inline";
          time_two__number.style.display = "inline";
          time_two__destination.style.display = "inline";
          time_two__platform.style.display = "inline";
          time_two__time.style.display = "inline";
        }
        if(i==2){
          time_three__background_number.style.display = "inline";
          time_three__number.style.display = "inline";
          time_three__destination.style.display = "inline";
          time_three__platform.style.display = "inline";
          time_three__time.style.display = "inline";
        }
        if(i==3){
          time_four__background_number.style.display = "inline";
          time_four__number.style.display = "inline";
          time_four__destination.style.display = "inline";
          time_four__platform.style.display = "inline";
          time_four__time.style.display = "inline";
        }
      }
      
      /* Time 1 */
      var colors = operator.getColors(evt.data.operators[0], evt.data.number[0]);
      
      time_one__number.style.fill = colors.line_color_font;
      time_one__background_number.style.fill = colors.line_color;
      
      time_one__number.text = evt.data.number[0];
      
      time_one__destination.text = evt.data.to[0];
      time_one__time.text = util.getTime(evt.data.departures[0])
      if(evt.data.platforms[0]==null){
        time_one__platform.text = evt.data.categories[0];
      }else{
        time_one__platform.text = "Gl. " + evt.data.platforms[0];
      }
      
      /* Time 2 */
      
      var colors = operator.getColors(evt.data.operators[1], evt.data.number[1]);
      
      time_two__number.style.fill = colors.line_color_font;
      time_two__background_number.style.fill = colors.line_color;
      
      time_two__number.text = evt.data.number[1];
      
      time_two__destination.text = evt.data.to[1];
      time_two__time.text = util.getTime(evt.data.departures[1])
      if(evt.data.platforms[1]==null){
        time_two__platform.text = evt.data.categories[1];
      }else{
        time_two__platform.text = "Gl. " + evt.data.platforms[1];
      }
      
      /* Time 3 */
      
      var colors = operator.getColors(evt.data.operators[2], evt.data.number[2]);
      
      time_three__number.style.fill = colors.line_color_font;
      time_three__background_number.style.fill = colors.line_color;
      
      time_three__number.text = evt.data.number[2];
      
      time_three__destination.text = evt.data.to[2];
      time_three__time.text = util.getTime(evt.data.departures[2])
      if(evt.data.platforms[2]==null){
        time_three__platform.text = evt.data.categories[2];
      }else{
        time_three__platform.text = "Gl. " + evt.data.platforms[2];
      }
      
      /* Time 4 */
      
      var colors = operator.getColors(evt.data.operators[3], evt.data.number[3]);
      
      time_four__number.style.fill = colors.line_color_font;
      time_four__background_number.style.fill = colors.line_color;
      
      time_four__number.text = evt.data.number[3];
      
      time_four__destination.text = evt.data.to[3];
      time_four__time.text = util.getTime(evt.data.departures[3]);
      if(evt.data.platforms[3]==null){
        time_four__platform.text = evt.data.categories[3];
      }else{
        time_four__platform.text = "Gl. " + evt.data.platforms[3];
      }

      scrollview.height = 400;
      vibration.start("confirmation-max");
      
      if(evt.data.settings.minutesFirst=="true"){
        showMinuteDisplay();
      }
      
      //Change station
      document.onkeypress = function(e) {
        if(e.key == "down"){
          if(index<=8){
            translateScreen("Nächste Station...", "", "Next stop...", "");
            
            index++;
            messaging.peerSocket.send({key:"changeStationDown", menu: current_menu});
          }
        }else if(e.key == "up"){
          if(index>1){
            translateScreen("Vorherige Station...", "", "Previous stop...", "");
            
            index--;
            messaging.peerSocket.send({key:"changeStationUp", menu: current_menu});
          }
        }else if (e.key == "back" && current_menu != -1){
          e.preventDefault();
          pre_select.style.display = "inline";
          current_menu = -1;
          index = 1;
        }
      }
    }
  }
}

function translateScreen(name_text_de, content_text_de, name_text_en, content_text_en){
  hideTimeTable();
  switch(language){
    case 'de_DE':
    case 'de_de':
    case 'de_De':
    case 'de-de':
      name.text = name_text_de;
      stationboard.text = content_text_de;
      break;
    default:
      name.text = name_text_en;
      stationboard.text = content_text_en;
      console.log(language);
      break;
  }
}

function showMinuteDisplay(){
  time_one__time.x = time_one__time.x - 10;
  time_two__time.x = time_two__time.x - 10;
  time_three__time.x = time_three__time.x - 10;
  time_four__time.x = time_four__time.x - 10;

  time_one__time.text = util.getMinutes(data.departures[0]);
  time_two__time.text = util.getMinutes(data.departures[1]);
  time_three__time.text = util.getMinutes(data.departures[2]);
  time_four__time.text = util.getMinutes(data.departures[3]);
  displayInMinutes = true;
}

function showTimeDisplay(){
  time_one__time.x = distance_between_time_and_details;
  time_two__time.x = distance_between_time_and_details;
  time_three__time.x = distance_between_time_and_details;
  time_four__time.x = distance_between_time_and_details;

  time_one__time.text = util.getTime(data.departures[0]);
  time_two__time.text = util.getTime(data.departures[1]);
  time_three__time.text = util.getTime(data.departures[2]);
  time_four__time.text = util.getTime(data.departures[3]);
  displayInMinutes = false;
}

function changeTimeDisplay(){
  if(displayInMinutes){
    showTimeDisplay();
  }else{
    showMinuteDisplay();
  }
}

//Pre-select
let pre_select_container = document.getElementById("pre_select").getElementById("container");
//let pre_select_currentIndex = 0;

translate(language, document.getElementById("text_image_1"),"Lokal","Local");
translate(language, document.getElementById("text_image_2"),"Favoriten","Favourites");

document.getElementById('background_image_1').addEventListener("click", function() {
  pre_select.style.display = "none";
  //Location
  current_menu = 1;
  try{
    messaging.peerSocket.send({key:"loadLocation", menu: current_menu});
  }catch(e){
    translateScreen("Fehler","Es ist ein Fehler aufgetreten. Bitte überprüfe die Einstellungen in der Fitbit App oder versuche es in ein paar Minuten erneut.","Error","Please check the settings in the fitbit app or try it again in a few minutes.");
  }

  startNoInternetTimer();
  getStations();
});

document.getElementById('background_image_2').addEventListener("click", function() {
  pre_select.style.display = "none";
  //Favourites
  current_menu = 0;
  try{
    messaging.peerSocket.send({key:"loadFavourites", menu: current_menu});
  }catch(e){
    translateScreen("Fehler","Es ist ein Fehler aufgetreten. Bitte überprüfe die Einstellungen in der Fitbit App oder versuche es in ein paar Minuten erneut.","Error","Please check the settings in the fitbit app or try it again in a few minutes.");
  }

  startNoInternetTimer();
  translateScreen("Lade deine Favoriten...","Falls du noch keine Favoriten definiert hast, kannst du diese in den Einstellungen festlegen.","Loading your favourites...","If you didn't have defined your favourites, you can do this via the settings in the app.");
});

function startNoInternetTimer(){
  message_received=false;
  setTimeout(function(){
    if(!message_received){
      translateScreen("Keine Verbindung", "Zurzeit kann keine Verbindung mit dem Smartphone hergestellt werden.",
                      "No connection", "It seems that you don't have a connection to your phone.");

      scrollview.height = 150;
      vibration.start("nudge-max");
    }
  }, 10000);
}

function hideTimeTable(){
  stationboard.style.display = "inline";
  
  time_one__background_number.style.display = "none";
  time_one__number.style.display = "none";
  time_one__destination.style.display = "none";
  time_one__platform.style.display = "none";
  time_one__time.style.display = "none";

  time_two__background_number.style.display = "none";
  time_two__number.style.display = "none";
  time_two__destination.style.display = "none";
  time_two__platform.style.display = "none";
  time_two__time.style.display = "none";

  time_three__background_number.style.display = "none";
  time_three__number.style.display = "none";
  time_three__destination.style.display = "none";
  time_three__platform.style.display = "none";
  time_three__time.style.display = "none";

  time_four__background_number.style.display = "none";
  time_four__number.style.display = "none";
  time_four__destination.style.display = "none";
  time_four__platform.style.display = "none";
  time_four__time.style.display = "none";
}

function translate(current_language, element, value_de, value_en){
  switch(current_language){
    case 'de_DE':
    case 'de_de':
    case 'de_De':
    case 'de-de':
      element.text = value_de;
      break;
    default:
      element.text = value_en;
      break;
  }
}