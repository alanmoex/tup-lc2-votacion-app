const tipoEleccion = 2;
const tipoRecuento = 1;
const periodosSelect = document.getElementById("año");
const cargosSelect = document.getElementById("cargo");
const distritosSelect = document.getElementById("distrito");
const seccionSelect = document.getElementById("seccion");
const inputSeccionProvincial = document.getElementById("hdSeccionProvincial")
const botonFiltrar = document.getElementById('filtrar')
const titulo = document.getElementById('titulo')
const subtitulo = document.getElementById('subtitulo')
const contenido = document.getElementById('sec-contenido')
const mensajeAmarillo = document.getElementById('mensaje-amarillo')
const mensajeVerde = document.getElementById('mensaje-verde')
const mensajeRojo = document.getElementById('mensaje-rojo')
const mensajeCargando = document.getElementById('mensaje-cargando')
const cuadroMesas = document.getElementById('cuadro-mesas')
const cuadroElectores = document.getElementById('cuadro-electores')
const cuadroParticipacion = document.getElementById('cuadro-participacion')
const svgContainer = document.getElementById('svg-container')

let añoSeleccionado = ""
let cargoSeleccionado = ""
let distritoSeleccionado = ""
let seccionSeleccionada = ""

let datosElecciones = "";

let datosElecciones = void



document.addEventListener('DOMContentLoaded', () => {
    mostrarMensaje(mensajeAmarillo, "Debe seleccionar los valores a filtrar y hacer clic en el botón FILTRAR")
});
document.addEventListener('DOMContentLoaded', consultarAños);
periodosSelect.addEventListener('change', consultarDatos);
cargosSelect.addEventListener('change', cargarDistritos);
distritosSelect.addEventListener('change', cargarSeccion);
seccionSelect.addEventListener('change', () => {
    seccionSeleccionada = seccionSelect.options[seccionSelect.selectedIndex].textContent;
});
botonFiltrar.addEventListener('click', consultarResultados);
botonFiltrar.addEventListener('click', mostrarTitulos);

function ocultarMensajes() {
    mensajeCargando.style.visibility = 'hidden'
    mensajeRojo.style.visibility = 'hidden';
    mensajeAmarillo.style.visibility = 'hidden';
    mensajeVerde.style.visibility = 'hidden';
}

function validarSelects() {
    return (periodosSelect.value !== 'none' && cargosSelect.value !== 'none' && distritosSelect.value !== 'none' && seccionSelect.value !== 'none')
}

function mostrarCampoFaltante() {
    if (periodosSelect.value == 'none'){
        mostrarMensaje(mensajeAmarillo, 'Por favor complete los campos de año, cargo, distrito y seccion antes de filtrar')
    }else if (cargosSelect.value =='none'){
        mostrarMensaje(mensajeAmarillo, 'Por favor complete los campos de cargo, distrito y seccion antes de filtrar')
    }else if (distritosSelect.value =='none'){
        mostrarMensaje(mensajeAmarillo, 'Por favor complete los campos de distrito y seccion antes de filtrar')
    }else{
        mostrarMensaje(mensajeAmarillo, 'Por favor complete el campos de seccion antes de filtrar')
    }
}

function mostrarTitulos() {
    titulo.textContent = `Elecciones ${periodosSelect.value} | Generales`
    subtitulo.textContent = `${añoSeleccionado}>Generales>${cargoSeleccionado}>${distritoSeleccionado}>${seccionSeleccionada}`
    titulo.style.visibility = 'visible';
    subtitulo.style.visibility = 'visible';
}

function mostrarContenido() {
    contenido.style.visibility = 'visible';
}

function cambiarImagenProvincia() {
    const svg = provinciasSVG.find(
        (item) => item.provincia === distritoSeleccionado
    );

    if (svg) {
        svgContainer.innerHTML = svg.svg;
    } else {
        svgContainer.innerHTML = "<p>No se encontró el SVG para la provincia seleccionada</p>";
    }
}

async function consultarResultados() {
    if (validarSelects()) {
        ocultarMensajes();
        const url = `https://resultados.mininterior.gob.ar/api/resultados/getResultados`
        let anioEleccion = periodosSelect.value;
        let categoriaId = 2;
        let distritoId = distritosSelect.value;
        let seccionProvincialId = 0; //tiene que ir 0 porque no reconoce el null
        let seccionId = seccionSelect.value;
        let circuitoId = "";
        let mesaId = "";
        let parametros = `?anioEleccion=${anioEleccion}&tipoRecuento=${tipoRecuento}&tipoEleccion=${tipoEleccion}&categoriaId=${categoriaId}&distritoId=${distritoId}&seccionProvincialId=${seccionProvincialId}&seccionId=${seccionId}&circuitoId=${circuitoId}&mesaId=${mesaId}`
        try {
            mensajeCargando.style.visibility = 'visible';
            const response = await fetch(url + parametros);
            if (response.ok) {
                mensajeCargando.style.visibility = 'hidden';
                const data = await response.json();
                console.log(data)
                mostrarTitulos();
                //cambiarImagenProvincia();
                mostrarContenido();
                cuadroMesas.textContent = `${data.estadoRecuento.mesasTotalizadas}`
                cuadroElectores.textContent = `${data.estadoRecuento.cantidadElectores}`
                cuadroParticipacion.textContent = `${data.estadoRecuento.participacionPorcentaje}%`
            } else {
                mostrarMensaje(mensajeRojo, "Error. El servicio esta caido por el momento. Intente mas tarde.")
            }
        }
        catch (err) {
            mostrarMensaje(mensajeRojo, "Error. El servicio esta caido por el momento. Intente mas tarde.")
        }
    }else{
        mostrarCampoFaltante();
    }

}

