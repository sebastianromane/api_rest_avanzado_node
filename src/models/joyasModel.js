const e = require("cors");
const {validateCategory, validateMetal} = require("../helpers/validaciones")
const { pool, format } = require("../db/connectionDb");

// aplicando offset
const getJoyas = async ({ limits = 6, order_by = "id_ASC", page = 1 }) => {
  try {
    const [campo, direccion] = order_by.split("_");

    if (direccion=="ASC" || direccion=="DESC") {
      const offset = (page - 1) * limits;
      const formattedQuery = format(
        "SELECT * FROM inventario order by %s %s LIMIT %s OFFSET %s",
        campo,
        direccion,
        limits,
        offset
      );
      const { rows: inventario } = await pool.query(formattedQuery);
      return inventario;
    } else{
      console.log("datos invalidos");
    }
   } catch (e) {
    console.log(e);
    res.status(500).json({ message: "Error al obtener los datos" });
  }};

// filtrando query params
const getJoyasByFilters = async ({
  precio_min,
  precio_max,
  categoria,
  metal,
}) => {
  try {
    let filtros = [];
    let valoresAceptados = /^[0-9]+$/;

    if (precio_min) {
      
      if (precio_min.match(valoresAceptados)) {
        if (precio_min<precio_max) {
          filtros.push(`precio >= ${precio_min}`);
          console.log("datos en el precio minimo es numerico");
        }
 
     } else {
       console.log("datos en el precio minimo NO es numerico");
     }}
 
    
    if (precio_max) {
    if (precio_max.match(valoresAceptados)) {
      filtros.push(`precio <= ${precio_max}`);
      console.log("datos en los precios  maximos son numericos");
    } else {
      console.log("datos en los precios  maximos NO son numericos");
    }}

    
    if (categoria){
      const resultValidateCategory = await validateCategory(categoria)
      if (resultValidateCategory=="ok") {
        filtros.push(`categoria = '${categoria}'`);
        console.log("categoria existe");
      }else{
        console.log("Categoria no existe");
        return "Categoria no existe"
      }
    } 


    if (metal){
      const resultValidateMetal = await validateMetal(metal)
      if (resultValidateMetal=="ok") {
        filtros.push(`metal = '${metal}'`);
        console.log("metal existe");
      }else{
        console.log("metal no existe");
        return "metal no existe"
      }
    } 


    let consulta = "SELECT * FROM inventario";
    if (filtros.length > 0) {
      filtros = filtros.join(" AND ");
      consulta += ` WHERE ${filtros}`;
    }
    const { rows: inventario } = await pool.query(consulta);
    return inventario;
  } catch (e) {
    console.log(e);
  }
};

module.exports = { getJoyas, getJoyasByFilters };