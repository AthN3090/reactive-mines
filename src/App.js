import React from 'react';
import './App.css';
class Header extends React.Component{
  render(){
    return (<h1 className="heading">
      MINESWEEPER
    </h1>
    )
  }
}

class Cell extends React.Component{
    state = {
        minecell : this.props.minecell,
        touching_mines : this.props.touching_mines,
        revealed:this.props.revealed,
        flagged:this.props.flagged

    }
    
    check = ()=>{
      this.setState({
        revealed:true
      })
    }
    cellvalue(){
     const value = this.props.value;
      if(value.revealed){
        if(value.mine)
         return <span role="img" aria-label="bomb">💣</span>;
        else {
          if(value.touching_mine !== 0)
            return value.touching_mine;
          else return;
          }
      }else if(value.flagged)
        return <span role="img" aria-label="flag">🚩</span>;
        if(!value.flagged)
        return;
        
    }
    render(){
      const onClick = this.props.onClick;
      const rtClick = this.props.cMenu;
      const value = this.props.value;
      var cellClass = this.props.class + (value.revealed?" revealed":"");
      return (  
    <div className={cellClass} onClick={onClick} onContextMenu={rtClick}>
         {this.cellvalue()}
      </div>
      )
    }

}
class DrawBoard extends React.Component{

  state = {
    player_status:null,
    game_status:"running",
    height: this.props.height,
    width: this.props.width,
    mines: this.props.mines,
    flags: this.props.flags,
    type: this.props.type,
    boardData:this.createArray(this.props.height, this.props.width, this.props.mines)
  }
  check_touching(i, j, data){
        //logic for calculating the touching mines for each cell if count is zero
        //otherwise put the count as value
        var touching = [];
        
        if(i>0){ //upper
          touching.push(data[i-1][j]);
          
        } //down
        if(i< this.props.height-1 ){
          touching.push(data[i+1][j]);
        }
        if(j>0){ //left
          touching.push(data[i][j-1]);
        } //right
        if(j < this.props.width-1){
          touching.push(data[i][j+1]);
        } 
        if(i > 0 && j > 0){ //top left
          touching.push(data[i-1][j-1]);
  
        } //bottom left
        if(i < this.props.height-1  && j > 0){
          touching.push(data[i+1][j-1]);
  
        }
        if(i > 0 && j < this.props.width-1){
          touching.push(data[i-1][j+1]);
        }
  
        
        if(i < this.props.height-1 && j < this.props.width-1){
          touching.push(data[i+1][j+1]);
  
        }
  
    return touching;
  }
    
  createArray(rows, cols, mines){

    var data = [];
    for(var i = 0; i < rows;i++){
      data.push([]);
      for(var j = 0; j < cols;j++){
        data[i][j] = {
          revealed:false,
          x_position: i,
          y_position: j,
          mine: false,
          touching_mine: 0,
          flagged:false

        };
      }
    }
    var plantedmines = 0;
  while(plantedmines < mines){
    var x_position = Math.floor(Math.random() * rows);
    var y_position = Math.floor(Math.random() * cols);

    if(!data[x_position][y_position].mine){
      data[x_position][y_position].mine = true;
      plantedmines++;
    }
    //randomly assign {mine:true} value for upto certain number of cells
    
  }

  for( i =0;i<rows;i++){
    for( j=0;j<cols;j++){
      
      if(data[i][j].mine === false){
        var mine_count = 0;
        const neighbours = this.check_touching(i,j,data);
        // eslint-disable-next-line
        neighbours.map(value =>{
          if(value.mine)
            mine_count+=1;
        });
        data[i][j].touching_mine = mine_count;
      }

      
    }
  }

 return data;
  }
  
 revealEmpty(i, j, data){
      var neighbours = this.check_touching(i,j,data);
        // eslint-disable-next-line
      neighbours.map( value => {
        if(!value.revealed && !value.mine && !value.flagged){
          data[value.x_position][value.y_position].revealed = true;
          if(value.touching_mine === 0)
          this.revealEmpty(value.x_position, value.y_position, data);
        }
      })
      
      this.setState({
        boardData:data
    
      })
  }
  
