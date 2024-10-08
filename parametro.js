// Obtén la URL actual
const urlActual = window.location.href;

// Verifica si el parámetro 'nombre' ya está presente en la URL
const parametros = new URLSearchParams(window.location.search);
let carpetaNombre = parametros.get("-");

if (!carpetaNombre) {
    // Si 'nombre' no está presente, genera un número aleatorio
    carpetaNombre = generarCadenaAleatoria();
    // Agrega el parámetro 'nombre' a la URL
    const urlConParametro = urlActual.includes("?") ? `${urlActual}&-=${carpetaNombre}` : `${urlActual}?-=${carpetaNombre}`;
    // Redirige a la nueva URL con el parámetro 'nombre'
    window.location.href = urlConParametro;
} else {
    // Llama a la función para crear la carpeta con el nombre obtenido
    crearCarpeta(carpetaNombre);
}

// Función para generar una cadena aleatoria
function generarCadenaAleatoria() {
    const caracteres = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let cadenaAleatoria = '';
    for (let i = 0; i < 3; i++) {
        const caracterAleatorio = caracteres.charAt(Math.floor(Math.random() * caracteres.length));
        cadenaAleatoria += caracterAleatorio;
    }
    return cadenaAleatoria;
}

// Función para crear la carpeta
function crearCarpeta(carpetaNombre) {
    $.ajax({
        url: 'crearCarpeta.php',
        type: 'POST',
        data: { nombreCarpeta: carpetaNombre },
        success: function(response) {
            console.log('Carpeta creada con éxito:', response);
        },
        error: function(xhr, status, error) {
            console.error('Error al crear la carpeta:', error);
        }
    });
}

// Manejar la zona de arrastre y evitar que los archivos se abran
const dropArea = document.getElementById('drop-area');
const Form = document.getElementById('form');

dropArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropArea.classList.add('drag-over');
});

dropArea.addEventListener('dragleave', () => {
    dropArea.classList.remove('drag-over');
});

dropArea.addEventListener('drop', (e) => {
    e.preventDefault();
    dropArea.classList.remove('drag-over');
    const file = e.dataTransfer.files[0];
    handleFile(file);
});

function handleFile(file) {
    if (file) {
        const formattedFileName = file.name.replace(/\s+/g, '-');
        console.log('Archivo seleccionado:', formattedFileName);

        // Aquí puedes continuar con el proceso de subida del archivo al servidor
    }
}

// Manejar el envío del formulario
Form.addEventListener('submit', (e) => {
    e.preventDefault();
    const fileInput = Form.querySelector('#archivo');
    const file = fileInput.files[0];
    if (file) {
        const formattedFileName = file.name.replace(/\s+/g, '-');
        console.log('Subir archivo:', formattedFileName);
        // Aquí puedes enviar el archivo al servidor para su procesamiento
    } else {
        alert('Por favor, seleccione un archivo primero.');
    }
});

// Progreso de subida de archivos
function uploadFile(carpetaRuta, inputId) {
    var archivoInput = document.getElementById(inputId);
    var archivo = archivoInput.files[0];
    var progressBar = document.getElementById('progressBar');

    var formData = new FormData();
    formData.append('archivo', archivo);

    var xhr = new XMLHttpRequest();

    xhr.upload.onprogress = function (event) {
        if (event.lengthComputable) {
            var percentComplete = (event.loaded / event.total) * 100;
            progressBar.value = percentComplete;
        }
    };

    xhr.onload = function () {
        if (xhr.status === 200) {
            console.log('Archivo subido con éxito');
            // Acciones adicionales después de la carga
        } else {
            console.error('Error al subir el archivo');
        }
    };

    xhr.open('POST', 'upload.php', true);
    xhr.send(formData);
}