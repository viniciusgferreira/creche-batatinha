'use strict'

// SALVA OS DADOS DO GATO EM UMA API MOCK
async function criarGato() {
  const inputCatName = document.querySelector('#inputCatName').value;
  const inputOwnerName = document.querySelector('#inputOwnerName').value;
  const inputCatPhoto = document.querySelector('#inputCatPhoto').files[0];
  const imagemPadrao = 'https://i.postimg.cc/ydxQRhj7/catImage.png'
  const url = 'https://644a8480a8370fb321510499.mockapi.io/api/v1/gatos';

  let base64 = '';
  if (inputCatPhoto) {
    base64 = await getBase64(inputCatPhoto)
  } else {
    base64 = await getBase64FromURL(imagemPadrao)
  }

  async function getBase64FromURL(url) {
    const response = await fetch(url);
    const blob = await response.blob();
    const base64 = await getBase64(blob);
    return base64;
  }
  
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
  
  const response = await fetch(url, {
    method: "POST",
    body: JSON.stringify({
      nomeGato: inputCatName,
      nomeDono: inputOwnerName,
      notas: {
        socializacao: 0,
        sonequinha: 0,
        alimentacao: 0,
        brincadeiras: 0,
        preguicinha: 0,
        fotos: 0
      },
      fotoGato: base64
    }),
    headers: {
      "Content-type": "application/json; charset=UTF-8"
    }
  });
  const responseCode = response.status;

  if (response.ok) {
    if (responseCode === 201) {
      sendNotification("success", "Dados salvos com sucesso!");
      setTimeout(() => {
        window.location.href = 'listar-gatos.html?added=1';
      }, 8000);
  } else {
    console.log(response.statusText)
  }}

}
// Mostrar preview da imagem do gato
const inputPhoto = document.getElementById('inputCatPhoto');
const previewImage = document.getElementById('previewImage');
const textoUpload = document.querySelector('.textoUpload');
const imagemPerfil = document.querySelector('.imagemPerfil');
const areaUpload = document.querySelector('.areaUpload');

inputPhoto.addEventListener('change', function(event) {
  const file = event.target.files[0];

  if (file) {
    const reader = new FileReader();
    textoUpload.classList.add('areaUpload--desabilitada');
    imagemPerfil.classList.add('areaUpload--desabilitada');
    areaUpload.classList.add('areaUpload--desabilitada');

    reader.onload = function(e) {
      previewImage.src = e.target.result;
    }

    reader.readAsDataURL(file);
  } else {
    previewImage.src = '#';
    textoUpload.classList.remove('areaUpload--desabilitada');
    imagemPerfil.classList.remove('areaUpload--desabilitada');
    areaUpload.classList.remove('areaUpload--desabilitada');
  }
});



// CONVERTE O ARQUIVO/IMAGEM DO GATO EM STRING BASE64 
function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = function () {
      resolve(reader.result)
    };
    reader.onerror = function (error) {
      console.log('Error: ', error);
      reject(error)
    };
    reader.readAsDataURL(file);

  })
}

document.addEventListener('DOMContentLoaded', function () {
  //validação input-botão
  let inputGato = document.getElementById('inputCatName');
  let inputDono = document.getElementById('inputOwnerName');
  let botao = document.getElementById('botaoCadastro');
  botao.disabled = true;

  function validarInputs() {
    if (inputGato.value.trim() !== '' && inputDono.value.trim() !== '') {
      botao.classList.remove('botaoCadastrar--desabilitado');
      botao.disabled = false;
    } else {
      botao.classList.add('botaoCadastrar--desabilitado');
      botao.disabled = true;
    }
  }
  //Ease-in e Ease-out do label

  inputGato.addEventListener('input', validarInputs);
  inputDono.addEventListener('input', validarInputs);
});


document.addEventListener('DOMContentLoaded', function () {
  let inputs = document.querySelectorAll('input');
  inputs.forEach(input => {
    input.oninput = function () {
      if (this.type !== 'file') {
        if (this.value.trim() !== '') {
          this.classList.add('input--preenchido');
        } else {
          this.classList.remove('input--preenchido');
        }
      }
    };
  });
});
