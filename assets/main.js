 
  // SALVA OS DADOS DO GATO EM UMA API MOCK
function criarGato() {
  const inputCatName = document.querySelector('#inputCatName').value;
  const inputOwnerName = document.querySelector('#inputOwnerName').value;
  const inputCatPhoto = document.querySelector('#inputCatPhoto').files[0];

  const url = 'https://644a8480a8370fb321510499.mockapi.io/api/v1/gatos';

  getBase64(inputCatPhoto)
      .then(async (base64) => {
          await fetch(url, {
              method: "POST",
              body: JSON.stringify({
                  nomeGato: inputCatName,
                  nomeDono: inputOwnerName,
                  notaGato: 0,
                  fotoGato: base64
              }),
              headers: {
                  "Content-type": "application/json; charset=UTF-8"
              }
          });
      })
      .catch((error) => console.log(error))
      .finally(() => {
          console.log('data saved.')
          window.location.href = 'listar-gatos.html?added=1'
      })

  return false;
}

// CONVERTE O ARQUIVO/IMAGEM DO GATO EM STRING BASE64 
function getBase64(file) {
  return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = function () {
          resolve(reader.result)
      };
      reader.onerror = function (error) {
          console.log('Error: ', error);
          reject(error)
      };

  })
}
document.addEventListener('DOMContentLoaded', function() {
  'use strict';
//validação input-botão
  let inputGato = document.getElementById('inputCatName');
  let inputDono = document.getElementById('inputOwnerName');
  let botao = document.getElementById('botaoCadastro');
  botao.disabled = true; // desabilita o botão no início

  function validarInputs() {
    if (inputGato.value.trim() !== '' && inputDono.value.trim() !== '') {
      botao.classList.remove('botaoCadastrar--desabilitado');
      botao.disabled = false;
    } else {
      botao.classList.add('botaoCadastrar--desabilitado');
      botao.disabled = true;
    }
  }

  inputGato.addEventListener('input', validarInputs);
  inputDono.addEventListener('input', validarInputs);
});
