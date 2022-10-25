 <template>
  <transition name="fade" >
    <div class='modal-overlay fade-in' v-if="showModal" style="height: 100vh">
      
        <div class="modal" style=" transition : all 0.6s ease 0s;"
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
    </div>

  </transition>

  <div>CurrentPlayer: {{currentPlayer?.name}}</div>
  <div>order index: {{orderIndex}}</div>

  <div class="submarine">
    <img src="../public/icons/submarine-svgrepo-com.svg" alt="">
  </div>

  <div class="tiles">
    <template v-for="(item,i) in tiles" :key="i">
      <div v-if="item.x !== 0" class="tiles" :class="item.type" :style="`top: ${item.y}px; left: ${item.x}px; color: ${item.color};` ">
        <img style="fill: crimson;" :src="getImgUrl(item.type)" alt="">
        <span>{{item.point}}</span>
        <!-- <span>{{i}}</span> -->
      </div>
    </template>
  </div>

  <template v-for="(item,i) in players" :key="i">
    <div class="player-pawn" :style="getLocation(item,i)">
      <img src="../public/icons/diver.svg" alt="">
    </div>
    
  </template>

  <!-- <svg src="../public/icons/triangle.svg" style="position: absolute; top: 50%; left: 50%; translate(-50%,-50%), width: 1000px; height: auto;"></svg> -->

  



  <div class="basic-data">

    <div class="card storage">
      Air: {{storage}} <br>
      <span>Round {{round}}/3</span>
    </div>

    
    <template v-for="(item,i) in players" :key="i">
      <div class="card players" :style="[currentPlayer?.name == item.name ? '' : 'opacity: 0.5']">
        <div>
          {{item.name}}: {{item.location}} <br>  
          <span v-if="item.goingFowrad">Fowrad</span>
          <span v-else>Back</span>
        </div>
    </div>
    </template>
  </div>

  <div class="dice">
    <button :style="[hasRolled ? 'opacity: 0.5' : '']" @click="roleTheDice()">Role</button>
    <button style="margin-left: 20px" :style="[!canGoBack || !currentPlayer?.goingFowrad || hasRolled ? 'opacity: 0.5' : '']" @click="changeDirection()">go back</button>
    <br>
    <strong>#: {{diceNum}}</strong><br>
    <button :style="[!hasRolled ? 'opacity: 0.5' : '']" @click="nextRole()">Done</button><br>
  </div>
</template>

<script>
var randomWords = require('random-words'); 
import AOS from "aos";
import {tiles} from './const/tiles.js'

