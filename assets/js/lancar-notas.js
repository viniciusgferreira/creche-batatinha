'use strict'

document.addEventListener('DOMContentLoaded', loadCat)

function getParamID() {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const id = urlParams.get('id')
  return id

}

async function loadCat() {
  const catID = getParamID()
  const cat = await fetchCatByID(catID)
  renderDate()
  renderCat(cat)
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
  // desabilitar botao de salvar
  document.getElementById('botaoSalvarNotas').disabled = true;

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
    //document.getElementById('botaoSalvarNotas').disabled = false;
    mudarPatinha(filledPaw)
    checkRequiredInputs()
  });
  return filledPaw;
}

function createEmptyPaw(id) {
  const emptyPaw = document.createElement('img')
  emptyPaw.id = id;
  emptyPaw.src = 'https://i.postimg.cc/G40dKQzq/patinha-1.png'
  emptyPaw.classList.add('iconePata');

  emptyPaw.addEventListener('click', function () {
    //document.getElementById('botaoSalvarNotas').disabled = false;
    mudarPatinha(emptyPaw);
    checkRequiredInputs()
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
  // enable button
  if (inputs) { document.getElementById('botaoSalvarNotas').disabled = false; }
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

