const btnNewContact = document.getElementById("btn-new-contact");
const form = document.getElementById("main-form");
const table = document.getElementById("main-table");
const tableRowDefault = document.getElementById("tr-default");

function hideElements(...elements) {
    elements.forEach((el) => el.classList.add("hide"));
}

function showElements(...elements) {
    elements.forEach((el) => el.classList.remove("hide"));
}

function newContact() {
    let contact = {};

    contact.name = form.querySelector("#tel-name").value;
    contact.tel = `(${form.querySelector("#tel-ddd").value}) `;
    contact.tel += form.querySelector("#tel-num").value;
    contact.iconLetter = contact.name[0].toUpperCase();
    
    return contact;
}

function addContactRow(contact) {
    const contactIcon = document.createElement("td");
    contactIcon.innerHTML = `<p class="circle">${contact.iconLetter}</p>`

    const contactName = document.createElement("td");
    contactName.innerText = contact.name;

    const contactTel = document.createElement("td");
    contactTel.innerText = contact.tel;

    const row = document.createElement("tr");
    row.className = "container-row";

    row.appendChild(contactIcon);
    row.appendChild(contactName);
    row.appendChild(contactTel);

    table.querySelector("tbody").appendChild(row);
}

function onNewContactClick(event) {
    event.preventDefault();

    showElements(form);
}

function onFormSubmit(event) {
    event.preventDefault();

    contact = newContact();
    addContactRow(contact);

    hideElements(form, tableRowDefault);
}

function onFormReset(event) {
    event.preventDefault();

    hideElements(form);
}

btnNewContact.addEventListener("click", (e) => onNewContactClick(e));
form.addEventListener("submit", (e) => onFormSubmit(e));
form.addEventListener("reset", (e) => onFormReset(e));