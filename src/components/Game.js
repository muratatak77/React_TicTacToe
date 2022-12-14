import React from "react";
import Board from "./Board";



class Game extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null)
        // squares: Array(3).fill(null).map(row => new Array(3).fill(null))
      }],
      stepNumber: 0,
      xIsNext: true,
      cellsMap: new Map(),
      cellVal: Array(1).fill(null),
    };
  }
 
  componentDidMount() {
    let cells = Array(3).fill(null).map(row => new Array(3).fill(null))
    let cells_map = new Map();
    let square = 0

    for(var row = 0; row < cells.length; row++) {
      for(var col = 0; col < cells[row].length; col++) {
          cells_map.set(square ++ ,[row,col]);
      }
    }
    console.log("Generate cells : ", cells)
    console.log("Generate cells_map : ", cells_map)
    this.state.history[0].location = cells_map
   }

  // def getCellsValue(i)
  //   const cells_map = {0 : [0,0], }

  // end

  // Why are we using immutable object :
  // Complex Features Become Simple
  // Detecting changes in mutable objects is difficult because they are modified directly.
  // The main benefit of immutability is that it helps you build pure components in React. 
  // Immutable data can easily determine if changes have been made, which helps to determine when a component requires re-rendering.
  handleClick(i){
    const history = this.state.history.slice(0,this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]){
      return;
    }
    squares[i] = this.state.xIsNext ? 'X':'O';
    const cellval = this.state.history[0].location.get(i)

    // When you call setState in a component, React automatically updates the child components inside of it too.
    this.setState({
      // Unlike the array push() method you might be more familiar with, 
      // the concat() method doesn’t mutate the original array, so we prefer it.
      history: history.concat([{
        squares: squares,
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
      cellVal: cellval,
    });
  }

  jumpTo(step){
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) == 0,
    });
  }

  getCellValue(step){
    console.log("step : ", step);
    return this.state.cellsMap.get(step);
  };

  render(){

    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);
    
    // As we iterate through history array, step variable refers to the current history element value, and move refers to the current history element index. We are only interested in move here, hence step is not getting assigned to anything.
    const moves = history.map((step, move) => {      
      let desc = move ? 'Go to move #' + move + "  - Cell : " + this.state.cellVal : 'Go to game start!';
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });

    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : '0');
    }

    return (
      <div className='game'>
        <div className='game-board'>
          <Board 
          squares={current.squares}
          onClick={(i) => this.handleClick(i)}
           />
        </div>

        <div className='game-info'>
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

function calculateWinner(squares){
  const lines = [
    [0,1,2],
    [3,4,5],
    [6,7,8],
    [0,3,6],
    [1,4,7],
    [2,5,8],
    [0,4,8],
    [2,4,6]
  ]
  for (let i = 0; i <lines.length; i++){
    const [a,b,c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]){
      return squares[a]
    }
  }
  return null;
}



export default Game;


