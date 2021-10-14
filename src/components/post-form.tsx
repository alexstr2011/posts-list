import React, {useEffect, useState} from 'react';
import {useHistory, useParams} from "react-router-dom";
import {TPost} from "../types";
import {POSTS_URL, sendRequest} from "../api";
import Loader from "./loader";
import styles from './post-form.module.css';

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
    }, [id]);

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
        <div className={styles.wrapper}>
            <h1 className={styles.header}>Edit the post:</h1>
            {
                postError && <p className={styles.error}>{postError}</p>
            }
            {
                isPostLoading && <Loader/>
            }
            {!postError && !isPostLoading && post &&
            <form onSubmit={submitHandler} className={styles.form}>
                <label className={styles.inputLabel}>
                    <span>Title:</span>
                    <textarea
                        name='title'
                        value={post.title}
                        onChange={changeHandler}
                        className={styles.textareaTitle}
                    />
                </label>
                <label className={styles.inputLabel}>
                    <span>Body:</span>
                    <textarea
                        name='body'
                        value={post.body}
                        onChange={changeHandler}
                        className={styles.textareaBody}
                    />
                </label>
                <div className={styles.buttonWrapper}>
                    <button type='submit' className={styles.button}>Save</button>
                    <button type='button' onClick={cancelHandler} className={styles.button}>Cancel</button>
                </div>
            </form>
            }
        </div>
    );
};

export default PostForm;
