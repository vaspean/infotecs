async function fetchUsers() {
    const response = await fetch('../users.json');
    const users = await response.json();
    return users;
}

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

function clearTable() {
    const table = document.querySelector('.table__tbody');
    const userRow = document.querySelectorAll('.user-row');
    for (let i = 0; i < userRow.length; i++) {
        table.removeChild(userRow[i]);
    }
}

function updateTable(users, hiddenColumns) {
    console.log(hiddenColumns);
    clearTable();
    const tableBody = document.querySelector('.table__tbody');
    for (const user of users) {
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

    toggleTheadTfooterColumns(hiddenColumns);
}

function usersByPage(users, page, usersByPage) {
    const offset = (page - 1) * usersByPage;
    return users.slice(offset, offset + usersByPage);
}

function updatePaginationElements(currentPage, pageCount) {
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

function paginate(currentPage) {
    document.location.href = `${window.location.pathname}?page=${currentPage}`;
}

function clearAllHeaders() {
    let headers = document.querySelectorAll('.header');
    headers.forEach((item) => {
        item.classList.remove('header_active');
    })
}

function sortUsersByFirstName(users) {
    clearAllHeaders();
    let headerFirstName = document.querySelector('.header_first-name');
    headerFirstName.classList.add('header_active');

    return users.sort((a, b) => {
        return a.name.firstName > b.name.firstName ? 1 : -1;
    })
}

function sortUsersByLastName(users) {
    clearAllHeaders();
    let headerLastName = document.querySelector('.header_last-name');
    headerLastName.classList.add('header_active');

    return users.sort((a, b) => {
        return a.name.lastName > b.name.lastName ? 1 : -1;
    })
}

function sortUsersByDescription(users) {
    clearAllHeaders();
    let headerAbout = document.querySelector('.header_about');
    headerAbout.classList.add('header_active');

    return users.sort((a, b) => {
        return a.about > b.about ? 1 : -1;
    })
}

function sortUsersByEyeColor(users) {
    clearAllHeaders();
    let headerEyeColor = document.querySelector('.header_eye-color');
    headerEyeColor.classList.add('header_active');

    return users.sort((a, b) => {
        return a.eyeColor > b.eyeColor ? 1 : -1 ;
    })
}

function saveSortParams(sortBy) {
    localStorage.setItem('sort', sortBy);
}

function hideColumn(numberOfColumn, hiddenColumns) {
    if (!hiddenColumns.includes(numberOfColumn)) {
        hiddenColumns.push(numberOfColumn);
    } else {
        hiddenColumns.splice(hiddenColumns.indexOf(numberOfColumn), 1);
    }
}

function toggleTheadTfooterColumns(hiddenColumns) {
    // console.log(numberOfColumn);
    const headers = document.querySelectorAll('.header');
    const footers = document.querySelectorAll('.table__hide-btn');
    const numberOfColumns = headers.length;
    console.log(numberOfColumns);
    for (let i = 1; i <= numberOfColumns; i++) {
        // console.log(column);
        if (hiddenColumns.includes(i)) {
            headers[i - 1].firstElementChild.classList.add('hidden');
            footers[i - 1].firstElementChild.textContent = '...';
        } else {
            headers[i - 1].firstElementChild.classList.remove('hidden');
            footers[i - 1].firstElementChild.textContent = 'Свернуть';
        }
    }
}