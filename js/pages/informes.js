let informes = [];

let anioEleccion = '';
let tipoRecuento = '';
let tipoEleccion = '';
let categoriaId = '';
let distritoId = '';
let seccionProvincialId = '';
let seccionId = '';
let circuitoId = "";
let mesaId = "";

document.addEventListener('DOMContentLoaded', () => {
    if (localStorage.getItem('INFORMES')) {
        informes = JSON.parse(localStorage.getItem('INFORMES'));
        console.log(informes);
        informes.forEach(datos => {

        });
    } else {
        mostrarMensaje(mensajeAmarillo, "Debe agregar un INFORME desde Paso o Generales primero!")
    }

});

function mostrarMensaje(tipoMensaje, mensaje,) {
    tipoMensaje.textContent = mensaje
    tipoMensaje.style.visibility = 'visible';
    setTimeout(function () {
        ocultarMensajes();
    }, 5000);
}

function armarUrl(data) {
    let datos = data.split('|');
    console.log(datos);

    anioEleccion = datos[0];
    tipoRecuento = datos[1];
    tipoEleccion = datos[2];
    categoriaId = datos[3];
    distritoId = datos[4];
    seccionProvincialId = datos[5];
    seccionId = datos[6];
    circuitoId = datos[7];
    mesaId = datos[8];

    const urlSinParametros = `https://resultados.mininterior.gob.ar/api/resultados/getResultados`;
    let parametros = `?anioEleccion=${anioEleccion}&tipoRecuento=${tipoRecuento}&tipoEleccion=${tipoEleccion}&categoriaId=${categoriaId}&distritoId=${distritoId}&seccionProvincialId=${seccionProvincialId}&seccionId=${seccionId}&circuitoId=${circuitoId}&mesaId=${mesaId}`
    let url = urlSinParametros + parametros;

    return url;
}

async function consultarResultados() {
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

}