
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
    }

    _toggleTable() {
        this.tableBooks.style.display =
        this.myLibrary.length > 0 ? "table" : "none";
    }

    _handleSubmit(event) {
        event.preventDefault();

        const title   = this.form.title.value;
        const author  = this.form.author.value;
        const pages   = this.form.pages.value;
        const status  = this.form.status.value;

        this._addBook({ title, author, pages, hasRead: status });

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

