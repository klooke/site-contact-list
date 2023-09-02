const searchInput = document.getElementById("search-input");
const btnNewContact = document.getElementById("btn-new-contact");

const form = document.getElementById("form-contact");
const formContactIcon = document.getElementById("icon-person-large");
const formContactName = document.getElementById("tel-name");
const formContactPhone = document.getElementById("tel-num");
const formSubmit = form.querySelector('button[type="submit"]');

const table = document.getElementById("table-contact");
const tableRowDefault = document.getElementById("tr-default");

let tableRowOnEdit = null;

function clearForm() {
	formContactIcon.firstElementChild.innerText = "-";
	formContactName.value = "";
	formContactPhone.value = "";
}

function fillForm(tableRow) {
	let contact = getContact(tableRow);

	formContactIcon.firstElementChild.innerText = contact.iconLetter;
	formContactName.value = contact.name;
	formContactPhone.value = contact.tel;
}

function showElements(...elements) {
	elements.forEach((el) => el.classList.remove("hide"));
}

function hideElements(...elements) {
	elements.forEach((el) => el.classList.add("hide"));
}

function hasDuplicates({ tel }) {
	for (let row of table.rows) {
		if (row === tableRowOnEdit) continue;

		if (tel === row.cells[2]?.innerText) {
			return true;
		}
	}

	return false;
}

function newContact() {
	let contact = {};

	contact.iconLetter = formContactIcon.firstElementChild.innerText;
	contact.name = formContactName.value;
	contact.tel = formContactPhone.value;

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
	btnCall.addEventListener("click", () => onCallClick(tableRow));

	const btnEdit = document.createElement("button");
	btnEdit.className = "btn-icon";
	btnEdit.innerHTML = `<img src="./images/edit.png" alt="Editar o contato" />`;
	btnEdit.addEventListener("click", () => onEditClick(tableRow));

	const btnDel = document.createElement("button");
	btnDel.className = "btn-icon";
	btnDel.innerHTML = `<img src="./images/bin.png" alt="Deletar o contato" />`;
	btnDel.addEventListener("click", () => onRemoveClick(tableRow));

	controls.appendChild(btnCall);
	controls.appendChild(btnEdit);
	controls.appendChild(btnDel);

	tableRow.appendChild(controls);
}

function addContactRow(contact) {
	const contactIcon = document.createElement("td");
	contactIcon.innerHTML = `<p class="circle">${contact.iconLetter}</p>`;

	const contactName = document.createElement("td");
	contactName.innerText = contact.name;

	const contactTel = document.createElement("td");
	contactTel.innerText = contact.tel;

	const newRow = document.createElement("tr");
	newRow.className = "container-row";

	newRow.appendChild(contactIcon);
	newRow.appendChild(contactName);
	newRow.appendChild(contactTel);

	appendControlsOnRow(newRow);

	for (let row of table.rows) {
		if (row === tableRowDefault) continue;

		if (contact.name < row.cells[1]?.innerText) {
			return table.firstElementChild.insertBefore(newRow, row);
		}
	}

	table.firstElementChild.appendChild(newRow);
}

function updateContactRow(contact) {
	cells = tableRowOnEdit.querySelectorAll("td");
	cells[0].firstElementChild.innerText = contact.iconLetter;
	cells[1].innerText = contact.name;
	cells[2].innerText = contact.tel;
}

function filterTable(name) {
	let found = 0;

	for (let row of table.rows) {
		if (row.cells[1]?.innerText.toLowerCase().match(`^${name.toLowerCase()}`)) {
			found++;
			showElements(row);
		} else {
			hideElements(row);
		}
	}

	if (!found) {
		showElements(tableRowDefault);
	}
}

function onSearchInput(event) {
	event.preventDefault();

	if (table.rows.length > 0) {
		filterTable(event.target.value);
	}
}

function onNewContactClick(event) {
	event.preventDefault();

	showElements(form.parentElement);
}

function onSubmitClick() {
	formContactName.setCustomValidity("");
	formContactPhone.setCustomValidity("");
}

function onInputContactName(event) {
	formContactIcon.firstElementChild.innerText = event.target.value ? event.target.value[0].toUpperCase() : "-";
}

function onInputContactTel(event) {
	let value = event.target.value.replace(/(\D)/g, "");

	if (value.length > 9) {
		value = value.replace(/(\d{2})(\d{5})(\d+)/g, "($1) $2-$3");
	} else {
		value = value.replace(/(\d{5})(\d+)/g, "$1-$2");
	}

	event.target.value = value;
}

function onFormSubmit(event) {
	event.preventDefault();

	contact = newContact();

	if (hasDuplicates(contact)) {
		formContactPhone.setCustomValidity("Telefone já está cadastrado.");
		formContactPhone.reportValidity();

		return false;
	}

	if (!tableRowOnEdit) {
		addContactRow(contact);
	} else {
		updateContactRow(contact);
		tableRowOnEdit = null;
	}

	clearForm();
	hideElements(form.parentElement, tableRowDefault);
}

function onFormReset(event) {
	event.preventDefault();

	clearForm();
	hideElements(form.parentElement);
}

function onCallClick(tableRow) {
	const callNum = tableRow.cells[2].innerText.replace(/\D+/g, "");

	window.location = `tel:+55${callNum}`;
}

function onEditClick(tableRow) {
	tableRowOnEdit = tableRow;

	fillForm(tableRowOnEdit);

	showElements(form.parentElement);
}

function onRemoveClick(tableRow) {
	tableRow.remove();

	if (table.rows.length < 2) {
		showElements(tableRowDefault);
	}
}

searchInput.addEventListener("input", onSearchInput);
btnNewContact.addEventListener("click", onNewContactClick);

form.addEventListener("submit", onFormSubmit);
form.addEventListener("reset", onFormReset);
formSubmit.addEventListener("click", onSubmitClick);

formContactName.addEventListener("input", onInputContactName);
formContactPhone.addEventListener("input", onInputContactTel);
