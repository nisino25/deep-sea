 <template>
  <transition name="fade" >
    <div class='modal-overlay fade-in' v-if="showModal" style="height: 100vh">
      
        <div v-if="!showSummary" class="modal" style=" transition : all 0.6s ease 0s;"
        >
          <div>
            <form onsubmit="event.preventDefault()">

              <label>Type all the usernames</label>
              <input type="text" placeholder="Type username.." class="input-transition" v-model="user1">
              <input type="text" placeholder="Type username.." class="input-transition" v-model="user2">
              <input type="text" placeholder="Type username.." class="input-transition" v-model="user3" v-if="capacity >= 3">
              <input type="text" placeholder="Type username.." class="input-transition" v-model="user4" v-if="capacity >= 4">
              <input type="text" placeholder="Type username.." class="input-transition" v-model="user5" v-if="capacity >= 5">
              <input type="text" placeholder="Type username.." class="input-transition" v-model="user6" v-if="capacity >= 6">

              <button class="w3-button w3-xlarge plus-button" style="background-color:DarkCyan; color: white;" @click="incrementCap()">+</button>

              <!-- <span v-if="modalWarning" class="warning">{{modalWarning}}</span> -->
              <button @click="startGame()" class="create" >Start Game</button>

            </form>
          </div>
        </div>

        <div v-else class="modal" style=" transition : all 0.6s ease 0s;"
        >
          <div>
            <form onsubmit="event.preventDefault()">

              <label>Round Summary</label>
              <div>
                <template v-for="(player,i) in players" :key="i">
                  <div style="margin-bottom: 20px; display: flex;">
                    <strong>{{player.name}}
                       <i v-if="!player.hasReturned" class='fas fa-skull-crossbones' style='font-size:30px; color:red'></i>
                       <i v-else style="font-size:30px; color:green" class="fa">&#xf118;</i>
                       : {{player?.point}} points</strong>:
                    <template v-for="(item,i) in player.item" :key="i">
                      <div class="flip-card" >
                        <div class="flip-card-inner" :class="[i < openingIndex ? 'card-opened' : '']" >
                          <div class="flip-card-front">
                            <img :class="item.type" :src="getImgUrl(item.type)" alt="" style="width: 45px;">
                          </div>
                          <div class="flip-card-back" style="color:black">
                            {{item.point}}
                          </div>
                        </div>
                      </div>
                    </template>
                    
                  </div>

                  
                </template>
                <button @click="startOpening()" v-if='!opened' class="create" >Open</button>
                <button @click="setupForNextRound()" v-if='opened && finishedOpen && round < 3' class="create" >next</button>
              </div>

            </form>
          </div>
        </div>

    </div>

  </transition>

  <div class="wrapper">
    <div class="submarine">
    <img src="../public/icons/submarine-svgrepo-com.svg" alt="" :class="[storageTrigger ? 'empty' : '']">
    <div style="position: relative">

      
    </div>
  </div>

  <div class="storage">
    <span>{{storage}}</span>
  </div>

  <div class="tiles">
    <template v-for="(item,i) in tiles" :key="i">
      <div v-if="item.x !== 0" class="tiles" :class="item.type" :style="`top: ${item.y}px; left: ${item.x}px; color: ${item.color};` ">
        <img v-if="item.belongsTo == 'nobody'" :src="getImgUrl(item.type)" alt="">
        <img src="../public/icons/circle.svg" alt="" v-else style="filter: invert(25%) sepia(5%) saturate(1277%) hue-rotate(181deg) brightness(90%) contrast(90%);">
        <!-- <span>{{item.value}}</span> -->
        <span>{{item.point}}</span>
      </div>
    </template>
  </div>

  <template v-for="(item,i) in players" :key="i">
    <div class="player-pawn" :style="getLocation(item,i)">
      <img src="../public/icons/diver.svg" alt="">
    </div>
    
  </template>

  

  <div class="dice">
    <!-- <span>rolled?: {{hasRolled}}</span><br> -->
    <div v-if="!movingNow">

      <button v-if="!hasRolled" :style="[hasRolled ? 'opacity: 0.5' : '']" @click="roleTheDice()">Role</button>
      <button style="margin-left: 20px" v-if="canGoBack" @click="changeDirection()">go back</button>
      <br>
      <strong v-if="hasRolled">#: {{diceNum}}</strong><br>
      <div v-if="hasRolled">

        <hr style="margin: 10px">
        <button v-if="pickable && !didAction" @click="pickup()">pick up</button>
        <button v-if="dropable && !didAction" @click="droppingNow = true">drop</button><br>
        <br>
    
        <button :style="[!hasRolled ? 'opacity: 0.5' : '']" @click="nextRole()">Done</button><br>
      </div>
    </div>

    <div v-else>
      <strong>#{{diceNum}}</strong>
    </div>
  </div>

  <div class="basic-data">
    
    <template v-for="(item,i) in players" :key="i">
      <div  class="card players" :style="[currentPlayer?.name == item.name ? '' : 'opacity: 0.5'] ">
        <div>
          <span style="font-weight: bold; font-size:20px;" :style="`color:${userColors[i]};`">{{item.name}}</span>: {{item.point}} <br>  
          <hr>
          <div>
            <template v-for="(item,i) in item.item" :key="i">
              <img @click="drop(i)" :class="item.type" :src="getImgUrl(item.type)" alt="">
            </template>

             

          </div>
          <!-- <hr> -->
          <span v-if="item.goingFowrad">Exploring</span>
          <span v-else>Returning</span>
        </div>
    </div>
    </template>
  </div>
  </div>


  

  
