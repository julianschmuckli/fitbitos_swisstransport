export function getColors(operator, number){
  var colors;
  switch(operator){
    case 'RVBW':
      colors = RVBW(number);
      break;
    case 'PAG':
      colors = {line_color:"#FFCC00",line_color_font:"#000"};
      break;
    default:
      console.log("----------");
      console.log("Unknown operator: "+operator);
      console.log("----------");
      colors = {line_color:"#fff",line_color_font:"#000"};
      break;
  }
  return colors;
}

/* Colors for number */
export function RVBW(line){
  var line_color, line_color_font;
  switch (line) {
    case '1':
        line_color = "#E2001A";
        line_color_font = "#FFFFFF";
        break;
    case '2':
        line_color = "#0091D0";
        line_color_font = "#FFFFFF";
        break;
    case '3':
        line_color = "#FFD201";
        line_color_font = "#000000";
        break;
    case '4':
        line_color = "#059D3A";
        line_color_font = "#FFFFFF";
        break;
    case '5':
        line_color = "#DA277C";
        line_color_font = "#FFFFFF";
        break;
    case '6':
        line_color = "#1A171C";
        line_color_font = "#FFFFFF";
        break;
    case '7':
        line_color = "#153E90";
        line_color_font = "#FFFFFF";
        break;
    case '8':
        line_color = "#84502A";
        line_color_font = "#FFFFFF";
        break;
    case '9':
        line_color = "#EBA360";
        line_color_font = "#FFFFFF";
        break;
    case '10':
        line_color = "#6B1E7B";
        line_color_font = "#FFFFFF";
        break;
    case '11':
        line_color = "#B8C100";
        line_color_font = "#FFFFFF";
        break;
    case '12':
        line_color = "#88CABD";
        line_color_font = "#FFFFFF";
        break;
    default:
        line_color = "#000000";
        line_color_font = "#F4E21D";
        break;
    }
  
  return {line_color: line_color, line_color_font: line_color_font};
}