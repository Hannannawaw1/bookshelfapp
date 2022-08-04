const books = [];
const RENDER_EVENT = "render-todo";
const BOOK_ID = "bookId";
const BOOK_INCOMPLETED_ID = "incompleteBookshelfList";
const BOOK_COMPLETED_ID = "completeBookshelfList";
const SAVED_EVENT = "saved-book";
const STORAGE_KEY = "BOOK-APPS";
const selesaiDibaca = document.getElementById("inputBookIsComplete");
selesaiDibaca.addEventListener("click", function () {
  if (selesaiDibaca.checked) {
    document.getElementById("submitStatus").innerText = "Belum selesai dibaca";
    document.getElementById("submitStatus").innerText = "selesai dibaca";
  } else {
    document.getElementById("submitStatus").innerText = "Belum selesai dibaca";
    document.getElementById("submitStatus").innerText = "Belum selesai dibaca";
  }
});
const editselesaiDibaca = document.getElementById("inputBookIsComplete");
editselesaiDibaca.addEventListener("click", function () {
  if (selesaiDibaca.checked) {
    document.getElementById("submitStatusChange").innerText =
      "Belum selesai dibaca";
    document.getElementById("submitStatusChange").innerText = "selesai dibaca";
  } else {
    document.getElementById("submitStatusChange").innerText =
      "Belum selesai dibaca";
    document.getElementById("submitStatusChange").innerText =
      "Belum selesai dibaca";
  }
});

function isStorageExist() {
  if (typeof Storage === undefined) {
    alert("Browser kamu tidak mendukung local storage");
    return false;
  }
  return true;
}

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

function loadDataFromStorage() {
  const serializedData = localStorage.getItem(STORAGE_KEY);
  let data = JSON.parse(serializedData);

  if (data !== null) {
    for (const book of data) {
      books.push(book);
    }
  }

  document.dispatchEvent(new Event(RENDER_EVENT));
}

function saveData() {
  if (isStorageExist()) {
    const parsed = JSON.stringify(books);
    localStorage.setItem(STORAGE_KEY, parsed);
    document.dispatchEvent(new Event(SAVED_EVENT));
  }
}

function clearInput() {
  document.getElementById("inputBookTitle").value = "";
  document.getElementById("inputBookAuthor").value = "";
  document.getElementById("inputBookYear").value = "";
  document.getElementById("inputBookIsComplete").checked = false;
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
    const trashButton = document.createElement("button");
    trashButton.classList.add("red");
    trashButton.innerText = "Hapus Buku";

    trashButton.addEventListener("click", function () {
      removeBookFromCompleted(bookObject.id);
    });

    containerAction.append(checkButton, trashButton);
  }
  return container;
}

function addBookToCompleted(bookId) {
  const bookTarget = findBook(bookId);

  if (bookTarget == null) return;

  bookTarget.isCompleted = true;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function removeBookFromCompleted(bookId) {
  const bookTarget = findBookIndex(bookId);

  if (bookTarget === -1) return;

  books.splice(bookTarget, 1);
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function undoBookFromCompleted(bookId) {
  const bookTarget = findBook(bookId);

  if (bookTarget == null) return;

  bookTarget.isCompleted = false;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
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
    isCompleted
  );
  books.push(bookObject);

  if (isCompleted) {
    document.getElementById(BOOK_COMPLETED_ID).append(books);
  } else {
    document.getElementById(BOOK_INCOMPLETED_ID).append(books);
  }

  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

document.addEventListener(SAVED_EVENT, function () {
  console.log(localStorage.getItem(STORAGE_KEY));
});

document.addEventListener("DOMContentLoaded", function () {
  const inputForm = document.getElementById("inputBook");
  inputForm.addEventListener("submit", function (event) {
    event.preventDefault();
    addBook();
    clearInput();
  });
  const inputFormChange = document.getElementById("submitBookChange");
  inputFormChange.style.display = "none";

  if (isStorageExist()) {
    loadDataFromStorage();
  }
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
