import React, {useEffect, useMemo, useState} from 'react';
import {getData, POSTS_URL, USERS_URL} from "../api";
import {TPosts, TUsers} from "../types";

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

    const postsWithUserName = useMemo(() => {
        const usersMap = new Map();
        users.forEach(item => usersMap.set(item.id, item.name));

        return posts.map(item => ({ ...item, userName: usersMap.get(item.userId)}));
    }, [posts, users]);

    const filteredPosts = useMemo(() => {
        const searchLowerCase = search.toLowerCase();
        return postsWithUserName.filter(item =>
            item.title.toLowerCase().includes(searchLowerCase)
            || item.body.toLowerCase().includes(searchLowerCase)
            || item.userName.toLowerCase().includes(searchLowerCase)
        );
    }, [postsWithUserName, search]);

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
                filteredPosts.map(item => <p>{item.userName} | {item.title} | {item.body}</p>)
            }
        </div>
    );
};

export default Table;