export default {
  name: 'App',
  data(){
    return{
      // developing: false,
      developing: true,

      showModal: true,
      capacity: 2,

      user1: '',
      user2: '',
      user3: '',
      user4: '',
      user5: '',
      user6: '',


      players: [],

      storage: 25,
      round: 1,
      roundFlag: false,

      
      rolesOrder: [],
      orderIndex: 0,

      hasRolled: false,
      diceList: [1,2,3,4,5,6],
      diceNum: 1,

      tiles,

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
        this.players[i].location = 0
        this.players[i].goingFowrad = true
        this.players[i].hasReturned = false
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

    setupForNextRound(){
      if(this.round >=3) return
      console.log('finction called')
      
      
      this.storage = 25
      
      for(let i in this.players){
        this.players[i].hasReturned = false
        this.players[i].goingFowrad = true
      }

      console.table(this.players)

      
    },

    async roleTheDice(){
      if(this.hasRolled) return
      let index = Math.floor(Math.random()* this.diceList.length)
      this.diceNum = this.diceList[index]
      let count = 0
      let flag = false
      if(this.currentPlayer.goingFowrad){
        while(count < this.diceNum){
          flag= false
          await this.sleep(250)

          for(let i in this.players){
            console.log('huh?')
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
        this.currentPlayer.location-= this.diceNum
        if(this.currentPlayer.location <= 0){
          this.currentPlayer.hasReturned = true
          this.currentPlayer.location = 0
          
        } 
      }
      this.hasRolled = true
    },

    nextRole(){
      if(!this.hasRolled) return
      this.orderIndex++

      let flag= false
      while(!flag){
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


      console.log('reahed here?')
      this.round++
      this.setupForNextRound()
    },

    changeDirection(){
      if(!this.canGoBack) return
      this.currentPlayer.goingFowrad = false
    },

    canGoBack(){
      if(!this.currentPlayer.goingFowrad || this.hasRolled || this.currentPlayer.location == 0) return false

      return true
    },

    getLocation(player,i){
      let index = player.location

      // flip or not
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

        // case :
        //   style =''
        //   break;


        
      }

      if(index < 5){
        style+= 'transform: scaleX(-1); '
      }else if(index > 14 && index < 20){
        style+= 'transform: scaleX(-1); '
      }
      if(index == 0){
        return style + `top: 60px; left: ${60+ (i*20)}px`
      }
      
      return style + `top: ${(this.tiles[index].y) }px; left: ${10+ (this.tiles[index].x )}px`
      // let location = player.location 
      
      // // let side 
      // if(location){
        
      // }
      // return `top: 250px; left: ${100+ (player.location * 100)}px`
    },

    getImgUrl(link) {
      // return link
      return require('../public/icons/'+ link + '.svg')
    },

    

    incrementCap(){
      if(this.capacity > 5) return 
      this.capacity++
    },

    test(){
      this.user1 =  randomWords()
      this.user2 =  randomWords()
      this.user3 =  randomWords()
      this.user4 =  randomWords()
      this.user5 =  randomWords()
      this.user6 =  randomWords()

      this.capacity++

      this.startGame()
    },


    
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
  },

  watch:{
    round(){
      if(this.round > 3){
        this.round = 3
        alert('hey the game is over')
      }
    },
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
  
  width: 75%;
  max-width: 600px;
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
/* ------------------------------------------------- */
.submarine{
  top: 0px;
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
  filter: drop-shadow(3px 5px 2px rgb(0 0 0 / 0.4));
}

.tiles{
  z-index: 0;
  width: 90px;
  
  position: absolute;
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
  
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-30%,-45%)
}

.triangle img{
  filter: invert(29%) sepia(10%) saturate(2619%) hue-rotate(359deg) brightness(95%) contrast(95%);
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

/* .triangle-tile{ 
  aspect-ratio: 1/1;
  width: 90px;
  
  position: absolute;
  background-color: purple;
} */
.player-pawn{
  
  position: absolute;
  transition: 1s ease-in;
  z-index: 10;
}

.player-pawn img{
  /* transform: scaleX(-1); */
  width: 90px;
  height: auto;
  transform: rotate(30deg);
  filter: drop-shadow(1px 3px 1px rgb(0 0 0 / 0.4));

  /* filter: invert(35%) sepia(36%) saturate(7009%) hue-rotate(2deg) brightness(104%) contrast(88%); */

}

/* ------------------------------------------------- */




.basic-data{
  position: absolute;
  bottom: 0px;
  left: 2.5%;
  /* background-color: lightgrey; */
  display: flex;
  justify-content: space-between;
  width: 60%;
  height: 100px;

  /* transform: translateX(30%) */
}

.basic-data .card{
  background-image: linear-gradient(Coral, BlanchedAlmond);
  
  position: relative;
  /* padding: 0px; */
  aspect-ratio: 2/1;
  width: 100px;
  height: 70px;
  border-radius: 5px;
  /* width: 100%; */
  /* padding: 0px; */
}

.basic-data .card div{
  padding: 0px;
  width: 100%;
  /* background-color: red; */
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%,-50%);
}

.basic-data .storage{
  width: 100%;
  background-image: linear-gradient( BlanchedAlmond,GreenYellow); 
  /* padding: 15px; */
  aspect-ratio: 3/2;
  width: 20%;
  border-radius: 5px;
}

.dice{
  position: absolute;
  bottom: 20px;
  right: 7.5%;
  color: white;
}
</style>
