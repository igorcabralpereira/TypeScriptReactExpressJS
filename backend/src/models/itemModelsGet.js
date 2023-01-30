const connection = require('../connection/connection');
const jwtDecode = require('jwt-decode');
const { LocalStorage } = require('node-localstorage');

const localStorage = new LocalStorage('./scratch');
const TokenStorage = JSON.parse(localStorage.getItem('access-token') ?? null );
//console.log('TOKEN GERAL', TokenStorage);


// TOKEN GERAL - access-token
if(TokenStorage !== null){

    const refresh = TokenStorage?.refresh;
    const payload = jwtDecode(refresh);
    const user_id = JSON.parse(payload.user_id);
    const username = payload.username;

    //===========================================================================================

    // TOKEN USER - access-tokenid-username
    const TokenStorageUser = JSON.parse(localStorage.getItem(`access-token${user_id}-${username}`) ?? null );

    if(TokenStorageUser !== null){

        //Se o Token User não for null, verificar o tempo de expiração do access-tokenid-username!

        const refreshUser = TokenStorageUser?.refresh;
        const payloadUser = jwtDecode(refreshUser);
        const user_idUser = JSON.parse(payloadUser.user_id);
        const usernameUser = payloadUser.username;
        const expiredUser = JSON.parse(payloadUser.exp);
        const nowUser = Date.now().valueOf() / 1000;

        const getAllItems = async () => {
            //console.log('entrei no primeiro');
            if (expiredUser < nowUser) {
                //localStorage.removeItem('access-token');
                localStorage.removeItem(`access-token${user_idUser}-${usernameUser}`);
                return [];
            } else {

                //console.log('entrei no select user', user_idUser);
                const query = 'SELECT * FROM ItemApp_items where user = ? ORDER BY date';
                const [selectUser] = await connection.query(query, [user_idUser]);
                return selectUser;
            }
        };

        module.exports = {
            getAllItems,
        };

    } else {

        const getAllItems = async () => {
            //console.log('entrei no penultimo');
            return [];
        };

        module.exports = {
            getAllItems,
        };
    }

} else {

    const getAllItems = async () => {
        //console.log('entrei no ultimo');
        return [];
    };

    module.exports = {
        getAllItems,

    };

}

