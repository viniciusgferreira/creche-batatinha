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
      window.location.href = 'listar-gatos.html?fromCadastro=1';
    } else {
      console.log(response.statusText);
    }
  }  

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
