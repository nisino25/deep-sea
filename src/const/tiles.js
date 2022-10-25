let tiles = [
  {point: 0, type: 'triangle',  belongsTo: 'nobody', value: 1, x: 230, y: 5},
  {point: 0, type: 'triangle',  belongsTo: 'nobody', value: 1, x: 350, y: 5},
  {point: 0, type: 'triangle',  belongsTo: 'nobody', value: 1, x: 470, y: 5},
  {point: 0, type: 'triangle',  belongsTo: 'nobody', value: 1, x: 590, y: 5},
  {point: 0, type: 'triangle',  belongsTo: 'nobody', value: 1, x: 680, y: 70},
  {point: 0, type: 'triangle',  belongsTo: 'nobody', value: 1, x: 590, y: 145},
  {point: 0, type: 'triangle',  belongsTo: 'nobody', value: 1, x: 470, y: 145},
  {point: 0, type: 'triangle',  belongsTo: 'nobody', value: 1, x: 350, y: 145},

  {point: 0, type: 'square', belongsTo: 'nobody', value: 2, x: 240, y: 145},
  {point: 0, type: 'square', belongsTo: 'nobody', value: 2, x: 130, y: 145},
  {point: 0, type: 'square', belongsTo: 'nobody', value: 2, x: 20, y: 215},
  {point: 0, type: 'square', belongsTo: 'nobody', value: 2, x: 130, y: 300},
  {point: 0, type: 'square', belongsTo: 'nobody', value: 2, x: 240, y: 300},
  {point: 0, type: 'square', belongsTo: 'nobody', value: 2, x: 350, y: 300},
  {point: 0, type: 'square', belongsTo: 'nobody', value: 2, x: 460, y: 300},
  {point: 0, type: 'square', belongsTo: 'nobody', value: 2, x: 570, y: 300},
  
  {point: 0, type: 'pentagon', belongsTo: 'nobody', value: 3, x: 670, y: 360},
  {point: 0, type: 'pentagon', belongsTo: 'nobody', value: 3, x: 570, y: 440},
  {point: 0, type: 'pentagon', belongsTo: 'nobody', value: 3, x: 460, y: 440},
  {point: 0, type: 'pentagon', belongsTo: 'nobody', value: 3, x: 350, y: 440},
  {point: 0, type: 'pentagon', belongsTo: 'nobody', value: 3, x: 240, y: 440},
  {point: 0, type: 'pentagon', belongsTo: 'nobody', value: 3, x: 130, y: 440},
  {point: 0, type: 'pentagon', belongsTo: 'nobody', value: 3, x: 40, y: 530},
  {point: 0, type: 'pentagon', belongsTo: 'nobody', value: 3, x: 130, y: 615},

  {point: 0, type: 'hexagon', belongsTo: 'nobody', value: 4, x: 250, y: 620},
  {point: 0, type: 'hexagon', belongsTo: 'nobody', value: 4, x: 360, y: 620},
  {point: 0, type: 'hexagon', belongsTo: 'nobody', value: 4, x: 470, y: 620},
  {point: 0, type: 'hexagon', belongsTo: 'nobody', value: 4, x: 580, y: 620},
  {point: 0, type: 'hexagon', belongsTo: 'nobody', value: 4, x: 680, y: 700},
  {point: 0, type: 'hexagon', belongsTo: 'nobody', value: 4, x: 580, y: 800},
  {point: 0, type: 'hexagon', belongsTo: 'nobody', value: 4, x: 470, y: 800},
  {point: 0, type: 'hexagon', belongsTo: 'nobody', value: 4, x: 360, y: 800},
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
  tiles[i].point = tempArray[i]
}




// console.table(array)

// let index
// let list


// for(let i in tiles){
//   switch(tiles[i].type){
//     case 'triangle': 
//       list = pointInTriangle
//       index = Math.floor(Math.random()* 4)
//       tiles[i].point = list[index]
//       break;

//     case 'square': 
//       list = pointInSquare
//       index = Math.floor(Math.random()* 4)
//       tiles[i].point = list[index]
//       break;

//     case 'pentagon': 
//       list = pointInPentagon
//       index = Math.floor(Math.random()* 4)
//       tiles[i].point = list[index]
//       break;

//     case 'hexagon': 
//       list = pointInHexagon
//       index = Math.floor(Math.random()* 4)
//       tiles[i].point = list[index]
//       break;
//   }
// }


// how to distribute point

export {tiles}