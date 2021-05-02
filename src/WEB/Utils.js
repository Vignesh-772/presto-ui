const { getUUID } = require("./JBridgeInterface");


function parseColors(color) {
    if (color.length < 8)
      return color;
  
    if (color.indexOf("rgba") !== -1 || color.indexOf("rgb") !== -1)
      return color;
  
    var alpha = parseInt(color.substring(1, 3), 16);
    alpha = (alpha / 255).toFixed(2);
  
    var hexColor = color.substring(3, 9);
    var rgbaColor = "rgba(" + convertHexToRgb(hexColor) + "," + alpha + ")";
  
    return rgbaColor;
}

function rWS(value) {
  return value.replace(/ /g, '');
}

function cS(value) {
  return value ? value + '' : "";
}

function convertColorToRgba(color) {
  color = rWS(cS(color));

  var values;
  var alpha = "1.00";

  if (color.length >= 8) {
    alpha = parseInt(color.substring(1, 3), 16);
    alpha = (alpha / 255).toFixed(2);
    color = color.substring(3, 9);
  } else {
    color = color.substring(1, color.length);
  }

  color = convertHexToRgb(rWS(color));
  values = color.split(',');

  return {
    r: parseInt(rWS(values[0])),
    g: parseInt(rWS(values[1])),
    b: parseInt(rWS(values[2])),
    a: parseFloat(alpha)
  };
}


function convertHexToRgb(hex) {
  var r = (parseInt(hex.substring(0, 2), 16)).toFixed(2);
  var g = (parseInt(hex.substring(2, 4), 16)).toFixed(2);
  var b = (parseInt(hex.substring(4, 6), 16)).toFixed(2);

  return r + "," + g + "," + b;
}

const state = {
  fragments : {},
  fragmentTypes : {},
  mainRootView : {
    type: "relativeLayout",
    props: {
        "h": document.getElementById("content").clientHeight,
        "w": document.getElementById("content").clientWidth
    }
  }
} 

function addToContainerList(id , namespace){
    let container = getContainer(namespace, true);
    if(container)
    {
      let key = getUUID();
      state.fragments[key] = document.getElementById(id);
      state.fragmentTypes[key] = window.__VIEWS[id];
      return key;
  }
  return "__failed"
}

function getContainer( namespace ){
    if(namespace){
      let container = state.fragments[namespace];
      if(container)
        return container;
  }
  return document.getElementById("content");
}

function getParentView(namespace, view) {
  if (namespace) {
    let containerType = state.fragmentTypes[namespace];
    if (containerType) {
      containerType.children = containerType.children || []
      containerType.children.push(view);
      containerType.oldView = true;
      return containerType;
    }
  }

  if (state.mainRootView.children) {
    state.mainRootView.oldView = true;
  }
  state.mainRootView.children = state.mainRootView.children || [];
  state.mainRootView.children.push(view);
  return state.mainRootView;
}

// function modifyTranslation(config){
//   var x = config.x || "0";
//   var y = config.y || "0";
//   var animationArray = JSON.parse(config.inlineAnimation);
//   var animationArray = animationArray.map(function(a){
//     if(a.hasOwnProperty("fromX")){
//       a.fromX = parseInt(a.fromX) + parseInt(x) + '';
//       if(!a.hasOwnProperty("toX")){
//         a.toX = 0 + parseInt(x) + '';
//       }
//     }
//     if(a.hasOwnProperty("toX")){
//       a.toX = parseInt(a.toX) + parseInt(x) + '';
//     }
//     if(a.hasOwnProperty("fromY")){
//       a.fromY = parseInt(a.fromY) + parseInt(y) + '';
//       if(!a.hasOwnProperty("toY")){
//         a.toY = 0 + parseInt(y) + '';
//       }
//     }
//     if(a.hasOwnProperty("toY")){
//       a.toY = parseInt(a.toY) + parseInt(y) + '';
//     }
//     return a;
//   })
//   return (animationArray);
// }

module.exports = {
    parseColors,
    rWS, 
    cS, 
    convertColorToRgba,
    addToContainerList,
    getParentView,
    getContainer
}