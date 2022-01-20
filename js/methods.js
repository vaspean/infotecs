/*
    Запрос на user.json, возвращает объект с которым будем работать

*/
async function fetchUsers() {
    const response = await fetch('../users.json');
    const users = await response.json();
    return users;
}

/*
    Получение номера страницы по данным URLSearchParams.
    Если они есть, то возвращаем page из URLSearchParams, если нет, то возвращаем 1 (первая страница);
    На вход принимает количество страниц.
*/
function pageByURL(pagesCount) {
    const START_PAGE_NUMBER = 1;
    const paramsString = window.location.search;
    const searchParams = new URLSearchParams(paramsString);
    let currentPage;

    if (searchParams.get('page') === null || +searchParams.get('page') < 1 || +searchParams.get('page') > pagesCount) {
        currentPage = START_PAGE_NUMBER;
    } else {
        currentPage = +searchParams.get('page');
    }
    return currentPage;
}

/*
    Удаление всех элементов с классом user-row (строки таблицы,
     в которых ототбражается данные из объекта users)
*/
function clearTable() {
    const table = document.querySelector('.table__tbody');
    const userRow = document.querySelectorAll('.user-row');
    for (let i = 0; i < userRow.length; i++) {
        table.removeChild(userRow[i]);
    }
}

/*
    Функция для переотрисовки таблицы
    На вход принимает массив с объектами users и массив с теми колонками, которые свёрнуты.
*/
function updateTable(users, hiddenColumns) {
    // Очищаем таблицу
    clearTable();
    const tableBody = document.querySelector('.table__tbody');
    for (const user of users) {
        // Создаем все элементы и присваиваем им нужные классы и значения
        const tr = document.createElement('tr');
        const tdFirstName = document.createElement('td');
        const pFirstName = document.createElement('p');
        const tdLastName = document.createElement('td');
        const pLastName = document.createElement('p');
        const tdAbout = document.createElement('td');
        const pAbout = document.createElement('p');
        const tdEyeColor = document.createElement('td');
        tr.classList.add('user-row');
        tdFirstName.classList.add('first-name');
        tdLastName.classList.add('last-name');
        tdAbout.classList.add('about');
        tdEyeColor.classList.add('eye-color');
        pFirstName.innerHTML = user.name.firstName;
        pLastName.innerHTML = user.name.lastName;
        pAbout.innerHTML = user.about;
        tdEyeColor.style.backgroundColor = user.eyeColor;
        tableBody.appendChild(tr);
        tr.appendChild(tdFirstName);
        tdFirstName.appendChild(pFirstName);
        tr.appendChild(tdLastName);
        tdLastName.appendChild(pLastName);
        tr.appendChild(tdAbout);
        tdAbout.appendChild(pAbout);
        tr.appendChild(tdEyeColor);

        // Проверка, каким столбцам присвоим класс hidden при отрисовке таблицы. (какие столбцы содержит входной массив hiddenColumns)
        if (hiddenColumns.includes(1)) {
            pFirstName.classList.add('hidden');
        }
        if (hiddenColumns.includes(2)) {
            pLastName.classList.add('hidden');
        }
        if (hiddenColumns.includes(3)) {
            pAbout.classList.add('hidden');
        }
        if (hiddenColumns.includes(4)) {
            tdEyeColor.style.backgroundColor = 'white';
        }
    }

    // Поскольку при переотрисовке создались новые элементы в таблице, вешаем обработчики редактора при каждой переотрисовке.
    editorUpdate();
    // Сворачиваем thead и меняем tfoot в зависимости от того, что находится в hiddenColumns
    toggleTheadTfooterColumns(hiddenColumns);
}

/*
    Функция, которая возвращается кусок массива users, в зависимости от того, какая страинца и сколько users на странице
    На вход принимает массив users, страницу и значение users на страницу
*/
function usersByPage(users, page, usersByPage) {
    const offset = (page - 1) * usersByPage;
    return users.slice(offset, offset + usersByPage);
}

