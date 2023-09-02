const searchInput = document.getElementById("search-input");
const btnNewContact = document.getElementById("btn-new-contact");

const form = document.getElementById("form-contact");
const formContactIcon = document.getElementById("icon-person-large");
const formContactName = document.getElementById("tel-name");
const formContactPhone = document.getElementById("tel-num");
const formSubmit = form.querySelector('button[type="submit"]');

const table = document.getElementById("table-contact");
const tableRowDefault = document.getElementById("tr-default");

const inputs = {
	get iconLetter() {
		return formContactIcon.firstElementChild;
	},

	get name() {
		return formContactName;
	},

	get phone() {
		return formContactPhone;
	},

	set values({ name, phone }) {
		this.name.value = name || "";
		this.phone.value = phone || "";

		this.refresh();
	},

	get values() {
		return {
			name: this.name.value,
			phone: this.phone.value,
		};
	},

	clear() {
		this.values = {};
	},

	refresh() {
		this.iconLetter.innerText = this.name.value[0]?.toUpperCase() || "-";
	},

	validity() {
		this.name.setCustomValidity("");
		this.phone.setCustomValidity("");
	},
};

let tableRowOnEdit = null;

function fillForm(tableRow) {
	let contact = getContact(tableRow);
	
	inputs.values = contact;

	inputs.refresh();
}

function showElements(...elements) {
	elements.forEach((el) => el.classList.remove("hide"));
}

function hideElements(...elements) {
	elements.forEach((el) => el.classList.add("hide"));
}

function hasDuplicates({ phone }) {
	for (let row of table.rows) {
		if (row === tableRowOnEdit) continue;

		if (phone === row.cells[2]?.innerText) {
			return true;
		}
	}

	return false;
}

function getContact(tableRow) {
	let contact = {};

	contact.name = tableRow.cells[1].innerText;
	contact.phone = tableRow.cells[2].innerText;

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

function addContactRow({ name, phone }) {
	const contactIcon = document.createElement("td");
	contactIcon.innerHTML = `<p class="circle">${name[0] || "-"}</p>`;

	const contactName = document.createElement("td");
	contactName.innerText = name;

	const contactTel = document.createElement("td");
	contactTel.innerText = phone;

	const newRow = document.createElement("tr");
	newRow.className = "container-row";

	newRow.appendChild(contactIcon);
	newRow.appendChild(contactName);
	newRow.appendChild(contactTel);

	appendControlsOnRow(newRow);

	for (let row of table.rows) {
		if (row === tableRowDefault) continue;

		if (name < row.cells[1]?.innerText) {
			return table.firstElementChild.insertBefore(newRow, row);
		}
	}

	table.firstElementChild.appendChild(newRow);
}

function updateContactRow({ name, phone }) {
	cells = tableRowOnEdit.querySelectorAll("td");
	cells[0].firstElementChild.innerText = name[0] || "-";
	cells[1].innerText = name;
	cells[2].innerText = phone;
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
	let contact = inputs.values;

	if (hasDuplicates(contact)) {
		inputs.phone.setCustomValidity("Telefone já cadastrado!");
		inputs.phone.reportValidity();

		return false;
	}

	inputs.validity();
}

function onInputName() {
	inputs.refresh();
}

function onInputPhone({ target }) {
	let value = target.value.replace(/\D+/g, "");

	if (value.length > 9) {
		value = value.replace(/(\d{2})(\d{5})(\d+)/g, "($1) $2-$3");
	} else {
		value = value.replace(/(\d{5})(\d+)/g, "$1-$2");
	}

	target.value = value;
}

function onFormSubmit(event) {
	event.preventDefault();

	let contact = inputs.values;

	if (!tableRowOnEdit) {
		addContactRow(contact);
	} else {
		tableRowOnEdit = null;
		updateContactRow(contact);
	}

	inputs.clear();

	hideElements(form.parentElement, tableRowDefault);
}

function onFormReset(event) {
	event.preventDefault();

	tableRowOnEdit = null;

	inputs.clear();

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

inputs.name.addEventListener("input", onInputName);
inputs.phone.addEventListener("input", onInputPhone);
