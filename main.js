const books = [];
const RENDER_EVENT = "render-todo";
const BOOK_ID = "bookId";
const BOOK_INCOMPLETED_ID = document.getElementById("incompleteBookList");
const BOOK_COMPLETED_ID = document.getElementById("completedBookList");

function generateId() {
  return +new Date();
}

function generateBookObject(id, bookTitle, bookAuthor, bookYear, isCompleted) {
  return {
    id,
    bookTitle,
    bookAuthor,
    bookYear,
    isCompleted,
  };
}

function findBook(bookId) {
  for (const bookItem of books) {
    if (bookItem.id === bookId) {
      return bookItem;
    }
  }
  return null;
}

function findBookIndex(bookId) {
  for (const index in books) {
    if (books[index].id === bookId) {
      return index;
    }
  }

  return -1;
}

function createBook(bookObject) {
  const textBookTitle = document.createElement("h3");
  textBookTitle.innerText = bookObject.bookTitle;
  textBookTitle.classList.add("my_title");

  const textBookAuthor = document.createElement("p");
  textBookAuthor.innerText = "Penulis : " + bookObject.bookAuthor;
  textBookAuthor.classList.add("my_author");

  const textBookYear = document.createElement("p");
  textBookYear.innerText = "Tahun : " + bookObject.bookYear;
  textBookYear.classList.add("my_year");

  const textContainer = document.createElement("div");
  textContainer.classList.add("book_list");
  textContainer.append(textBookTitle, textBookAuthor, textBookYear);

  const containerAction = document.createElement("div");
  containerAction.classList.add("action");

  const container = document.createElement("article");
  container.classList.add("book_item");
  container.setAttribute("id", `book-${bookObject.id}`);
  container.append(textContainer, containerAction);

  if (bookObject.isCompleted) {
    const undoBotton = document.createElement("button");
    undoBotton.classList.add("yellow");
    undoBotton.innerText = "Belum Selesai";

    undoBotton.addEventListener("click", function () {
      undoBookFromCompleted(bookObject.id);
    });

    const trashButton = document.createElement("button");
    trashButton.classList.add("red");
    trashButton.innerText = "Hapus Buku";

    trashButton.addEventListener("click", function () {
      removeBookFromCompleted(bookObject.id);
    });

    containerAction.append(undoBotton, trashButton);
  } else {
    const checkButton = document.createElement("button");
    checkButton.classList.add("green");
    checkButton.innerText = "Selesai dibaca";

    checkButton.addEventListener("click", function () {
      addBookToCompleted(bookObject.id);
    });

    containerAction.append(checkButton);
  }
  return container;
}

function addBookToCompleted(bookId) {
  const bookTarget = findBook(bookId);

  if (bookTarget == null) return;

  bookTarget.isCompleted = true;
  document.dispatchEvent(new Event(RENDER_EVENT));
}

function removeBookFromCompleted(bookId) {
  const bookTarget = findBookIndex(bookId);

  if (bookTarget === -1) return;

  books.splice(bookTarget, 1);
  document.dispatchEvent(new Event(RENDER_EVENT));
}

function undoBookFromCompleted(bookId) {
  const bookTarget = findBook(bookId);

  if (bookTarget == null) return;

  bookTarget.isCompleted = false;
  document.dispatchEvent(new Event(RENDER_EVENT));
}

function addBook() {
  const bookTitle = document.getElementById("inputBookTitle").value;
  const bookAuthor = document.getElementById("inputBookAuthor").value;
  const bookYear = document.getElementById("inputBookYear").value;
  const isCompleted = document.getElementById("inputBookIsComplete").checked;

  const generateID = generateId();
  const bookObject = generateBookObject(
    generateID,
    bookTitle,
    bookAuthor,
    bookYear,
    false
  );
  books.push(bookObject);

  document.dispatchEvent(new Event(RENDER_EVENT));
}

document.addEventListener("DOMContentLoaded", function () {
  const inputForm = document.getElementById("inputBook");
  inputForm.addEventListener("submit", function (event) {
    event.preventDefault();
    addBook();
  });
});

document.addEventListener(RENDER_EVENT, function () {
  const uncompletedBookList = document.getElementById(
    "incompleteBookshelfList"
  );
  uncompletedBookList.innerHTML = "";

  const completedBookList = document.getElementById("completeBookshelfList");
  completedBookList.innerHTML = "";

  for (const bookItem of books) {
    const bookElement = createBook(bookItem);
    if (!bookItem.isCompleted) {
      uncompletedBookList.append(bookElement);
    } else {
      completedBookList.append(bookElement);
    }
  }
});