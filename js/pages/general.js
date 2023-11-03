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
