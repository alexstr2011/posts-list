export const POSTS_URL = 'https://jsonplaceholder.typicode.com/posts';
export const USERS_URL = 'https://jsonplaceholder.typicode.com/users';

export const sendRequest = async (url: string, options?: object) => {
    const result = {
        data: [],
        error: ''
    };

    try {
        let response = await fetch(url, options);
        if (response.ok) {
            let json = await response.json();
            result.data = json;
        } else {
            throw new Error("Ошибка HTTPS: " + response.status);
        }
    } catch(error) {
        result.error = (error as Error).message;
    }

    return result;
};
