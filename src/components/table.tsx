import React, {useEffect, useState} from 'react';
import {getData, POSTS_URL, USERS_URL} from "../api";

const Table = () => {
    const [users, setUsers] = useState([]);
    const [posts, setPosts] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, isError] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            const result1 = await getData(POSTS_URL);
            console.log(result1);
            const result2 = await getData(USERS_URL);
            console.log(result2);
        }
        fetchData();
        }, []);

    return (
        <div>
            Table
        </div>
    );
};

export default Table;
