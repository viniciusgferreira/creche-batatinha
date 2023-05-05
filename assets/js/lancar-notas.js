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
    const catNameEl = document.querySelector('#nomeGato')
    const catPhotoEl = document.querySelector('#fotoGato')

    catNameEl.textContent = cat.nomeGato
    catPhotoEl.src = cat.fotoGato

    for (const category in cat.notas) {
        const div = document.querySelector(`#${category}`);
        let filledPawCounter = 0;
        for (let i = 0; i < 5; i++) {
            if (filledPawCounter < cat.notas[category]) {
                div.appendChild(createPawFilled());
                filledPawCounter++;
            } else {
                div.appendChild(createPawEmpty())
            }
        }
    }
}

function createPawFilled() {
    const filledPaw = document.createElement('img')
    filledPaw.src = 'https://img.icons8.com/ios-filled/50/null/cat-footprint.png'
    filledPaw.classList.add('iconePata')
    return filledPaw;
}

function createPawEmpty() {
    const emptyPaw = document.createElement('img')
    emptyPaw.src = 'https://img.icons8.com/ios/50/000000/cat-footprint.png'
    emptyPaw.classList.add('iconePata')
    return emptyPaw
}

function lancarNotas() {
}