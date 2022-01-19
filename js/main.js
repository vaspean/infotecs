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

    let sortedUsers = users;

    firstNameHeader.addEventListener('click', () => {
        updateTable(usersByPage(sortUsersByFirstName(users), currentPage, USERS_PER_PAGE));
        saveSortParams('firstName');
    });

    lastNameHeader.addEventListener('click', () => {
        updateTable(usersByPage(sortUsersByLastName(users), currentPage, USERS_PER_PAGE));
        saveSortParams('lastName');
    });

    aboutHeader.addEventListener('click', () => {
        updateTable(usersByPage(sortUsersByDescription(users), currentPage, USERS_PER_PAGE));
        saveSortParams('about');
    });

    eyeColorHeader.addEventListener('click', () => {
        updateTable(usersByPage(sortUsersByEyeColor(users), currentPage, USERS_PER_PAGE));
        saveSortParams('eyeColor');
    });

    previousPageButton.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            paginate(currentPage);
        }
    });

    nextPageButton.addEventListener('click', () => {
        if (currentPage < pagesCount) {
            currentPage++;
            paginate(currentPage);
        }
    });

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

    updateTable(usersByPage(sortedUsers, currentPage, USERS_PER_PAGE));
});