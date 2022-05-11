import { useState } from "react";
import { board } from "./common/consts/ExamInput";
import wall from './images/wall.jpg'; 
import ball from './images/ball.jpg'; 
import air from './images/air.gif'; 
import y from './images/y.jpg'; 
import styles from './App.module.scss';

let state = 0;

function App() {
  let gameBoardUpdate = () => {
    return (  board.map( indexTable => 
      <div> { indexTable.map(element => {
          if(element === 'X'){ return <img src={wall} alt="" />
            } else if (element === '1'){ return <img src={ball} alt="" className={styles.Ball}/> 
            } else if (element === '0'){ return <img src={air} alt="" />  
            } else if (element === 'Y'){ return <img src={y} alt="" /> 
          };
        })
      } </div> ))
  };

  let [gameBoardDisplay, setGameBoardDisplay] = useState(gameBoardUpdate());

  class BallGenerator {					
    constructor(board){					
          this.board = board;					
    };				
    generateBall(){					
    let y;					
    let x;					
      for (let i = 0; i < board.length; i++) {					
        let tempX = board[i].indexOf('1');					
        if (tempX > -1) {					
          y = i;					
          x = tempX;					
        }					
      };					
    return {y: y, x: x};					
    };		
  }					

  class Vector{
    constructor(y, x){
      this.x = x * this.randomVector();
      this.y = y * this.randomVector();
    };
    randomVector(){
      if (Math.random() < 0.5){return -1}else{return 1}
    };
  };
  class Ball{
    constructor(y, x, vector){
      this.x = x;
      this.y = y;
      this.vector = vector;
    };
    move(){
      this.x += this.vector.x;
      this.y += this.vector.y;
    };
  };
//move ball, board pole = 
  class Game{
    constructor(ball, board, state){
      this.ball = ball;
      this.board = board;
      this.state = state;
      this.startingX = Number(ball.x);
      this.startingY = Number(ball.y);
    }

    randomVector = () => {if (Math.random() < 0.5){ return this.ball.vector.x *=-1 
      }else{return this.ball.vector.y *=-1}};
        
    checkForYCollision = () => {
      this.moveBall();
      this.randomVector();
    };
      
    checkForXCollision = () => {
      // corner X collision
      if(this.board[this.ball.y][this.ball.x + this.ball.vector.x] !== 'X' && 
      this.board[this.ball.y + this.ball.vector.y][this.ball.x] !== 'X' ) {
        this.randomVector();
      };
      // horizontal and vertical X collision
      if(this.board[this.ball.y][this.ball.x + this.ball.vector.x] === 'X'){ 
        this.ball.vector.x *=-1 };
      if(this.board[this.ball.y + this.ball.vector.y][this.ball.x] === 'X'){ 
        this.ball.vector.y *=-1 };
      this.moveBall();
    };

    moveBall = () => {
      this.board[this.ball.y][this.ball.x] = '0';
      this.board[this.ball.y + this.ball.vector.y][this.ball.x + this.ball.vector.x] = '1';
      this.ball.move();
    }
     
    start(){
      state = 1; 
      // interval
      const play = setInterval(() => { 
        if (this.board[this.ball.y + this.ball.vector.y][this.ball.x + this.ball.vector.x] === 'Y') {
          this.checkForYCollision();
        } else if (this.board[this.ball.y + this.ball.vector.y][this.ball.x + this.ball.vector.x] === 'X' ) {
          this.checkForXCollision();
        } else { this.moveBall() };

        setGameBoardDisplay(gameBoardUpdate());
        // game state: 0 - before start, 1 - active, 2 - finished
        if(this.ball.x === this.startingX && this.ball.y === this.startingY){
          state = 2; 
          document.getElementById("myBtn").disabled = false;
          clearInterval(play);
          alert("Game done!");
          console.log("Game over");
        };
      }, 333);
    };
  };

  let startBall = new BallGenerator(board).generateBall();
  let myVector = new Vector(1, 1);
  let movingBall = new Ball(startBall.y, startBall.x, myVector);
  
  function gameStart(){ let game = new Game(movingBall, board).start();
    document.getElementById("myBtn").disabled = true;
  };

  return (
    <>
      <div className={styles.board}>
        <button id="myBtn" onClick={gameStart}> Start! </button>
        <div><br></br></div>
        {gameBoardDisplay}
      </div>
    </>
  )
}

export default App