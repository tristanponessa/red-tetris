/*
  boardData 
  [
    [null, 'S', 'S']
    ['Z', 'Z', null]
  ]
*/

import Piece from './Piece';
import  styled  from 'styled-components';
import { sizes } from '../styles/tetrimino'

function Board({ boardData, small, ghost }) {

  const cols = 10;
  const rows = 20;

  const rowSize = small ? sizes['SMALL'].rowSize : sizes['NORMAL'].rowSize;
  const colSize = small ? sizes['SMALL'].colSize : sizes['NORMAL'].colSize;

  //found a good candidate for dumb IFFE to avoid having var and fn (used only once) to have same name
  const getFirstOccupiedRow = ((boardData) => {
      let rowNb = 0;
      for (let row of boardData) {
          for (let col of row) {
            if (col !== '-')
              return rowNb;
          }
        rowNb++;
      }
  })(boardData);


  const Grid = styled.div`
      display: grid;
      grid-template-rows: repeat(${rows}, ${rowSize});
      grid-template-columns: repeat(${cols}, ${colSize});
  `;

  const pieces = [];
  let rowNb = 0;
  for (let row of boardData) {
    for (let col of row) {
      if (rowNb > getFirstOccupiedRow)
        pieces.push(<Piece ghost={ghost} pieceId={col} />);
      else 
        pieces.push(<Piece pieceId={col} />); 
    }
    rowNb++;
  }



  return (
    <>
      <Grid>
          {pieces};
      </Grid>
    </>
  );
};

export default Board;