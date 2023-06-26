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
    resp_densidad.innerHTML = `Densidad: ${densidad} g/ml`
    densidadAcido.value = densidad.toFixed(4)
}


// codigo pureza

const temperaturaAcido = document.querySelector("#temperatura_acido")
const respPureza = document.querySelector("#resp_pureza")



const tablaPurezaAcido = [
    [-1, 10, 20, 40],
    [1, 1.0048, 1.0032, 0.9970],
    [2, 1.0100, 1.0082, 1.0019],
    [4, 1.0202, 1.0181, 1.0116],
    [6, 1.0303, 1.0279, 1.0211],
    [8, 1.0403, 1.0376, 1.0305],
    [10, 1.0504, 1.0474, 1.0400],
    [12, 1.0607, 1.0574, 1.0497],
    [14, 1.0711, 1.0675, 1.0594],
    [16, 1.0815, 1.0776, 1.0692],
    [18, 1.0920, 1.0878, 1.0790],
    [20, 1.1025, 1.0980, 1.0888],
    [22, 1.1131, 1.1083, 1.0986],
    [24, 1.1238, 1.1187, 1.1085],
    [26, 1.1344, 1.1290, 1.1183],
    [28, 1.1449, 1.1392, 1.1280],
    [30, 1.1553, 1.1493, 1.1376],
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
    // console.log(`(${rowA1.densidad} - ${rowA2.densidad}) * (${temperaturaAcido.value} - ${rowA2.temperatura}) / (${rowA1.temperatura} - ${rowA2.temperatura})) + ${rowA2.densidad}`);
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

let gmolReactivo = 84.0066;
let gmolAcido = 36.46094;
let gmolProd1 = 82.03378;
let gmolProd2 = 44.0095;
let gmolAgua = 18.01528;


let molesReactivo = 2;
let molesAcido = 6;
let molesProd1 = 2;
let molesProd2 = 3;

let RL = 'ACIDO'

let reactivoMg = document.querySelector('#reactivoMg')
let reactivoSn = document.querySelector('#reactivoSn')
let reactivoAl = document.querySelector('#reactivoAl')


const CambiarReactivo = (reactivo) => {
    if (reactivo == 'Mg') {
        gmolReactivo = 24.305;
        gmolProd1 = 95.211;
        gmolProd2 = 18.0153;

        molesReactivo = 2;
        molesAcido = 6;
        molesProd1 = 2;
        molesProd2 = 3;

        reactivoMg.className = "btn btn-active"
        reactivoSn.className = "btn"
        reactivoAl.className = "btn"


    } else if (reactivo == 'Sn') {
        gmolReactivo = 65.38;
        gmolProd1 = 136.286;
        gmolProd2 = 2.01588;

        molesReactivo = 1;
        molesAcido = 2;
        molesProd1 = 2;
        molesProd2 = 2;

        reactivoMg.className = "btn"
        reactivoSn.className = "btn btn-active"
        reactivoAl.className = "btn"

    } else if (reactivo == 'Al') {
        gmolReactivo = 26.98153;
        gmolProd1 = 133.34053;
        gmolProd2 = 2.01588;

        molesReactivo = 2;
        molesAcido = 6;
        molesProd1 = 2;
        molesProd2 = 3;

        reactivoMg.className = "btn"
        reactivoSn.className = "btn"
        reactivoAl.className = "btn btn-active"
    }
}


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
//moles
const respMolBicarSodio = document.querySelector("#mol_bicarbonatoSodio")
const respMolAcidoAcetico = document.querySelector("#mol_acidoAcetico")
const respMolAceSodio = document.querySelector("#mol_acetatoSodio")
const respMolDioCarbono = document.querySelector("#mol_dioxidoCarbono")
const respMolAgua = document.querySelector("#mol_aguaMolecular")


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
    const molesBicarSodio = MasaBicarSodio / gmolReactivo;
    const molesAcAcetico = MasaAcAcetico / gmolAcido;

    // relacion molar
    console.log(molesAcAcetico, MasaAcAcetico, gmolAcido);
    const relMolarBicarSodio = molesBicarSodio / molesReactivo
    const relMolarAcAcetico = molesAcAcetico / molesAcido

    respRelMolarBicarSodio.innerHTML = `Bicarbonato de sodio: ${relMolarBicarSodio} ${relMolarBicarSodio - relMolarAcAcetico < 0 ? 'RL' : 'RE'}`
    respRelMolarAcAcetico.innerHTML = `Acido acetico: ${relMolarAcAcetico} ${relMolarAcAcetico - relMolarBicarSodio < 0 ? 'RL' : 'RE'}`


    const molesRL = relMolarBicarSodio - relMolarAcAcetico < 0 ? molesBicarSodio : molesAcAcetico
    if (relMolarBicarSodio - relMolarAcAcetico < 0) RL = 'BICARBONATO'

    //CALCULO DE PRODUCTOS

    let grAcAsetico = 0
    let grBicarSodio = 0

    if (RL == 'ACIDO') {
        grAcAsetico = MasaAcAcetico
        grBicarSodio = molesRL * (molesReactivo / molesAcido) * gmolReactivo

        respProdAcidoAcetico.innerHTML = `Acido acetico: ${grAcAsetico} g`;
        respProdBicarSodio.innerHTML = `Bicarbonato de sodio: ${grBicarSodio} g`;

    } else {
        grAcAsetico = molesRL * (molesAcido / molesReactivo) * gmolAcido
        grBicarSodio = MasaBicarSodio

        respProdBicarSodio.innerHTML = `Bicarbonato de sodio: ${MasaBicarSodio} g`;
        respProdAcidoAcetico.innerHTML = `Acido acetico: ${molesRL * gmolAcido} g`;
    }

    const grAceSodio = molesRL * (molesProd1 / molesAcido) * gmolProd1
    const grDioCarbono = molesRL * (molesProd2 / molesAcido) * gmolProd2
    console.log(molesProd2);
    // const grAgua = molesRL * (molesReactivo / molesAcido) * gmolAgua

    respProdAceSodio.innerHTML = `Acetato de Sodio: ${grAceSodio} g`
    respProdDioCarbono.innerHTML = `Dioxido de carbono: ${grDioCarbono} g`
    // respProdAgua.innerHTML = `Agua molecular: ${grAgua} g`

    //CACULO DE MOLARIDAD

    // respMolBicarSodio.innerHTML = `Bicarbonato de sodio: ${grBicarSodio / gmolReactivo} M`
    // respMolAcidoAcetico.innerHTML = `Acido acetico: ${grAcAsetico / gmolAcido} M`
    // respMolAceSodio.innerHTML = `Acetato de Sodio: ${grAceSodio / gmolProd1} g`
    // respMolDioCarbono.innerHTML = `Dioxido de carbono: ${grDioCarbono / gmolProd2} g`
    // respMolAgua.innerHTML = `Agua molecular: ${grAgua / gmolAgua} g`

    // molaridadDioCarbono = grDioCarbono / gmolProd2
    // molaridadAcAcetico = grAcAsetico / gmolAcido




    //  constante de equilibrio

    // const volumenAcAcetico = inputGrAcAsetico.value / 1000
    // const respKC = document.querySelector("#kc")
    // respKC.innerHTML = `kc: ${(molaridadDioCarbono / volumenAcAcetico)}`
}
