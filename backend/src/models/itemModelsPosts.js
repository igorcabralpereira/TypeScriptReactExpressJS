const connection = require('../connection/connection');

const createItems = async (req, res) => {
    const {date, category, title, user, value} = req.body;

    const query = 'INSERT INTO ItemApp_items(date, category, value, title, user) VALUES (?,?,?,?,?)';
    await connection.query(query, [date, category, value, title, user]);
    return res.status(201).json('Criado com sucesso!');

};

module.exports = {
    createItems,
};