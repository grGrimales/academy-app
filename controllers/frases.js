const { response } = require('express');
const bcrypt = require('bcryptjs');

const Usuario = require('../models/usuario');
const { generarJWT } = require('../helpers/jwt');
const Frases = require('../models/frases');
const Categoria = require('../models/categorias');

const getCategorias = async (req, res = response) => {
    const categorias = await Categoria.find({}, 'categoria');

    res.json({
        ok: true,
        categorias
    });
}


const cargarCategorias = async (req, res = response) => {
    await Categoria.deleteMany();

    const categorias = await Frases.find({}).distinct('categoria');

    console.log(categorias)


    const uniqueValues = Array.from(new Set(categorias.flatMap(str => str.split(' '))));


    await Categoria.insertMany(uniqueValues.map(categoria => ({ categoria })));
    res.json({
        ok: true,
        uniqueValues
    });
}
const array = [
    'carlos alimentos',
    'carlos familia',
    'carlos gramatica are_is_question',
];




const getFrases = async (req, res) => {
    // const { listWordsToSearch, typeOrder = 'aleatorio', fechaInicio, fechaFin, categoriaSeleccionada } = req.body;

    // let query = {};

    // if (listWordsToSearch && listWordsToSearch.length > 0) {
    //     const regexListWords = listWordsToSearch.map(word => new RegExp(word, 'i'));

    //     query = {
    //         ...query,
    //         $or: [
    //             { phraseEnglish: { $in: regexListWords } },
         
    //         ]
    //     };
    // }




    // const [frases, count] = await Promise.all([

    //     Frases.find(query),
    //     Frases.countDocuments(query)
    // ]);

const {categoria } = req.query;

const regex = new RegExp( categoria, 'i' );

    const frases = await Frases.find({
        categoria: regex

    }).limit(100);

    res.json({
        ok: true,
        frases
    });
}




const loadFrases = async (req, res = response) => {
    try {
        await Frases.deleteMany();
 
        
        const apiKey = process.env.apiKey;
        const spreadsheetId = process.env.spreadsheetId;

        const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}?includeGridData=true&key=${apiKey}`;
        const response = await fetch(url);
        const data = await response.json();

        const title = 'frases_ingles';
        const filteredSheets = data.sheets.filter(sheet => sheet.properties.title === title);
        const dataClean = transform(filteredSheets[0].data[0].rowData.map((item) => {
            return item.values.map((item) => {
                return item.formattedValue;
            });
        }
        ));



        // Insertar el array de dataClean en la base de datos
        await Frases.insertMany(dataClean);
        await cargarCategorias();

        return res.json({
            ok: true,
            msg: 'Frases cargadas correctamente'
        });
    } catch (error) {
        console.error('Error al leer la hoja de cálculo:', error);
        throw error;
    }
};


const transform = (data) => {
    // Asumiendo que el array original se llama data
    // Primero, extraemos los nombres de las propiedades del primer elemento del array
    const keys = data[0];

    // Luego, creamos un nuevo array vacío para almacenar los objetos transformados
    const result = [];

    // Después, iteramos sobre el resto de los elementos del array, saltando el primero
    for (let i = 1; i < data.length; i++) {
        // Creamos un objeto vacío para almacenar las propiedades y valores del elemento actual
        const obj = {};
        // Iteramos sobre los nombres de las propiedades
        for (let j = 0; j < keys.length; j++) {
            // Asignamos el valor correspondiente del elemento actual al objeto, usando el nombre de la propiedad como clave
            obj[keys[j]] = data[i][j];
        }
        // Agregamos el objeto al array resultante
        result.push(obj);
    }

    // Finalmente, imprimimos o retornamos el array resultante

    // o
    return result;
}

module.exports = {
    getFrases,
    loadFrases,
    getCategorias,
    cargarCategorias
}
