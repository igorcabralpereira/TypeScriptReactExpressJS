const validateItems = (request, response, next) => {
    const {body} = request;
    //console.log('Validação do Item', body);

    if (body.date === undefined || body.date === ''){
        return response.status(400).json({message: 'Campo Data precisa ser preenchido!!'});
    }

    if (body.category === undefined || body.category === ''){
        return response.status(400).json({message: 'Campo Categoria precisa ser preenchido!!'});
    }

    if (body.value === undefined || body.value === ''){
        return response.status(400).json({message: 'Campo Valor precisa ser preenchido!!'});
    }

    if (body.title === undefined || body.title === ''){
        return response.status(400).json({message: 'Campo Titulo precisa ser preenchido!!'});
    }

    next();
};

module.exports = {
    validateItems
};