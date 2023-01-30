const connection = require('../connection/connection');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { SECRET_ACCESS, SECRET_REFRESH } = process.env;


const getAllUsers = async () => {
    const [users] = await connection.query('SELECT * FROM auth_user');
    return users;
};

const createUser = async (user) => {
    const {username, password} = user;

    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(password, salt);

    const query = 'INSERT INTO auth_user(username, password) VALUES (?,?)';
    const [createUser] = await connection.query(query, [username, passwordHash]);
    return {insertId: createUser.insertId}; //somente para verificar o id criado no insert

};

const authUser = async (users) => {

    const {username} = users;

    //console.log('cheguei até aqui no authUser:', username);

    const verifyUser = 'SELECT * from auth_user where username=?';
    const [usernameDB] = await connection.query(verifyUser, [username]);

    //console.log('Fiz a consulta pelo username:', usernameDB);

    const query = 'SELECT id, username from auth_user where username=? and password=?';
    const [user] = await connection.query(query, [username, usernameDB[0].password]);


    const secret_access = SECRET_ACCESS;
    const secret_refresh= SECRET_REFRESH;

    //Criando token de refresh do usuário
    const refresh = jwt.sign(
        {
            user_id: user[0].id,
            username: user[0].username
        },
        secret_refresh, { expiresIn:'600s', algorithm: 'HS256' } // 600s equivale a 10 min
        // refresh token quem deve te deslogar.
        // para manter a persistência por maior tempo, em expireIn
        // pode aumentar o tempo por exemplo: expiresIn:'1d'
        // apos 1 dia, será necessário fazer o login novamente.
    );

    //Criando token de access do usuário
    const access = jwt.sign(
        {
            user_id: user[0].id,
            username: user[0].username
        },
        secret_access, { expiresIn:'300s', algorithm: 'HS256' } // 5 min para expirar
    );

    return {refresh, access};

};

const userRefreshToken = (refreshToken) => {
    const {refresh} = refreshToken;

    const secret_refresh = SECRET_REFRESH;
    const payload = jwt.verify(refresh, secret_refresh);

    // Novo token de acesso disparado pelo token de atualização!
    const access = jwt.sign(
        {
            user_id: payload.user_id,
            username: payload.username
        },
        secret_refresh,
        {
            algorithm: 'HS256',
            expiresIn: '300s'
        }

    );

    return {refresh, access};
};


module.exports = {
    getAllUsers,
    createUser,
    authUser,
    userRefreshToken
};