</template>

<script>
var randomWords = require('random-words'); 

import AOS from "aos";
import {tiles, cordination} from './const/tiles.js'

export default {
  name: 'App',
  data(){
    return{
      developing: false,
      // developing: true,

      minor: true,
      // minor: false,

      showModal: true,
      showSummary: false,
      openingIndex: 0,
      flippingSpeed: 1000,
      opened: false,
      finishedOpen: false,


      capacity: 2,

      user1: '',
      user2: '',
      user3: '',
      user4: '',
      user5: '',
      user6: '',
      userColors: ['crimson','CornflowerBlue','green'],


      players: [],

      storage: 25,
      round: 1,
      roundFlag: false,

      
      rolesOrder: [],
      orderIndex: 0,

      hasRolled: false,
      movingNow: false,
      diceList: [1,2,3,4,5,6],
      diceNum: 1,
      storageTrigger: false,

      tiles,
      cordination,

      flipStyle: '',

      droppingNow: false,
      didAction: false,

    }
  },
  methods:{
    sleep(ms) {
      return new Promise((resolve) => {
        setTimeout(resolve, ms);
      });
    },
    startGame(){
      if(this.capacity< 2 || this.capacity > 6) return

      this.showModal = false

      
      
      this.players.push({name: this.user1})
      this.players.push({name: this.user2})

      if(this.capacity > 2){
        this.players.push({name: this.user3})
      }
      if(this.capacity > 3){
        this.players.push({name: this.user4})
      }
      if(this.capacity > 4){
        this.players.push({name: this.user5})
      }
      if(this.capacity > 5){
        this.players.push({name: this.user6})
      }

      for(let i in this.players){
        this.players[i].balance = 0
        this.players[i].location = -1
        this.players[i].goingFowrad = true
        this.players[i].hasReturned = false
        this.players[i].item = []
        this.players[i].point = 0
        this.players[i].tempPoints = 0
      }

      // console.log(this.players)

      let count = 0
      while(count < 50){
        for(let i in this.players){
          this.rolesOrder.push(this.players[i].name)
        }
        count++
      }
      // console.log(this.rolesOrder)
      

    },
    summary(){
      this.showModal= true
      this.showSummary = true
      this.openingIndex = 0
    },

    async startOpening(){
      this.opened = true
      this.finishedOpen = false


      this.openingIndex = 0
      let count = 0
      while(count< this.maxLength){

        for(let i in this.players){
          let player = this.players[i]
          if(player.item.length > this.openingIndex){
            if(player.hasReturned){

              let item  = player.item[this.openingIndex]
              player.point+= item.point
            }
            // console.log(item.point)
          }
        }


        
        count++
        this.openingIndex++
        await this.sleep(this.flippingSpeed)
        
      }

      this.finishedOpen = true
    },

    async setupForNextRound(){
      this.showModal = false
      this.opened = false
      this.finishedOpen = false

      this.hasRolled = false
      this.storageTrigger = false
      this.round++
      if(this.round >=3) return
      // console.log('finction called')
      
      
      this.storage = 25
      
      for(let i in this.players){
        let player = this.players[i]
        player.location = -1
        player.hasReturned = false
        player.goingFowrad = true
        player.item = []
      }

      // console.table(this.players)

      // tiles fixing 

      this.tiles = this.tiles.filter(function(item) {
        return item.belongsTo == 'nobody'
      })


      // console.log(this.tiles)

      for(let i in this.tiles){
        let tile = this.tiles[i]
        tile.x = this.cordination[i].x
        tile.y = this.cordination[i].y
      }

      // await this.sleep(2000)

      // let count = 0
      // let num = 0
      // while(count < this.tiles.length){
      //   let tile = this.tiles[count]
      //   if(tile.belongsTo !== 'nobody'){
      //     num--
      //   }else{
      //     tile.x = this.cordination[num].x
      //     tile.y = this.cordination[num].y
      //   }
      //   count++
      //   num++
      // }


      


      
    },

    async roleTheDice(){
      if(this.hasRolled) return
      let index = Math.floor(Math.random()* this.diceList.length)
      this.diceNum = this.diceList[index]
      console.log(this.diceNum)
      let tempNum = this.diceNum- this.currentPlayer.item.length

      

      let count = 0
      let flag = false
      this.movingNow = true
      if(this.currentPlayer.goingFowrad){
        while(count < tempNum){
          flag= false
          await this.sleep(660)

          for(let i in this.players){
            if(this.players[i].location == this.currentPlayer.location +1){
              console.log(`oh hey : ${this.players[i].name}`)
              flag = true
            }
          }

          this.currentPlayer.location++
          if(flag) count--

          count++
        }
        




      }else{
        if(tempNum > 0){
          
          while(count < tempNum){
            flag= false
            await this.sleep(660)

            for(let i in this.players){
              if(this.players[i].location == this.currentPlayer.location -1){
                console.log(`oh hey : ${this.players[i].name}`)
                flag = true
              }
            }

            this.currentPlayer.location--
            if(flag) count--

            if(this.currentPlayer.location <= -1){
              this.currentPlayer.hasReturned = true
              this.currentPlayer.location = -1

              
            } 

            count++
          }
          // this.currentPlayer.location-= tempNum
          

        }
      }

      this.movingNow = false
      this.hasRolled = true
    },

    nextRole(){
      if(!this.hasRolled) return
      if(this.storageTrigger){
        this.summary()
        return
      }
      this.orderIndex++

      let flag= false
      while(!flag){
        if(!this.currentPlayer?.hasReturned) {
          this.storage-=this.currentPlayer.item.length
          if(this.storage <= 0){
            this.storage =0
            this.storageTrigger = true
          } 
        }
        if(this.currentPlayer?.hasReturned){
          // this.orderIndex++
          if(this.hasAllReturned){
            flag = true
          }else{
            this.orderIndex++
          }
        }else{
          flag = true
        }
      }
      // skipfunction for the players return 
      this.hasRolled = false

      if(!this.hasAllReturned) return


      this.summary()
      // this.setupForNextRound()
    },



    changeDirection(){
      if(!this.canGoBack) return
      this.currentPlayer.goingFowrad = false
    },

    pickup(){
      let index = this.currentPlayer.location
      this.tiles[index].belongsTo = this.currentPlayer.name
      this.currentPlayer.item.push(this.tiles[index])

      this.didAction = true
      // console.log(this.currentPlayer.item)

      // console.table(this.players.item)
    },

    drop(i){
      if(!this.droppingNow) return
      let text = `${this.currentPlayer.name}, would like to drop this ${this.currentPlayer.item[i].value} point tiles`
      if(confirm(text)){
        let index = this.currentPlayer.location
        this.tiles[index].belongsTo = 'nobody'
        this.tiles[index].point = this.currentPlayer.item[i].point
        this.tiles[index].pvalue = this.currentPlayer.item[i].value

        let player = this.players.find(({ name }) => name === this.rolesOrder[this.orderIndex]);
        
        // console.log(player.item)

        player.item[i].belongsTo = 'nobody'
        player.item = player.item.filter(function(i) {
          return i.belongsTo == 'nobody'
        })
        

        this.droppingNow = false
        this.didAction = true
      }else{
        this.droppingNow = false
      }
      // let index = this.currentPlayer.location
      // this.tiles[index].belongsTo = 'nobody'
      // this.tiles[index].poinßt = 


    },





    

    getLocation(player,i){
      let index = player.location

      // flip or not
      let style
      
      switch(i){
        case 0:
          style = 'filter: invert(17%) sepia(54%) saturate(6329%) hue-rotate(339deg) brightness(88%) contrast(97%);'
          break;

        case 1:
          style ='filter: invert(55%) sepia(30%) saturate(1619%) hue-rotate(192deg) brightness(100%) contrast(87%);'
          break;

        case 2:
          style ='filter: invert(42%) sepia(15%) saturate(2441%) hue-rotate(59deg) brightness(90%) contrast(87%);'
          break;



        
      }

      if(player.goingFowrad){

        if(index < 4){
          style+= 'transform: scaleX(-1); '
        }else if(index >= 10 && index < 17){
          style+= 'transform: scaleX(-1); '
        }else if(index >= 22 && index < 29){
          style+= 'transform: scaleX(-1); '
        }
      }else{
        if(index > 5){
          style+= 'transform: scaleX(-1); '
        }else if(index <= 10 && index > 17){
          style+= 'transform: scaleX(-1); '
        }else if(index <= 22 && index > 29){
          style+= 'transform: scaleX(-1); '
        }
      }




      if(index == -1){
        return style + `top: 60px; left: ${60+ (i*20)}px`
      }
      
      return style + `top: ${(this.tiles[index].y) + 20 }px; left: ${10+ (this.tiles[index].x )}px`
      // let location = player.location 
      
      // // let side 
      // if(location){
        
      // }
      // return `top: 250px; left: ${100+ (player.location * 100)}px`
    },
    textStyle(item){
      return `transform: translate(-${item.text}%,-45%)`
    },

    getImgUrl(link) {
      // return link
      return require('../public/icons/'+ link + '.svg')
    },

    getPlayerColor(i){
      let style
      switch(i){
        case 0:
          style = 'filter: invert(73%) sepia(6%) saturate(6893%) hue-rotate(311deg) brightness(96%) contrast(106%); '
          break;

        case 1:
          style ='filter: invert(87%) sepia(30%) saturate(229%) hue-rotate(351deg) brightness(106%) contrast(97%);'
          break;

        case 2:
          style ='filter: invert(42%) sepia(15%) saturate(2441%) hue-rotate(59deg) brightness(90%) contrast(87%);'
          break;

        
      }

      style+= 'transform: scaleX(-0.75); width: 100px; height: auto;'
      return style


    },

    

    incrementCap(){
      if(this.capacity > 5) return 
      this.capacity++
    },

    async test(){
      this.user1 =  'nozo'
      this.user2 =  'becca'
      this.user3 =  'mom'

      this.flippingSpeed = 100
      
      // this.user4 =  randomWords()
      // this.user5 =  randomWords()
      // this.user6 =  randomWords()

      this.capacity++

      

      this.startGame()
      
      this.showModal = true
      this.showSummary = true

      this.players[0].item.push(this.tiles[3])

      this.players[1].item.push(this.tiles[1])
      this.players[1].item.push(this.tiles[11])
      this.players[1].item.push(this.tiles[21])
      this.players[1].item.push(this.tiles[30])

      this.players[2].item.push(this.tiles[2])
      this.players[2].item.push(this.tiles[12])
      this.players[2].item.push(this.tiles[5])
      this.players[2].item.push(this.tiles[15])
      this.players[2].item.push(this.tiles[20])
      this.players[2].item.push(this.tiles[22])

      

      for(let i in this.players){
        let player = this.players[i]
        for(let index in player.item){
          
          this.tiles[player.item[index].theIndex].belongsTo = player.name
        }
      }

      this.players[0].hasReturned = true
      this.players[1].hasReturned = true
      this.players[2].hasReturned = true

      console.log(randomWords())

      // let text
      // for(let i in this.tiles){
      //   let tile = this.tiles[i]
      //   text+= `{x: ${tile.x}, y:${tile.y}},`
      // }

      // console.log(text)
    },

    async minorTest(){
      this.user1 =  'nozo'
      this.user2 =  'becca'
      this.user3 =  'mom'

      // this.flippingSpeed = 100

      this.capacity++
    }

    

    
  },
  mounted(){
    
    // this.intervalID = setInterval(() => {
		// 	this.getLevelProgress(this.increment)
		// }, 10)
  },

  created(){
    console.log('hey')
    console.clear()
    AOS.init();


    if(this.developing) this.test()

    if(this.minor) this.minorTest()

    // this.user1 =  randomWords()
    //   this.user2 =  randomWords()
    //   this.user3 =  randomWords()
    //   this.user4 =  randomWords()
    //   this.user5 =  randomWords()
    //   this.user6 =  randomWords()

    


    
  },

  computed:{
    currentPlayer(){
      if(!this.players) return
      // if(this.round == 3) return 'no one'

      let player = this.players.find(({ name }) => name === this.rolesOrder[this.orderIndex]);
      return player
    },

    hasAllReturned(){
      if(!this.players) return
      for(let i in this.players){
        if(!this.players[i].hasReturned){
          return false
        }
      }

      return true

    },

    canGoBack(){
      if(!this.players) return false
      if(!this.currentPlayer) return false

      if(!this.currentPlayer?.goingFowrad || this.hasRolled || this.currentPlayer?.location == -1) return false

      return true
    },
    
    pickable(){
      if(!this.currentPlayer) return false

      let index = this.currentPlayer.location
      if(this.tiles[index]?.belongsTo == 'nobody'){
        return true
      }

      if(this.currentPlayer.location == -1) return false

      return false

    },

    dropable(){
      if(!this.currentPlayer) return false

      let index=  this.currentPlayer.location
      if(this.tiles[index]?.belongsTo == 'nobody') return false

      if(this.currentPlayer.item.length == 0) return false

      if(this.currentPlayer.location == -1) return false

      return true

      
    },
    

    maxLength(){
      if(!this.currentPlayer) return false

      // let count = 0 
      let tempMax = 0

      for(let i in this.players){
        if(this.players[i].item.length > tempMax)
        tempMax = this.players[i].item.length
      }

      return tempMax
    },
  },

  watch:{
    round(){
      if(this.round > 3){
        this.round = 3
        alert('hey the game is over')
      }
    },
    currentPlayer(){
      this.droppingNow = false
      this.didAction = false
      // console.log('player change')
      

      

      
    }
    // orderIndex(){
    //   console.log(`index: ${this.orderIndex}`)
    // }
  }
  
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  /* margin-top: 60px; */
}

