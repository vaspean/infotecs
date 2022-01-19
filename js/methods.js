async function fetchUsers() {
    const response = await fetch('../users.json');
    const users = await response.json();
    return users;
}

function clearTable() {
    let table = document.querySelector('.table__tbody');
    let userRow = document.querySelectorAll('.user-row');
    for (let i = 0; i < userRow.length; i++) {
        table.removeChild(userRow[i]);
    }
}

function updateTable(users) {
    clearTable();
    let tableBody = document.querySelector('.table__tbody');
    for (let user of users) {
        let tr = document.createElement('tr');
        let tdFirstName = document.createElement('td');
        let tdLastName = document.createElement('td');
        let tdAbout = document.createElement('td');
        let pAbout = document.createElement('p');
        let tdEyeColor = document.createElement('td');
        tdFirstName.classList.add('first-name');
        tdLastName.classList.add('last-name');
        tdAbout.classList.add('about');
        tdEyeColor.classList.add('eye-color');
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