/*
    Функция перерисовки элементы пагинации. 
    На вход принимает текущую страницу и количество страниц
*/
function updatePaginationElements(currentPage, pageCount) {
    // Создаем все элементы и присваиваем им нужные классы, атрибуты и значения, а также вешаем обработчики.
    const paginationContainer = document.querySelector('.pagination');
    const previousPageButton = document.querySelector('.pagination__button_previous-page');
    const nextPageButton = document.querySelector('.pagination__button_next-page');
    for (let i = 1; i <= pageCount; i++) {
        const pageButton = document.createElement('button');
        pageButton.classList.add('pagination__button');
        pageButton.innerHTML = i;
        if (currentPage === i) {
            pageButton.classList.add('pagination__button_current-page');
        }
        pageButton.addEventListener('click', () => {
            paginate(i);
        })
        paginationContainer.insertBefore(pageButton, nextPageButton);
    }

    if (currentPage <= 1) {
        previousPageButton.setAttribute('disabled', 'disabled');
    }
    if (currentPage >= pageCount) {
        nextPageButton.setAttribute('disabled', 'disabled');
    }
}

/*
    Функция переадресации страницы. Создает searchParam page;
    На вход принимает текущую страницу.
*/
function paginate(currentPage) {
    document.location.href = `${window.location.pathname}?page=${currentPage}`;
}

/*
    Удаление активного класса у всех заголовков
*/
function clearAllHeaders() {
    let headers = document.querySelectorAll('.header');
    headers.forEach((item) => {
        item.classList.remove('header_active');
    })
}

/*
    Сортировка массива users по свойству name.firstName.
    На вход принимает объект users.
*/
function sortUsersByFirstName(users) {
    // Очищаем все активные классы
    clearAllHeaders();
    let headerFirstName = document.querySelector('.header_first-name');
    // Присваиваем активный класс заголовку "Имя"
    headerFirstName.classList.add('header_active');

    return users.sort((a, b) => {
        return a.name.firstName > b.name.firstName ? 1 : -1;
    })
}

/*
    Сортировка массива users по свойству name.lastName.
    На вход принимает объект users.
*/
function sortUsersByLastName(users) {
    // Очищаем все активные классы
    clearAllHeaders();
    let headerLastName = document.querySelector('.header_last-name');
    // Присваиваем активный класс заголовку "Фамилия"
    headerLastName.classList.add('header_active');

    return users.sort((a, b) => {
        return a.name.lastName > b.name.lastName ? 1 : -1;
    })
}

/*
    Сортировка массива users по свойству about.
    На вход принимает объект users.
*/
function sortUsersByDescription(users) {
    // Очищаем все активные классы
    clearAllHeaders();
    let headerAbout = document.querySelector('.header_about');
    // Присваиваем активный класс заголовку "Описание"
    headerAbout.classList.add('header_active');

    return users.sort((a, b) => {
        return a.about > b.about ? 1 : -1;
    })
}

/*
    Сортировка массива users по свойству eyeColor.
    На вход принимает объект users.
*/
function sortUsersByEyeColor(users) {
    // Очищаем все активные классы
    clearAllHeaders();
    let headerEyeColor = document.querySelector('.header_eye-color');
    // Присваиваем активный класс заголовку "Цвет глаз"
    headerEyeColor.classList.add('header_active');

    return users.sort((a, b) => {
        return a.eyeColor > b.eyeColor ? 1 : -1 ;
    })
}

/*
    Сохранение параметров сортировки для перезагрузки страницы. 
    (При перелистывании страницы параметры сортировки не сохраняются,
     было принято решение сохранять параметры в localStorage)
    На вход принимает параметр сортировки в виде строкового значения.
*/
function saveSortParams(sortBy) {
    localStorage.setItem('sort', sortBy);
}

