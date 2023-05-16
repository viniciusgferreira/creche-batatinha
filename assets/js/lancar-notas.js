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


function sendNotification(type, text, duration = 25000) {
  const notificationBox = document.querySelector(".notification-box");

  const alerts = {
    success: {
      icon: `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g clip-path="url(#clip0_1021_117)">
      <path d="M5.99984 13.3333H11.9998C12.5532 13.3333 13.0265 13 13.2265 12.52L15.2398 7.82C15.2998 7.66667 15.3332 7.50667 15.3332 7.33333V6C15.3332 5.26667 14.7332 4.66667 13.9998 4.66667H9.79317L10.4265 1.62L10.4465 1.40667C10.4465 1.13333 10.3332 0.88 10.1532 0.7L9.4465 0L5.05317 4.39333C4.81317 4.63333 4.6665 4.96667 4.6665 5.33333V12C4.6665 12.7333 5.2665 13.3333 5.99984 13.3333ZM5.99984 5.33333L8.89317 2.44L7.99984 6H13.9998V7.33333L11.9998 12H5.99984V5.33333ZM0.666504 5.33333H3.33317V13.3333H0.666504V5.33333Z" fill="white"/>
      </g>
      <defs>
      <clipPath id="clip0_1021_117">
      <rect width="16" height="16" fill="white"/>
      </clipPath>
      </defs>
      </svg>`,
      color: "success"
    }
  };


  const component = document.createElement("div");
  component.className = `notification ${alerts[type].color}`;
  component.innerHTML = `
    ${alerts[type].icon}
    <p>${text}</p>
    <button class="close-button" type="button" aria-label="Close">&times;</button>
  `;
  notificationBox.appendChild(component);

  const closeNotification = () => {
    component.style.opacity = "0";
    component.style.transform = "translateY(-100%)";
    component.addEventListener("transitionend", () => {
      notificationBox.removeChild(component);
    }, { once: true });
  };

  let timeoutID = setTimeout(closeNotification, duration);

  const closeButton = component.querySelector(".close-button");
  if (closeButton) {
    closeButton.addEventListener("click", () => {
      clearTimeout(timeoutID);
      closeNotification();
    });
  }

  // Mostrar a notificação
  component.style.opacity = "1";
  component.style.transform = "translateY(0)";
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

    const responseCode = response.status;

    if (response.ok) {
      if (responseCode === 200) {
        sendNotification("success", "Notas salvas com sucesso!");
    } else {
      console.log(response.statusText)
    }}
    
    console.log(updatedCat);
    console.log(response.status);
  } catch (error) {
    console.log(error);
  }
}

document.querySelector('#botaoSalvarNotas').onclick = submitForm;

