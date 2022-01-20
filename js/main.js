document.addEventListener('DOMContentLoaded', async () => {
    // Определяем количество users на страницу
    const USERS_PER_PAGE = 10;
    
    // Получаем объект users по fetch-запросу
    users = await fetchUsers();

    // Считаем количество страниц
    const pagesCount = Math.ceil(users.length / USERS_PER_PAGE);
    // Получаем текущую страницу
    let currentPage = pageByURL(pagesCount);

    // Отрисовываем пагинацию
    updatePaginationElements(currentPage, pagesCount);

    // Определяем массив для сворачивания столбцов
    const hiddenColumns = [];

    // Опрелеяем статические элементы, чтоб повесить на них обработчики
    const firstNameHeader = document.querySelector('.header_first-name');
    const lastNameHeader = document.querySelector('.header_last-name');
    const aboutHeader = document.querySelector('.header_about');
    const eyeColorHeader = document.querySelector('.header_eye-color');

    const firstNameHideBtn = document.querySelector('.table__hide-btn_first-name');
    const lastNameHideBtn = document.querySelector('.table__hide-btn_last-name');
    const aboutHideBtn = document.querySelector('.table__hide-btn_about');
    const eyeColorHideBtn = document.querySelector('.table__hide-btn_eye-color');

    const previousPageButton = document.querySelector('.pagination__button_previous-page');
    const nextPageButton = document.querySelector('.pagination__button_next-page');

    
    let sortedUsers = users;


    /*
        Сортировка таблицы по имени
    */    
    function sortTableByFirstName() {
        // Перересовываем таблицу, сортируя users по имени и отрисовывая только те users, которые должны быть на этой странице.
        updateTable(usersByPage(sortUsersByFirstName(users), currentPage, USERS_PER_PAGE), hiddenColumns);
        // Сохраняем параметры сортировки (по имени)
        saveSortParams('firstName');
    }

    /*
        Сортировка таблицы по фамилии
    */   
    function sortTableByLastName() {
        // Перересовываем таблицу, сортируя users по фамилии и отрисовывая только те users, которые должны быть на этой странице.
        updateTable(usersByPage(sortUsersByLastName(users), currentPage, USERS_PER_PAGE), hiddenColumns);
        // Сохраняем параметры сортировки (по фамилии)
        saveSortParams('lastName');
    }

    /*
        Сортировка таблицы по описанию
    */   
    function sortTableByDescription() {
        // Перересовываем таблицу, сортируя users по описанию и отрисовывая только те users, которые должны быть на этой странице.
        updateTable(usersByPage(sortUsersByDescription(users), currentPage, USERS_PER_PAGE), hiddenColumns);
        // Сохраняем параметры сортировки (по описанию)
        saveSortParams('about');
    }

    /*
        Сортировка таблицы по цвету
    */ 
    function sortTableByEyeColor() {
        // Перересовываем таблицу, сортируя users по цвету и отрисовывая только те users, которые должны быть на этой странице.
        updateTable(usersByPage(sortUsersByEyeColor(users), currentPage, USERS_PER_PAGE), hiddenColumns);
        // Сохраняем параметры сортировки (по цвету)
        saveSortParams('eyeColor');
    }

    /*
        Сворачивание столбца "Имя"
    */ 
    function hideFirstNameColumn() {
        // Сворачиваем (или раскрываем если уже свёрнут) столбец
        hideColumn(1, hiddenColumns);
        // Перерисовываем таблицу уже со скрытыми столбацми
        updateTable(usersByPage(sortedUsers, currentPage, USERS_PER_PAGE), hiddenColumns);
    }

    /*
        Сворачивание столбца "Фамилия"
    */ 
    function hideLastNameColumn() {
        // Сворачиваем (или раскрываем если уже свёрнут) столбец
        hideColumn(2, hiddenColumns);
        // Перерисовываем таблицу уже со скрытыми столбацми
        updateTable(usersByPage(sortedUsers, currentPage, USERS_PER_PAGE), hiddenColumns);
    }

    /*
        Сворачивание столбца "Описание"
    */ 
    function hideAboutColumn() {
        // Сворачиваем (или раскрываем если уже свёрнут) столбец
        hideColumn(3, hiddenColumns);
        // Перерисовываем таблицу уже со скрытыми столбацми
        updateTable(usersByPage(sortedUsers, currentPage, USERS_PER_PAGE), hiddenColumns);
    }

    /*
        Сворачивание столбца "Цвет глаз"
    */ 
    function hideEyeColorColumn() {
        // Сворачиваем (или раскрываем если уже свёрнут) столбец
        hideColumn(4, hiddenColumns);
        // Перерисовываем таблицу уже со скрытыми столбацми
        updateTable(usersByPage(sortedUsers, currentPage, USERS_PER_PAGE), hiddenColumns);
    }

    /*
        Переход на предыдущую страницу
    */ 
    function paginatePreviousPage() {
        if (currentPage > 1) {
            currentPage--;
            paginate(currentPage);
        }
    }

    /*
        Переход на следующую страницу
    */
    function paginateNextPage() {
        if (currentPage < pagesCount) {
            currentPage++;
            paginate(currentPage);
        }
    }

    // Вешаем обработчики сортировки и сворачивания на соотв. элементы
    firstNameHeader.addEventListener('click', sortTableByFirstName);

    lastNameHeader.addEventListener('click', sortTableByLastName);

    aboutHeader.addEventListener('click', sortTableByDescription);

    eyeColorHeader.addEventListener('click', sortTableByEyeColor);

    firstNameHideBtn.addEventListener('click', hideFirstNameColumn);

    lastNameHideBtn.addEventListener('click', hideLastNameColumn);

    aboutHideBtn.addEventListener('click', hideAboutColumn);

    eyeColorHideBtn.addEventListener('click', hideEyeColorColumn);

    previousPageButton.addEventListener('click', paginatePreviousPage);

    nextPageButton.addEventListener('click', paginateNextPage);

    // Получаем из localStorage параметры сортировки
    const sortParamsStorage = localStorage.getItem('sort');

    switch(sortParamsStorage) {
        case 'firstName':
            sortedUsers = sortUsersByFirstName(users);
            break;
        case 'lastName':
            sortedUsers = sortUsersByLastName(users);
            break;
        case 'about':
            sortedUsers = sortUsersByDescription(users);
            break;
        case 'eyeColor':
            sortedUsers = sortUsersByEyeColor(users);
            break;
    }

    // Отрисовываем таблицу уже с полученными параметрами сортировки
    updateTable(usersByPage(sortedUsers, currentPage, USERS_PER_PAGE), hiddenColumns);
});