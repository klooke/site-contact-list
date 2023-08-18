const btnNewContact = document.getElementById("btn-new-contact");
const form = document.getElementById("main-form");
const table = document.getElementById("main-table");
const tableRowDefault = document.getElementById("tr-default");

function clearForm() {
    form.querySelector("#icon-person-large p").innerText = "-";
    form.querySelectorAll("input").forEach((el) => el.value = "");
}

function hideElements(...elements) {
    elements.forEach((el) => el.classList.add("hide"));
}

function showElements(...elements) {
    elements.forEach((el) => el.classList.remove("hide"));
}

function newContact() {
    let contact = {};

    contact.iconLetter = form.querySelector("#icon-person-large p").innerText;
    contact.name = form.querySelector("#tel-name").value;
    contact.tel = `(${form.querySelector("#tel-ddd").value}) `;
    contact.tel += form.querySelector("#tel-num").value;
    
    return contact;
}

function appendControlsOnRow(tableRow) {
    const controls = document.createElement("td");
    controls.className = "container-row";

    const btnCall = document.createElement("button");
    btnCall.className = "btn-icon";
    btnCall.innerHTML = `<img src="./images/tel.png" alt="Ligar para o contato" />`;

    const btnEdit = document.createElement("button");
    btnEdit.className = "btn-icon";
    btnEdit.innerHTML = `<img src="./images/edit.png" alt="Editar o contato" />`;

    const btnDel = document.createElement("button");
    btnDel.className = "btn-icon";
    btnDel.innerHTML = `<img src="./images/bin.png" alt="Deletar o contato" />`;

    controls.appendChild(btnCall);
    controls.appendChild(btnEdit);
    controls.appendChild(btnDel);

    tableRow.appendChild(controls);
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

    appendControlsOnRow(row);

    table.querySelector("tbody").appendChild(row);
}

function onNewContactClick(event) {
    event.preventDefault();

    showElements(form);
}

function onInputContactName(event) {
    form.querySelector("#icon-person-large p").innerText = 
        event.target.value ? event.target.value[0].toUpperCase() : "-";
}

function onInputContactTel(event) {
    event.target.value = event.target.value.replace(/(\d{5})(\d+)/g, "$1-$2");
}

function onFormSubmit(event) {
    event.preventDefault();

    contact = newContact();
    addContactRow(contact);

    clearForm();
    hideElements(form, tableRowDefault);
}

function onFormReset(event) {
    event.preventDefault();

    clearForm();
    hideElements(form);
}

btnNewContact.addEventListener("click", (e) => onNewContactClick(e));
form.addEventListener("submit", (e) => onFormSubmit(e));
form.addEventListener("reset", (e) => onFormReset(e));
form.querySelector("#tel-name").addEventListener("input", (e) => onInputContactName(e));
form.querySelector("#tel-num").addEventListener("input", (e) => onInputContactTel(e));
