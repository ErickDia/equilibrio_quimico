// codigo densisdad
const inputPicVacio = document.querySelector("#pic_vacio")
const inputPicDestilada = document.querySelector("#pic_destilada")
const inputPicAcido = document.querySelector("#pic_acido")
const btn_cancular_densidad = document.querySelector("#btn_cancular_densidad")
const resp_densidad = document.querySelector("#resp_densidad")


const densidadAcido = document.querySelector("#densidad_acido")


inputPicAcido.addEventListener('keydown', (event) => {
    if (event.keyCode === 13) {
        onClickCalcularDensidad()
    }
})

const onClickCalcularDensidad = () => {
    const densidad = (parseFloat(inputPicAcido.value).toFixed(4) - parseFloat(inputPicVacio.value).toFixed(4)) / (parseFloat(inputPicDestilada.value).toFixed(4) - parseFloat(inputPicVacio.value).toFixed(4))
    resp_densidad.innerHTML = `Densidad: ${densidad.toFixed(4)} g/ml`
    densidadAcido.value = densidad.toFixed(4)
}


// codigo pureza

const temperaturaAcido = document.querySelector("#temperatura_acido")
const respPureza = document.querySelector("#resp_pureza")



const tablaPurezaAcido = [
    [-1, 0, 10, 15, 20, 25, 30, 40],
    [0, 0.9999, 0.9997, 0.9991, 0.9982, 0.9971, 0.9957, 0.9922],
    [1, 1.0016, 1.0013, 1.0006, 0.9996, 0.9987, 0.9971, 0.9934],
    [2, 1.0033, 1.0029, 1.0021, 1.0012, 1.0000, 0.9984, 0.9946],
    [3, 1.0051, 1.0044, 1.0036, 1.0025, 1.0013, 0.9997, 0.9958],
    [4, 1.0070, 1.0060, 1.0051, 1.0040, 1.0027, 1.0011, 0.9970],
    [5, 1.0088, 1.0076, 1.0066, 1.0055, 1.0041, 1.0024, 0.9982],
    [6, 1.0106, 1.0092, 1.0081, 1.0069, 1.0055, 1.0037, 0.9994],
    [7, 1.0124, 1.0108, 1.0096, 1.0083, 1.0068, 1.0050, 1.0006],
    [8, 1.0142, 1.0124, 1.0111, 1.0097, 1.0081, 1.0063, 1.0018],
    [9, 1.0159, 1.0140, 1.0126, 1.0111, 1.0094, 1.0076, 1.0030],
    [10, 1.0177, 1.0156, 1.0141, 1.0125, 1.0107, 1.0089, 1.0042],
    [11, 1.0194, 1.0171, 1.0155, 1.0139, 1.0120, 1.0102, 1.0054],
    [12, 1.0211, 1.0187, 1.0170, 1.0154, 1.0133, 1.0115, 1.0065],
    [13, 1.0228, 1.0202, 1.0184, 1.0168, 1.0146, 1.0127, 1.0077],
    [14, 1.0245, 1.0217, 1.0199, 1.0182, 1.0159, 1.0139, 1.0088],
    [15, 1.0262, 1.0232, 1.0213, 1.0195, 1.0172, 1.0151, 1.0099],
]

