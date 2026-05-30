const card = document.querySelectorAll('.carta');

function virar(){
    this.classList.toggle('flip');
}

card.forEach(card => card.addEventListener('click', virar))
