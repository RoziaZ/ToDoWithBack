const BASE_URL = 'http://127.0.0.1:5501/tasks'
const inputEl = (document.getElementsByClassName('app__control__input'))[0] //создаем переменную для html элемента из index.html (поле ввода); происходит поиск и получение элемента 
//по классу, точнее элементов (происходит сохранение в виде массива), но т.к. у нас только 1 с таким классом, берем первый [0]
const btnEl = (document.getElementsByClassName('app__control__btn'))[0]/// тоже самое но для кнопки добавления
const listEl = (document.getElementsByClassName("app__list"))[0]/// div который будет хранить в себе все задачи

let counter = 1 //счетчик для задания id для каждой задачи 


// function loadData() { //функция для получения данных из loсаlStorage
//     const savedData = localStorage.getItem('tasks') //обращается к localStorage и пытается получить данные, сохраненные под ключом 'tasks'
//     return savedData ? JSON.parse(savedData) : [] //тернарный оператор который проверяет есть ли сохраненные данные
// }

let data =[] //содержит все таски которые были сохранены в массиве
//API

async function getItemsApi(){
    const res = await fetch(BASE_URL, {
        method: 'GET'
    })
    if (!res.ok){
        console.log("Чето пошло не так");
        return
        
    }
    data = await res.json()
}

async function createTaskApi(data){
    const res =await fetch(BASE_URL, {
        method: 'POST',
        body: JSON.stringify({
            text: data.text,
            isDone: data.isDone
        })
    })
    if (!res.ok){
        console.log("Чето пошло не так");
        return
        
    }
    console.log(res.json());
    

    return await res.json()
}


// async function createTaskApi(data) {
//     const res = await fetch(BASE_URL, {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json' // Убедитесь, что заголовок правильно установлен
//         },
//         body: JSON.stringify({
//             text: data.text,
//             isDone: data.isDone
//         })
//     });

//     if (!res.ok) {
//         console.log("Чето пошло не так");
//         return;
//     }

//     // Добавьте проверку на пустой ответ
//     const responseData = await res.text();
//     if (responseData) {
//         return JSON.parse(responseData); // Парасим данные только если они не пустые
//     }

//     throw new Error('Пустой ответ от сервера'); // Для отладки
// }







//APP
async function init() {

    await getItemsApi()

    render()
}




function deleteById(id) {//функция удаления элемента из массива
    
    // const idx = data.findIndex((i) => {
    //     return i.id === id
    // })
    // data.splice(idx, 1)
    
    // render()
    
    const index = data.findIndex(item => item.id === id)
    if (index !== -1) { 
        data.splice(index, 1) //Если задача найдена, она удаляется из массива
        // syncData()
        render()
    }
}

function changeStatus(id) { //обновляет статус задачи
    
    // const item = data.find((i) => {
    //     return i.id === id
    // })
    // item.isDone = !item.isDone
    
    // render()
    
    const task = data.find(item => item.id === id);

    if (task) {
        task.isDone = !task.isDone; //изменение статуса задачи (isDone) на противоположный
        // syncData()
        render()
    }
}


// Пока что уберу каунтер

// data.forEach((item) => {  ///перебирает каждый элемент массива data
//     if (item.id >= counter) { //нужно для того чтобы были разные id,  т.е. не повторялись
//         counter = item.id + 1;
//     }
// });


// function syncData(){//функция которая сохраненяет текущее состояние данных
//     localStorage.setItem('tasks', JSON.stringify(data))
//     render()
// }



function createTask(objectData){ ///создание таски
    const root = document.createElement('div')///строка задачи, на котором будет сам текст, чекбокс и кнопка удаления
    root.classList.add("app__list__item")//задаем ей класс

    if (objectData.isDone){//если isDone=== true, добавляем для таски новый класс, по которому потом можно правильно отобразить сделанную задачу
        root.classList.add('app__list-checkbox-done')
    }


    const chekinput = document.createElement('input')///кнопка чекбокс
    chekinput.classList.add("app__list-checkbox")
    chekinput.type = 'checkbox'//задаем тип чекбокса

    if (objectData.isDone){//если задача завершена, 
        chekinput.checked = true //ставим галочку
    }


    const txt = document.createElement('p')
    txt.classList.add("app_l_text")
    txt.innerText = objectData.text

    const btn = document.createElement('button')
    btn.classList.add("app__list__btn")

    const img = document.createElement('img')
    img.src = "vedro.png"
    img.alt = "удалить"

    btn.appendChild(img) 

    btn.addEventListener('click', (event)=> {
        event.stopPropagation();
        deleteById(objectData.id);
        // console.log(data);
        

    })

    root.addEventListener('click', () => changeStatus(objectData.id)); //при нажатии на задачу менятся ее статус, сделано/не сделано

    root.appendChild(chekinput)
    root.appendChild(txt)
    root.appendChild(btn)

    return root ///возвращаем готовую задачу
    
}






btnEl.addEventListener('click', async ()=>{ ///что происходит при нажатии Добавить:
    const textValue = inputEl.value///берет значение(value) из inputEl (т.е. текст из строки)
    if (textValue!=''){//если там действительно что-то написано
        const item = await createTaskApi({
            text: textValue,
            isDone: false
        })
        data.push(item)


    // const taskEl = createTask(textValue)///прогоняет полученный текст через нашу функцию, теперь taskEl содержит в себе одну задачу
    // listEl.appendChild(taskEl)//добавляет задачу в основной лист задач
        // syncData()
        inputEl.value=''
        render()
    }
    
})

// btnEl.addEventListener('click', async () => {
//     const textValue = inputEl.value; // Берем значение из поля ввода
//     if (textValue != '') { // Если строка не пустая
//         try {
//             const item = await createTaskApi({
//                 text: textValue,
//                 isDone: false
//             });
//             if (item) { // Проверяем, получили ли мы новый элемент
//                 data.push(item); // Добавляем элемент в массив задач
//                 render(); // Обновляем отображение задач
//             }
//         } catch (error) {
//             console.error('Ошибка при создании задачи:', error);
//         }
//     }
// });




function render(){//обновляет отображение на экране
    listEl.innerHTML=''
    for (let item of data){
        const tmpEl = createTask(item)
        // console.log(newTask);
        listEl.appendChild(tmpEl)
    }
}
// render();
init();