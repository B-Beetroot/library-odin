class Book {
    constructor(title, author, pages, hasRead) {
        this.id = crypto.randomUUID();
        this.title = title;
        this.author = author;
        this.pages = pages;
        this.hasRead = hasRead;
    }

    toggleReadStatus () {
        this.hasRead = this.hasRead === "Read" ? "Not Read" : "Read";
    };
}

class Library {
    constructor() {
        this.dialog = document.querySelector("#book-dialog");
        this.openBtn = document.querySelector("#new-book-dialog");
        this.closeBtn = document.querySelector("#close-dialog");
        this.form = document.querySelector("#dialogForm");
        this.tableBooks = document.querySelector('#books');

        this.myLibrary = [];

        this._init();
    }

    _init() {
        this._toggleTable();
        this.openBtn.addEventListener("click", () => this.dialog.showModal());
        this.closeBtn.addEventListener("click", () => this.dialog.close());
        this.form.addEventListener("submit", this._handleSubmit.bind(this));

        Array.from(this.form.elements).forEach(el => {
            if (el instanceof HTMLInputElement || el instanceof HTMLSelectElement || el instanceof HTMLTextAreaElement) {
                el.addEventListener('input', () => el.setCustomValidity(''));
            }
        });
    }

    _toggleTable() {
        this.tableBooks.style.display =
        this.myLibrary.length > 0 ? "table" : "none";
    }

    _handleSubmit(event) {
        event.preventDefault();

        const title   = this.form.title;
        const author  = this.form.author;
        const pages   = this.form.pages;
        const status  = this.form.status;

        let isValid = true;

        if (title.value.trim() === "") {
            title.setCustomValidity("The book title must be filled!");
            isValid = false;
        }

        if (author.value.trim() === "") {
            author.setCustomValidity("The author name must be filled!");
            isValid = false;
        }

        const pageNum = parseInt(pages.value, 10);
        if (isNaN(pageNum) || pageNum < 1 || pageNum > 10000) {
            pages.setCustomValidity("Please enter a valid number of pages (1–10,000).");
            isValid = false;
        }

        if (!isValid) {
            this.form.reportValidity();
            return;
        }

        this._addBook({ 
            title: title.value.trim(), 
            author: author.value.trim(), 
            pages: pageNum, 
            hasRead: status.value 
        });

        this.dialog.close();
        this.form.reset();
    }

    _addBook({ title, author, pages, hasRead }) {
        const book = new Book(title, author, pages, hasRead);
        this.myLibrary.push(book);
        this._updateRow(book);
        this._toggleTable();
    }
    
    _removeBook(id, rowElement) {
        rowElement.remove();
        this.myLibrary = this.myLibrary.filter(book => book.id !== id);
        this._toggleTable();
    }

    _updateRow(book) {
        const row = document.createElement("tr");
        row.setAttribute("data-id", book.id);

        const titleCell = document.createElement("td");
        titleCell.textContent = book.title;
        row.appendChild(titleCell);

        const authorCell = document.createElement("td");
        authorCell.textContent = book.author;
        row.appendChild(authorCell);

        const pagesCell = document.createElement("td");
        pagesCell.textContent = book.pages;
        row.appendChild(pagesCell);

        const statusCell = document.createElement("td");
        statusCell.textContent = book.hasRead;
        row.appendChild(statusCell);

        const actionCell = document.createElement("td");
        
        const toggleBtn = document.createElement("button");
        toggleBtn.textContent = "Toggle Status";

        toggleBtn.addEventListener("click", () => {
            book.toggleReadStatus();
            statusCell.textContent = book.hasRead;
        });

        const removeBtn = document.createElement("button");
        removeBtn.textContent = "Remove";
        removeBtn.classList.add("remove-btn");

        removeBtn.addEventListener("click", () => {
            this._removeBook(book.id, row);
        });

        actionCell.appendChild(toggleBtn);
        actionCell.appendChild(removeBtn);
        
        row.appendChild(actionCell);

        this.tableBooks.appendChild(row);
    }
}

document.addEventListener("DOMContentLoaded", () => {
  new Library();
});