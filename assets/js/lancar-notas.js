'use strict'

document.addEventListener('DOMContentLoaded', loadCat)

function getParamID() {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const id = urlParams.get('id')
  return id

}

async function loadCat() {
  // renderizar dados do gato
  const catID = getParamID()
  const cat = await fetchCatByID(catID)
  renderDate()
  renderCat(cat)

  // habilitar botão 'imprimir' se campos estão preenchidos
  checkRequiredInputs() ? enableButton(document.querySelector('#botaoImprimirNotas')) : null;
}

async function fetchCatByID(id) {
  const url = `https://644a8480a8370fb321510499.mockapi.io/api/v1/gatos/${id}`;

  try {
    const response = await fetch(url)
    const cat = await response.json()
    return cat
  } catch (error) {
    console.log(error)
  }
}

function renderDate() {
  const dataElemento = document.querySelector('#data')
  const month = new Date().toLocaleString('default', { month: 'long' });
  const year = new Date().toLocaleString('default', { year: 'numeric' });
  dataElemento.textContent = month.charAt(0).toUpperCase() + month.slice(1) + '/' + year;
}

function renderCat(cat) {
  const catNameEl = document.querySelector('#nomeGato')
  const catPhotoEl = document.querySelector('#fotoGato')

  catNameEl.textContent = cat.nomeGato
  catPhotoEl.src = cat.fotoGato

  let notaAtual = 0;
  for (const category in cat.notas) {
    const div = document.querySelector(`#${category}`);
    let filledPawCounter = 0;
    notaAtual = cat.notas[category];
    for (let i = 1; i <= 5; i++) {
      if (filledPawCounter < cat.notas[category]) {
        div.appendChild(createFilledPaw(`${category}${i}`));
        filledPawCounter++;
      } else {
        div.appendChild(createEmptyPaw(`${category}${i}`))
      }
    }
  }
}

function createFilledPaw(id) {
  const filledPaw = document.createElement('img')
  filledPaw.id = id;
  filledPaw.src = 'https://i.postimg.cc/hX9g5d5g/patinha.png'
  filledPaw.classList.add('iconePata--preenchida', 'iconePata')
  filledPaw.addEventListener('click', function () {
    mudarPatinha(filledPaw)
    if (checkRequiredInputs()) { enableButtons() }
  });
  return filledPaw;
}

function createEmptyPaw(id) {
  const emptyPaw = document.createElement('img')
  emptyPaw.id = id;
  emptyPaw.src = 'https://i.postimg.cc/G40dKQzq/patinha-1.png'
  emptyPaw.classList.add('iconePata');

  emptyPaw.addEventListener('click', function () {
    mudarPatinha(emptyPaw);
    if (checkRequiredInputs()) { enableButtons() }
  });
  return emptyPaw
}

function mudarPatinha(paw) {
  const pawCategory = paw.id.substring(0, paw.id.length - 1)
  const pawPosition = paw.id.slice(paw.id.length - 1)
  if (paw.src.endsWith('patinha-1.png')) {
    // aumentar nota
    for (let i = 1; i <= pawPosition; i++) {
      const element = document.querySelector(`#${pawCategory}${i}`)
      element.src = 'https://i.postimg.cc/hX9g5d5g/patinha.png';
      element.classList.add('iconePata--preenchida')
    }

  } else if (paw.src.endsWith('patinha.png')) {
    // diminuir nota
    for (let i = 5; i > pawPosition; i--) {
      const element = document.querySelector(`#${pawCategory}${i}`)
      element.src = 'https://i.postimg.cc/G40dKQzq/patinha-1.png';
      element.classList.remove('iconePata--preenchida')
    }
  }
}

function checkRequiredInputs() {
  const firstPaws = document.querySelectorAll('.iconePata')
  let inputs = true;
  for (let i = 0; i <= 25; i += 5) {
    if (!firstPaws[i].classList.contains('iconePata--preenchida')) {
      inputs = false
      break;
    }
  }
  return inputs
}

function enableButton(button) {
  button.disabled = false;
}

function disableButton(button) {
  button.disabled = true;
}

function enableButtons() {
  enableButton(document.querySelector('#botaoSalvarNotas'))
  enableButton(document.querySelector('#botaoImprimirNotas'))
}

function printCatData() {

  let displaData = new Map()
  const header = document.querySelector('header')
  const navButton = document.querySelector('#botaoVoltar')
  const buttons = document.querySelector('.botoes')
  displaData.set(header, header.style.display).set(navButton, navButton.style.display).set(buttons, buttons.style.display)

  displaData.forEach((value, key) => key.style.display = 'none')

  window.addEventListener("afterprint", (event) => {
    displaData.forEach((value, key) => key.style.display = value)
    console.log(header.style.display)
    console.log('fim')
  });

  console.log(header.style.display)
  window.print()

}

async function submitForm() {
  const catID = getParamID();
  const cat = {
    "id": catID,
    "notas": {
      "socializacao": 0,
      "sonequinha": 0,
      "alimentacao": 0,
      "brincadeiras": 0,
      "preguicinha": 0,
      "fotos": 0
    }
  }

  for (const category in cat.notas) {
    const div = document.querySelector(`#${category}`);
    const filledPaws = div.querySelectorAll('.iconePata--preenchida');
    cat.notas[category] = filledPaws.length;
  }
  await updateCat(cat);
}

async function updateCat(cat) {
  const url = `https://644a8480a8370fb321510499.mockapi.io/api/v1/gatos/${cat.id}`;
  const options = {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(cat)
  };
  try {
    const response = await fetch(url, options);
    const updatedCat = await response.json();
    console.log(updatedCat);
    console.log(response.status);
  } catch (error) {
    console.log(error);
  }
}

document.querySelector('#botaoSalvarNotas').onclick = submitForm;

