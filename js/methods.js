async function fetchUsers() {
    const response = await fetch("../users.json");
    const users = await response.json();
    return users;
}

function pageByURL(pagesCount) {
    const START_PAGE_NUMBER = 1;
    const paramsString = window.location.search;
    const searchParams = new URLSearchParams(paramsString);
    let currentPage;

    if (searchParams.get("page") === null || +searchParams.get("page") < 1 || +searchParams.get("page") > pagesCount) {
        currentPage = START_PAGE_NUMBER;
    } else {
        currentPage = +searchParams.get("page");
    }
    return currentPage;
}

function clearTable() {
    const table = document.querySelector(".table__tbody");
    const userRow = document.querySelectorAll(".user-row");
    for (let i = 0; i < userRow.length; i++) {
        table.removeChild(userRow[i]);
    }
}

function updateTable(users) {
    // clearTable();
    const tableBody = document.querySelector(".table__tbody");
    for (const user of users) {
        const tr = document.createElement("tr");
        const tdFirstName = document.createElement("td");
        const tdLastName = document.createElement("td");
        const tdAbout = document.createElement("td");
        const pAbout = document.createElement("p");
        const tdEyeColor = document.createElement("td");
        tdFirstName.classList.add("first-name");
        tdLastName.classList.add("last-name");
        tdAbout.classList.add("about");
        tdEyeColor.classList.add("eye-color");
        tdFirstName.innerHTML = user.name.firstName;
        tdLastName.innerHTML = user.name.lastName;
        pAbout.innerHTML = user.about;
        tdEyeColor.style.backgroundColor = user.eyeColor;
        tableBody.appendChild(tr);
        tr.appendChild(tdFirstName);
        tr.appendChild(tdLastName);
        tr.appendChild(tdAbout);
        tdAbout.appendChild(pAbout);
        tr.appendChild(tdEyeColor);
    }
}

function usersByPage(users, page, usersByPage) {
    const offset = (page - 1) * usersByPage;
    return users.slice(offset, offset + usersByPage);
}

function updatePaginationElements(currentPage, pageCount) {
    const paginationContainer = document.querySelector(".pagination");
    const previousPageButton = document.querySelector(".pagination__button_previous-page");
    const nextPageButton = document.querySelector(".pagination__button_next-page");
    for (let i = 1; i <= pageCount; i++) {
        const pageButton = document.createElement("button");
        pageButton.classList.add('pagination__button');
        pageButton.innerHTML = i;
        if (currentPage === i) {
            pageButton.classList.add("pagination__button_current-page");
        }
        pageButton.addEventListener("click", () => {
            paginate(i);
        })
        paginationContainer.insertBefore(pageButton, nextPageButton);
    }

    if (currentPage <= 1) {
        previousPageButton.setAttribute("disabled", "disabled");
    }
    if (currentPage >= pageCount) {
        nextPageButton.setAttribute("disabled", "disabled");
    }
}

function paginate(currentPage) {
    document.location.href = `${window.location.pathname}?page=${currentPage}`;
}