let tiles = [
  {point: 0, type: 'triangle', text: 30, belongsTo: 'nobody', value: 1, x: 230, y: 5},
  {point: 0, type: 'triangle', text: 30, belongsTo: 'nobody', value: 1, x: 350, y: 5},
  {point: 0, type: 'triangle', text: 30, belongsTo: 'nobody', value: 1, x: 470, y: 5},
  {point: 0, type: 'triangle', text: 30, belongsTo: 'nobody', value: 1, x: 590, y: 5},
  {point: 0, type: 'triangle', text: 30, belongsTo: 'nobody', value: 1, x: 680, y: 70},
  {point: 0, type: 'triangle', text: 30, belongsTo: 'nobody', value: 1, x: 590, y: 145},
  {point: 0, type: 'triangle', text: 30, belongsTo: 'nobody', value: 1, x: 470, y: 145},
  {point: 0, type: 'triangle', text: 30, belongsTo: 'nobody', value: 1, x: 350, y: 145},

  {point: 0, type: 'square', text: 60, belongsTo: 'nobody', value: 2, x: 240, y: 145},
  {point: 0, type: 'square', text: 60, belongsTo: 'nobody', value: 2, x: 130, y: 145},
  {point: 0, type: 'square', text: 60, belongsTo: 'nobody', value: 2, x: 20, y: 215},
  {point: 0, type: 'square', text: 60, belongsTo: 'nobody', value: 2, x: 130, y: 300},
  {point: 0, type: 'square', text: 60, belongsTo: 'nobody', value: 2, x: 240, y: 300},
  {point: 0, type: 'square', text: 60, belongsTo: 'nobody', value: 2, x: 350, y: 300},
  {point: 0, type: 'square', text: 60, belongsTo: 'nobody', value: 2, x: 460, y: 300},
  {point: 0, type: 'square', text: 60, belongsTo: 'nobody', value: 2, x: 570, y: 300},
  
  {point: 0, type: 'pentagon', text: 20, belongsTo: 'nobody', value: 3, x: 670, y: 360},
  {point: 0, type: 'pentagon', text: 20, belongsTo: 'nobody', value: 3, x: 570, y: 440},
  {point: 0, type: 'pentagon', text: 20, belongsTo: 'nobody', value: 3, x: 460, y: 440},
  {point: 0, type: 'pentagon', text: 20, belongsTo: 'nobody', value: 3, x: 350, y: 440},
  {point: 0, type: 'pentagon', text: 20, belongsTo: 'nobody', value: 3, x: 240, y: 440},
  {point: 0, type: 'pentagon', text: 20, belongsTo: 'nobody', value: 3, x: 130, y: 440},
  {point: 0, type: 'pentagon', text: 20, belongsTo: 'nobody', value: 3, x: 40, y: 520},
  {point: 0, type: 'pentagon', text: 20, belongsTo: 'nobody', value: 3, x: 130, y: 580},

  {point: 0, type: 'hexagon', text: 50, belongsTo: 'nobody', value: 4, x: 250, y: 590},
  {point: 0, type: 'hexagon', text: 50, belongsTo: 'nobody', value: 4, x: 360, y: 590},
  {point: 0, type: 'hexagon', text: 50, belongsTo: 'nobody', value: 4, x: 470, y: 590},
  {point: 0, type: 'hexagon', text: 50, belongsTo: 'nobody', value: 4, x: 580, y: 590},
  {point: 0, type: 'hexagon', text: 50, belongsTo: 'nobody', value: 4, x: 675, y: 660},
  {point: 0, type: 'hexagon', text: 50, belongsTo: 'nobody', value: 4, x: 580, y: 730},
  {point: 0, type: 'hexagon', text: 50, belongsTo: 'nobody', value: 4, x: 470, y: 730},
  {point: 0, type: 'hexagon', text: 50, belongsTo: 'nobody', value: 4, x: 360, y: 730},

  // {point: 20, type: 'special', text: 50, belongsTo: 'nobody', value: 4, x: 250, y: 730},
]

// let pointInTriangle=[0,1,2,3,0,1,2,3,]
// let pointInSquare=[4,5,6,7,4,5,6,7]
// let pointInPentagon=[8,9,10,11,8,9,10,11]
// let pointInHexagon=[12,13,14,15,12,13,14,15]
let tempArray = []
let array = [0,1,2,3,0,1,2,3,]
for (let i = array.length - 1; i > 0; i--) {
  const j = Math.floor(Math.random() * (i + 1));
  const temp = array[i];
  array[i] = array[j];
  array[j] = temp;
}

tempArray.push(...array)


array = [4,5,6,7,4,5,6,7]
for (let i = array.length - 1; i > 0; i--) {
  const j = Math.floor(Math.random() * (i + 1));
  const temp = array[i];
  array[i] = array[j];
  array[j] = temp;
}

tempArray.push(...array)

array = [8,9,10,11,8,9,10,11]
for (let i = array.length - 1; i > 0; i--) {
  const j = Math.floor(Math.random() * (i + 1));
  const temp = array[i];
  array[i] = array[j];
  array[j] = temp;
}

tempArray.push(...array)

array = [12,13,14,15,12,13,14,15]
for (let i = array.length - 1; i > 0; i--) {
  const j = Math.floor(Math.random() * (i + 1));
  const temp = array[i];
  array[i] = array[j];
  array[j] = temp;
}

tempArray.push(...array)





for(let i in tiles){
  tiles[i].theIndex = i
  tiles[i].point = tempArray[i]
  tiles[i].opened = false
  tiles[i].y+= 20

}


let cordination = [
  {x: 230, y:25},{x: 350, y:25},{x: 470, y:25},{x: 590, y:25},{x: 680, y:90},{x: 590, y:165},{x: 470, y:165},{x: 350, y:165},{x: 240, y:165},{x: 130, y:165},{x: 20, y:235},{x: 130, y:320},{x: 240, y:320},{x: 350, y:320},{x: 460, y:320},{x: 570, y:320},{x: 670, y:380},{x: 570, y:460},{x: 460, y:460},{x: 350, y:460},{x: 240, y:460},{x: 130, y:460},{x: 40, y:540},{x: 130, y:600},{x: 250, y:610},{x: 360, y:610},{x: 470, y:610},{x: 580, y:610},{x: 675, y:680},{x: 580, y:750},{x: 470, y:750},{x: 360, y:750},
]

export {tiles,cordination}