/*
    Функция добавления номера столбца в массив, в котором хранятся свёрнутые столбцы, или удаление его если столбец уже находится в массиве.
    На вход принимает номер столбца и массив со свёрнутыми столбцами.
*/
function hideColumn(numberOfColumn, hiddenColumns) {
    if (!hiddenColumns.includes(numberOfColumn)) {
        hiddenColumns.push(numberOfColumn);
    } else {
        hiddenColumns.splice(hiddenColumns.indexOf(numberOfColumn), 1);
    }
}

/*
    Сворачивание и разворачивание tfoot при нажании на "Свернуть" (Замена 'Свернуть' на '...' и наоборот.);
    На вход принимает массив со свёрнутыми столбцами.
*/
function toggleTheadTfooterColumns(hiddenColumns) {
    const headers = document.querySelectorAll('.header');
    const footers = document.querySelectorAll('.table__hide-btn');
    const numberOfColumns = headers.length;
    for (let i = 1; i <= numberOfColumns; i++) {
        if (hiddenColumns.includes(i)) {
            headers[i - 1].firstElementChild.classList.add('hidden');
            footers[i - 1].firstElementChild.textContent = '...';
        } else {
            headers[i - 1].firstElementChild.classList.remove('hidden');
            footers[i - 1].firstElementChild.textContent = 'Свернуть';
        }
    }
}

/*
    Удаление всех элементов в форме редактора.
*/
function clearEditorForm() {
    const editorForm = document.querySelector('.editor__form');
    while (editorForm.firstChild) {
        editorForm.removeChild(editorForm.firstChild)
    }
}

/*
    Создание элементов для редактирования выбранного имени.
    На вход принимает элемент DOM ячейки выбранного имени (в виде объекта).
*/
function editorFirstName(item) {
    // Очистка формы
    clearEditorForm();
    // Создание необходимых элементов, добавления классов, значений и аттрибутов.
    const editorForm = document.querySelector('.editor__form');
    const label = document.createElement('label');
    const input = document.createElement('input');
    const button = document.createElement('button');
    label.textContent = 'Имя:';
    input.value = item.children[0].textContent;
    button.textContent = 'Сохранить';
    editorForm.append(label);
    label.append(input);
    editorForm.append(button);
    // Добавление обработчика на кнопку
    editorSetTextButton(button, item, input);
}

/*
    Создание элементов для редактирования выбранной фамилии.
    На вход принимает элемент DOM ячейки выбранной фамилии (в виде объекта).
*/
function editorLastName(item) {
    // Очистка формы
    clearEditorForm();
    // Создание необходимых элементов, добавления классов, значений и аттрибутов.
    const editorForm = document.querySelector('.editor__form');
    const label = document.createElement('label');
    const input = document.createElement('input');
    const button = document.createElement('button');
    label.textContent = 'Фамилия:';
    input.value = item.children[0].textContent;
    button.textContent = 'Сохранить';
    editorForm.append(label);
    label.append(input);
    editorForm.append(button);
    // Добавление обработчика на кнопку
    editorSetTextButton(button, item, input);
}

/*
    Создание элементов для редактирования выбранного описания.
    На вход принимает элемент DOM ячейки выбранного описания (в виде объекта).
*/
function editorAbout(item) {
    // Очистка формы
    clearEditorForm();
    // Создание необходимых элементов, добавления классов, значений и аттрибутов.
    const editorForm = document.querySelector('.editor__form');
    const label = document.createElement('label');
    const textArea = document.createElement('textArea');
    const button = document.createElement('button');
    label.textContent = 'Описание:';
    textArea.value = item.children[0].textContent;
    textArea.setAttribute('rows', '5');
    button.textContent = 'Сохранить';
    editorForm.append(label);
    label.append(textArea);
    editorForm.append(button);
    // Добавление обработчика на кнопку
    editorSetTextButton(button, item, textArea);
}

