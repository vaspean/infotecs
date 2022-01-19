document.addEventListener("DOMContentLoaded", async function(event) {
    users = await fetchUsers();
    console.log(users);

    updateTable(users);
});