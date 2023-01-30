import { Category } from '../types/Category'

//expense: se for true, é uma despesa
//expense: se for false, é uma receita

//Não é um array, é um objeto de itens
export const categories: Category = {
    food: { title: 'Alimentação', color: 'blue', expense: true},
    rent: { title: 'Aluguel', color: 'brown', expense: true },
    salary: { title: 'Salário', color: 'green', expense: false },
    invoice: { title: 'Fatura', color: 'brown', expense: true },
    sendPix : { title: 'Enviar PIX', color: 'brown', expense: true },
    receivePix : { title: 'Receber PIX', color: 'green', expense: false }

}