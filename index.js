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

const listContact = {
	get items() {
		return table.rows;
	},

	selectedItem: null,

	get(index) {
		return {
			name: this.items[index]?.cells[1]?.innerText,
			phone: this.items[index]?.cells[2]?.innerText,

			match(name) {
				return this.name?.toLowerCase().match(`^${name.toLowerCase()}`);
			},
		};
	},

	add({ name, phone }) {
		if (this.selectedItem) {
			this.selectedItem.cells[0].firstElementChild.innerText = name[0]?.toUpperCase() || "-";
			this.selectedItem.cells[1].innerText = name;
			this.selectedItem.cells[2].innerText = phone;
			this.selectedItem = null;

			return;
		}

		let index = this.getIndexSorted({ name });
		let newRow = table.insertRow(index);
		newRow.className = "container-row";

		let iconCell = newRow.insertCell();
		iconCell.innerHTML = `<p class="circle">${name[0]?.toUpperCase() || "-"}</p>`;

		let nameCell = newRow.insertCell();
		nameCell.innerText = name || "-";

		let phoneCell = newRow.insertCell();
		phoneCell.innerText = phone || "-";

		let group = newRow.insertCell();
		group.className = "container-row";

		let btnCall = document.createElement("button");
		btnCall.className = "btn-icon";
		btnCall.innerHTML = '<img src="./images/tel.png" alt="ligar para o contato" />';
		btnCall.addEventListener("click", () => onCallClick(phone));

		let btnEdit = document.createElement("button");
		btnEdit.className = "btn-icon";
		btnEdit.innerHTML = '<img src="./images/edit.png" alt="Editar o contato" />';
		btnEdit.addEventListener("click", () => onEditClick(newRow.rowIndex));

		let btnDel = document.createElement("button");
		btnDel.className = "btn-icon";
		btnDel.innerHTML = '<img src="./images/bin.png" alt="Excluir o contato" />';
		btnDel.addEventListener("click", () => onDeleteClick(newRow.rowIndex));

		group.appendChild(btnCall);
		group.appendChild(btnEdit);
		group.appendChild(btnDel);
	},

	select(index) {
		this.selectedItem = this.items[index];

		return this.get(index);
	},

	delete(index) {
		if (!index) return;

		this.items[index].remove();
	},

	empty() {
		return !(this.items.length - 1);
	},

	contains({ phone }) {
		for (let item of this.items) {
			if (item === this.selectedItem) continue;

			if (this.get(item.rowIndex).phone === phone) {
				return true;
			}
		}

		return false;
	},

	getIndexSorted({ name }) {
		for (let item of this.items) {
			if (name?.toLowerCase() < this.get(item.rowIndex).name?.toLowerCase()) {
				return item.rowIndex;
			}
		}

		return -1;
	},
};

function showElements(...elements) {
	elements.forEach((el) => el.classList.remove("hide"));
}

function hideElements(...elements) {
	elements.forEach((el) => el.classList.add("hide"));
}

function filterTable(name) {
	let found = 0;

	for (let item of listContact.items) {
		if (listContact.get(item.rowIndex).match(name)) {
			found++;
			showElements(item);
		} else {
			hideElements(item);
		}
	}

	if (!found) {
		showElements(tableRowDefault);
	}
}

function onSearchInput({ target }) {
	!listContact.empty() ? filterTable(target.value) : null;
}

function onNewContactClick() {
	showElements(form.parentElement);
}

function onSubmitClick() {
	let contact = inputs.values;

	if (listContact.contains(contact)) {
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

	value =
		value.length > 9 ? value.replace(/(\d{2})(\d{5})(\d+)/g, "($1) $2-$3") : value.replace(/(\d{5})(\d+)/g, "$1-$2");

	target.value = value;
}

function onFormSubmit(event) {
	event.preventDefault();

	let contact = inputs.values;
	listContact.add(contact);

	inputs.clear();

	hideElements(form.parentElement, tableRowDefault);
}

function onFormReset(event) {
	event.preventDefault();

	listContact.selectedItem = null;

	inputs.clear();

	hideElements(form.parentElement);
}

function onCallClick(phone) {
	let numberPhone = phone.replace(/\D+/g, "");

	window.location = `tel:${numberPhone.length > 9 ? "+55" : ""}${numberPhone}`;
}

function onEditClick(index) {
	inputs.values = listContact.select(index);

	showElements(form.parentElement);
}

function onDeleteClick(index) {
	listContact.delete(index);

	listContact.empty() ? showElements(tableRowDefault) : null;
}

searchInput.addEventListener("input", onSearchInput);
btnNewContact.addEventListener("click", onNewContactClick);

form.addEventListener("submit", onFormSubmit);
form.addEventListener("reset", onFormReset);
formSubmit.addEventListener("click", onSubmitClick);

inputs.name.addEventListener("input", onInputName);
inputs.phone.addEventListener("input", onInputPhone);
