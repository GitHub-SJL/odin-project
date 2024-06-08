const newBookBtn = document.getElementById("new-book-btn");
const modal = document.getElementById("modal");
const modalCloseBtn = document.querySelector(".close");
const bookList = document.querySelector(".book-lists");
const bookForm = document.getElementById("book-form");

// bookList
const myLibrary = [];

function Book(title, author, pages, read) {
  this.title = title;
  this.author = author;
  this.pages = pages;
  this.read = read;
}

function displayBooks(books) {
  bookList.innerHTML = "";
  myLibrary.forEach((book, index) => {
    const card = document.createElement("div");
    card.classList.add("book-card");
    card.innerHTML = `
        <p>제목: ${book.title}</P>
        <p>저자: ${book.author}</p>
        <p>페이지수: ${book.pages}</p>
        <p>상태: ${book.read ? "읽음" : "안읽음"}
        `;

    bookList.appendChild(card);
  });
}

function addBookToLibrary(book) {
  myLibrary.push(book);
}

// Book 추가
bookForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const title = document.getElementById("title").value;
  const author = document.getElementById("author").value;
  const pages = document.getElementById("pages").value;
  const read = document.getElementById("read").checked;

  const newBook = new Book(title, author, pages, read);
  addBookToLibrary(newBook);
  displayBooks();
  modal.style.display = "none";
  bookForm.reset();
});

// Book 삭제

// 모달창 제어
newBookBtn.addEventListener("click", () => {
  modal.style.display = "block";
});

modalCloseBtn.addEventListener("click", () => {
  modal.style.display = "none";
});

window.addEventListener("click", (e) => {
  if (e.target == modal) {
    modal.style.display = "none";
  }
});
