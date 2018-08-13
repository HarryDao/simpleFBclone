const TOKEN_KEY='token';

class LS {
    getToken = () => {
        return localStorage.getItem(TOKEN_KEY);
    }

    setToken = (token) => {
        localStorage.setItem(TOKEN_KEY, token);
    }

    deleteToken = () => {
        localStorage.removeItem(TOKEN_KEY);
    }

    createAuthHeader = (token) => {
        return {
            headers: {
                authorization: token || this.getToken()
            }
        }
    }
}

export default new LS();