body{
  /* overflow: hidden; */
  /* position: fixed; */
  /* background-color: red; */

  background-image: linear-gradient(lightblue, darkblue); 
  height: 100vh;
  /* background: linear-gradient(DarkCyan, DarkSlateBlue); */
}

/* -------------------------------------------------------- */

.modal-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  /* bottom: 0; */
  /* height: 667px; */
  z-index: 98;
  background-color: rgba(0, 0, 0, 0.7);
}

.modal {
  color: black;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%,-50%);
  z-index: 99;
  
  width: 85%;
  max-width: 700px;
  background-color: #f2f2f2;
  border-radius: 16px;
  
  padding: 25px;
  font-size: 200%;
}

.modal h1 {
  color: #222;
  font-size: 32px;
  font-weight: 900;
  margin-bottom: 15px;
}
 
.modal p {
  color: #666;
  font-size: 18px;
  font-weight: 400;
  margin-bottom: 15px;
}

.modal strong{
  content:"handsome";
  white-space: pre;
}

.fade-in {
	opacity: 1;
	animation-name: fadeInOpacity;
	animation-iteration-count: 1;
	animation-timing-function: ease-in;
	animation-duration: .4s;
}
@keyframes fadeInOpacity {
	0% {
		opacity: 0;
	}
	100% {
		opacity: 1;
	}
}

