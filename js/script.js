document.addEventListener('DOMContentLoaded', function() {
  'use strict';
  
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