let formNombre = document.getElementById("busquedaNombre");
let formNivel = document.getElementById("busquedaNivel");
let formCrearDigimon = document.getElementById("formCrearDigimon");

const urlBase = "http://localhost:3000/api/digimones/";

formNombre.addEventListener("submit", (event) => {
    event.preventDefault();
    let nombre = searchNombre.value;
    getData(`nombre/${nombre}`).then((digimon) => {
        cardTitle.innerHTML = digimon.name;
        cardDescription.innerHTML = digimon.level;
        cardImg.setAttribute("src", digimon.img);
        cardImg.setAttribute("alt", digimon.name);
        card.classList.remove("d-none");
    });
});

formNivel.addEventListener("submit", (event) => {
    event.preventDefault();
    let nivel = document.getElementById("nivelDigimon").value;
    console.log(nivel);
    if (nivel == "default") {
        return alert("Debe elegir un nivel.");
    }
    getData(`nivel/${nivel}`)
        .then((digimones) => {
            let tablaDigimones = document.querySelector(
                "#tablaDigimones tbody"
            );

            let filas = "";
            let contador = 1;
            for (const digimon of digimones) {
                filas += `
						<tr>
							<th scope="row">${contador}</th>
							<td><img src="${digimon.img}" alt"${digimon.name}></img></td>
							<td>${digimon.name}</td>
							<td>${digimon.level}</td>
						</tr>
				`;
                contador++;
            }
            tablaDigimones.innerHTML = filas;
        })
        .catch((error) => {
            alert("Error al buscar los digimones");
        });
});

formCrearDigimon.addEventListener("submit", async (event) => {
    try {
        event.preventDefault();
        let nuevoDigimon = {
            name: document.getElementById("createNombre").value,
            img: document.getElementById("createImagen").value,
            level: document.getElementById("createNivel").value,
        };

        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        const requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: JSON.stringify(nuevoDigimon),
            redirect: "follow",
        };

        let response = await fetch(
            "http://localhost:3000/api/digimones",
            requestOptions
        );
        let data = await response.json();

        if (response.status == 201) {
            alert(`Se ha creado correctamente el digimon: ${data.name}`);
            formCrearDigimon.reset();
        } else {
            alert("Error al crear el nuevo digimon.");
        }
    } catch (error) {
        console.log(error);
        alert("Ha ocurrido un error al crear el digimon.");
    }
});

const getData = (path) => {
    return new Promise(async (resolve, reject) => {
        try {
            let response = await fetch(`${urlBase}${path}`);
            let data = await response.json();
            if (response.status == 200) {
                // console.log(data);
                resolve(data);
            } else if (response.status == 404) {
                alert("Pokemon no encontrado");
            } else {
                alert("Algo salió mal");
            }
        } catch (error) {
            console.log(error);
            reject("No se pudo hacer la peticion");
        }
    });
};
