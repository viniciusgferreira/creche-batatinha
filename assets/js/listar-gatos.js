'use strict';

document.addEventListener('DOMContentLoaded', loadCats)

// Call api before DOM loaded event
let catsData = fetchCats()

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
