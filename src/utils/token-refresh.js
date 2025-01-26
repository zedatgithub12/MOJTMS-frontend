import Connections from 'api';

export const RefreshToken = async () => {
    var Api = Connections.api + Connections.refresh_token;
    const token = sessionStorage.getItem('token');

    fetch(Api, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(token)
    })
        .then((response) => response.json())
        .then((response) => {
            if (response.success) {
                const ttl = new Date(response.expires_in * 1000); // TTL in seconds
                const expirationTime = ttl.getTime();
                sessionStorage.setItem('token', response.token);
                sessionStorage.setItem('tokenExpiration', expirationTime);
            }
        })
        .catch((error) => {
            console.log(error);
        });
};
