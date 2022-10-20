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
  <div>CurrentPlayer: {{currentPlayer.name}}</div>



  <div class="basic-data">
    <div class="card storage">Tank Remain <br> {{storage}}</div>
    <template v-for="(item,i) in players" :key="i">
      <div class="card players" :style="[currentPlayer.name == item.name ? '' : 'opacity: 0.5']">{{item.name}} <br> Location: {{item.location}} <br>
      <span v-if="item.goingFowrad">Fowrad</span>
      <span v-else>Back</span>
    </div>
    </template>
  </div>

  <div class="dice">
    <button :style="[hasRolled ? 'opacity: 0.5' : '']" @click="roleTheDice()">Role</button>
    <button style="margin-left: 20px" :style="[!canGoBack || !currentPlayer.goingFowrad || hasRolled ? 'opacity: 0.5' : '']" @click="changeDirection()">go back</button>
    <br>
    <strong>#: {{diceNum}}</strong><br>
    <button :style="[!hasRolled ? 'opacity: 0.5' : '']" @click="nextRole()">Done</button><br>
  </div>
</template>

<script>
var randomWords = require('random-words');
import AOS from "aos";

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

      
      rolesOrder: [],
      orderIndex: 0,

      hasRolled: false,
      diceList: [1,2,3,4,5,6],
      diceNum: 1,

    }
  },
  methods:{
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

    roleTheDice(){
      if(this.hasRolled) return
      let index = Math.floor(Math.random()* this.diceList.length)
      this.diceNum = this.diceList[index]
      if(this.currentPlayer.goingFowrad){
        this.currentPlayer.location+= this.diceNum
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
        if(this.currentPlayer.hasReturned){
          this.orderIndex++
        }else{
          flag = true
        }
      }
      // skipfunction for the players return 
      this.hasRolled = false
    },

    changeDirection(){
      if(!this.canGoBack) return
      this.currentPlayer.goingFowrad = false
    },

    canGoBack(){
      if(!this.currentPlayer.goingFowrad || this.hasRolled || this.currentPlayer.location == 0) return false

      return true
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

      let player = this.players.find(({ name }) => name === this.rolesOrder[this.orderIndex]);
      return player
    },
  },
  
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


.basic-data{
  position: absolute;
  bottom: 5%;
  /* background-color: lightgrey; */
  display: flex;
  justify-content: space-between;
  width: 50%;
  transform: translateX(30%)
}

.basic-data .card{
  background-image: linear-gradient(Coral, BlanchedAlmond); 
  padding: 15px;
  aspect-ratio: 3/4;
  width: 125px;
  border-radius: 5px;
}

.basic-data .storage{
  background-image: linear-gradient( BlanchedAlmond,GreenYellow); 
  padding: 15px;
  aspect-ratio: 3/2;
  width: 125px;
  border-radius: 5px;
}

.dice{
  position: absolute;
  bottom: 15%;
  right: 7.5%;
  color: white;
}
</style>
