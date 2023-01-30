const itemsModelsGet = require('../models/itemModelsGet');

const getAllItems = async (request, response) => {
    const items = await itemsModelsGet.getAllItems();
    return response.status(200).json(items);
};

module.exports = {
    getAllItems,
};