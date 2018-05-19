/*
 ДЗ 7 - Создать редактор cookie с возможностью фильтрации

 7.1: На странице должна быть таблица со списком имеющихся cookie. Таблица должна иметь следующие столбцы:
   - имя
   - значение
   - удалить (при нажатии на кнопку, выбранная cookie удаляется из браузера и таблицы)

 7.2: На странице должна быть форма для добавления новой cookie. Форма должна содержать следующие поля:
   - имя
   - значение
   - добавить (при нажатии на кнопку, в браузер и таблицу добавляется новая cookie с указанным именем и значением)

 Если добавляется cookie с именем уже существующией cookie, то ее значение в браузере и таблице должно быть обновлено

 7.3: На странице должно быть текстовое поле для фильтрации cookie
 В таблице должны быть только те cookie, в имени или значении которых, хотя бы частично, есть введенное значение
 Если в поле фильтра пусто, то должны выводиться все доступные cookie
 Если дабавляемая cookie не соответсвуте фильтру, то она должна быть добавлена только в браузер, но не в таблицу
 Если добавляется cookie, с именем уже существующией cookie и ее новое значение не соответствует фильтру,
 то ее значение должно быть обновлено в браузере, а из таблицы cookie должна быть удалена

 Запрещено использовать сторонние библиотеки. Разрешено пользоваться только тем, что встроено в браузер
 */

/*
 homeworkContainer - это контейнер для всех ваших домашних заданий
 Если вы создаете новые html-элементы и добавляете их на страницу, то дабавляйте их только в этот контейнер

 Пример:
   const newDiv = document.createElement('div');
   homeworkContainer.appendChild(newDiv);
 */
const homeworkContainer = document.querySelector('#homework-container');
// текстовое поле для фильтрации cookie
const filterNameInput = homeworkContainer.querySelector('#filter-name-input');
// текстовое поле с именем cookie
const addNameInput = homeworkContainer.querySelector('#add-name-input');
// текстовое поле со значением cookie
const addValueInput = homeworkContainer.querySelector('#add-value-input');
// кнопка "добавить cookie"
const addButton = homeworkContainer.querySelector('#add-button');
// таблица со списком cookie
const listTable = homeworkContainer.querySelector('#list-table tbody');

// Возвращает массив объектов cookie вида {name: cookieName, value: cookieValue}
const getCookies = () => {
    let cookies = document.cookie;

    if (!cookies) {
        return null;
    }

    cookies = document.cookie.split('; ').reduce((prev, current) => {
        let [name, value] = current.split('=');

        prev.push({
            name,
            value
        });

        return prev;
    }, []);

    return cookies;
};

// Функция фильтрации
const isMatching = (full, chunk) => (full.toUpperCase().indexOf(chunk.toUpperCase()) >= 0);

// Фильтрует cookies по значению filterNameInput
const filterCookie = () => {
    let filterValue = filterNameInput.value;
    let cookies = getCookies();

    if (filterValue) {
        cookies = cookies.filter(cookie => {
            return isMatching(cookie.name, filterValue) || isMatching(cookie.value, filterValue);
        });
    }

    return cookies;
};

// Добавляет строку с cookie в таблицу.
const addRowToCookieTable = (cookieName, cookieValue) => {
    if (arguments.length === 0) {
        return;
    }

    let tableRow = document.createElement('tr');
    let nameCell = document.createElement('td');
    let valueCell = document.createElement('td');
    let removeCell = document.createElement('td');
    let removeButton = document.createElement('button');

    nameCell.textContent = cookieName;
    valueCell.textContent = cookieValue;
    removeButton.textContent = 'Удалить';

    removeCell.appendChild(removeButton);
    tableRow.appendChild(nameCell);
    tableRow.appendChild(valueCell);
    tableRow.appendChild(removeCell);

    removeButton.addEventListener('click', () => {
        document.cookie = `${cookieName} = ${cookieValue}; expires = ${new Date(-1)}`;
        refreshCookieTable();
    });

    listTable.appendChild(tableRow);
};

// Обновляет таблицу с cookie
const refreshCookieTable = (cookiesArr) => {
    let cookies = cookiesArr || getCookies();

    listTable.innerHTML = null;

    if (!cookies) {
        return;
    }

    for (let cookie of cookies) {
        let name = cookie.name;
        let value = cookie.value;

        addRowToCookieTable(name, value);
    }
};

// Обработка нажатия на клавиши внутри текстового поля для фильтрации cookie
filterNameInput.addEventListener('keyup', function() {
    listTable.innerHTML = null;

    let cookies = filterCookie();

    refreshCookieTable(cookies);
});

// Обработатка нажатия на кнопку "добавить cookie"
addButton.addEventListener('click', () => {
    document.cookie = `${addNameInput.value} = ${addValueInput.value}`;

    let cookies = filterCookie();

    refreshCookieTable(cookies);

    addNameInput.value = '';
    addValueInput.value = '';
});

