import React, {useEffect, useState} from 'react';
import {getData, POSTS_URL, USERS_URL} from "../api";
import {TPosts, TUser, TUsers} from "../types";

const Table = () => {
    const [users, setUsers] = useState<TUsers>([]);
    const [posts, setPosts] = useState<TPosts>([]);
    const [isUsersLoading, setIsUsersLoading] = useState(false);
    const [usersError, setUsersError] = useState('');
    const [isPostsLoading, setIsPostsLoading] = useState(false);
    const [postsError, setPostsError] = useState('');
    const [search, setSearch] = useState('');
    const [userId, setUserId] = useState(0);


    useEffect(() => {
        const fetchData = async () => {
            setIsUsersLoading(true);
            setUsersError('');
            const result = await getData(USERS_URL);
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
            const result = await getData(POSTS_URL + (userId ? `?userId=${userId}` : ''));
            setIsPostsLoading(false);
            if (result.error) {
                setPostsError(result.error);
            } else {
                setPosts(result.data as TPosts);
            }
        }
        fetchData();
    }, [userId]);

    return (
        <div>
            <input
                type='text'
                value={search}
                onChange={(e)=>setSearch(e.currentTarget.value)}/>
            <select
                value={userId}
                onChange={(e)=>setUserId(Number(e.currentTarget.value))}
            >
                <option key={0} value={0}>none</option>
                {
                    users.map(item => <option key={item.id} value={item.id}>{item.name}</option>)
                }
            </select>
            {
                posts.map(item => <p>{item.userId} {item.title}</p>)
            }
        </div>
    );
};

export default Table;