const getDataTablaPureza = (force = false) => {

    let colA = {
        idx: 0,
        temperatura: 0
    };
    let colB = {
        idx: 0,
        temperatura: 0
    };
    let mainCol = 'A';

    let rowA1 = {
        idx: 0,
        percent: 0,
        densidad: 0,
        temperatura: 0
    }
    let rowA2 = {
        idx: 0,
        percent: 0,
        densidad: 0,
        temperatura: 0
    }

    let rowB1 = {
        idx: 0,
        percent: 0,
        densidad: 0,
        temperatura: 0
    }
    let rowB2 = {
        idx: 0,
        percent: 0,
        densidad: 0,
        temperatura: 0
    }

    // obtener columnas de temperatura
    for (let i = 0; i < tablaPurezaAcido[0].length; i++) {

        if (tablaPurezaAcido[0][i] >= temperaturaAcido.value) {
            colA = {
                idx: i - 1,
                temperatura: tablaPurezaAcido[0][i - 1]
            };
            colB = {
                idx: i,
                temperatura: tablaPurezaAcido[0][i]
            };
            console.log(force);
            if ((temperaturaAcido.value - colA.temperatura > colB.temperatura - temperaturaAcido.value) && !force) mainCol = 'B'
            break;
        }

    }

    //obtener los datos para la interpolacion, los 4 puntos de las densidades

    for (let i = 1; i < tablaPurezaAcido.length; i++) {
        if ((mainCol == 'A' && tablaPurezaAcido[i][colA.idx] > densidadAcido.value) ||
            (mainCol == 'B' && tablaPurezaAcido[i][colB.idx] > densidadAcido.value)) {
            rowA1 = {
                idx: i - 1,
                percent: tablaPurezaAcido[i - 1][0],
                densidad: tablaPurezaAcido[i - 1][colA.idx],
                temperatura: colA.temperatura

            }
            rowA2 = {
                idx: i - 1,
                percent: tablaPurezaAcido[i - 1][0],
                densidad: tablaPurezaAcido[i - 1][colB.idx],
                temperatura: colB.temperatura

            }
            rowB1 = {
                idx: i,
                percent: tablaPurezaAcido[i][0],
                densidad: tablaPurezaAcido[i][colA.idx],
                temperatura: colA.temperatura

            }
            rowB2 = {
                idx: i - 1,
                percent: tablaPurezaAcido[i][0],
                densidad: tablaPurezaAcido[i][colB.idx],
                temperatura: colB.temperatura

            }
            break
        }

    }
    return { rowA1, rowB1, rowA2, rowB2 }
}

const onClickCalcularPureza = () => {
    const { rowA1, rowB1, rowA2, rowB2 } = getDataTablaPureza()


    //        temp1 | mainTemp | temp2
    //       ------------------------
    //  per1 | den1 |     x    | den2
    //       ------------------------
    //   z   |      |  mainDen | 
    //       ------------------------
    //  per2 | den3 |     y    | den4

    console.log(rowA1, rowB1, rowA2, rowB2);

    // hallar x
    let x = ((rowA1.densidad - rowA2.densidad) * (temperaturaAcido.value - rowA2.temperatura) / (rowA1.temperatura - rowA2.temperatura)) + rowA2.densidad
    // hallar y
    let y = ((rowB1.densidad - rowB2.densidad) * (temperaturaAcido.value - rowB2.temperatura) / (rowB1.temperatura - rowB2.temperatura)) + rowB2.densidad
    console.log(`(${rowA1.percent} - ${rowB1.percent}) * (${densidadAcido.value} - ${y}) / (${x} - ${y}) + ${rowB1.percent}`);
    // hallar z
    let z = ((rowA1.percent - rowB1.percent) * (densidadAcido.value - y) / (x - y)) + rowB1.percent
    if (z < rowA1.percent) {
        const { rowA1, rowB1, rowA2, rowB2 } = getDataTablaPureza(true)
        console.log(rowA1, rowB1, rowA2, rowB2);

        x = ((rowA1.densidad - rowA2.densidad) * (temperaturaAcido.value - rowA2.temperatura) / (rowA1.temperatura - rowA2.temperatura)) + rowA2.densidad
        // hallar y
        y = ((rowB1.densidad - rowB2.densidad) * (temperaturaAcido.value - rowB2.temperatura) / (rowB1.temperatura - rowB2.temperatura)) + rowB2.densidad
        console.log(`(${rowA1.percent} - ${rowB1.percent}) * (${densidadAcido.value} - ${y}) / (${x} - ${y}) + ${rowB1.percent}`);
        // hallar z
        z = ((rowA1.percent - rowB1.percent) * (densidadAcido.value - y) / (x - y)) + rowB1.percent
    }
    respPureza.innerHTML = `Pureza: ${z} %`
    console.log(x, y, z);
}


//  camculo de productos

const gmolBicarbonatoSodio = 84.0066;
const gmolAcidoAsetico = 60.05196;
const gmolAcetatoSodio = 82.03378;
const gmolDioxidoCarbono = 44.0095;
const gmolAgua = 18.01528;
const RL = 'ACIDO'

const inputPurBicarSodio = document.querySelector("#pureza_bicarbonatoSodio")
const inputGrBicarSodio = document.querySelector("#gramos_bicarbonatoSodio")
const inputPurAcAsetico = document.querySelector("#pureza_acidoAsetico")
const inputDenAcAsetico = document.querySelector("#densidad_acidoAsetico")
const inputGrAcAsetico = document.querySelector("#gramos_acidoAsetico")

