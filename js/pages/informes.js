const mensajeAmarillo = document.getElementById('mensaje-amarillo')
const mensajeVerde = document.getElementById('mensaje-verde')
const mensajeRojo = document.getElementById('mensaje-rojo')
const mensajeCargando = document.getElementById('mensaje-cargando')
const informesContainer = document.getElementById('informe-container')

let informes = [];
let resultados = "";

let anioEleccion = '';
let tipoRecuento = '';
let tipoEleccion = '';
let categoriaId = '';
let distritoId = '';
let seccionProvincialId = '';
let seccionId = '';
let circuitoId = "";
let mesaId = "";

let añoSeleccionado = ""
let cargoSeleccionado = ""
let distritoSeleccionado = ""
let seccionSeleccionada = ""
let eleccion = ""

document.addEventListener('DOMContentLoaded', async () => {
    if (localStorage.getItem('INFORMES')) {
        informes = JSON.parse(localStorage.getItem('INFORMES'));
        const promises = informes.map(datos => {
            url = armarUrl(datos);
            return consultarResultados(url);
        });
        
    } else {
        mostrarMensaje(mensajeAmarillo, "Debe agregar un INFORME desde Paso o Generales primero!");
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

    anioEleccion = datos[0];
    tipoRecuento = datos[1];
    tipoEleccion = datos[2];
    categoriaId = datos[3];
    distritoId = datos[4];
    seccionProvincialId = datos[5];
    seccionId = datos[6];
    circuitoId = datos[7];
    mesaId = datos[8];
    añoSeleccionado = datos[9];
    cargoSeleccionado = datos[10];
    distritoSeleccionado = datos[11];
    seccionSeleccionada = datos[12];

    if (tipoEleccion == 1) {
        eleccion = "Paso"
    } else {
        eleccion = "Generales"
    }

    let urlSinParametros = `https://resultados.mininterior.gob.ar/api/resultados/getResultados`;
    let parametros = `?anioEleccion=${anioEleccion}&tipoRecuento=${tipoRecuento}&tipoEleccion=${tipoEleccion}&categoriaId=${categoriaId}&distritoId=${distritoId}&seccionProvincialId=${seccionProvincialId}&seccionId=${seccionId}&circuitoId=${circuitoId}&mesaId=${mesaId}`
    let url = urlSinParametros + parametros;
    console.log(url)
    return url;

}

async function consultarResultados(url) {
    try {
        console.log('entra en el try de consultar resultados')
        mensajeCargando.style.visibility = 'visible';
        let response = await fetch(url);
        console.log('hace el fetch')
        if (response.ok) {
            console.log('respuesta ok')
            mensajeCargando.style.visibility = 'hidden';
            resultados = await response.json();
            console.log(resultados)
            console.log(resultados.valoresTotalizadosPositivos)
            crearInforme(resultados);


        } else {
            mostrarMensaje(mensajeRojo, "Error. El servicio esta caido por el momento. Intente mas tarde.")
        }
    }
    catch (err) {
        mostrarMensaje(mensajeRojo, "Error. El servicio esta caido por el momento. Intente mas tarde.")
    }

}

function crearInforme(resultados) {
    console.log('resultados dentro de crear informe: ', resultados)
    try {
        let agrupaciones = resultados.valoresTotalizadosPositivos;
        const tr = document.createElement('tr');

        const tdProvincia = document.createElement('td');
        cambiarImagenProvincia(tdProvincia);

        const tdEleccion = document.createElement('td');

        const h4Eleccion = document.createElement('h4');
        h4Eleccion.textContent = `Elecciones ${anioEleccion} | ${eleccion}`;

        const pEleccion = document.createElement('p');
        pEleccion.classList.add('texto-path');
        pEleccion.textContent = `${anioEleccion}>${eleccion}>${cargoSeleccionado}>${distritoSeleccionado}>${seccionSeleccionada}`

        tdEleccion.appendChild(h4Eleccion);
        tdEleccion.appendChild(pEleccion);


        const tdCuadritos = document.createElement('td');

        const tdDatos = document.createElement('td');


        agrupaciones.forEach(agrupacion => {
            const p1Partido = document.createElement('p');// crea el <p> donde va el nombre de la lista//
            p1Partido.textContent = agrupacion.nombreAgrupacion;// agrega el nombre de la lista al <p>//

            const spanP1Partido = document.createElement('span'); //crea el span donve va el porcentaje de votos//
            const porcentajeVotos = `${agrupacion.votosPorcentaje}%`; // calculo el porcentaje y hago que solo tenga 2 decimales//
            spanP1Partido.textContent = porcentajeVotos;// agrega el porcentaje//
            spanP1Partido.classList.add('porcentajes'); //agrega el span a la clase porcentajes//

            const p2Partido = document.createElement('p'); //crea el elemnto <p> que va acontener el span con los votos//

            const spanP2Partido = document.createElement('span');// crea el span donve van los votos//
            spanP2Partido.textContent = `${agrupacion.votos} votos`; // formateo los votos para que se vean asi "XXX votos" //
            spanP2Partido.classList.add('porcentajes');

            tdDatos.appendChild(p1Partido);
            tdDatos.appendChild(p2Partido);

            p1Partido.appendChild(spanP1Partido);
            p2Partido.appendChild(spanP2Partido);
        });

        tr.appendChild(tdProvincia);
        tr.appendChild(tdEleccion);
        tr.appendChild(tdCuadritos);
        tr.appendChild(tdDatos);

        informesContainer.appendChild(tr);
    } catch (error) {
        console.log(resultados.valoresTotalizadosPositivos)
        console.log("No se creo el informe porque el resultado esta vacio")
    }
}

function ocultarMensajes() {
    mensajeCargando.style.visibility = 'hidden'
    mensajeRojo.style.visibility = 'hidden';
    mensajeAmarillo.style.visibility = 'hidden';
    mensajeVerde.style.visibility = 'hidden';
}


function cambiarImagenProvincia(svgContainer) {
    const provincia = provinciasSVG.find(

        (item) => item.provincia.toUpperCase() === distritoSeleccionado.toUpperCase()
    );

    if (provincia) {
        const divSvg = document.createElement('div');
        divSvg.innerHTML = provincia.svg;
        divSvg.classList.add('contenedor-provincia');

        svgContainer.appendChild(divSvg);
    } else {
        svgContainer.innerHTML = "<p>La imagen no se pudo cargar</p>";
    }
}