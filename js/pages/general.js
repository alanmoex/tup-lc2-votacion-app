const tipoEleccion = 2;
const tipoRecuento = 1;
const periodosSelect = document.getElementById("año");
const cargosSelect = document.getElementById("cargo");
const distritosSelect = document.getElementById("distrito");

let datosElecciones = void

document.addEventListener('DOMContentLoaded', consultarAños);
periodosSelect.addEventListener('change', consultarDatos);
cargosSelect.addEventListener('change', cargarDistritos);

function cargarDistritos() {
    while (distritosSelect.options.length > 1) {
        distritosSelect.remove(1);
    }
    
    datosElecciones.forEach((eleccion) => {
        if (eleccion.IdEleccion == tipoEleccion) {
            eleccion.Cargos.forEach((cargo) => {
                if (cargo.IdCargo == cargosSelect.value)  {
                    cargo.Distritos.forEach((distrito) => {
                        console.log(distrito)
                        const option = document.createElement('option');
                        option.value = distrito.IdDistrito;
                        option.text = distrito.Distrito;
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
            //tarjeta.innerText = 'Hubo un error al consultar la API'
        }
    }
    catch (err) {
        //tarjeta.innerText = 'Hubo un error al consultar la API'
    }
}

async function consultarDatos() {
    const url = "https://resultados.mininterior.gob.ar/api/menu?año="
    try {
        const response = await fetch(url + periodosSelect.value);

        if (response.ok) {
            while (cargosSelect.options.length > 1) {
                cargosSelect.remove(1);
            }
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
            //tarjeta.innerText = 'Hubo un error al consultar la API'
        }
    }
    catch (err) {
        //tarjeta.innerText = 'Hubo un error al consultar la API'
    }
}