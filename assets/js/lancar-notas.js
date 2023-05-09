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

/*
document.addEventListener('DOMContentLoaded', function () {
    let elementos = [
      document.getElementById('socializacao'),
      document.getElementById('sonequinha'),
      document.getElementById('alimentacao'),
      document.getElementById('brincadeiras'),
      document.getElementById('preguicinha'),
      document.getElementById('fotos')
    ];
  
    let botao = document.getElementById('botaoSalvarNotas');
    botao.disabled = true;
  
    function validarInputs() {
      let temNota = false;
      for (const category in cat.notas) {
        if (filledPawCounter >= 1){
            temNota = true;
            break;
        }
      }
      if (temNota) {
        botao.classList.remove('botaoSalvar--desabilitado');
        botao.disabled = false;
      } else {
        botao.classList.add('botaoSalvar--desabilitado');
        botao.disabled = true;
      }
    }
  
    for (let i = 0; i < elementos.length; i++) {
      elementos[i].addEventListener('input', validarInputs);
    }
  });
  */
let notaAtual = 0;

function renderCat(cat) {
  const catNameEl = document.querySelector('#nomeGato')
  const catPhotoEl = document.querySelector('#fotoGato')

  catNameEl.textContent = cat.nomeGato
  catPhotoEl.src = cat.fotoGato

  for (const category in cat.notas) {
    const div = document.querySelector(`#${category}`);
    let filledPawCounter = 0;
    notaAtual = cat.notas[category];
    for (let i = 0; i < 5; i++) {
      if (filledPawCounter < cat.notas[category]) {
        div.appendChild(createFilledPaw());
        filledPawCounter++;
      } else {
        div.appendChild(createEmptyPaw())
      }
    }
  }
}

function createFilledPaw() {
  const filledPaw = document.createElement('img')
  filledPaw.src = 'https://i.postimg.cc/hX9g5d5g/patinha.png'
  filledPaw.classList.add('iconePata--preenchida', 'iconePata')
  filledPaw.addEventListener('click', function () {
    mudarPatinha(filledPaw)
  });
  return filledPaw;
}

function createEmptyPaw() {
  const emptyPaw = document.createElement('img')
  emptyPaw.src = 'https://i.postimg.cc/G40dKQzq/patinha-1.png'
  emptyPaw.classList.add('iconePata');

  emptyPaw.addEventListener('click', function () {
    mudarPatinha(emptyPaw);
  });
  return emptyPaw
}

function mudarPatinha(paw) {
  if (paw.src.endsWith('patinha-1.png')) {
    paw.src = 'https://i.postimg.cc/hX9g5d5g/patinha.png';
    filledPawCounter++;
    updateCat(cat);

    // aumentar nota
  } else if (paw.src.endsWith('patinha.png')) {
    paw.src = 'https://i.postimg.cc/G40dKQzq/patinha-1.png';
    filledPawCounter--;
    updateCat(cat);
    // diminuir nota
  }

}

async function submitForm() {
  const catID = getParamID();
  const cat = await fetchCatByID(catID);
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

