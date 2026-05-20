const API = 'http://localhost:8080/api/tasks';

// ── BOOT ───────────────────────────────────────
document.addEventListener('DOMContentLoaded', loadTasks);

// ── LOAD ALL TASKS ──────────────────────────────
async function loadTasks() {
    try {
        const res   = await fetch(API);
        const tasks = await res.json();
        renderTasks(tasks);
        updateStats(tasks);
    } catch {
        document.getElementById('taskList').innerHTML =
            `<div class="state-empty">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                <p>Cannot connect to server.<br/>Make sure Spring Boot is running.</p>
            </div>`;
    }
}

// ── RENDER TASKS ────────────────────────────────
function renderTasks(tasks) {
    const list = document.getElementById('taskList');

    if (!tasks.length) {
        list.innerHTML =
            `<div class="state-empty">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="9" y1="9" x2="15" y2="9"/><line x1="9" y1="13" x2="12" y2="13"/></svg>
                <p>No tasks yet. Click <strong>New Task</strong> to get started.</p>
            </div>`;
        return;
    }

    list.innerHTML = tasks.map(t => {
        const done    = t.status === 'COMPLETED';
        const dueText = t.dueDate ? formatDate(t.dueDate) : '—';
        const overdue = t.dueDate && !done && new Date(t.dueDate) < new Date();

        return `
        <div class="task-row ${done ? 'is-done' : ''}">

            <div class="task-check ${done ? 'checked' : ''}"
                 onclick="toggleStatus(${t.id})" title="Toggle status"></div>

            <div class="task-title-text ${done ? 'striked' : ''}"
                 title="${escHtml(t.title)}">${escHtml(t.title)}</div>

            <div>
                <span class="priority-pill ${t.priority}">
                    <span class="dot dot-${t.priority.toLowerCase()}"></span>
                    ${capitalize(t.priority)}
                </span>
            </div>

            <div class="due-text ${overdue ? 'overdue' : ''}">${dueText}</div>

            <div>
                <span class="status-pill ${t.status}">
                    ${done ? 'Done' : 'Pending'}
                </span>
            </div>

            <div class="task-row-actions">
                <button class="act-btn" onclick='openEditPanel(${JSON.stringify(t)})' title="Edit">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                </button>
                <button class="act-btn del" onclick="deleteTask(${t.id})" title="Delete">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/></svg>
                </button>
            </div>
        </div>`;
    }).join('');
}

// ── CREATE TASK ─────────────────────────────────
async function createTask() {
    const title       = document.getElementById('title').value.trim();
    const description = document.getElementById('description').value.trim();
    const priority    = document.getElementById('priority').value;
    const dueDate     = document.getElementById('dueDate').value;

    if (!title) { highlight('title'); return; }

    const res = await fetch(API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description, priority, dueDate: dueDate || null })
    });

    if (res.status === 201) {
        closePanels();
        clearAddForm();
        loadTasks();
    } else {
        const err = await res.json();
        alert(JSON.stringify(err));
    }
}

// ── UPDATE TASK ─────────────────────────────────
async function updateTask() {
    const id          = document.getElementById('editId').value;
    const title       = document.getElementById('editTitle').value.trim();
    const description = document.getElementById('editDescription').value.trim();
    const priority    = document.getElementById('editPriority').value;
    const status      = document.getElementById('editStatus').value;
    const dueDate     = document.getElementById('editDueDate').value;

    if (!title) { highlight('editTitle'); return; }

    await fetch(`${API}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description, priority, status, dueDate: dueDate || null })
    });

    closePanels();
    loadTasks();
}

// ── TOGGLE STATUS ───────────────────────────────
async function toggleStatus(id) {
    await fetch(`${API}/${id}/status`, { method: 'PATCH' });
    loadTasks();
}

// ── DELETE TASK ─────────────────────────────────
async function deleteTask(id) {
    if (!confirm('Delete this task?')) return;
    await fetch(`${API}/${id}`, { method: 'DELETE' });
    loadTasks();
}

// ── FILTER BY STATUS ────────────────────────────
async function filterByStatus(status, el) {
    setActiveNav(el);
    updatePageTitle(el);
    if (status === 'ALL') { loadTasks(); return; }
    const res   = await fetch(`${API}/filter/status/${status}`);
    const tasks = await res.json();
    renderTasks(tasks);
}

// ── FILTER BY PRIORITY ──────────────────────────
async function filterByPriority(priority, el) {
    setActiveNav(el);
    document.querySelector('.page-title').textContent = capitalize(priority) + ' Priority';
    const res   = await fetch(`${API}/filter/priority/${priority}`);
    const tasks = await res.json();
    renderTasks(tasks);
}

// ── SEARCH ──────────────────────────────────────
async function searchTasks(keyword) {
    if (!keyword.trim()) { loadTasks(); return; }
    const res   = await fetch(`${API}/search?keyword=${encodeURIComponent(keyword)}`);
    const tasks = await res.json();
    renderTasks(tasks);
}

// ── UPDATE STATS ────────────────────────────────
function updateStats(tasks) {
    const total     = tasks.length;
    const pending   = tasks.filter(t => t.status === 'PENDING').length;
    const completed = tasks.filter(t => t.status === 'COMPLETED').length;

    document.getElementById('totalCount').textContent     = total;
    document.getElementById('pendingCount').textContent   = pending;
    document.getElementById('completedCount').textContent = completed;
    document.getElementById('navAll').textContent         = total;
    document.getElementById('navPending').textContent     = pending;
    document.getElementById('navCompleted').textContent   = completed;
}

// ── PANELS ──────────────────────────────────────
function openAddPanel() {
    document.getElementById('addPanel').classList.remove('hidden');
    document.getElementById('overlay').classList.remove('hidden');
    setTimeout(() => document.getElementById('title').focus(), 50);
}

function openEditPanel(task) {
    document.getElementById('editId').value          = task.id;
    document.getElementById('editTitle').value       = task.title;
    document.getElementById('editDescription').value = task.description || '';
    document.getElementById('editPriority').value    = task.priority;
    document.getElementById('editStatus').value      = task.status;
    document.getElementById('editDueDate').value     = task.dueDate || '';
    document.getElementById('editPanel').classList.remove('hidden');
    document.getElementById('overlay').classList.remove('hidden');
    setTimeout(() => document.getElementById('editTitle').focus(), 50);
}

function closePanels() {
    document.getElementById('addPanel').classList.add('hidden');
    document.getElementById('editPanel').classList.add('hidden');
    document.getElementById('overlay').classList.add('hidden');
}

// ── HELPERS ─────────────────────────────────────
function setActiveNav(el) {
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    if (el) el.classList.add('active');
}

function updatePageTitle(el) {
    const text = el ? el.innerText.replace(/\d+/g, '').trim() : 'All Tasks';
    document.querySelector('.page-title').textContent = text;
}

function clearAddForm() {
    ['title', 'description', 'dueDate'].forEach(id => document.getElementById(id).value = '');
    document.getElementById('priority').value = 'MEDIUM';
}

function highlight(id) {
    const el = document.getElementById(id);
    el.style.borderColor = 'var(--high)';
    el.focus();
    setTimeout(() => el.style.borderColor = '', 1500);
}

function formatDate(dateStr) {
    const d = new Date(dateStr + 'T00:00:00');
    return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

function capitalize(str) {
    return str.charAt(0) + str.slice(1).toLowerCase();
}

function escHtml(str) {
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}