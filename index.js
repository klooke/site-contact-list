const newContact = document.getElementById("btn-new-contact");
const form = document.getElementById("main-form");

function hideElements(...elements) {
    elements.forEach((el) => el.classList.add("hide"));
}

function showElements(...elements) {
    elements.forEach((el) => el.classList.remove("hide"));
}

function onNewContactClick(event) {
    event.preventDefault();

    showElements(form);
}

function onFormSubmit(event) {
    event.preventDefault();

    hideElements(form);
}

function onFormReset(event) {
    event.preventDefault();

    hideElements(form);
}

newContact.addEventListener("click", (e) => onNewContactClick(e));
form.addEventListener("submit", (e) => onFormSubmit(e));
form.addEventListener("reset", (e) => onFormReset(e));