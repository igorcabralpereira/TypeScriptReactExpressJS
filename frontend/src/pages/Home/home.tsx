import { useContext, useEffect, useState } from 'react';
import * as C from '../../App.styles';
import { TableArea } from '../../components/TableArea';
import { InfoArea } from '../../components/InfoArea';
import { InputArea } from '../../components/InputArea';
import { Item } from '../../types/Item';
import { categories } from '../../data/categories';
import {
    getCurrentMonth,
    filteredListByMonth,
    parseDateFromServer,
    parseValueFromServer
} from '../../helpers/dateFilter';
import { variables } from '../../Variables';
import { AuthContext } from '../../contexts/Auth/AuthContext';


export const HomePage = () => {

    const [list, setList] = useState<Item[]>([]);
    const [filteredList, setFilteredList] = useState<Item[]>([]);
    const [currentMonth, setCurrentMonth] = useState(getCurrentMonth());
    const [income, setIncome] = useState(0);
    const [expense, setExpense] = useState(0);

    const auth = useContext(AuthContext)
    //const storageData = JSON.parse(localStorage.getItem('authToken'));

    // A função a seguir retorna dados vinda do backend(Django) no formato JSON.
    // Esta é uma requisição assincrona do tipo GET para retorno de dados do backend.
    // Será monitorado e atualizado a lista caso houver novas informações vinda do backend.
    useEffect(() => {
        const getItems = async () => {
            //const res = await api.get('item/');
            const response = await fetch(variables.API_URL + 'api/item/', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + String(auth.authToken?.access)
                }
            })

            const data = await response.json();
            //console.log(data) este console mostra as informações atuais vinda do servidor backend

            // função para utilizar dados reais como Date e Value.
            const parsedData: Item[] = await data.map(
                (x: any) =>
                ({
                    ...x,

                    // Foi criado esta função onde retorna uma Date String(JSON)
                    // vinda do backend para um Object Date: new Date().
                    // Somente com tipo Date podemos trabalhar com
                    // funções como: GetFullYear, GetDate, GetMonth...
                    date: parseDateFromServer(x.date),

                    // Foi criado esta função para retornar um Valor do tipo String(JSON)
                    // vinda do backend para um Valor do tipo Float
                    value: parseValueFromServer(x.value)

                } as Item)
            );

            //console.log(parsedData) // este console mostra as informações atuais apos atualização

            // Inicializa a lista para atualizar as informações.
            if (response.status === 200 || response.status === 201) {
                setList(parsedData)
            } else if (response.statusText === 'Unauthorized') {
                auth.signout()
            }

            //return parsedData;

        };

        getItems();
    }, []);


    // Se houver dados no mês atual ou mês(Anterior/Proximo), o useEffect irá monitorar a mudança e
    // atualizar os dados da lista de acordo com o mês atual ou filtrado.
    useEffect(() => {
        setFilteredList(filteredListByMonth(list, currentMonth));
    }, [list, currentMonth]);

    // monitorando as mudanças apos criação de uma nova informação na lista
    // e soma a receita ou a despesa pela categoria.
    useEffect(() => {
        let incomeCount = 0;
        let expenseCount = 0;
        //expense: se for true, é uma despesa
        //expense: se for false, é uma receita

        for (let i in filteredList) {

            // se a categoria for uma despesa(expense=True), então
            // será somado a quantidade de despesa.

            // categoria filtrada de acordo com a tipagem criada em "categories.ts".
            // expense é verificado de acordo com a categoria definida com:
            // food, rent , salary e etc.. (os tipos são estaticos)
            if (categories[filteredList[i].category].expense) {
                expenseCount += filteredList[i].value;
            } else {

                // se não, será somado a quantidade de receita(expense=false)
                incomeCount += filteredList[i].value;
            }
        }

        setIncome(incomeCount);
        setExpense(expenseCount);
    }, [filteredList]);


    //Função para atualizar/setar o mês(Anterior/atual/Proximo)
    const handleMonthChange = (newMonth: string) => {
        setCurrentMonth(newMonth);
    }

    //atualizando a lista apos o cadastro
    const handleAddItem = (item: Item) => {
        let newList = [...list];
        newList.push(item);
        setList(newList);
    }


    return (
        <C.Container>
            <C.Body>
                {/*  Area de Informação  */}
                <InfoArea
                    currentMonth={currentMonth}
                    onMonthChange={handleMonthChange}
                    income={income}
                    expense={expense}

                />

                {/*  Area de Inserção  */}
                <InputArea onAdd={handleAddItem} />

                {/*  Area de Tabela (Table Area) */}
                <TableArea list={filteredList} />

            </C.Body>
        </C.Container>
    );
}