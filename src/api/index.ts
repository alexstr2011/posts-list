export const POSTS_URL = 'https://jsonplaceholder.typicode.com/posts';
export const USERS_URL = 'https://jsonplaceholder.typicode.com/users';

export const sendRequest = async (url: string, options?: object) => {
    try {
        let response = await fetch(url, options);
        if (response.ok) {
            let json = await response.json();
            return {
                data: json,
                error: ''
            }
        } else {
            throw new Error("Ошибка HTTPS: " + response.status);
        }
    } catch(error) {
        return {
            data: null,
            error: (error as Error).message
        }
    }
};
