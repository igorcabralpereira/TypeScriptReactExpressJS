import { useState, useContext } from 'react';
import * as C from './styles';
import { Item } from '../../types/Item';
import { categories } from '../../data/categories';
import { variables } from '../../Variables';
import { parseDateFromServer } from '../../helpers/dateFilter'
import { AuthContext } from '../../contexts/Auth/AuthContext';
import swal from 'sweetalert';


type Props = {
    onAdd: (item: Item) => void;
};

export const InputArea = ({ onAdd }: Props) => {
    const [dateField, setDateField] = useState('');
    const [categoryField, setCategoryField] = useState('');
    const [titleField, setTitleField] = useState('');
    const [valueField, setValueField] = useState(0);

    //const storageData = JSON.parse(localStorage.getItem('authToken'));
    const auth = useContext(AuthContext)

    // auth.user por padrão vem como string, porem deve-se retornar um numero
    // inteiro para armazenar o user_id do banco de dados
    const userID = auth.user?.user_id

    let categoryKeys: string[] = Object.keys(categories);

    const handleAddEvent = () => {
        let errors: string[] = [];


        if (isNaN(new Date(dateField).getTime())) {
            errors.push('Data inválida!');
        }
        if (!categoryKeys.includes(categoryField)) {
            //console.log(categoryField);
            errors.push('Categoria inválida!');
        }
        if (titleField === '') {
            //console.log(titleField);
            errors.push('Título vazio!');
        }
        if (valueField <= 0) {
            //console.log(valueField);
            errors.push('Valor inválido!');
        }

        if (errors.length > 0) {
            alert(errors.join("\n"));
        }

        else {

            // Adicionar cadastro de um novo Item
            fetch(variables.API_URL + 'api/item/', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + String(auth.authToken?.access)
                },

                body: JSON.stringify({
                    date: dateField,
                    category: categoryField,
                    title: titleField,
                    user: userID,
                    value: valueField.toString()
                })

            })
                .then(res => res.json())
                .then((result) => {

                     // poderá levar informações via onAdd: Props
                    // para ser renderizado no home.tsx(Função handleAddItem).

                    // Porem se os dados reais vierem de um backend, o id ainda não existe
                    // no frontend.

                    // Ao renderizar o novo item na Lista atraves da função onAdd
                    // se tentar atualizar ou deletar algum item.. recebéra o error(failed)
                    // pois apenas foi renderizado as informações apenas no frontend,
		            // ainda precisa atualizar o navegador para que a lista receba o novo ID criado no backend da função getItems(onde faz a requisição do tipo GET)

                    onAdd({
                        id: null,
                        date: parseDateFromServer(dateField),
                        category: categoryField,
                        title: titleField,
                        user: userID,
                        value: valueField
                    })

                    swal({
                        title: "Registrado",
                        text: result,
                        icon: "success",
                        dangerMode: false,
                        closeOnClickOutside: false
                    });

                    setTimeout(() => {
                        window.location.reload();
                    }, 1500);

                }, (error) => {
                    alert('Failed');
                })


            clearFields();
        }
    }

    const clearFields = () => {
        setDateField('');
        setCategoryField('');
        setTitleField('');
        setValueField(0);
    }

    return (
        <C.Container>
            <C.InputLabel>
                <C.InputTitle>Data</C.InputTitle>
                <C.Input type="date" value={dateField} onChange={e => setDateField(e.target.value)} />
            </C.InputLabel>
            <C.InputLabel>
                <C.InputTitle>Categoria</C.InputTitle>
                <C.Select value={categoryField} onChange={e => setCategoryField(e.target.value)}>
                    <>
                        <option></option>
                        {categoryKeys.map((key, index) => (
                            <option key={index} value={key}>{categories[key].title}</option>
                        ))}
                    </>
                </C.Select>
            </C.InputLabel>
            <C.InputLabel>
                <C.InputTitle>Título</C.InputTitle>
                <C.Input type="text" value={titleField} onChange={e => setTitleField(e.target.value)} />
            </C.InputLabel>
            <C.InputLabel>
                <C.InputTitle>Valor</C.InputTitle>
                <C.Input type="number" value={valueField} onChange={e => setValueField(parseFloat(e.target.value))} />
            </C.InputLabel>
            <C.InputLabel>
                <C.InputTitle>&nbsp;</C.InputTitle>
                <C.Button onClick={handleAddEvent}>Adicionar</C.Button>
            </C.InputLabel>
        </C.Container>
    );
}