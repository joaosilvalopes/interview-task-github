import styled from "styled-components";

const Spinner = styled.div`
    width: 1em;
    height: 1em;
    border: 3px solid transparent;
    border-radius: 50%;
    border-top-color: currentColor;
    border-right-color: currentColor;
    animation: spin 1s ease-out infinite;
  }
  
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

export default Spinner;