// masa real
const respMasaBicarSodio = document.querySelector("#masa_bicarbonatoSodio")
const respMasaAcAsetico = document.querySelector("#masa_acidoAsetico")

// relacion molar
const respRelMolarBicarSodio = document.querySelector("#relacioMolar_bicarbonatoSodio")
const respRelMolarAcAcetico = document.querySelector("#relacioMolar_acidoAsetico")

//productos
const respProdBicarSodio = document.querySelector("#prod_bicarbonatoSodio")
const respProdAcidoAcetico = document.querySelector("#prod_acidoAcetico")
const respProdAceSodio = document.querySelector("#prod_acetatoSodio")
const respProdDioCarbono = document.querySelector("#prod_dioxidoCarbono")
const respProdAgua = document.querySelector("#prod_aguaMolecular")



const onClickProductos = () => {
    console.log({
        inputPurBicarSodio: inputPurBicarSodio.value,
        inputGrBicarSodio: inputGrBicarSodio.value,
        inputPurAcAsetico: inputPurAcAsetico.value,
        inputDenAcAsetico: inputDenAcAsetico.value,
        inputGrAcAsetico: inputGrAcAsetico.value
    });
    //  masa real
    const MasaBicarSodio = inputGrBicarSodio.value * inputPurBicarSodio.value / 100;
    const MasaAcAcetico = inputDenAcAsetico.value * inputGrAcAsetico.value * inputPurAcAsetico.value / 100;

    respMasaBicarSodio.innerHTML = `Bicarbonato de sodio: ${MasaBicarSodio} g`
    respMasaAcAsetico.innerHTML = `Acido acetico: ${MasaAcAcetico} g`

    console.log({ MasaBicarSodio, MasaAcAcetico });

    //  moles de reactivos
    const molesBicarSodio = MasaBicarSodio / gmolBicarbonatoSodio;
    const molesAcAcetico = MasaAcAcetico / gmolAcidoAsetico;

    // relacion molar

    const relMolarBicarSodio = molesBicarSodio / 1
    const relMolarAcAcetico = molesAcAcetico / 1

    respRelMolarBicarSodio.innerHTML = `Bicarbonato de sodio: ${relMolarBicarSodio} ${relMolarBicarSodio - relMolarAcAcetico < 0 ? 'RL' : 'RE'}`
    respRelMolarAcAcetico.innerHTML = `Acido acetico: ${relMolarAcAcetico} ${relMolarAcAcetico - relMolarBicarSodio < 0 ? 'RL' : 'RE'}`


    const molesRL = relMolarBicarSodio - relMolarAcAcetico < 0 ? molesBicarSodio : molesAcAcetico
    if (relMolarBicarSodio - relMolarAcAcetico < 0) RL = 'BICARBONATO'

    //CALCULO DE PRODUCTOS

    let grAcAsetico = 0
    let grBicarSodio = 0

    if (RL == 'ACIDO') {
        grAcAsetico = MasaAcAcetico
        grBicarSodio = molesRL * gmolBicarbonatoSodio

        respProdAcidoAcetico.innerHTML = `Acido acetico: ${grAcAsetico} g`;
        respProdBicarSodio.innerHTML = `Bicarbonato de sodio: ${grBicarSodio} g`;

    } else {
        grAcAsetico = molesRL * gmolAcidoAsetico
        grBicarSodio = MasaBicarSodio

        respProdBicarSodio.innerHTML = `Bicarbonato de sodio: ${MasaBicarSodio} g`;
        respProdAcidoAcetico.innerHTML = `Acido acetico: ${molesRL * gmolAcidoAsetico} g`;
    }

    const grAceSodio = molesRL * gmolAcetatoSodio
    const grDioCarbono = molesRL * gmolDioxidoCarbono
    const grAgua = molesRL * gmolAgua

    respProdAceSodio.innerHTML = `Acetato de Sodio: ${grAceSodio} g`
    respProdDioCarbono.innerHTML = `Dioxido de carbono: ${grDioCarbono} g`
    respProdAgua.innerHTML = `Agua molecular: ${grAgua} g`


    //  constante de equilibrio
    const respKC = document.querySelector("#kc")
    respKC.innerHTML = `kc: ${(grAceSodio * grDioCarbono * grAgua) / (grAcAsetico * grBicarSodio)}`
}
