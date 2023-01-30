const connection = require('../connection/connection');

const updateItems = async (req, res) => {
    const {id, date, category, title, user, value} = req.body;

    const query = 'UPDATE ItemApp_items SET date = ?, category = ?, value = ?, title = ?, user = ? WHERE id = ?';
    await connection.query(query, [date, category, value, title, user, id]);
    return res.status(201).json('Atualizado com sucesso!');

};

module.exports = {
    updateItems
};