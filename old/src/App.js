import Board from './components/Board';
import { board1 } from './testing/backendData';

/* 
  you will have to use states once you receive a huge amount of data from socket.io 
  to let react update tiny portions instead of the whole thing 
  + 
  redux is needed to avoid having the parent, App contain everything 


*/

function App() {
  return (
    <div>
      <Board boardData={board1} small ghost/>
      <Board boardData={board1} small/>
      <Board boardData={board1} ghost/>
      <Board boardData={board1}/>
    </div>
  );
}

export default App;
