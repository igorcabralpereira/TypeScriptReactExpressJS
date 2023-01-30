const usersModels = require('../models/authUserModels');
const jwtDecode = require('jwt-decode');
const { LocalStorage } = require('node-localstorage');
const localStorage = new LocalStorage('./scratch');

const getAllUsers = async (request, response) => {
    const users = await usersModels.getAllUsers();
    return response.status(200).json(users);
};

const createUser = async (request, response) => {
    const createUser = await usersModels.createUser(request.body);
    return response.status(201).json(createUser);
};

const userAccessToken = async (request, response) => {
    // recebendo token de access e refresh como objeto
    const users = await usersModels.authUser(request.body);

    const payload = jwtDecode(JSON.stringify(users));
    const user_id = JSON.parse(payload.user_id);
    const username = payload.username;

    localStorage.setItem(`access-token${user_id}-${username}`, JSON.stringify(users));
    localStorage.setItem('access-token', JSON.stringify(users));

    return response.status(201).json(users);
};

const userRefreshToken = async (request, response) => {
    // recebendo token de refresh como objeto
    const refreshToken = await usersModels.userRefreshToken(request.body);

    const payload = jwtDecode(JSON.stringify(refreshToken));
    const id = JSON.parse(payload.user_id);
    const username = payload.username;
    localStorage.setItem(`access-token${id}-${username}`, JSON.stringify(refreshToken));
    localStorage.setItem('access-token', JSON.stringify(refreshToken));

    return response.status(201).json(refreshToken);
};

module.exports = {
    getAllUsers,
    createUser,
    userAccessToken,
    userRefreshToken
};