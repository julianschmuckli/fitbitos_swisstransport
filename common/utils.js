export function pad(num, size) {
    var s = num+"";
    while (s.length < size) s = "0" + s;
    return s;
}

export function getTime(timestamp){
  var date = new Date(timestamp*1000);
  // Hours part from the timestamp
  var hours = pad(date.getHours(),2);
  // Minutes part from the timestamp
  var minutes = "0" + date.getMinutes();
  // Seconds part from the timestamp
  var seconds = "0" + date.getSeconds();

  // Will display time in 10:30:23 format
  return hours + ":" + minutes.substr(-2);
}

export function getMinutes(timestamp){
  var current_time = new Date();
  var time = new Date(timestamp*1000);
  
  var timeDiff = Math.abs(time.getTime() - current_time.getTime());
  var diffMinutes = Math.ceil(timeDiff / (1000 * 60));
  var diffHours = Math.ceil(timeDiff / (1000 * 60 * 60));
  if(diffMinutes<60) {
    return diffMinutes + " Min.";
  }else{
    return diffHours + " Std.";
  }
}