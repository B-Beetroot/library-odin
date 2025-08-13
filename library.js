
const dialog = document.querySelector("#book-dialog");
const openBtn = document.querySelector("#new-book-dialog");
const closeBtn = document.querySelector("#close-dialog");

const form = document.querySelector("#dialogForm");

const tableBooks = document.querySelector('#books');

const myLibrary = [];

if (myLibrary.length === 0) {
    tableBooks.style.display = "none";
}

function Book(title, author, pages, hasRead) {
    if (!new.target) {
        throw Error("You must use the 'new' operator to call the constructor");
    }
    this.id = crypto.randomUUID();
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.hasRead = hasRead;
}

function addBookToLibrary(name, author, pages, hasRead) { 
    const addBook = new Book(name, author, pages, hasRead); 
    myLibrary.push(addBook) 
}

Book.prototype.toggleReadStatus = function() {
    this.hasRead = this.hasRead === "Read" ? "Not Read" : "Read";
};

function addBookTable(book) {
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
    const removeBtn = document.createElement("button");
    removeBtn.textContent = "Remove";
    removeBtn.classList.add("remove-btn");

    removeBtn.addEventListener("click", () => {
        row.remove();

        const index = myLibrary.findIndex(b => b.id === book.id);
        if (index !== -1) {
            myLibrary.splice(index, 1);
        }
        
        if (myLibrary.length === 0) {
            tableBooks.style.display = "none";
        }
    });

    const toggleBtn = document.createElement("button");
    toggleBtn.textContent = "Toggle Status";
    toggleBtn.addEventListener("click", () => {
        book.toggleReadStatus();
        statusCell.textContent = book.hasRead;
    });


    actionCell.appendChild(toggleBtn);
    actionCell.appendChild(removeBtn);
    
    row.appendChild(actionCell);

    tableBooks.appendChild(row);
}

form.addEventListener("submit", function(event) {
    event.preventDefault();
    const name = document.querySelector("#name").value;
    const author = document.querySelector("#author").value;
    const pages = document.querySelector("#pages").value;
    const hasRead = document.querySelector('input[name="status"]:checked').value;
    addBookToLibrary(name, author, pages, hasRead);
    addBookTable(myLibrary[myLibrary.length - 1]);
    if (myLibrary.length !== 0) {
    tableBooks.style.display = "block";
    }
    dialog.close();
    form.reset();
});

openBtn.addEventListener("click", () => {
    dialog.showModal();
});

closeBtn.addEventListener("click", () => {
    dialog.close();
});

