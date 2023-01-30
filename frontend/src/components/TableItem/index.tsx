import * as C from './styles'
import { Item } from '../../types/Item';
import { formatDate, moneyMask } from '../../helpers/dateFilter';
import { categories } from '../../data/categories';
import { useState, ReactNode, useContext, ChangeEvent } from 'react';
import { Modal, ModalBody } from "reactstrap";
import {variables} from '../../Variables'
import { AuthContext } from '../../contexts/Auth/AuthContext';
import swal from 'sweetalert';

type Props = {
    item: Item
}

type ModalType = {
    children?: JSX.Element[] | ReactNode;
    isOpen: boolean;
    toggle: () => void;
}

const MyModal = ({children, isOpen, toggle }: ModalType ) => (
    <Modal isOpen={isOpen} toggle={toggle}>
        <ModalBody>{children}</ModalBody>
    </Modal>
);

export const TableItem = ({ item }: Props) => {

    const auth = useContext(AuthContext)
    //const navigate = useNavigate()

    const [dateField, setDateField] = useState(item.date.toJSON().substr(0, 10));
    const [categoryField, setCategoryField] = useState(item.category);
    const [titleField, setTitleField] = useState(item.title);
    const [valueField, setValueField] = useState(item.value);
    const [isOpen, setIsOpen] = useState(false);
    const toggle = () => setIsOpen(!isOpen);
    const toggleClose = () => (
        setDateField(item.date.toJSON().substr(0, 10)),
        setCategoryField(item.category),
        setTitleField(item.title),
        setValueField(item.value),
        setIsOpen(!isOpen)
    );

    const handleDateInput = (e: ChangeEvent<HTMLInputElement>) => {
        //console.log(e.target.value);
        setDateField(e.target.value);
    }

    const handleCategorySelect = (e: ChangeEvent<HTMLSelectElement>) => {
        //console.log(e.target.value);
        setCategoryField(e.target.value);
    }

    const handleTitleInput = (e: ChangeEvent<HTMLInputElement>) => {
        //console.log(e.target.value);
        setTitleField(e.target.value);
    }

    const handleValueInput = (e: ChangeEvent<HTMLInputElement>) => {
        setValueField(parseFloat(e.target.value));
    }

    let categoryKeys: string[] = Object.keys(categories);
    //console.log(categoryKeys);

    const handleUpdateEvent = () => {
        let errors: string[] = [];
        //console.log(errors);

        if (isNaN(new Date(dateField).getTime())) {
            errors.push('Data inválida!');
        }
        if (!categoryKeys.includes(categoryField)) {
            errors.push('Categoria inválida!');
        }
        if (titleField === '') {
            //console.log(titleField);
            errors.push('Título vazio!');
        }
        if (valueField <= 0 || !valueField) {
            //console.log(valueField);
            errors.push('Valor inválido!');
        }

        if (errors.length > 0) {
            alert(errors.join("\n"));
        }

        else {

            // Atualizar registro de um Item
            fetch(variables.API_URL + 'api/item/', {
                method: 'PUT',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + String(auth.authToken?.access)
                },

                body: JSON.stringify({
                    id: item.id,
                    date: dateField,
                    category: categoryField,
                    title: titleField,
                    user: auth.user?.user_id,
                    value: valueField.toString()
                })

            })
                .then(res => res.json())
                .then((result) => {

                    swal({
                        title: "Atualizado",
                        text: result,
                        icon: "success",
                        dangerMode: false,
                        closeOnClickOutside: false
                    });

                    setTimeout(() => {
                        window.location.reload();
                    }, 1500)


                }, (error) => {
                    alert('Failed');
                })

        }
    }


    const handleDeleteEvent = () => {
        let r = window.confirm("Tem certeza que deseja deletar este item?");

        if (r === true){

             // Deletar registro de um Item
            fetch(variables.API_URL + 'api/item/', {
                method: 'DELETE',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + String(auth.authToken?.access)
                },

                body: JSON.stringify({
                    id: item.id,
                })

            })
                .then(res => res.json())
                .then((result) => {

                    swal({
                        title: "Deletado",
                        text: result,
                        icon: "warning",
                        dangerMode: true,
                        closeOnClickOutside: false
                    });

                    setTimeout(() => {
                        window.location.reload();
                    }, 1500)

                }, (error) => {
                    alert('Failed');
                })

        } else {
            alert("Ação cancelada !");
            return false;
        }
    }

    return (
        <C.TableLine>
            <C.TableColumn>{formatDate(new Date(item.date))}</C.TableColumn>
            <C.TableColumn>
                <C.Category color={categories[item.category].color}>
                    {categories[item.category].title}
                </C.Category>
            </C.TableColumn>
            <C.TableColumn>
                <C.Title>
                    {item.title}
                </C.Title>
            </C.TableColumn>
            <C.TableColumn>
                <C.Value color={categories[item.category].expense ? 'red' : 'green'}>
                    {moneyMask(item.value.toString())}
                </C.Value>
            </C.TableColumn>

            <C.TableColumn>
                <C.ButtonUpdate  onClick={toggle}>
                    Up
                </C.ButtonUpdate>
                <C.ButtonDelete  onClick={handleDeleteEvent}>
                    Del
                </C.ButtonDelete>
                <MyModal isOpen={isOpen} toggle={toggle}>
                    <ModalBody>

                        {/*  Data */}
                        <C.InputTitle>Data</C.InputTitle>
                        <input type="date" className='form-control' defaultValue={item.date.toJSON().substr(0, 10)} onChange={handleDateInput} /> <br/>

                        {/*  Categoria */}
                        <C.InputTitle>Categoria (Opções abaixo caso queira atualizar) ⬇️</C.InputTitle>
                        <select defaultValue={item.category} className='form-control'      onChange={handleCategorySelect}>
                            {categoryKeys.map((key, index) => (
                            <option key={index} value={key} >
                                {categories[key].title}
                            </option>
                            ))}
                        </select> <br/>

                        {/*  Título */}
                        <C.InputTitle>Título</C.InputTitle>
                        <input type="text" className='form-control' defaultValue={item.title} onChange={handleTitleInput} /> <br/>

                        {/*  Valor */}
                        <C.InputTitle>Valor</C.InputTitle>
                        <input  type="number" className='form-control' defaultValue={item.value} onChange={handleValueInput} /> <br/>

                    </ModalBody>
                    &nbsp; &nbsp;
                    <button className='btn btn-secondary' onClick={toggleClose}>Close</button>
                    &nbsp; &nbsp;
                    <button className='btn btn-primary' onClick={handleUpdateEvent}>Update</button>
                </MyModal>
            </C.TableColumn>

        </C.TableLine>
    );
}