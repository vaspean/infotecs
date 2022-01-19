document.addEventListener("DOMContentLoaded", async () => {
    const USERS_PER_PAGE = 10;

    users = await fetchUsers();

    const pagesCount = users.length / USERS_PER_PAGE;
    let currentPage = pageByURL(pagesCount);

    updatePaginationElements(currentPage, pagesCount);

    const previousPageButton = document.querySelector(".pagination__button_previous-page");
    const nextPageButton = document.querySelector(".pagination__button_next-page");

    previousPageButton.addEventListener("click", function() {
        if (currentPage > 1) {
            currentPage--;
            paginate(currentPage);
        }
    });

    nextPageButton.addEventListener("click", function() {
        if (currentPage < pagesCount) {
            currentPage++;
            paginate(currentPage);
        }
    });

    updateTable(usersByPage(users, currentPage, USERS_PER_PAGE));
});