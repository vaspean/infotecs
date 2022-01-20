document.addEventListener('DOMContentLoaded', async () => {
    const USERS_PER_PAGE = 10;

    users = await fetchUsers();

    const pagesCount = users.length / USERS_PER_PAGE;
    let currentPage = pageByURL(pagesCount);

    updatePaginationElements(currentPage, pagesCount);

    const firstNameHeader = document.querySelector('.header_first-name');
    const lastNameHeader = document.querySelector('.header_last-name');
    const aboutHeader = document.querySelector('.header_about');
    const eyeColorHeader = document.querySelector('.header_eye-color');
    const previousPageButton = document.querySelector('.pagination__button_previous-page');
    const nextPageButton = document.querySelector('.pagination__button_next-page');
    const firstNameHideBtn = document.querySelector('.table__hide-btn_first-name');
    const lastNameHideBtn = document.querySelector('.table__hide-btn_last-name');
    const aboutHideBtn = document.querySelector('.table__hide-btn_about');
    const eyeColorHideBtn = document.querySelector('.table__hide-btn_eye-color');

    let sortedUsers = users;

    const hiddenColumns = [];

    function sortTableByFirstName() {
        updateTable(usersByPage(sortUsersByFirstName(users), currentPage, USERS_PER_PAGE), hiddenColumns);
        saveSortParams('firstName');
    }

    function sortTableByLastName() {
        updateTable(usersByPage(sortUsersByLastName(users), currentPage, USERS_PER_PAGE), hiddenColumns);
        saveSortParams('lastName');
    }

    function sortTableByDescription() {
        updateTable(usersByPage(sortUsersByDescription(users), currentPage, USERS_PER_PAGE), hiddenColumns);
        saveSortParams('about');
    }

    function sortTableByEyeColor() {
        updateTable(usersByPage(sortUsersByEyeColor(users), currentPage, USERS_PER_PAGE), hiddenColumns);
        saveSortParams('eyeColor');
    }

    function hideFirstNameColumn() {
        hideColumn(1, hiddenColumns);
        updateTable(usersByPage(sortedUsers, currentPage, USERS_PER_PAGE), hiddenColumns);
    }

    function hideLastNameColumn() {
        hideColumn(2, hiddenColumns);
        updateTable(usersByPage(sortedUsers, currentPage, USERS_PER_PAGE), hiddenColumns);
    }

    function hideAboutColumn() {
        hideColumn(3, hiddenColumns);
        updateTable(usersByPage(sortedUsers, currentPage, USERS_PER_PAGE), hiddenColumns);
    }

    function hideEyeColorColumn() {
        hideColumn(4, hiddenColumns);
        updateTable(usersByPage(sortedUsers, currentPage, USERS_PER_PAGE), hiddenColumns);
    }

    function paginatePreviousPage() {
        if (currentPage > 1) {
            currentPage--;
            paginate(currentPage);
        }
    }

    function paginateNextPage() {
        if (currentPage < pagesCount) {
            currentPage++;
            paginate(currentPage);
        }
    }

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

    updateTable(usersByPage(sortedUsers, currentPage, USERS_PER_PAGE), hiddenColumns);
});