/*
    Создание элементов для редактирования выбранного цвета глаз.
    На вход принимает элемент DOM ячейки выбранного цвета глаз (в виде объекта).
*/
function editorEyeColor(item) {
    // Очистка формы
    clearEditorForm();
    // Создание необходимых элементов, добавления классов, значений и аттрибутов.
    const editorForm = document.querySelector('.editor__form');
    const label = document.createElement('label');
    const input = document.createElement('input');
    const button = document.createElement('button');
    label.textContent = 'Цвет глаз:';
    input.setAttribute('type', 'color');
    // При клике на цвет глаз в таблице, в редакторе отображается изначально черный цвет,
    // а не тот, что в таблице. Это можно было бы реализовать с помощью setAttribute('value', 'color') для input[color]
    // Однако value определяет цвет лишь в HEX формате, когда как в объекте цвета приходят в формате слова.
    button.textContent = 'Сохранить';
    editorForm.append(label);
    label.append(input);
    editorForm.append(button);
    // Добавление обработчика на кнопку
    editorSetColorButton(button, item, input);
}

/*
    Добавление обработчика на кнопку редактирования текстового значения.
    На вход принимает элемент DOM кнопки (в виде объекта), элемент DOM ячейки выбранного значения
    и input, для связывания значения input и выбранного текстового значения.
*/
function editorSetTextButton(btn, item, input) {
    btn.addEventListener('click', () => {
        // Присваиваем текстовому значению выбранного элемента value input'а. (children[0] потому что внутри ячейки находится 1 текстовый тег)
        item.children[0].innerText = input.value;
        // Очистка формы
        clearEditorForm();
        // После нажатия на кнопку, помимо моментального отображения изменения в таблице (реализовано в данной программе), скорее всего 
        // подразумевается отправка на сервер: при перезагрузке странице или перелистывании с помощью кнопок пагинации измененные значения не сохраняются.
        // Это решается отправкой измененного значения на сервер или сохранение в localStorage (не реализовано в данной программе)
        console.log('Отправляю запрос на сервер для изменения данных')
    })
}

/*
    Добавление обработчика на кнопку редактирования цвета.
    На вход принимает элемент DOM кнопки (в виде объекта), элемент DOM ячейки выбранного значения
    и input, для связывания значения input и выбранного цвета.
*/
function editorSetColorButton(btn, item, input) {
    btn.addEventListener('click', () => {
        // Присваиваем цвету выбранного элемента value input'а.
        item.style.backgroundColor = input.value;
        // Очистка формы
        clearEditorForm();
        // После нажатия на кнопку, помимо моментального отображения изменения в таблице (реализовано в данной программе), скорее всего 
        // подразумевается отправка на сервер: при перезагрузке странице или перелистывании с помощью кнопок пагинации измененные значения не сохраняются.
        // Это решается отправкой измененного значения на сервер или сохранение в localStorage (не реализовано в данной программе)
        console.log('Отправляю запрос на сервер для изменения данных')
    })
}

/*
    Переопределение элементов, при нажатии на которые осуществляется редактирование. 
    Необходимо, так как при перерисовке таблицы, например при сортировке, элементы пересоздаются
    и обработчки спадают.  
*/
function editorUpdate() {
    const firstNameValues = document.querySelectorAll('.first-name');
    const lastNameValues = document.querySelectorAll('.last-name');
    const aboutValues = document.querySelectorAll('.about');
    const eyeColorValues = document.querySelectorAll('.eye-color');

    //Вешаем обработчики на все созданные элементы в таблице для возможности их редактирования
    firstNameValues.forEach((item) => {
        item.addEventListener('click', () => {
            editorFirstName(item);
        })
    })

    lastNameValues.forEach((item) => {
        item.addEventListener('click', () => {
            editorLastName(item);
        })
    })

    aboutValues.forEach((item) => {
        item.addEventListener('click', () => {
            editorAbout(item);
        })
    })

    eyeColorValues.forEach((item) => {
        item.addEventListener('click', () => {
            editorEyeColor(item);
        })
    })
}