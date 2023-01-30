const { LocalStorage } = require('node-localstorage');
const localStorage = new LocalStorage('./scratch');

const removeAccess = (request) => {
    const {body} = request;
    localStorage.removeItem(`access-token${body.id}-${body.username}`);
};

module.exports = {
    removeAccess
};