function limpiarSelect(select) {
    while (select.options.length > 1) {
        select.remove(1);
    }
}

function cargarSeccion() {
    distritoSeleccionado = distritosSelect.options[distritosSelect.selectedIndex].textContent;
    limpiarSelect(seccionSelect)

    datosElecciones.forEach((eleccion) => {
        if (eleccion.IdEleccion == tipoEleccion) {
            eleccion.Cargos.forEach((cargo) => {
                if (cargo.IdCargo == cargosSelect.value) {
                    cargo.Distritos.forEach((distrito) => {
                        if (distrito.IdDistrito == distritosSelect.value) {
                            distrito.SeccionesProvinciales.forEach((seccionProvincial) => {
                                inputSeccionProvincial.id = seccionProvincial.IDSeccionProvincial; // da error porque el id es null
                                seccionProvincial.Secciones.forEach((seccion) => {
                                    const option = document.createElement('option');
                                    option.value = seccion.IdSeccion;
                                    option.textContent = seccion.Seccion;
                                    seccionSelect.appendChild(option);
                                })
                            })
                        }
                    });
                }
            });
        }
    });
}

function cargarDistritos() {
    cargoSeleccionado = cargosSelect.options[cargosSelect.selectedIndex].textContent;
    limpiarSelect(distritosSelect)

    datosElecciones.forEach((eleccion) => {
        if (eleccion.IdEleccion == tipoEleccion) {
            eleccion.Cargos.forEach((cargo) => {
                if (cargo.IdCargo == cargosSelect.value) {
                    cargo.Distritos.forEach((distrito) => {
                        const option = document.createElement('option');
                        option.value = distrito.IdDistrito;
                        option.textContent = distrito.Distrito;
                        distritosSelect.appendChild(option);
                    });
                }
            });
        }
    });
}



async function consultarAños() {
    const url = `https://resultados.mininterior.gob.ar/api/menu/periodos`
    try {
        const response = await fetch(url);

        if (response.ok) {
            const data = await response.json();
            data.forEach((item) => {
                const option = document.createElement('option');
                option.value = item;
                option.text = item;
                periodosSelect.appendChild(option);
            });
        } else {
            mostrarMensaje(mensajeRojo, "Error. El servicio esta caido por el momento. Intente mas tarde.")
        }
    }
    catch (err) {
        mostrarMensaje(mensajeRojo, "Error. El servicio esta caido por el momento. Intente mas tarde.")
    }
}

async function consultarDatos() {
    añoSeleccionado = periodosSelect.options[periodosSelect.selectedIndex].textContent;
    const url = "https://resultados.mininterior.gob.ar/api/menu?año="
    try {

        const response = await fetch(url + periodosSelect.value);

        if (response.ok) {
            limpiarSelect(cargosSelect)

            datosElecciones = await response.json();
            datosElecciones.forEach((eleccion) => {
                if (eleccion.IdEleccion == tipoEleccion) {
                    eleccion.Cargos.forEach((cargo) => {
                        const option = document.createElement('option');
                        option.value = cargo.IdCargo;
                        option.text = cargo.Cargo;
                        cargosSelect.appendChild(option);
                    });
                }

            });
        } else {
            mostrarMensaje(mensajeRojo, "Error. El servicio esta caido por el momento. Intente mas tarde.")
        }
    }
    catch (err) {
        mostrarMensaje(mensajeRojo, "Error. El servicio esta caido por el momento. Intente mas tarde.")
    }
}

function agregarInforme() {
    const nuevoInforme = {
        vAnio: periodosSelect.value,
        vTipoRecuento: tipoRecuento,
        vTipoEleccion: tipoEleccion,
        vCategoriaId: 2,
        vDistrito: distritosSelect.value,
        vSeccionProvincial: 0,
        seccionId: seccionSelect.value,
        circuitoId: "",
        mesaId: "",

    }

    let informes = JSON.parse(localStorage.getItem('INFORMES')) || [];

    if (informes.includes(nuevoInforme)) {
        mostrarMensaje(tipoMensaje, "El informe ya se encuentra añadido.")
    } else {
        informes.push(nuevoInforme);
        localStorage.setItem('INFORMES', JSON.stringify(informes));
        mostrarMensaje(mensajeVerde, "Informe agregado con exito")
    }
}

function mostrarMensaje(tipoMensaje, mensaje,) {
    tipoMensaje.textContent = mensaje
    tipoMensaje.style.visibility = 'visible';
    setTimeout(function () {
        ocultarMensajes();
    }, 5000);
}