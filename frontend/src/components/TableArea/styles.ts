import styled from "styled-components";

export const Table = styled.table`

    border: 1px solid #ccc;
    border-collapse: collapse;
    box-shadow: 0px 0px 5px #CCC;
    border-radius: 10px;
    margin-top: 20px;
    width: 100%;


    display: flex;
    flex-direction: column;


`;

export const TableHeadColumn = styled.th<{width?: number}>`
    width : ${props => props.width ? `${props.width}px` : 'auto' };
    text-align: center;
    padding-bottom: 20px;



`;