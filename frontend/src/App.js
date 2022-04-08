import Board from './components/Board';
import { board1 } from './testing/backendData';

function App() {
  return (
    <div>
      <Board boardData={board1}/>
    </div>
  );
}

export default App;
