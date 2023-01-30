const connection = require('../connection/connection');
const usersModels = require('../models/authUserModels');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const jwtDecode = require('jwt-decode');
const { LocalStorage } = require('node-localstorage');
const localStorage = new LocalStorage('./scratch');

require('dotenv').config();

const validateCreationUser= async (request, response, next) => {
    const {body} = request;

    if (body.username === undefined || body.username === ''){
        return response.status(400).json({message: 'Campo Username precisa ser preenchido!!'});
    }

    if (body.password === undefined || body.password === ''){
        return response.status(400).json({message: 'Campo Password precisa ser preenchida!!'});
    }

    // verificar se usuário existe no bd
    const verifyUserExist = 'SELECT * from auth_user where username=?';
    const [usernameDB] = await connection.query(verifyUserExist, [body.username]);

    //se não existe usuário, pode prosseguir
    if(usernameDB[0] === undefined) {
        next();

    //se existe usuário, não pode prosseguir
    } else if (usernameDB[0].username === body.username)  {
        return response.status(400).json({message: 'Usuário já existe!'});
    }

};

const validateUser = async (request, response, next) => {
    const {body} = request;
    //console.log(body);

    //Buscando o username no banco de dados de Usuários!
    const verifyPassUser = 'SELECT * from auth_user where username=?';
    const [usernameDB] = await connection.query(verifyPassUser, [body.username]);

    // verificando se existe dados do usuário pela consulta da query!
    if(usernameDB[0] === undefined) {
        return response.status(400).json({message: 'Usuário não existe!'});
    }

    // Se existe informação inserida em username e password, verificar =>
    // por primeiro se o username é valido. Se o username for valido e existe no =>
    // banco de dados, faço a comparação com o dado inserido em password(request) =>
    // e com o password do banco de dados(password hash).
    if (body.username && body.password){

        const verify = await bcrypt.compare(body.password, usernameDB[0].password);

        if (verify === false) {
            return response.status(400).json({message: 'Senhas não conferem com o banco de dados!'});
        }

    } else {
        return response.status(400).json({message: 'Usuário inválido!'});
    }

    next();

};

const checkToken = async (request, response, next) => {
    const users = await usersModels.authUser(request.body);

    // acessando o token de acesso dentro do objeto de users
    const access = users.access;

    if (!users){
        console.log('Token Inválido');
        return response.status(406).json('Unauthorized');
    }
    if (users) {

        const accessToken = access;
        const payload = jwtDecode(accessToken);
        const user_id = JSON.parse(payload.user_id);
        const username = payload.username;

        const secret_access = process.env.SECRET_ACCESS;
        jwt.verify(access, secret_access, (err, user) => {
            if(err){
                console.log('Token de acesso expirou:', err.expiredAt);
                localStorage.removeItem(`access-token${user_id}-${username}`);
                return response.status(406).json('Unauthorized');
            } else {
                // resultado final de toda essa verificação!
                request.user = user;
                next();

            }

        });
    }

};

const checkTokenRefresh = (request, response, next) => {
    const {refresh} = request.body;
    //console.log(refresh);

    if (!refresh){
        console.log('Token refresh não existe (Undefined)');
        return response.status(406).json('Unauthorized');
    }

    if (refresh) {
        //const TokenStorage = JSON.parse(localStorage.getItem('access-token') ?? null );
        const refreshToken = refresh;
        const payload = jwtDecode(refreshToken);
        const user_id = JSON.parse(payload.user_id);
        const username = payload.username;

        const secret_refresh = process.env.SECRET_REFRESH;
        jwt.verify(refresh, secret_refresh, (err, user) => {

            if(err){
                console.log('Token do refresh expirou:', err.expiredAt);
                localStorage.removeItem(`access-token${user_id}-${username}`);
                return response.status(406).json('Unauthorized');
            } else {
                request.user = user;
                next();
            }

        });
    }

};

module.exports = {
    validateCreationUser,
    validateUser,
    checkToken,
    checkTokenRefresh
};