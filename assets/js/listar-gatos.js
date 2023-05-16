'use strict';

document.addEventListener('DOMContentLoaded', loadCats)

// Call api before DOM loaded event
let catsData = fetchCats()

function sendNotification(type, text, duration = 8000) {
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
  
    // Mostrar a notificação!!!!!!!1
    component.style.opacity = "1";
    component.style.transform = "translateY(0)";
  }
// Verificar se a página foi aberta a partir da página de cadastro
const urlParams = new URLSearchParams(window.location.search);
const openedFromCadastro = urlParams.has('fromCadastro');

if (openedFromCadastro) {
// A página foi aberta a partir da página de cadastro, mostrar a notificação
document.addEventListener('DOMContentLoaded', function() {
    sendNotification('success', 'Dados salvos com sucesso!');
});} 

async function loadCats() {
    const catList = await catsData

    // Create all cats elements
    for (let i = 0; i < catList.length; i++) {
        createItem(catList[i])
    }
}

function createItem(catObject) {
    const ul = document.querySelector('#idLista');

    const li = document.createElement('li')
    li.classList.add('gatoItemLista')

    const div = document.createElement('div')

    const img = document.createElement('img')
    img.classList.add('imagemGato')
    img.width = 50
    img.height = 50
    img.src = catObject.fotoGato

    const span = document.createElement('span')
    span.textContent = catObject.nomeGato

    const a = document.createElement('a')
    a.href = `lancar-notas.html?id=${catObject.id}`
    a.innerText = 'Lançar notas'
    a.classList.add('link-lancar-notas')

    ul.appendChild(li)
    li.appendChild(div)
    div.appendChild(img)
    div.appendChild(span)
    li.appendChild(a)

}

  
async function fetchCats() {
    const url = 'https://644a8480a8370fb321510499.mockapi.io/api/v1/gatos';

    try {
        const response = await fetch(url)
        const catList = await response.json()
        return catList
    } catch (error) {
        console.log(error)
    }
}
