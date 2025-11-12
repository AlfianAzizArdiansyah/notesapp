if (!localStorage.getItem("notesData")) {
  localStorage.setItem("notesData", JSON.stringify(initialNotes));
}
let notesData = JSON.parse(localStorage.getItem("notesData"));

class AppHeader extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `<header><h1>My Notes App</h1></header>`;
  }
}
customElements.define("app-header", AppHeader);

class NoteItem extends HTMLElement {
  connectedCallback() {
    const title = this.getAttribute("title");
    const body = this.getAttribute("body");
    const createdAt = new Date(
      this.getAttribute("createdAt")
    ).toLocaleDateString();
    const id = this.getAttribute("idNote");

    this.innerHTML = `
      <div class="note">
        <h3>${title}</h3>
        <p>${body}</p>
        <small>Dibuat pada: ${createdAt}</small>
        <button class="delete-btn">Hapus</button>
      </div>
    `;

    this.querySelector(".delete-btn").addEventListener("click", () =>
      deleteNote(id)
    );
  }
}
customElements.define("note-item", NoteItem);

class NoteForm extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <form id="note-form">
        <input type="text" id="note-title" placeholder="Judul catatan" required>
        <textarea id="note-body" placeholder="Isi catatan" required></textarea>
        <button type="submit">Tambah Catatan</button>
      </form>
    `;
    this.querySelector("form").addEventListener("submit", (e) => {
      e.preventDefault();
      const title = this.querySelector("#note-title").value.trim();
      const body = this.querySelector("#note-body").value.trim();
      if (title && body) addNote({ title, body });
      this.querySelector("#note-title").value = "";
      this.querySelector("#note-body").value = "";
    });
  }
}
customElements.define("note-form", NoteForm);

const container = document.getElementById("notes-container");

function renderNotes(notes) {
  container.innerHTML = "";
  notes.forEach((note) => {
    const noteElement = document.createElement("note-item");
    noteElement.setAttribute("title", note.title);
    noteElement.setAttribute("body", note.body);
    noteElement.setAttribute("createdAt", note.createdAt);
    noteElement.setAttribute("idNote", note.id);
    container.appendChild(noteElement);
  });
  localStorage.setItem("notesData", JSON.stringify(notes));
}

function addNote({ title, body }) {
  const newNote = {
    id: `notes-${Date.now()}`,
    title,
    body,
    createdAt: new Date().toISOString(),
    archived: false,
  };
  notesData.push(newNote);
  renderNotes(notesData);
}

function deleteNote(id) {
  notesData = notesData.filter((note) => note.id !== id);
  renderNotes(notesData);
}

renderNotes(notesData);
