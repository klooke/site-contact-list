const btnNewContact = document.getElementById("btn-new-contact");
const form = document.getElementById("main-form");
const table = document.getElementById("main-table");
const tableRowDefault = document.getElementById("tr-default");

let tableRowOnEdit = null;

function clearForm() {
    form.querySelector("#icon-person-large p").innerText = "-";
    form.querySelectorAll("input").forEach((el) => el.value = "");
}

function fillForm(tableRow) {
    let contact = getContact(tableRow);
    form.querySelector("#icon-person-large p").innerText = contact.iconLetter;
    form.querySelector("#tel-name").value = contact.name;
    form.querySelector("#tel-ddd").value = contact.tel.split(" ")[0].replace(/\(|\)/g, "");
    form.querySelector("#tel-num").value = contact.tel.split(" ")[1];
}

function hideElements(...elements) {
    elements.forEach((el) => el.classList.add("hide"));
}

function showElements(...elements) {
    elements.forEach((el) => el.classList.remove("hide"));
}

function hasDuplicates(contact) {
    let duplicates = 0;

    Array.from(table.querySelectorAll("tbody tr")).forEach((el) => {
        if (el !== tableRowOnEdit && (el.cells[2] && el.cells[2].innerText === contact.tel)) {
            duplicates++;
        }
    });

    return duplicates > 0;
}

function newContact() {
    let contact = {};

    contact.iconLetter = form.querySelector("#icon-person-large p").innerText;
    contact.name = form.querySelector("#tel-name").value;
    contact.tel = `(${form.querySelector("#tel-ddd").value}) `;
    contact.tel += form.querySelector("#tel-num").value;

    return contact;
}

function getContact(tableRow) {
    let contact = {};

    contact.iconLetter = tableRow.cells[0].innerText;
    contact.name = tableRow.cells[1].innerText;
    contact.tel = tableRow.cells[2].innerText;

    return contact;
}

function appendControlsOnRow(tableRow) {
    const controls = document.createElement("td");
    controls.className = "container-row";

    const btnCall = document.createElement("button");
    btnCall.className = "btn-icon";
    btnCall.innerHTML = `<img src="./images/tel.png" alt="Ligar para o contato" />`;
    btnCall.onclick = () => onCallClick(tableRow);

    const btnEdit = document.createElement("button");
    btnEdit.className = "btn-icon";
    btnEdit.innerHTML = `<img src="./images/edit.png" alt="Editar o contato" />`;
    btnEdit.onclick = () => onEditClick(tableRow);

    const btnDel = document.createElement("button");
    btnDel.className = "btn-icon";
    btnDel.innerHTML = `<img src="./images/bin.png" alt="Deletar o contato" />`;
    btnDel.onclick = () => onRemoveClick(tableRow);

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

    let tBody = table.querySelector("tbody");

    for (tr of tBody.querySelectorAll("tr:not(#tr-default)")) {
        if (!tr.cells[1]) continue;

        if (contact.name < tr.cells[1].innerText) {
            return tBody.insertBefore(row, tr);
        }
    }

    tBody.appendChild(row);
}

function updateContactRow(contact) {
    cells = tableRowOnEdit.querySelectorAll("td");
    cells[0].firstElementChild.innerText = contact.iconLetter;
    cells[1].innerText = contact.name;
    cells[2].innerText = contact.tel;
}

function onNewContactClick(event) {
    event.preventDefault();

    showElements(form);
}

function onSubmitClick(event) {
    form.querySelectorAll("input").forEach((el) => el.setCustomValidity(""));
}

function onInputContactName(event) {
    form.querySelector("#icon-person-large p").innerText =
        event.target.value ? event.target.value[0].toUpperCase() : "-";
}

function onInputContactTel(event) {
    event.target.value =
        event.target.value
            .replace(/(\D)/g, "")
            .replace(/(\d{5})(\d+)/g, "$1-$2");
}

function onFormSubmit(event) {
    event.preventDefault();

    contact = newContact();

    if (hasDuplicates(contact)) {
        form.querySelector("#tel-num").setCustomValidity("Telefone já está cadastrado.");
        form.querySelector("#tel-num").reportValidity();

        return false;
    }

    if (!tableRowOnEdit) {
        addContactRow(contact);
    } else {
        updateContactRow(contact);
        tableRowOnEdit = null;
    }

    clearForm();
    hideElements(form, tableRowDefault);
}

function onFormReset(event) {
    event.preventDefault();

    clearForm();
    hideElements(form);
}

function onCallClick(tableRow) {
    const callNum = tableRow.cells[2].innerText.replace(/\D+/g, "");

    window.location = `tel:+55${callNum}`;
}

function onEditClick(tableRow) {
    tableRowOnEdit = tableRow;

    fillForm(tableRowOnEdit);

    showElements(form);
}

function onRemoveClick(tableRow) {
    tableRow.remove();

    if (table.querySelector("tbody").childElementCount < 2) {
        showElements(tableRowDefault);
    }
}

btnNewContact.addEventListener("click", (e) => onNewContactClick(e));
form.addEventListener("submit", (e) => onFormSubmit(e));
form.addEventListener("reset", (e) => onFormReset(e));
form.querySelector('button[type="submit"]').addEventListener("click", (e) => onSubmitClick(e));
form.querySelector("#tel-name").addEventListener("input", (e) => onInputContactName(e));
form.querySelector("#tel-num").addEventListener("input", (e) => onInputContactTel(e));
