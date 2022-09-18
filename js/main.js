/* eslint-disable guard-for-in */
/* eslint-disable no-restricted-syntax */

let isediting = false;
// Kulcsok az adatok bejárásához
const keys = ['id', 'name', 'emailAdress', 'adress'];
const messageBox = document.querySelector('#container');

// Adatok beolvasása a szerverről
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
  const input = tr.querySelector('input:first-child');
  input.setAttribute('readonly', 'false');

  const id = input.innerHTML;
  const fetchOptions = {
    method: 'DELETE',
    mode: 'cors',
    cache: 'no-cache',
  };

  fetch(`http://localhost:3000/users/${getRowData(tr).id}`, fetchOptions).then(
    (resp) => resp.json(),
    (err) => console.error(err),
  ).then(
    (data) => {
      refreshData();
    },
  );
};

// Azon adatok összegyűjtése amivel műveleteket végzünk
const getRowData = (tr) => {
  const inputs = tr.querySelectorAll('input');
  const data = {};
  for (let index = 0; index < inputs.length; index++) {
    data[inputs[index].name] = inputs[index].value;
  }
  return data;
};

// Sorok hozzáadása:
const addRow = (btn) => {
  const tr = btn.parentElement.parentElement;
  const data = getRowData(tr);
  delete data.id;

  let wrongvalidate = false;
  wrongvalidate = validate(data, wrongvalidate);

  if (wrongvalidate === false) {
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
  }
};
// };

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

  let wrongvalidate = false;

  wrongvalidate = validate(data, wrongvalidate);

  if (wrongvalidate === false) {
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
        isediting = false;
        refreshData();
      },
    );
  }
};

// Validálás

const roles = {
  name: /^[A-ZÁÉÍÓÚÖŐÜŰ]{1}[a-záéíóúöőüű\'\-]{1,20} [A-ZÁÉÍÓÚÖŐÜŰ]{1}[a-záéíóúöőüű\-]{0,18}(\'[A-ZÁÉÍÓÚÖŐÜŰ]{1}[a-záéíóúöőüű\-]{1,18}|[a-záéíóúöőüű\-]{1,20}|\-[A-ZÁÉÍÓÚÖŐÜŰ]{1}[a-záéíóúöőüű\-]{1,18})$/,
  emailAdress: /^[a-zA-Z][a-zA-Z0-9\.\-\_]+@[a-zA-Z0-9\.\-\_]+\.[a-zA-Z]{2,6}/,
  adress: /^[0-9]{1,10} [a-zA-Z0-9\.\-\_ ]*$/,
};

const alertBoxWrong = (k, vh) => {
  const box = document.createElement('div');
  box.innerHTML = `A ${k} validating is wrong`;
  box.setAttribute('style', `background-color:red; bottom: ${vh}vh;`);
  box.setAttribute('class', 'message');
  messageBox.appendChild(box);
  setTimeout(() => { messageBox.removeChild(box); }, 5000);
};

const alertBoxGood = (k, vh) => {
  const box = document.createElement('div');
  box.innerHTML = `A ${k} validating is ok`;
  box.setAttribute('style', `background-color:green; bottom: ${vh}vh;`);
  box.setAttribute('class', 'message');
  messageBox.appendChild(box);
  setTimeout(() => { messageBox.removeChild(box); }, 5000);
};
const alertBoxDuplcatedEditing = () => {
  const box = document.createElement('div');
  box.innerHTML = 'Please, finish your actual editing first.';
  box.setAttribute('style', 'background-color:red; bottom: 50vh;');
  box.setAttribute('class', 'message');

  messageBox.appendChild(box);
  setTimeout(() => { messageBox.removeChild(box); }, 5000);
};

const validate = (data, wrongvalidate) => {
  let i = 1;
  for (const k of ['name', 'emailAdress', 'adress']) {
    if (roles[k].test(data[k])) alertBoxGood(k, (40 + i * 10));
    else {
      alertBoxWrong(k, (40 + i * 20));
      wrongvalidate = true;
      break;
    }
    i += 1;
  }
  messageBox.setAttribute('display', 'none');
  return wrongvalidate;
};

// egy sor újraépítése, szerkeszthetővé tétel
const filldatarow = (tr, data) => {
  tr.innerHTML = '';
  for (const k of keys) {
    const td = document.createElement('td');
    const input = document.createElement('input');
    input.value = data[k];
    input.setAttribute('name', k);
    if (k === 'id') input.setAttribute('readonly', 'true');
    td.appendChild(input);
    tr.appendChild(td);
  }
  const btnGroup = createBtnGroup('Save', 'Cancel');
  tr.appendChild(btnGroup);

  return tr;
};

// Sorok szerkeszthetőek lesznek
const makeRowEditable = (btn) => {
  isediting = true;
  const tr = btn.parentElement.parentElement.parentElement;
  const data = getRowData(tr);

  return filldatarow(tr, data);
};

// kattintás a gombokon
const firstBtnClick = (btn) => {
  if ((btn.innerHTML === 'Edit') && (isediting === false)) makeRowEditable(btn);
  else if ((btn.innerHTML === 'Edit') && (isediting === true)) {
    messageBox.setAttribute('display', 'box');
    alertBoxDuplcatedEditing();
    messageBox.setAttribute('display', 'none');
  } else refreshRow(btn);
};

const secondBtnClick = (btn) => {
  if ((btn.innerHTML === 'Remove') && (isediting === false)) deleteRow(btn);
  else if ((btn.innerHTML === 'Remove') && (isediting === true)) {
    messageBox.setAttribute('display', 'box');
    alertBoxDuplcatedEditing();
    messageBox.setAttribute('display', 'none');
  } else {
    refreshData();
  }
};

// Gombok létrehozása
const createBtnGroup = (firstvalue, secondvalue) => {
  const divgroup = document.createElement('div');
  const editBtn = document.createElement('button');
  editBtn.innerHTML = firstvalue;
  editBtn.onclick = function () {
    firstBtnClick(this);
  };
  const delBtn = document.createElement('button');
  delBtn.innerHTML = secondvalue;
  delBtn.onclick = function () { secondBtnClick(this); };
  const btnTd = document.createElement('td');
  divgroup.appendChild(editBtn);
  divgroup.appendChild(delBtn);
  btnTd.appendChild(divgroup);

  return btnTd;
};

// Táblázat kitöltése adatokkal
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
      input.setAttribute('readonly', 'true');
      td.appendChild(input);
      tr.appendChild(td);
    }
    const btnGroup = createBtnGroup('Edit', 'Remove');
    tr.appendChild(btnGroup);
    table.appendChild(tr);
  }
};

// Adatok frissítése, újra beolvasása
const refreshData = () => {
  getServerData('http://localhost:3000/users').then(
    (data) => filldatatable(data),
    (error) => console.error(error),
  );
};

// indítás
refreshData();
