const tipoEleccion = 2;
const tipoRecuento = 1;
const periodosSelect = document.getElementById("año");

document.addEventListener('DOMContentLoaded', consultarDatos);

async function consultarDatos() {
    const url = `https://resultados.mininterior.gob.ar/api/menu/periodos`
    try{
        const response = await fetch(url);
        console.log(response);

        if(response.ok){
            const data = await response.json();
            console.log(data);
            data.forEach((item) => {
                const option = document.createElement('option');
                option.value = item;
                option.text = item;
                periodosSelect.appendChild(option);
              });
        }else{
            //tarjeta.innerText = 'Hubo un error al consultar la API'
            pass
        }
    }
    catch (err){
        //tarjeta.innerText = 'Hubo un error al consultar la API'
        pass
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