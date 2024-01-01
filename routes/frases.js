/*
    Ruta: /api/frases
*/
const { Router } = require('express');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');

const { validarJWT } = require('../middlewares/validar-jwt');
const { getFrases,loadFrases, getCategorias, cargarCategorias } = require('../controllers/frases');


const router = Router();


router.get( '/' , getFrases );

router.post( '/cargar' , loadFrases );

router.get( '/categorias' , getCategorias );

router.post( '/categorias' , cargarCategorias );


module.exports = router;