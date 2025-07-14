const apiCallWithAuth = async (url, method) => {
    const accessToken = getAccessToken();
    let headers = new Headers();
    headers.append("Content-Type", "application/json");
    headers.append("Authorization", `Bearer ${accessToken}`);
    const requestOptions = {
        method: method,
        headers: headers,
        redirect: "follow",
    };
    return await fetch(url, requestOptions)
        .then((response) => response.json())
        .then((result) => {
            return result;
        })
        .catch((error) => console.log("error: ", error));
};

export const chatWithGPT = (text) => {
    const url = `${WEB_URI}/api/v1/pvp/user-game-score/?game_slug=${game_slug}`;
    const response = await apiCallWithAuth(url, "GET");
    if (response?.code !== 200) return false;
    return response.data;
}

export const chatWithDeepSeek = (text) => {
    const url = `${WEB_URI}/api/v1/pvp/user-game-score/?game_slug=${game_slug}`;
    const response = await apiCallWithAuth(url, "GET");
    if (response?.code !== 200) return false;
    return response.data;
}