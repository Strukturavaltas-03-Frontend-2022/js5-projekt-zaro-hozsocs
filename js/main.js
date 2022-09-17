/* eslint-disable guard-for-in */
/* eslint-disable no-restricted-syntax */
const keys = ['id', 'name', 'emailAdress', 'adress'];

const getServerData = (url) => {
  const fetchOptions = {
    method: 'GET',
    mode: 'cors',
    cache: 'no-cache',
  };

  return fetch(url, fetchOptions).then(
    (response) => response.json(),
    (err) => console.error(err),
  );
};

// Sorok törlése
const deleteRow = (btn) => {
  const tr = btn.parentElement.parentElement.parentElement;
  const id = tr.querySelector('td:first-child').innerHTML;
  const fetchOptions = {
    method: 'DELETE',
    mode: 'cors',
    cache: 'no-cache',
  };
  fetch(`http://localhost:3000/users/${id}`, fetchOptions).then(
    (resp) => resp.json(),
    (err) => console.error(err),
  ).then(
    (data) => {
      refreshData();
    },
  );
};

// Sorok hozzáadása:
const getRowData = (tr) => {
  const inputs = tr.querySelectorAll('input');
  const data = {};
  for (let index = 0; index < inputs.length; index++) {
    data[inputs[index].name] = inputs[index].value;
  }
  return data;
};

const addRow = (btn) => {
  const tr = btn.parentElement.parentElement;
  const data = getRowData(tr);
  delete data.id;

  const fetchOptions = {
    method: 'POST',
    mode: 'cors',
    cache: 'no-cache',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  };

  fetch('http://localhost:3000/users', fetchOptions).then(
    (resp) => resp.json(),
    (err) => console.error(err),
  ).then(
    (data) => {
      refreshData();
    },
  );
};

// Sorok hozzáadása: hely előkészítése
const newUserRow = () => {
  const tr = document.createElement('tr');

  for (const k of keys) {
    const td = document.createElement('td');
    const input = document.createElement('input');
    input.setAttribute('name', k);
    td.appendChild(input);
    tr.appendChild(td);
  }

  const newBtn = document.createElement('button');
  newBtn.onclick = function () { addRow(this); };
  newBtn.innerHTML = 'Add new user';
  const td1 = document.createElement('td');
  td1.appendChild(newBtn);
  tr.appendChild(td1);

  return tr;
};
// Sorok frissítése
const refreshRow = (btn) => {
  const tr = btn.parentElement.parentElement.parentElement;
  const data = getRowData(tr);

  const fetchOptions = {
    method: 'PUT',
    mode: 'cors',
    cache: 'no-cache',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  };

  fetch(`http://localhost:3000/users/${data.id}`, fetchOptions).then(
    (resp) => resp.json(),
    (err) => console.error(err),
  ).then(
    (data) => {
      refreshData();
    },
  );
};
// Sorok .....
const anyRow = (em) => {
  console.log(em);
};

const createBtnGroup = () => {
  const teszt1 = 'hello1';
  const divgroup = document.createElement('div');
  const editBtn = document.createElement('button');
  editBtn.innerHTML = 'Edit';
  editBtn.onclick = function () { refreshRow(this); };
  const delBtn = document.createElement('button');
  delBtn.innerHTML = 'Delete';
  delBtn.onclick = function () { deleteRow(this); };
  const btnTd = document.createElement('td');
  divgroup.appendChild(editBtn);
  divgroup.appendChild(delBtn);
  btnTd.appendChild(divgroup);

  return btnTd;
};

const filldatatable = (data) => {
  const table = document.querySelector('#tbody');
  table.innerHTML = '';
  const newRow = newUserRow();
  table.appendChild(newRow);
  for (const row of data) {
    const tr = document.createElement('tr');

    for (const k of keys) {
      const td = document.createElement('td');
      const input = document.createElement('input');
      input.value = row[k];
      input.setAttribute('name', k);
      if (k === 'id') { input.setAttribute('readonly', 'true'); }
      td.appendChild(input);
      tr.appendChild(td);
    }
    const btnGroup = createBtnGroup();
    tr.appendChild(btnGroup);
    table.appendChild(tr);
  }
};

const refreshData = () => {
  getServerData('http://localhost:3000/users').then(
    (data) => filldatatable(data),
    (error) => console.error(error),
  );
};

// indítás
refreshData();
