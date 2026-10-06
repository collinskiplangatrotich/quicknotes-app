// Task 1 & 3: DOM Element Selection using querySelector
const noteForm = document.querySelector("#note-form");
const noteInput = document.querySelector("#note-input");
const noteCategory = document.querySelector("#note-category");
const errorMessage = document.querySelector("#error-message");
const searchInput = document.querySelector("#search-input");
const noteCount = document.querySelector("#note-count");
const notesList = document.querySelector("#notes-list");
const clearAllBtn = document.querySelector("#clear-all-btn");

// Storage key constant
const STORAGE_KEY = "quicknotes_app_data";

// Task 5: Load notes array from localStorage
let notes = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

// Save notes to localStorage
function saveNotes() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
}

// Update Note Count message
function updateNoteCount() {
  const total = notes.length;
  if (total === 0) {
    noteCount.textContent = "You have no notes yet.";
  } else if (total === 1) {
    noteCount.textContent = "You have 1 note.";
  } else {
    noteCount.textContent = `You have ${total} notes.`;
  }
}

// Delete a single note
function deleteNote(id) {
  notes = notes.filter((note) => note.id !== id);
  saveNotes();
  render();
}

// Task 3 & 5: Render function strictly using createElement and textContent (NO innerHTML for user text)
function render() {
  // Clear previous list contents safely
  notesList.textContent = "";

  updateNoteCount();

  const query = searchInput.value.trim().toLowerCase();
  const filteredNotes = notes.filter((note) =>
    note.text.toLowerCase().includes(query)
  );

  // Search no match state
  if (filteredNotes.length === 0 && notes.length > 0) {
    const noMatchPara = document.createElement("p");
    noMatchPara.className = "no-match";
    noMatchPara.textContent = "No notes match your search.";
    notesList.appendChild(noMatchPara);
    return;
  }

  // Render note list
  filteredNotes.forEach((note) => {
    const li = document.createElement("li");
    li.className = `note-card category-${note.category}`;

    // Card Header (Category Badge)
    const cardHeader = document.createElement("div");
    cardHeader.className = "note-card-header";

    const badge = document.createElement("span");
    badge.className = "category-badge";
    badge.textContent = note.category;
    cardHeader.appendChild(badge);

    // Card Body (Note Content)
    const textPara = document.createElement("p");
    textPara.className = "note-text";
    textPara.textContent = note.text;

    // Card Footer (Date & Delete Button)
    const cardFooter = document.createElement("div");
    cardFooter.className = "note-card-footer";

    const dateSpan = document.createElement("span");
    dateSpan.className = "note-date";
    dateSpan.textContent = note.createdAt;

    const deleteBtn = document.createElement("button");
    deleteBtn.className = "btn-delete";
    deleteBtn.textContent = "Delete";
    deleteBtn.addEventListener("click", () => deleteNote(note.id));

    cardFooter.appendChild(dateSpan);
    cardFooter.appendChild(deleteBtn);

    // Assemble Card
    li.appendChild(cardHeader);
    li.appendChild(textPara);
    li.appendChild(cardFooter);

    notesList.appendChild(li);
  });
}

// Task 3 & 4: Form Submit & Validation
noteForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const text = noteInput.value.trim();
  const category = noteCategory.value;

  // Validation
  if (text === "") {
    errorMessage.textContent = "Please type a note first.";
    return;
  }

  if (text.length > 200) {
    errorMessage.textContent = "Notes must be 200 characters or fewer.";
    return;
  }

  // Clear validation error on successful addition
  errorMessage.textContent = "";

  // Create new note object
  const newNote = {
    id: Date.now(),
    text: text,
    category: category,
    createdAt: new Date().toLocaleString(),
  };

  notes.unshift(newNote);
  saveNotes();
  render();

  // Reset input field
  noteInput.value = "";
  noteInput.focus();
});

// Task 5: Live Search Event
searchInput.addEventListener("input", render);

// Bonus: Clear All Notes Feature
clearAllBtn.addEventListener("click", () => {
  if (notes.length === 0) return;

  const confirmed = confirm("Delete all notes?");
  if (confirmed) {
    notes = [];
    saveNotes();
    render();
    errorMessage.textContent = "";
  }
});

// Initial Page Load Initialization
render();

