import React, {useEffect, useState} from 'react';
import {sendRequest, POSTS_URL, USERS_URL} from "../api";
import {TableSortColumnEnum, TPosts, TTableSort, TUsers} from "../types";
import TableColumnHeader from "./table-column-header";
import styles from './table.module.css';
import {Redirect, useHistory} from "react-router-dom";

const Table = () => {
    const history = useHistory();
    const [users, setUsers] = useState<TUsers>([]);
    const [posts, setPosts] = useState<TPosts>([]);
    const [isUsersLoading, setIsUsersLoading] = useState(false);
    const [usersError, setUsersError] = useState('');
    const [isPostsLoading, setIsPostsLoading] = useState(false);
    const [postsError, setPostsError] = useState('');
    const [search, setSearch] = useState('');
    const [userId, setUserId] = useState(0);
    const [sort, setSort] = useState<TTableSort>({column: TableSortColumnEnum.USER_NAME, asc: true});

    useEffect(() => {
        const fetchData = async () => {
            setIsUsersLoading(true);
            setUsersError('');
            const result = await sendRequest(USERS_URL);
            setIsUsersLoading(false);
            if (result.error) {
                setUsersError(result.error);
            } else {
                setUsers((result.data as TUsers).map(item => ({id: item.id, name: item.name})));
            }
        }
        fetchData();
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            setIsPostsLoading(true);
            setPostsError('');
            const result = await sendRequest(POSTS_URL + (userId ? `?userId=${userId}` : ''));
            setIsPostsLoading(false);
            if (result.error) {
                setPostsError(result.error);
            } else {
                setPosts(result.data as TPosts);
            }
        }
        fetchData();
    }, [userId]);

    const usersMap = new Map();
    users.forEach(item => usersMap.set(item.id, item.name));
    const postsWithUserName = posts.map(item => ({...item, userName: usersMap.get(item.userId)}));

    const searchLowerCase = search.toLowerCase();
    const filteredPosts = postsWithUserName.filter(item =>
        item.title.toLowerCase().includes(searchLowerCase)
        || item.body.toLowerCase().includes(searchLowerCase)
        || item.userName.toLowerCase().includes(searchLowerCase)
    );

    const sortedPosts = filteredPosts.sort((a, b) => {
        const aValue = a[sort.column];
        const bValue = b[sort.column];

        let result = 0;
        if (aValue < bValue) {
            result = -1;
        } else if (aValue > bValue) {
            result = 1;
        }

        return result * (sort.asc ? 1 : -1);
    });

    const headerClickHandler = (column: TableSortColumnEnum) => {
        if (sort.column === column) {
            setSort({...sort, asc: !sort.asc});
        } else {
            setSort({column, asc: true});
        }
    }

    const deleteClickHandler = async (id: number) => {
        const result = await sendRequest(POSTS_URL + '/' + id, {method: 'DELETE'});
        if (result.error) {
            console.log(result.error);
        } else {
            const index = posts.findIndex(item => item.id === id);
            setPosts([...posts.slice(0, index), ...posts.slice(index + 1)]);
        }
    }

    const editClickHandler = (id: number) => {
        history.push('/posts/' + id);
    }

    const isLoading = !postsError && !usersError && (isPostsLoading || isUsersLoading);

    return (
        <div>
            <input
                type='text'
                value={search}
                onChange={(e) => setSearch(e.currentTarget.value)}/>
            <select
                value={userId}
                onChange={(e) => setUserId(Number(e.currentTarget.value))}
            >
                <option key={0} value={0}>none</option>
                {
                    users.map(item => <option key={item.id} value={item.id}>{item.name}</option>)
                }
            </select>
            {
                postsError && <p>{`Posts: ${postsError}`}</p>
            }
            {
                usersError && <p>{`Users: ${usersError}`}</p>
            }
            {
                isLoading && <p>Loading...</p>
            }
            {!postsError && !usersError && !isLoading && (
                <table className={styles.table}>
                    <thead>
                    <tr>
                        <TableColumnHeader title='№'/>
                        <TableColumnHeader
                            title='User'
                            column={TableSortColumnEnum.USER_NAME}
                            sort={sort}
                            clickHandler={headerClickHandler}
                        />
                        <TableColumnHeader
                            title='Title'
                            column={TableSortColumnEnum.TITLE}
                            sort={sort}
                            clickHandler={headerClickHandler}
                        />
                        <TableColumnHeader
                            title='Body'
                            column={TableSortColumnEnum.BODY}
                            sort={sort}
                            clickHandler={headerClickHandler}
                        />
                        <TableColumnHeader title='Actions'/>
                    </tr>
                    </thead>
                    <tbody>
                    {
                        sortedPosts.map((item, index) =>
                            <tr key={item.id}>
                                <td>{index + 1}</td>
                                <td>{item.userName}</td>
                                <td>{item.title}</td>
                                <td>{item.body}</td>
                                <td><button onClick={()=>{deleteClickHandler(item.id)}}>Delete</button></td>
                                <td><button onClick={()=>{editClickHandler(item.id)}}>Edit</button></td>
                            </tr>
                        )
                    }
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default Table;
