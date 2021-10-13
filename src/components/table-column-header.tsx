import React, {FC} from 'react';
import {ReactComponent as ArrowUp} from '../images/arrow-up.svg';
import {ReactComponent as ArrowDown} from '../images/arrow-down.svg';
import {TableSortColumnEnum, TTableSort} from "../types";

interface ITableColumnHeaderProps {
    title: string;
    column?: TableSortColumnEnum;
    clickHandler?: (column: TableSortColumnEnum) => void;
    sort?: TTableSort
}

const TableColumnHeader: FC<ITableColumnHeaderProps> =
    ({title, column, clickHandler, sort}) => {

        const canSort = column && clickHandler && sort;
        const onClick = () => {
            if (canSort) {
                clickHandler(column);
            }
        }

        const isArrowUp = canSort && sort.column === column && sort.asc;
        const isArrowDown = canSort && sort.column === column && !sort.asc;

        return (
            <th onClick={onClick}>
                {title}
                {
                    isArrowUp &&
                    <ArrowUp/>
                }
                {
                    isArrowDown &&
                    <ArrowDown/>
                }
            </th>
        );
    };

export default TableColumnHeader;
