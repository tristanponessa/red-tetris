import styled from 'styled-components';
import { colors } from '../styles/tetrimino'

function Piece({ ghost, pieceId }) {

    const clr = ghost ? colors['ghost'] : colors[pieceId];
    const Div = styled.div`
        background-color: ${clr};
        outline: 5px ridge black;
    `;

    return (
      <Div>
          {pieceId}
      </Div>
    );
};
  
export default Piece;