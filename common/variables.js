export function getURLStationNames(lat, lon){
  return "https://transport.opendata.ch/v1/locations?x="+ lat +"&y="+ lon;
}

export function getURLStationDetails(id){
  return "https://transport.opendata.ch/v1/stationboard?id="+id+"&limit=4";
}