// app.js
// DogController (/api/dogs) に対するCRUDクライアント
// index.html と同じオリジン(Spring Bootの static/)から配信される想定なので相対パスで呼び出す

const API_BASE_URL = '/api/dogs';

// ----------------------------------------------------
// DOM参照
// ----------------------------------------------------
const errorEl = document.getElementById('error-message');
const successEl = document.getElementById('success-message');
const formEl = document.getElementById('dog-form');
const formHeadingEl = document.getElementById('form-heading');
const titleEl = document.getElementById('title');
const contentEl = document.getElementById('content');
const submitButtonEl = document.getElementById('submit-button');
const cancelButtonEl = document.getElementById('cancel-button');
const listEl = document.getElementById('dogs-list');
const dogIdEl = document.getElementById('dog-id');
const foundDogEl = document.getElementById('found-dog');

// 編集中のID(nullなら新規作成モード)
let editingId = null;

// ----------------------------------------------------
// ヘルパー関数
// ----------------------------------------------------
function clearMessages() {
    errorEl.textContent = '';
    successEl.textContent = '';
}

function displayError(message) {
    successEl.textContent = '';
    errorEl.textContent = 'エラー: ' + message;
}

function displaySuccess(message) {
    errorEl.textContent = '';
    successEl.textContent = message;
}

// GlobalExceptionHandler はエラー本文をJSONではなく文字列で返すため text() で読む
async function readErrorBody(response) {
    try {
        const text = await response.text();
        return text || '(本文なし)';
    } catch (e) {
        return '(本文を読み取れませんでした)';
    }
}

function formatDate(value) {
    if (!value) return '-';
    const date = new Date(value);
    return isNaN(date.getTime()) ? String(value) : date.toLocaleString();
}

// innerHTML を使わず textContent で組み立てる(XSS対策)
function createLine(label, value) {
    const line = document.createElement('div');
    const strong = document.createElement('strong');
    strong.textContent = label;
    line.appendChild(strong);
    line.appendChild(document.createTextNode(' ' + value));
    return line;
}

function createDogElement(dog, withActions) {
    const item = document.createElement('div');
    item.className = 'dog-item';

    item.appendChild(createLine('ID:', dog.id));
    item.appendChild(createLine('タイトル:', dog.title));
    item.appendChild(createLine('内容:', dog.content));
    const small = document.createElement('small');
    small.textContent = '作成日時: ' + formatDate(dog.createdAt);
    item.appendChild(small);

    if (withActions) {
        const actions = document.createElement('div');
        actions.className = 'actions';

        const editButton = document.createElement('button');
        editButton.type = 'button';
        editButton.textContent = '編集';
        editButton.addEventListener('click', () => startEdit(dog));

        const deleteButton = document.createElement('button');
        deleteButton.type = 'button';
        deleteButton.textContent = '削除';
        deleteButton.addEventListener('click', () => deleteDog(dog.id));

        actions.appendChild(editButton);
        actions.appendChild(deleteButton);
        item.appendChild(actions);
    }

    return item;
}

// ----------------------------------------------------
// GET: 一覧取得
// ----------------------------------------------------
async function fetchDogs() {
    listEl.textContent = 'ロード中...';

    try {
        const response = await fetch(API_BASE_URL);

        if (!response.ok) {
            throw new Error(`HTTPエラー! ステータス: ${response.status}`);
        }

        const dogs = await response.json();
        listEl.innerHTML = '';

        if (dogs.length === 0) {
            listEl.textContent = 'データはありません。';
            return;
        }

        dogs.forEach(dog => listEl.appendChild(createDogElement(dog, true)));

    } catch (error) {
        listEl.textContent = '';
        displayError(`一覧の取得に失敗しました: ${error.message}`);
    }
}

