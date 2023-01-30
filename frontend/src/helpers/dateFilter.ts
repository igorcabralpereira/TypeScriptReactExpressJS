import {Item} from '../types/Item';


export const getCurrentMonth = () => {
    let now = new Date();
    return `${now.getFullYear()}-${now.getMonth()+1}`;
}

export const filteredListByMonth = (list: Item[], date:string): Item[] => {
    //retono de uma nova lista de um array de Item[]

    //tipar o newList com Item[]
    let newList: Item[] = [];
    let [year, month] = date.split('-');

    for(let i in list) {

      if(
        list[i].date.getFullYear() === parseInt(year) &&
        (list[i].date.getMonth() + 1) === parseInt(month)
    )   {
        //console.log(list[i])
        newList.push(list[i]);
        }
    }

    return newList;
}

export const formatDate = (date: Date): string => {
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();

    return `${addZeroToDate(day)}/${addZeroToDate(month)}/${year}`;
}
const addZeroToDate = (n: number): string => n < 10 ? `0${n}` : `${n}`;

export const formatCurrentMonth = (currentMonth: string): string => {
    let [year, month] = currentMonth.split('-');
    let months = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
    return `${months[parseInt(month) - 1]} de ${year}`;
}

export const newDateAdjusted = (dateField: string) => {
    let [year, month, day] = dateField.split('-')
    return new Date(parseInt(year), parseInt(month) - 1, parseInt(day))
}


export const moneyMask = (value: string) => {

    const result = parseFloat(value).toLocaleString('pt-BR',{ style: 'currency', currency: 'BRL' });
    //console.log(result)

    return result
  }

export const parseDateFromServer = (date: string): Date => {

    // esta resolução retorna uma conversão de timezone (00:00:00) para não haver
    //problemas com Fuso Horario local

    var convertdLocalTime = new Date(date);

    var hourOffset = convertdLocalTime.getTimezoneOffset() / 60;

    convertdLocalTime.setHours( convertdLocalTime.getHours() + hourOffset );

    return convertdLocalTime;


    // a resolução abaixo retorna uma nova Data com formato LocalTime Brasília(UTC-03:00) padrão
    // com timezone (pt-BR : 21:00:00). Padrao estados unidos é (en-US: 09:00:00).

   // if (date) {
   //     return typeof date === "string" ? new Date(date) : date;
   // }
   //
   // return null

    // em tsconfig.json, informe esta config: "strictNullChecks": false,
    // desta forma entende-se que pode ser retornada null ou undefined
}

export const parseValueFromServer = (value: string) => {

    if (value) {
        return typeof value === "string" ? parseFloat(value) : value;
    }

    return null

    // em tsconfig.json, informe esta config: "strictNullChecks": false,
    // desta forma entende-se que pode ser retornada null ou undefined
}


//export const formatDate = (date: string) => {
//
//    const dateFormated = new Date(date);
//    //console.log(dateFormated)
//
//    return `${dateFormated}`;
//}
//

