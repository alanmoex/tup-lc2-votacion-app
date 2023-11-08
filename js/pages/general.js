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
const cuadroAgrupaciones = document.getElementById('cuadro-agrupaciones')
const cuadroResumenVotos = document.getElementById('cuadro-resumen')
const botonAgregarInforme = document.getElementById('agregar-informe')

let añoSeleccionado = ""
let cargoSeleccionado = ""
let distritoSeleccionado = ""
let seccionSeleccionada = ""

let resultados = "";

let agrupacionesYColores = {}

let coloresGraficaPlenos = [
    getComputedStyle(document.documentElement).getPropertyValue('--grafica-amarillo'),
    getComputedStyle(document.documentElement).getPropertyValue('--grafica-celeste'),
    getComputedStyle(document.documentElement).getPropertyValue('--grafica-bordo'),
    getComputedStyle(document.documentElement).getPropertyValue('--grafica-lila'),
    getComputedStyle(document.documentElement).getPropertyValue('--grafica-lila2'),
    getComputedStyle(document.documentElement).getPropertyValue('--grafica-verde'),
    getComputedStyle(document.documentElement).getPropertyValue('--grafica-gris')
]
let coloresGraficaLivianos = [
    getComputedStyle(document.documentElement).getPropertyValue('--grafica-amarillo-claro'),
    getComputedStyle(document.documentElement).getPropertyValue('--grafica-celeste-claro'),
    getComputedStyle(document.documentElement).getPropertyValue('--grafica-bordo-claro'),
    getComputedStyle(document.documentElement).getPropertyValue('--grafica-lila-claro'),
    getComputedStyle(document.documentElement).getPropertyValue('--grafica-lila2-claro'),
    getComputedStyle(document.documentElement).getPropertyValue('--grafica-verde-claro'),
    getComputedStyle(document.documentElement).getPropertyValue('--grafica-gris-claro')
]




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
botonAgregarInforme.addEventListener('click', agregarInforme);


function crearListaAgrupacionesYColores() {
    let agrupaciones = resultados.valoresTotalizadosPositivos.sort((a, b) => b.votos - a.votos);
    let cont = 0
    agrupaciones.forEach(agrupacion => {
        let idAgrupacion = agrupacion.idAgrupacion

        if (cont < 6) {
            agrupacionesYColores[idAgrupacion] = {
                colorPleno: coloresGraficaPlenos[cont],
                colorLiviano: coloresGraficaLivianos[cont]
            };
            cont++;
        } else {
            agrupacionesYColores[idAgrupacion] = {
                colorPleno: coloresGraficaPlenos[cont],
                colorLiviano: coloresGraficaLivianos[cont]
            };
        }
    })
}

