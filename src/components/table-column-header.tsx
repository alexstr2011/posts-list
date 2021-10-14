import React, {FC} from 'react';
import {ReactComponent as ArrowUp} from '../images/arrow-up.svg';
import {ReactComponent as ArrowDown} from '../images/arrow-down.svg';
import {TableSortColumnEnum, TTableSort} from "../types";
import styles from './table-column-header.module.css';

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

        const isArrowDown = canSort && sort.column === column && !sort.asc;
        const isArrowUp = canSort && !isArrowDown;
        const arrowUpStyles = [styles.icon];
        if (canSort && sort.column !== column) {
            arrowUpStyles.push(styles.iconInactive);
        }

        return (
            <th onClick={onClick} className={styles.header} title='Press to sort'>
                {title}
                {
                    isArrowUp &&
                    <ArrowUp className={arrowUpStyles.join(' ')}/>
                }
                {
                    isArrowDown &&
                    <ArrowDown className={styles.icon}/>
                }
            </th>
        );
    };

export default TableColumnHeader;