// ----------------------------------------------------
// POST / PUT: フォーム送信(editingId の有無で切り替え)
// ----------------------------------------------------
formEl.addEventListener('submit', async (event) => {
    event.preventDefault();
    clearMessages();

    const body = {
        title: titleEl.value,
        content: contentEl.value
    };

    const isEdit = editingId !== null;
    const url = isEdit ? `${API_BASE_URL}/${editingId}` : API_BASE_URL;
    const method = isEdit ? 'PUT' : 'POST';
    const expectedStatus = isEdit ? 200 : 201;

    try {
        const response = await fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });

        if (response.status === expectedStatus) {
            displaySuccess(isEdit ? `ID ${editingId} を更新しました。` : '作成しました。');
            resetForm();
            fetchDogs();
        } else if (response.status === 400) {
            const message = await readErrorBody(response);
            displayError(`入力エラー (400 Bad Request): ${message}`);
        } else if (response.status === 404) {
            const message = await readErrorBody(response);
            displayError(`対象が見つかりません (404 Not Found): ${message}`);
        } else {
            throw new Error(`HTTPエラー! ステータス: ${response.status}`);
        }

    } catch (error) {
        displayError(`${isEdit ? '更新' : '作成'}に失敗しました: ${error.message}`);
    }
});

// ----------------------------------------------------
// 編集モードの開始・終了
// ----------------------------------------------------
function startEdit(dog) {
    clearMessages();
    editingId = dog.id;
    titleEl.value = dog.title;
    contentEl.value = dog.content;
    formHeadingEl.textContent = `1. 編集 (PUT /api/dogs/${dog.id})`;
    submitButtonEl.textContent = '更新';
    cancelButtonEl.hidden = false;
    formEl.scrollIntoView({ behavior: 'smooth' });
}

function resetForm() {
    editingId = null;
    formEl.reset();
    formHeadingEl.textContent = '1. 新規作成 (POST /api/dogs)';
    submitButtonEl.textContent = '保存';
    cancelButtonEl.hidden = true;
}

cancelButtonEl.addEventListener('click', () => {
    clearMessages();
    resetForm();
});

// ----------------------------------------------------
// GET: ID指定で1件取得
// ----------------------------------------------------
async function fetchDogById() {
    clearMessages();
    foundDogEl.textContent = '';

    const id = dogIdEl.value;
    if (!id) {
        displayError('検索するIDを入力してください。');
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/${id}`);

        if (response.status === 404) {
            const message = await readErrorBody(response);
            displayError(`ID ${id} が見つかりません (404 Not Found): ${message}`);
        } else if (!response.ok) {
            throw new Error(`HTTPエラー! ステータス: ${response.status}`);
        } else {
            const dog = await response.json();
            foundDogEl.appendChild(createDogElement(dog, false));
        }

    } catch (error) {
        displayError(`検索に失敗しました: ${error.message}`);
    }
}

// ----------------------------------------------------
// DELETE: ID指定で削除
// ----------------------------------------------------
async function deleteDog(id) {
    clearMessages();

    if (!id || !confirm(`本当にID ${id} を削除しますか？`)) {
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/${id}`, { method: 'DELETE' });

        if (response.status === 204) {
            displaySuccess(`ID ${id} を削除しました。`);
            if (editingId === Number(id)) {
                resetForm();
            }
            foundDogEl.textContent = '';
            fetchDogs();
        } else if (response.status === 404) {
            const message = await readErrorBody(response);
            displayError(`削除対象が見つかりません (404 Not Found): ${message}`);
        } else {
            throw new Error(`HTTPエラー! ステータス: ${response.status}`);
        }

    } catch (error) {
        displayError(`削除に失敗しました: ${error.message}`);
    }
}

// ----------------------------------------------------
// ボタンのイベント登録 & 初期表示
// ----------------------------------------------------
document.getElementById('reload-button').addEventListener('click', () => {
    clearMessages();
    fetchDogs();
});
document.getElementById('find-button').addEventListener('click', fetchDogById);
document.getElementById('delete-button').addEventListener('click', () => deleteDog(dogIdEl.value));

window.addEventListener('load', fetchDogs);