.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
input[type=text], select {
  width: 100%;
  padding: 12px 20px;
  margin: 8px 0;
  display: inline-block;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
  font-size: 16px;
}
.modal  .create {
  width: 100%;
  background-color: #4CAF50;
  color: white;
  padding: 14px 20px;
  margin: 10px 0;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
.modal .plus-button{
  margin: 10px;
  float: left;
  padding: 2px 10px;
}


/* ------------------------------------------------------- */
.submarine{
  top: -15px;
  left:30px;

  aspect-ratio: 2/1;
  width: 100px;
  
  position: absolute;
  /* background-color: crimson; */
}

.submarine img{
  transform: scaleX(-1);
  width: 175px;
  height: auto;
  /* d */
}

.empty{
  filter: invert(11%) sepia(80%) saturate(6296%) hue-rotate(12deg) brightness(93%) contrast(112%);
}

.storage span{
  position: absolute;
  top: 0%;
  left:5%;

  z-index: 20;
  font-size: 350%;

  /* width: 100px;
  height: 100px; */

  color: #FF6D28;
  font-weight: bold;
  /* background-color: black; */
  /* border-radius: 50%; */

}

.tiles{
  z-index: 0;
  width: 90px;
  
  position: absolute;
  transition: 2s ease-in;
  /* background-color: purple; */
  /* position:absolute; */
}

.tiles img{
  width: 95px;
  height: auto;
  filter: drop-shadow(3px 5px 2px rgb(0 0 0 / 0.4));
}

.tiles span{
  font-size:150%;
  color: white;
  text-align: center;
  
  position: absolute;
  left: 50%;
  top: 50%;
  
}

.occupied{
  filter: invert(25%) sepia(5%) saturate(1277%) hue-rotate(181deg) brightness(90%) contrast(90%);
}

.triangle img{
  filter: invert(29%) sepia(10%) saturate(2619%) hue-rotate(359deg) brightness(95%) contrast(95%);

  
  /* box-shadow: 10px 0 5px -2px #888; */
  /* filter: drop-shadow(3px 5px 2px rgb(0 0 0 / 0.4)); */
}

.square img{
  width: 85px;
  height: auto;
  filter: invert(48%) sepia(9%) saturate(2540%) hue-rotate(360deg) brightness(103%) contrast(90%);
}

.pentagon img{
  width: 105px;
  height: auto;
  filter: invert(81%) sepia(9%) saturate(3224%) hue-rotate(347deg) brightness(82%) contrast(79%);


}

.hexagon img{
  width: 95px;
  height: auto;
  filter: invert(86%) sepia(17%) saturate(4073%) hue-rotate(347deg) brightness(99%) contrast(82%);
}

.special img{
  filter: invert(85%) sepia(72%) saturate(6396%) hue-rotate(359deg) brightness(103%) contrast(101%);
}

.special span{
  color: black;
}

.player-pawn{
  
  position: absolute;
  transition: 0.33s ease-in;
  z-index: 10;
  /* display: none; */
}

.player-pawn img, .modal-overlay img{
  /* transform: scaleX(-1); */
  width: 90px;
  height: auto;
  /* transform: rotate(30deg); */
  filter: drop-shadow(1px 3px 1px rgb(0 0 0 / 0.4));

  /* filter: invert(35%) sepia(36%) saturate(7009%) hue-rotate(2deg) brightness(104%) contrast(88%); */

}

.modal-overlay img{
  width: 50px;
  height: auto;
  margin-right: 10px;
  filter: drop-shadow(1px 3px 1px rgb(0 0 0 / 0.4));
}

/* ------------------------------------------------- */
.dice{
  position: absolute;
  background-color: #666;
  border-radius: 10px;
  padding: 30px;
  bottom: 15px;
  left: 20px;
  color: white;

  transition: 1s;
  transition-property: width
}



.basic-data{
  position: absolute;
  bottom: 15px;
  right: 15px;
  /* background-color: lightgrey; */
  display: flex;
  justify-content: space-between;
  width: 520px;
  height: 200px;

  /* transform: translateX(30%) */
}

.basic-data .card{
  background-image: linear-gradient(white, grey);
  position: relative;
  width: 20%;
  border-radius: 5px;
  padding: 5px;
}

.basic-data hr {
  border: 1px solid red;
  width: 75%;
  /* text-align: center; */
  margin: auto auto;
}


.basic-data .card img{
  width: 30px;
  margin: 5px;
  height: auto;
}

.basic-data .triangle,.modal-overlay .triangle{
  filter: invert(29%) sepia(10%) saturate(2619%) hue-rotate(359deg) brightness(95%) contrast(95%);
}
.basic-data .square ,.modal-overlay .square{
  width: 85px;
  height: auto;
  filter: invert(48%) sepia(9%) saturate(2540%) hue-rotate(360deg) brightness(103%) contrast(90%);
}
.basic-data .pentagon,.modal-overlay .pentagon{
  width: 105px;
  height: auto;
  filter: invert(81%) sepia(9%) saturate(3224%) hue-rotate(347deg) brightness(82%) contrast(79%);

}
.basic-data .hexagon ,.modal-overlay .hexagon {
  width: 95px;
  height: auto;
  filter: invert(86%) sepia(17%) saturate(4073%) hue-rotate(347deg) brightness(99%) contrast(82%);
}

.basic-data .card div{
  padding: 0px;
  width: 100%;
  /* background-color: red; */
  /* position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%,-50%); */
}

/* .basic-data .storage{
  width: 100%;
  background-image: linear-gradient( BlanchedAlmond,GreenYellow); 
  aspect-ratio: 3/2;
  width: 20%;
  border-radius: 5px;
} */




.flip-card {
  background-color: transparent;
  
}

/* This container is needed to position the front and back side */
.flip-card-inner {
  position: relative;
  /* width: 100%;
  height: 100%; */
  text-align: center;
  transition: transform 0.8s;
  transform-style: preserve-3d;
}

/* Do an horizontal flip when you move the mouse over the flip box container */
.flip-card:hover .flip-card-inner, .card-opened {
  transform: rotateY(180deg);
}

/* Position the front and back side */
.flip-card-front, .flip-card-back {
  /* position: absolute;
  width: 100%;
  height: 100%; */
  -webkit-backface-visibility: hidden; /* Safari */
  backface-visibility: hidden;
}

/* Style the front side (fallback if image is missing) */
.flip-card-front {
  /* background-color: #bbb; */
  color: black;
}

/* Style the back side */
.flip-card-back {
  /* margin-right: 20px; */
  position: absolute;
  top:0;
  left: 10px;
  /* background-color: dodgerblue; */
  color: white;
  transform: rotateY(180deg);
}

</style>
