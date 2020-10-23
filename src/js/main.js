const disableScroll = function() {
    let paddingOffset = window.innerWidth - document.body.offsetWidth + 'px'
    document.body.classList.toggle('scroll-lock')
    document.body.style.paddingRight = paddingOffset
}

const burger = document.querySelector('.menu-icon').addEventListener('click', function() {
    const menu = document.querySelector('.menu')
    this.classList.toggle('menu-icon__active')
    menu.classList.toggle('menu__active')
    disableScroll()

    let links = document.querySelectorAll('.menu__link').forEach(element => {
        element.onclick = () => {
            menu.classList.toggle('menu__active')
            this.classList.toggle('menu-icon__active')
            disableScroll()
        }
    })
})