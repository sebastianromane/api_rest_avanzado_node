const express = require("express");
const router = express.Router();

//importar funciones desde el controlador
const {getAllJoyas, filterJoyas} = require("../controllers/joyasController");

router.get("/inventario", getAllJoyas);
router.get("/inventario/filtros", filterJoyas);

// a nivel de ruta
router.get("*", (req, res) => {
  res.status(404).send("Esta ruta no existe");
});

module.exports = router;