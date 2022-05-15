import Board from './components/Board';
import { board1 } from './test/backendData';

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