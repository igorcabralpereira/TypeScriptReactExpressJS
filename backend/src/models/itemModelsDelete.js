const connection = require('../connection/connection');

const DeleteItems = async (req, res) => {
    const {id} = req.body;

    const query = 'DELETE FROM ItemApp_items WHERE id = ?';
    await connection.query(query, [id]);
    return res.status(201).json('Deletado com sucesso!');

};

module.exports = {
    DeleteItems
};