function completarCuadroAgrupaciones() {
    let agrupaciones = resultados.valoresTotalizadosPositivos.sort((a, b) => b.votos - a.votos);

    while (cuadroAgrupaciones.firstChild) {
        cuadroAgrupaciones.removeChild(cuadroAgrupaciones.firstChild);
    }

    if (agrupaciones) {
        agrupaciones.forEach(agrupacion => {

            const divAgrupacion = document.createElement('div');
            divAgrupacion.classList.add('agrupacion');

            const h4Titulo = document.createElement('h4');
            h4Titulo.classList.add('titulo-agrupaciones');

            h4Titulo.textContent = agrupacion.nombreAgrupacion;

            divAgrupacion.appendChild(h4Titulo);

            const divPartido = document.createElement('div'); //crea el div el partido//
            divPartido.classList.add('partido'); //lo añade a la clase partido//

            const p1Partido = document.createElement('p');// crea el <p> donde va el nombre de la lista//
            p1Partido.textContent = agrupacion.nombreAgrupacion;// agrega el nombre de la lista al <p>//

            const spanP1Partido = document.createElement('span'); //crea el span donve va el porcentaje de votos//
            const porcentajeVotos = `${agrupacion.votosPorcentaje}%`; // calculo el porcentaje y hago que solo tenga 2 decimales//
            spanP1Partido.textContent = porcentajeVotos;// agrega el porcentaje//
            spanP1Partido.classList.add('porcentajes'); //agrega el span a la clase porcentajes//

            const p2Partido = document.createElement('p'); //crea el elemnto <p> que va acontener el span con los votos//

            const spanP2Partido = document.createElement('span');// crea el span donve van los votos//
            spanP2Partido.textContent = `${agrupacion.votos} votos`; // formateo los votos para que se vean asi "XXX votos" //
            spanP2Partido.classList.add('porcentajes'); //agrega el span a la clase porcentajes//

            const divBarra = document.createElement('div');// crea el div que tiene el fondo de la barra de progreso//
            divBarra.classList.add('progress'); //agrega el div a la clase progress//

            const idAgrupacion = agrupacion.idAgrupacion.toString(); //convierte el id de la agrupacion en string 
            divBarra.style.background = agrupacionesYColores[idAgrupacion].colorLiviano; //busca el id de la agrupacion en la lista de agrupacion y colores y extra el color para el fondo de la barra

            const divProgresoBarra = document.createElement('div'); // crea el div que tiene la barra de progreso//
            divProgresoBarra.classList.add('progress-bar'); //agrega el div a la clase progress-bar//

            divProgresoBarra.style.background = agrupacionesYColores[idAgrupacion].colorPleno; //busca el id de la agrupacion en la lista de agrupacion y colores y extra el color para la barra
            divProgresoBarra.style.width = porcentajeVotos; //le da a la barra un ancho igual al porcentaje de votos

            const spanDivProgresoBarra = document.createElement('span'); // crea el span de adentro de la barra que dice el porcentaje//
            spanDivProgresoBarra.textContent = porcentajeVotos; // agrega el porcentaje al span//
            spanDivProgresoBarra.classList.add('progress-bar-text');// agrega el span a la clase progress-bar-text//

            divPartido.appendChild(p1Partido);
            divPartido.appendChild(p2Partido);
            divPartido.appendChild(divBarra);

            p1Partido.appendChild(spanP1Partido);
            p2Partido.appendChild(spanP2Partido);

            divBarra.appendChild(divProgresoBarra);

            divProgresoBarra.appendChild(spanDivProgresoBarra);


            divAgrupacion.appendChild(divPartido);

            cuadroAgrupaciones.appendChild(divAgrupacion);
        })
    }

}

function completarResumenVotos() {
    let agrupaciones = resultados.valoresTotalizadosPositivos;
    let cont = 0;

    while (cuadroResumenVotos.firstChild) {
        cuadroResumenVotos.removeChild(cuadroResumenVotos.firstChild);
    }

    agrupaciones.forEach(agrupacion => {
        if (cont < 7) {
            const divBarra = document.createElement('div');
            divBarra.classList.add('bar');
            divBarra.style.width = `${agrupacion.votosPorcentaje}%`;
            divBarra.style.background = agrupacionesYColores[agrupacion.idAgrupacion].colorPleno;
            divBarra.dataset.name = agrupacion.nombreAgrupacion;
            divBarra.title = `${agrupacion.nombreAgrupacion} ${agrupacion.votosPorcentaje}%`;
            cont++;

            cuadroResumenVotos.appendChild(divBarra);
        }
    })
}

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
    if (periodosSelect.value == 'none') {
        mostrarMensaje(mensajeAmarillo, 'Por favor complete los campos de año, cargo, distrito y seccion antes de filtrar')
    } else if (cargosSelect.value == 'none') {
        mostrarMensaje(mensajeAmarillo, 'Por favor complete los campos de cargo, distrito y seccion antes de filtrar')
    } else if (distritosSelect.value == 'none') {
        mostrarMensaje(mensajeAmarillo, 'Por favor complete los campos de distrito y seccion antes de filtrar')
    } else {
        mostrarMensaje(mensajeAmarillo, 'Por favor complete el campos de seccion antes de filtrar')
    }
}

