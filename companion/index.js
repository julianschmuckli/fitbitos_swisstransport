import { geolocation } from "geolocation";
import * as messaging from "messaging";

var index = 1;

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
  /*var location_chosen = 1;
  latitude = [47.471177, 47.378594][location_chosen];
  longitude = [8.313994, 8.540089][location_chosen];*/
  
  console.log("Location: "+latitude+", "+longitude);
  var url = "https://transport.opendata.ch/v1/locations?x="+ latitude +"&y="+ longitude;
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
            var url2 = "https://transport.opendata.ch/v1/stationboard?id="+data["stations"][i]["id"]+"&limit=4";
            //console.log(url2);
            fetch(url2)
            .then(function (response2) {
                response2.text()
                .then(function(data2) {
                  //console.log("Hallo:"+data2);
                  var data2 = JSON.parse(data2);
                  var data_response = {
                    name: data["stations"][i]["name"],
                    to:[],
                    departures:[],
                    number:[],
                    operators:[],
                    platforms:[],
                    categories:[]
                  }
                  
                  for(var ia=0;ia<data2["stationboard"].length;ia++){
                    //console.log(ia+": "+data2["stationboard"][ia]["to"]);
                    data_response.to[ia] = data2["stationboard"][ia]["to"];
                    data_response.departures[ia] = data2["stationboard"][ia]["stop"]["departureTimestamp"];
                    data_response.number[ia] = data2["stationboard"][ia]["number"];
                    data_response.operators[ia] = data2["stationboard"][ia]["operator"];
                    data_response.platforms[ia] = data2["stationboard"][ia]["passList"][0]["platform"];
                    data_response.categories[ia] = data2["stationboard"][ia]["category"];
                  }

                  sendResponse(data_response);
                });
            }).catch(function (err) {
              console.log("Error fetching data from internet: " + err);
            });
            break;
          }
        }
      });
  })
  .catch(function (err) {
    console.log("Error fetching: " + err);
  });
}

function sendResponse(response){
  if (messaging.peerSocket.readyState === messaging.peerSocket.OPEN) {
    // Send a command to the device
    console.log("Sending response");
    messaging.peerSocket.send(response);
  } else {
    console.log("Error: Connection is not open");
  }
}

messaging.peerSocket.onopen = function() {
  console.log("Socket open");
  geolocation.getCurrentPosition(getStations, locationError, GPSoptions);
}

// Listen for messages from the device
messaging.peerSocket.onmessage = function(evt) {
  if(evt.data.key=="changeStationDown"){
    index++;
    geolocation.getCurrentPosition(getStations, locationError, GPSoptions);
  }else if(evt.data.key=="changeStationUp"){
    index--;
    geolocation.getCurrentPosition(getStations, locationError, GPSoptions);
  }
}

// Listen for the onerror event
messaging.peerSocket.onerror = function(err) {
  // Handle any errors
  console.log("Connection error: " + err.code + " - " + err.message);
}