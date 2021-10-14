import React, {useEffect, useState} from 'react';
import {useHistory, useParams} from "react-router-dom";
import {TPost} from "../types";
import {POSTS_URL, sendRequest} from "../api";

const PostForm = () => {
    const history = useHistory();
    const {id} = useParams<{ id: string }>();
    const [post, setPost] = useState<TPost>();
    const [isPostLoading, setIsPostLoading] = useState(false);
    const [postError, setPostError] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            setIsPostLoading(true);
            setPostError('');
            const result = await sendRequest(POSTS_URL + '/' + id);
            setIsPostLoading(false);
            if (result.error) {
                setPostError(result.error);
            } else {
                setPost(result.data);
            }
        }
        fetchData();
    }, []);

    const changeHandler = (e: React.ChangeEvent<HTMLInputElement>|React.ChangeEvent<HTMLTextAreaElement>) => {
        const target = e.currentTarget;
        setPost({...(post as TPost), [target.name]: target.value});
    };

    const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const result = await sendRequest(POSTS_URL + '/' + id, {
            method: 'PUT',
            body: JSON.stringify({...post}),
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            },
        });
        if (result.error) {
            console.log(result.error);
        } else {
            history.push('/posts');
        }
    };

    const cancelHandler = () => {
        history.goBack();
    };

    return (
        <div>
            {
                postError && <p>{postError}</p>
            }
            {
                isPostLoading && <p>Loading...</p>
            }
            {!postError && !isPostLoading && post &&
            <form onSubmit={submitHandler}>
                <h1>Edit the post:</h1>
                <label>Title
                    <input
                        type='text'
                        name='title'
                        value={post.title}
                        placeholder='title'
                        onChange={changeHandler}
                    />
                </label>
                <label>Body
                    <textarea
                        name='body'
                        value={post.body}
                        onChange={changeHandler}
                    />
                </label>
                <button type='submit'>Save</button>
                <button type='button' onClick={cancelHandler}>Cancel</button>
            </form>
            }
        </div>
    );
};

export default PostForm;
