class ElementManager {
    constructor() {

    }

    get(el) {
        return document.querySelector(el);
    }

    getAll(el) {
        return document.querySelectorAll(el);
    }

    show(el, key = "d-none") {
        return el.classList.remove(key);
    }

    hide(el, key = "d-none") {
        return el.classList.add(key);
    }

    enableOrDisable(el, value) {
        return el.disabled = value;
    }

    html(el, message) {
        return el.innerHTML = message;
    }

    htmlList(el, message) {
        return el.innerHTML += message;
    }

    text(el, message) {
        return el.innerText = message;
    }

    classAdd(el, className){
        return el.classList.add(className)
    }

    classRemove(el, className){
        return el.classList.remove(className)
    }

    style(el, value){
        return el.style = value;
    }

    href(el, value){
        return el.href = value;
    }

    alertSuccess(message){
        return `<div class="alert alert-success alert-dismissible fade show" role="alert">
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
      </div>`
    }

    alertInfo(message){
        return `<div class="alert alert-info alert-dismissible fade show" role="alert">
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
      </div>`
    }

    alertError(message){
        return `<div class="alert alert-danger alert-dismissible fade show" role="alert">
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
      </div>`
    }
}
exports.ElementManager = ElementManager;