function mostrarTitulos() {
    titulo.textContent = `Elecciones ${periodosSelect.value} | Paso`
    subtitulo.textContent = `${añoSeleccionado}>Generales>${cargoSeleccionado}>${distritoSeleccionado}>${seccionSeleccionada}`
    titulo.style.visibility = 'visible';
    subtitulo.style.visibility = 'visible';
}

function mostrarContenido() {
    contenido.style.visibility = 'visible';
}

function cambiarImagenProvincia() {
    while (svgContainer.firstChild) {
        svgContainer.removeChild(svgContainer.firstChild);
    }

    const provincia = provinciasSVG.find(

        (item) => item.provincia.toUpperCase() === distritoSeleccionado.toUpperCase()
    );

    if (provincia) {
        const h3Provincia = document.createElement('h3');
        h3Provincia.textContent = provincia.provincia;
        h3Provincia.classList.add('titulo-cuadros', 'titulo-provincias');

        const divSvg = document.createElement('div');
        divSvg.innerHTML = provincia.svg;
        divSvg.classList.add('contenedor-provincia');

        svgContainer.appendChild(h3Provincia);
        svgContainer.appendChild(divSvg);
    } else {
        svgContainer.innerHTML = "<p>La imagen no se pudo cargar</p>";
    }
}

async function consultarResultados() {
    if (validarSelects()) {
        ocultarMensajes();
        const url = `https://resultados.mininterior.gob.ar/api/resultados/getResultados`
        let anioEleccion = periodosSelect.value;
        let categoriaId = cargosSelect.value;
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
                resultados = await response.json();
                console.log(resultados)
                mostrarTitulos();
                cambiarImagenProvincia();
                crearListaAgrupacionesYColores();
                completarCuadroAgrupaciones();
                completarResumenVotos();
                mostrarContenido();
                cuadroMesas.textContent = `${resultados.estadoRecuento.mesasTotalizadas}`
                cuadroElectores.textContent = `${resultados.estadoRecuento.cantidadElectores}`
                cuadroParticipacion.textContent = `${resultados.estadoRecuento.participacionPorcentaje}%`
            } else {
                mostrarMensaje(mensajeRojo, "Error. El servicio esta caido por el momento. Intente mas tarde.")
            }
        }
        catch (err) {
            mostrarMensaje(mensajeRojo, "Error. El servicio esta caido por el momento. Intente mas tarde.")
        }
    } else {
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
            const años = await response.json();
            años.forEach((item) => {
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
        ocultarMensajes();
        mostrarMensaje(mensajeRojo, "Error. El servicio esta caido por el momento. Intente mas tarde.")
        setInterval(function () {
            mensajeRojo.style.visibility = 'visible'
        }, 5000);
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
    let vAnio = periodosSelect.value;
    let vTipoRecuento = tipoRecuento;
    let vTipoEleccion = tipoEleccion;
    let vCategoriaId = 2;
    let vDistrito = distritosSelect.value;
    let vSeccionProvincial = 0;
    let seccionId = seccionSelect.value;
    let circuitoId = "";
    let mesaId = "";

    nuevoInforme = `${vAnio}|${vTipoRecuento}|${vTipoEleccion}|${vCategoriaId}|${vDistrito}|${vSeccionProvincial}|${seccionId}|${circuitoId}|${mesaId}`

    let informes = [];

    if (localStorage.getItem('INFORMES')) {
        informes = JSON.parse(localStorage.getItem('INFORMES'));
    }

    console.log(informes);
    console.log(nuevoInforme);

    if (informes.includes(nuevoInforme)) {
        mostrarMensaje(mensajeAmarillo, "El informe ya se encuentra añadido.");
    } else {
        informes.push(nuevoInforme);
        localStorage.setItem('INFORMES', JSON.stringify(informes));
        mostrarMensaje(mensajeVerde, "Informe agregado con éxito");
    }
}

function mostrarMensaje(tipoMensaje, mensaje,) {
    tipoMensaje.textContent = mensaje
    tipoMensaje.style.visibility = 'visible';
    setTimeout(function () {
        ocultarMensajes();
    }, 5000);
}