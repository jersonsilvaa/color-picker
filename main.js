const $ = selector => document.querySelector(selector)
const $$ = selector => document.querySelectorAll(selector)

const colorPicker = $('#color__picker')
const colorList = $('.all__colors')
const clearAll = $('.clear__all')


// Cuando se copia el color deseado, se activa un texto por un tiempo y luego desaparece
const copyColor = el => {
    navigator.clipboard.writeText(el.dataset.color)
    el.innerText = 'copiado'
    setTimeout(() => el.innerText = el.dataset.color, 1000)
}

// Seleccionamos lo que esté dentro del local storage, sí no hay nada, será un array vacío
const pickedColors = JSON.parse(localStorage.getItem('picked__colors') || '[]')

// Mostramos los colores según sean seleccionados
const showColors = () => {
    if (!pickedColors.length) return
    colorList.innerHTML = pickedColors.map(color => `
        <li class="color">
            <span class="rect"
                style="background: ${color}; border: 1px solid ${color === '#ffffff' ? '#ccc' : color}"></span>
            <span class="value" data-color="${color}">${color}</span>
        </li>
        `)
        // Generando la lista con los colores seleccionados para añadirlos al cuerpo de los colores
        .join('')

    $('.picked__colors').classList.remove('hidden')

    // Añadir un evento al dar clic para copiar el elemento deseado
    $$('.color').forEach(li => {
        li.addEventListener('click', e => copyColor(e.currentTarget.lastElementChild))
    })

}

showColors()
// Eliminando los colores guardados en el localstorage
const clearAllColors = () => {
    pickedColors.length = 0
    localStorage.setItem('picked__colors', JSON.stringify(pickedColors))
    $('.picked__colors').classList.add('hidden')
}

const activateEyeDropper = async () => {
    try {
        // Creamos la propiedad EyeDropper para que se nos abra la herramienta de selección
        const eyeDropper = new EyeDropper()

        // Guarda El hexadecimal del color seleccionado
        const { sRGBHex } = await eyeDropper.open()

        // Se pasa el valor hexadecimal al portapapeles
        navigator.clipboard.writeText(sRGBHex)

        // Sí el color ya existe, no se agrega
        if (!pickedColors.includes(sRGBHex)) {
            // Agrega el valor hexadecimal a los colores que fueron seleccionados dentro de un array
            pickedColors.push(sRGBHex)

            // Se guarda el valor hexadecimal en el localstorage para que el usuario tenga acceso a ellos
            // de una forma más sencilla.
            localStorage.setItem('picked__colors', JSON.stringify(pickedColors))

            showColors()
        }

    } catch (err) {
        console.error(err)
    }
}

// Eventos de click
colorPicker.addEventListener('click', activateEyeDropper)
clearAll.addEventListener('click', clearAllColors)