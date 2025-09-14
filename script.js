// 🌟 Get list containers
const lists = document.getElementsByClassName('list');
const doList = document.getElementById('to-do-list');
const progressList = document.getElementById('in-progress-list');
const doneList = document.getElementById('done-list');

// 📦 Task data
let tasks = [
    { id: 'card1', text: "Buy Groceries", status: 'new' },
    { id: 'card2', text: "Wash Dishes", status: 'new' },
    { id: 'card3', text: "See My friend", status: 'new' },
    { id: 'card4', text: "Learn Code", status: 'progress' },
    { id: 'card5', text: "Play Football", status: 'done' },
    { id: 'card6', text: "Do Some Tasks", status: 'done' },
];

// 💾 Load from localStorage if exists
if (localStorage.tasks) tasks = JSON.parse(localStorage.tasks);

// 💾 Save to localStorage
function storeTasks(tasks) {
    localStorage.tasks = JSON.stringify(tasks);
}

// 🚀 Initial render
showCardsInLists();

// 🧩 Render all cards based on status
function showCardsInLists() {
    // Clear all cards (except h3 titles)
    Array.from(lists).forEach(list => {
        const h3 = list.querySelector('h3');
        list.innerHTML = '';
        list.appendChild(h3);
    });

    // Insert tasks into respective list
    tasks.forEach(task => {
        if (task.status === 'new') insertCardIn(doList, task);
        else if (task.status === 'progress') insertCardIn(progressList, task);
        else insertCardIn(doneList, task);
    });

    // Re-attach drag events after rendering
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        card.addEventListener('dragstart', startDrag);
        // Optional: card.addEventListener('dragend', endDrag);
    });
}

// ➕ Insert a single task into a list
function insertCardIn(list, task) {
    list.innerHTML += `
        <div
            class="card"
            data-status='${task.status}'
            id="${task.id}"
            draggable="true"
        >${task.text}</div>
    `;
}

// 🧲 Register drag & drop events on all lists
Array.from(lists).forEach(list => {
    list.addEventListener('dragenter', enterDrag);
    list.addEventListener('dragleave', leaveDrag);
    list.addEventListener('dragover', overDrag);
    list.addEventListener('drop', dropDrag);
});

// 🎯 Start dragging
function startDrag(e) {
    e.dataTransfer.setData('text/plain', this.id);
}

// 🟩 Visual feedback: highlight
function enterDrag() {
    this.classList.add('over');
}

// ❌ Remove highlight
function leaveDrag() {
    this.classList.remove('over');
}

// 🛑 Allow dropping
function overDrag(e) {
    e.preventDefault();
}

// 📥 Handle drop logic
function dropDrag(e) {
    e.preventDefault();
    const cardId = e.dataTransfer.getData('text/plain');
    const droppedCard = document.getElementById(cardId);
    this.classList.remove('over');
    this.appendChild(droppedCard);
    changeDroppedCardStatus(cardId, this.dataset.status);
}

// 🔄 Update task status and store
function changeDroppedCardStatus(id, newStatus) {
    tasks.forEach(task => {
        if (task.id === id) {
            task.status = newStatus;
        }
    });
    storeTasks(tasks);
}
