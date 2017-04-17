function Square(props) {
  return (
    <button className={props.color ? props.color: 'square'} onClick={() => props.onClick()}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    const squares = this.props.squares;
    const color = this.props.winLine && this.props.winLine.includes(i) ? 'highlight square' : '';
    
    return <Square key={i.toString()} color={color} value={squares[i]} onClick={() => this.props.onClick(i)} />;
  }
  
  render() {
    let rows = [];
    
    const board = ((numberOfRows, numberOfColumns) => {
      for (let i = 0; i < numberOfRows; i++) {
        let columns = [];
        
        for (let j = 0; j < numberOfColumns; j++) {
          columns.push(this.renderSquare(i * numberOfColumns + j));
        }

        rows.push(
          <div key={i.toString()} className="board-row">
            {columns}
          </div>
        );
      }
      
      return rows;
    });
    
    return (
      <div>
        {board(3,3)}
      </div>
    );
  }
}

class Game extends React.Component {
  constructor() {
    super();
    this.state = {
      history: [{
        squares: Array(9).fill(null),
        location: null,
      }],
      stepNumber: 0,
      xIsNext: true,
      moveOrderAsc: false,
      winLine: Array(),
    };
  }
  handleClick(i) {
    var history = this.state.history.slice(0, this.state.stepNumber + 1);
    var current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinLine(squares) || squares[i]) {
      return;
    }

    squares[i] = this.state.xIsNext ? 'X' : 'O';

    this.setState({
      history: history.concat([{
        squares: squares,
        location: i
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) ? false : true,
    });
  }
  
  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const line = calculateWinLine(current.squares);
    
    let status;
    
    if (line) {
      status = 'Winner: ' + current.squares[line[0]];
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    const moves = history.map((step, move) => {
      const desc = move ? 'Move #' + move + ' (' + Math.floor(step.location / 3) + ',' + (step.location % 3) + ')': 'Game start';
      const className = this.state.stepNumber === move ? 'thick' : '';
      
      return (
        <li key={move}>
          <a href="#" onClick={() => this.jumpTo(move)}>
            <p className={className}>
            {desc}
            </p>
          </a>
        </li>
      );
    });
    
    if (!this.state.moveOrderAsc) {
      moves.reverse();
    }

    return (
      <div className="game">
        <div>
          <Board
            squares={current.squares}
            winLine={line}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
        <div><button onClick={() => this.setState({moveOrderAsc: !this.state.moveOrderAsc})}>Moves Order</button></div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('container')
);

function calculateWinLine(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return lines[i];
    }
  }
  return null;
}
