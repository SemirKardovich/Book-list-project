// Book Class
class Book {
    constructor(title, author, isbn) {
        this.title = title;
        this.author = author;
        this.isbn = isbn;
    }
}
// UI Class

class UI {
    // Method for adding new Book
    addBookToList(book) {
        let bookList = document.getElementById('book-list');

        bookList.innerHTML += `
        <tr>
            <td>${book.title}</td>
            <td>${book.author}</td>
            <td>${book.isbn}</td>
            <td><i class="fa fa-trash"></i></td>
        </tr>
        `;
    }
    // Clear input fields after new book is added
    clearFields() {
        document.getElementById('title').value = '';
        document.getElementById('author').value = '';
        document.getElementById('isbn').value = '';
    }
    // Alerts
    showAlert(message, className) {
        //Create element
        const div = document.createElement('div');
        //Add classes
        div.className = `alert ${className}`;
        //Add text node
        div.appendChild(document.createTextNode(message));

        // Insert alert element 
        const container = document.querySelector('.container');
        const form = document.querySelector('#book-form');

        container.insertBefore(div, form);

        // Timeout after 3 sec

        setTimeout(function() {
            document.querySelector('.alert').remove();
        }, 1500);
    }

    // Delete Book
    deleteBook(target) {
        if(target.classList.contains('fa')) {
            target.parentElement.parentElement.remove();
            const ui = new UI;
            ui.showAlert('Book removed', 'success');
        }
    }
}

// Local storage Class

class Store {
    static getBook(){
        let books;
        if(localStorage.getItem('books') === null){
            books = []
        }else {
            books = JSON.parse(localStorage.getItem('books'));
        }
        return books;
    }
    static displayBook(){
        let books = Store.getBook();

        books.forEach(book => {
            const ui = new UI;

            ui.addBookToList(book);
        })

        
    }
    static addBook(book) {
        let books = Store.getBook();
        books.push(book);
        localStorage.setItem('books', JSON.stringify(books));
    }

    static deleteBook(isbn) {
        let books = Store.getBook();

        books.forEach((book, index) => {
            if(isbn === book.isbn) {
                books.splice(index, 1);
            }
        })

        localStorage.setItem('books', JSON.stringify(books));
    }
}

// Event listener on DOM load 

document.addEventListener('DOMContentLoaded', Store.displayBook);

// Event listener for submitting new book
document.getElementById('book-form').addEventListener('submit', function(e){

    const title = document.getElementById('title').value,
          author = document.getElementById('author').value,
          isbn = document.getElementById('isbn').value;  

    const book = new Book(title, author, isbn);
    const ui = new UI;

    // Validation
    if(title === '' || author === '' || isbn ==='') {
        // Error alert
        ui.showAlert('Please fill up inputs', 'error');
    }else {
        //Success alert
        ui.showAlert('Book added successfully', 'success');
        ui.addBookToList(book);
        ui.clearFields();

        // Add book to local storage
        Store.addBook(book);
    }
    
    
    e.preventDefault();
})

// Event listener for deleting books 
document.getElementById('book-list').addEventListener('click', function(e) {

    const ui = new UI;
    ui.deleteBook(e.target);
    Store.deleteBook(e.target.parentElement.previousElementSibling.innerText);
})