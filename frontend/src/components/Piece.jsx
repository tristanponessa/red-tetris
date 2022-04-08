import styled from 'styled-components';
import colors from '../styles/colors'

function Piece({ pieceId }) {

    const clr = colors[pieceId];
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