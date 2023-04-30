document.getElementById('hamburger').addEventListener('click', function () {
  document.getElementById('controls').classList.toggle('responsive')
  document.getElementById('hamburger').classList.toggle('active')
})

document.getElementById('overlay_container').addEventListener('click', function () {
  if (this.style.display !== 'none') {
    this.style.display = 'none'
  }
})

document.getElementById('modal_container').addEventListener('click', function (event) {
  event.preventDefault()
  event.stopPropagation()
  return false;
})

document.getElementById('closeModal').addEventListener('click', function () {
  document.getElementById('overlay_container').style.display = 'none'
})
function reset () {
  let node

  for (let i = 0; i < 25; i++) {
    node = document.getElementById('node' + i)
    node.classList.remove('hit')
  }
}

function openModal (which) {
  const modals = [
    'settings',
    'help',
    'about'
  ]

  modals.forEach((m) => {
    if (m !== which) {
      document.getElementById(m).style.display = 'none'
    }
  })

  document.getElementById('modal_title_text').innerText = which[0].toUpperCase() + which.slice(1)

  document.getElementById(which).style.display = 'block'

  document.getElementById('overlay_container').style.display = 'block'

  document.getElementById('controls').classList.toggle('responsive')
  document.getElementById('hamburger').classList.toggle('active')
}