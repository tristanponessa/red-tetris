/*
  boardData 
  [
    [null, 'S', 'S']
    ['Z', 'Z', null]
  ]
*/

import Piece from './Piece';
import  styled  from 'styled-components';

function Board({ boardData }) {

  const cols = 10;
  const rows = 20;

  const Grid = styled.div`
      display: grid;
      grid-template-rows: repeat(${rows}, 100px);
      grid-template-columns: repeat(${cols}, 100px);
  `;

  const pieces = [];
  for (let row of boardData)
    for (let col of row)
      pieces.push(<Piece pieceId={col} />);
  
  return (
    <>
      <Grid>
          {pieces};
      </Grid>
    </>
  );
};

export default Board;