  revealAll(data){
// eslint-disable-next-line
      data.map((row) =>{// eslint-disable-next-line
        row.map((cols)=>{
          cols.revealed = true;
          })

      })

      this.setState({
        boardData:data,
        game_status:"stopped"
      })

  }
leftclick(x_position, y_position, data){

  if(!data[x_position][y_position].mine){
  if(!data[x_position][y_position].revealed && !data[x_position][y_position].flagged){
     if(data[x_position][y_position].touching_mine === 0){
      data[x_position][y_position].revealed = true;
        this.revealEmpty(x_position, y_position, data);
     }
      else
       data[x_position][y_position].revealed = true;

  }
}else if(!data[x_position][y_position].flagged){
      
      if(this.state.game_status === "running"){
        this.setState({
          player_status:"Lost"
        })
        this.revealAll(data);
       // alert("********** Game Over **********");
      }
      



}


  this.setState({
    boardData:data

  })
  
  
}
rightclick(e,x_position, y_position, data){

  e.preventDefault();
  var mines = this.state.mines;
  var flags = this.state.flags;
  if(!data[x_position][y_position].revealed){
  if(!data[x_position][y_position].flagged){
    if(flags>0){
    data[x_position][y_position].flagged = true;
    flags-=1;
    if(data[x_position][y_position].mine){
        mines--;
    }
    }
  }else{
    
    data[x_position][y_position].flagged = false;
    flags+=1;
    if(data[x_position][y_position].mine){
      console.log("2");
      mines++;
      }
    
    } this.setState({
      
  flags:flags,
  boardData:data,
  mines:mines
  },()=>{
    console.log(this.state.flags);
    if(this.state.mines=== 0){
      this.setState({
        player_status:"won"
      }, () => this.revealAll(data))
      
    }

  })
 
    


      }
    }
rendercells(){
  var data = this.state.boardData;
    return(
          data.map((row)=>{
            return row.map((col)=>{
              return(
                
                <Cell cMenu={(e)=>this.rightclick(e,col.x_position, col.y_position, data)} onClick={() => this.leftclick(col.x_position, col.y_position, data)} class={this.state.type} value={col} level={this.state.type} />
              )
            
            })
      })
     
    )
    
}
  render(){
   
    return <div className={this.state.type+"_board"}>
              {this.state.game_status === "running" ?<div className="flag">Flags <span role="img" aria-label='flag'>🚩</span>: {this.state.flags} </div>: <div className={this.state.player_status === "Lost" ? "lost":"won"}> You {this.state.player_status} !</div>}
              {
                this.rendercells()
              }
              
          </div>
  }
}

class Game extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      level : null
    };
  }
   
       setLevel(value){
      this.setState(
        {
          level : value
        }
      );
    }
   

  render(){
return(
      <div className="container">
        <Header />
        {this.state.level===null? <div className="options">
        <center>
        <h2 style={{
          color:"white",
          fontFamily:"arial"        
      }}>
        Choose Difficulty 
        </h2> 
        </center> 
        <center>
        <button className="easy" onClick={() =>{this.setLevel('easy')}}>
        Easy
        </button>
        <button className="medium" onClick={() =>{this.setLevel('medium')}}>
        Medium
        </button>
        <button className="hard" onClick={() =>{this.setLevel('hard')}}>
        Hard
        </button>
        </center>
        
      </div> : console.log(this.state.level)}
      {this.state.level === "easy" ?  <DrawBoard height="9" width="9" mines="10" flags="10" type="easy_cell" /> : null}
      {this.state.level === "medium" ?  <DrawBoard height="16" width="16" mines="40" flags="40" type="medium_cell" /> : null}
      {this.state.level === "hard" ?  <DrawBoard height="24" width="24" mines="99" flags="99" type="hard_cell" /> : null}
      
</div>      

    )
  }

}

export default Game;

