
import type { Item, Group } from './types';

interface RawItem {
  codigo: number;
  descripcion: string;
  um: string;
  maximo: number;
}

const rawData: RawItem[] = [
    // GRUPO DE ALIMENTO: ABARROTES
    { "codigo": 2212001001, "descripcion": "aceite comestible de 20 lts", "um": "bidon", "maximo": 177 },
    { "codigo": 2212001002, "descripcion": "aceite de oliva de 750ml", "um": "litro", "maximo": 46 },
    { "codigo": 2212001006, "descripcion": "atun en aceite de 1880 gramos", "um": "lata", "maximo": 298 },
    { "codigo": 2212001007, "descripcion": "azucar bolsa", "um": "kg", "maximo": 4788 },
    { "codigo": 2212001009, "descripcion": "cafe en grano de 500 gramos", "um": "paquete", "maximo": 706 },
    // GRUPO DE ALIMENTO: CARNES
    { "codigo": 2212002001, "descripcion": "fajitas de cerdo", "um": "kg", "maximo": 306 },
    { "codigo": 2212002003, "descripcion": "bisteck de res aguayon para brocheta", "um": "kg", "maximo": 1387 },
    { "codigo": 2212002004, "descripcion": "carnaza de cerdo en trozo", "um": "kg", "maximo": 175 },
    { "codigo": 2212002005, "descripcion": "carne de res para cocido con platano y poco hueso", "um": "kg", "maximo": 736 },
    { "codigo": 2212002006, "descripcion": "carne de res para deshebrar corte de kilo", "um": "kg", "maximo": 14 },
    // GRUPO DE ALIMENTO: EMBUTIDOS
    { "codigo": 2212003002, "descripcion": "chorizo", "um": "kg", "maximo": 20 },
    { "codigo": 2212003003, "descripcion": "jamon de pechuga de pavo rebanada de 30 g", "um": "kg", "maximo": 1028 },
    { "codigo": 2212003008, "descripcion": "tocino rebanado", "um": "kg", "maximo": 140 },
    { "codigo": 2212003012, "descripcion": "salchicha de pavo", "um": "kg", "maximo": 7 },
    { "codigo": 2212003017, "descripcion": "jamon de pierna york", "um": "kg", "maximo": 16 },
    // GRUPO DE ALIMENTO: FRUTAS
    { "codigo": 2212004003, "descripcion": "ciruela amarilla", "um": "kg", "maximo": 30 },
    { "codigo": 2212004004, "descripcion": "durazno", "um": "kg", "maximo": 552 },
    { "codigo": 2212004007, "descripcion": "jicama", "um": "kg", "maximo": 67 },
    { "codigo": 2212004008, "descripcion": "lima", "um": "kg", "maximo": 184 },
    { "codigo": 2212004011, "descripcion": "manzana delicia", "um": "kg", "maximo": 9612 },
    // GRUPO DE ALIMENTO: LACTEOS
    { "codigo": 2212005007, "descripcion": "leche pasteurizada descremada tetrapak", "um": "litro", "maximo": 45 },
    { "codigo": 2212005011, "descripcion": "queso parmesano pasteurizado 453 gr", "um": "fco", "maximo": 2 },
    { "codigo": 2212005014, "descripcion": "crema pasteurizada envasada", "um": "sm", "maximo": 1240 },
    { "codigo": 2212005015, "descripcion": "leche pasteurizada fresca de 900ml", "um": "pieza", "maximo": 184 },
    { "codigo": 2212005016, "descripcion": "mantequilla con sal en barra kilo", "um": "kg", "maximo": 156 },
    // GRUPO DE ALIMENTO: AVES Y HUEVO
    { "codigo": 2212006001, "descripcion": "pechuga de pollo en fajitas", "um": "kg", "maximo": 10000 },
    { "codigo": 2212006003, "descripcion": "pollo partido en 8 pigmentado sin piel pescuezo y mollejas", "um": "kg", "maximo": 1656 },
    { "codigo": 2212006004, "descripcion": "huevo kilo", "um": "kg", "maximo": 7048 },
    { "codigo": 2212006005, "descripcion": "pechuga de pollo sin hueso partida para brocheta", "um": "kg", "maximo": 920 },
    { "codigo": 2212006006, "descripcion": "pechuga de pollo con hueso", "um": "kg", "maximo": 1164 },
    // GRUPO DE ALIMENTO: PESCADOS Y MARISCOS
    { "codigo": 2212007001, "descripcion": "camaron fresco", "um": "kg", "maximo": 272 },
    { "codigo": 2212007003, "descripcion": "cazon tierno s/ espinas pieza", "um": "kg", "maximo": 361 },
    { "codigo": 2212007004, "descripcion": "filete de pescado huachinango corte de 150gr c/u", "um": "kg", "maximo": 6 },
    { "codigo": 2212007007, "descripcion": "filete de pescado cazon en cubito", "um": "kg", "maximo": 2 },
    { "codigo": 2212007008, "descripcion": "huachinango trozo s/espinas sin cabeza, escamas brillantes y pagadas a la piel", "um": "kg", "maximo": 552 },
    // GRUPO DE ALIMENTO: PANADERIA Y TORTILLERIA
    { "codigo": 2212008002, "descripcion": "tostada deshidratada con 25 piezas", "um": "paquete", "maximo": 736 },
    { "codigo": 2212008007, "descripcion": "bolillo con sal de 160 gramos", "um": "pieza", "maximo": 42 },
    { "codigo": 2212008008, "descripcion": "bolillo mini sin sal de 80 gramos", "um": "pieza", "maximo": 3680 },
    { "codigo": 2212008010, "descripcion": "pan blanco de caja grande", "um": "paquete", "maximo": 3608 },
    { "codigo": 2212008011, "descripcion": "pan dulce de 100 gramos", "um": "pieza", "maximo": 36800 },
    // GRUPO DE ALIMENTO: SEMILLAS Y CEREALES
    { "codigo": 2212009002, "descripcion": "chile guajillo", "um": "kg", "maximo": 2 },
    { "codigo": 2212009005, "descripcion": "ajo cabeza grande", "um": "kg", "maximo": 151 },
    { "codigo": 2212009008, "descripcion": "arroz bolsa con fecha de caducidad", "um": "kg", "maximo": 3248 },
    { "codigo": 2212009009, "descripcion": "cacahuate limpio", "um": "kg", "maximo": 4 },
    { "codigo": 2212009010, "descripcion": "canela en rama", "um": "kg", "maximo": 194 },
    // GRUPO DE ALIMENTO: VERDURAS Y HORTALIZAS
    { "codigo": 2212010004, "descripcion": "champinones", "um": "kg", "maximo": 368 },
    { "codigo": 2212010005, "descripcion": "te de limon", "um": "manojo", "maximo": 244 },
    { "codigo": 2212010007, "descripcion": "acelga", "um": "manojo", "maximo": 184 },
    { "codigo": 2212010008, "descripcion": "aguacate", "um": "kg", "maximo": 1060 },
    { "codigo": 2212010009, "descripcion": "apio", "um": "kg", "maximo": 21 },
    // GRUPO DE ALIMENTO: CONGELADOS
    { "codigo": 2212011002, "descripcion": "chicharo congelado paquete de 2 kilos", "um": "paquete", "maximo": 27 },
    { "codigo": 2212011003, "descripcion": "coliflor congelado", "um": "kg", "maximo": 756 },
    { "codigo": 2212011004, "descripcion": "ejote congelado", "um": "kg", "maximo": 424 },
    { "codigo": 2212011006, "descripcion": "maiz en grano congelado", "um": "kg", "maximo": 184 },
    { "codigo": 2212011007, "descripcion": "mezcla bajio congelado", "um": "kg", "maximo": 10 }
];

const groupNames: { [key: string]: string } = {
  '2212001': 'Abarrotes',
  '2212002': 'Carnes',
  '2212003': 'Embutidos',
  '2212004': 'Frutas',
  '2212005': 'Lacteos',
  '2212006': 'Aves y Huevo',
  '2212007': 'Pescados y Mariscos',
  '2212008': 'Panaderia y Tortilleria',
  '2212009': 'Semillas y Cereales',
  '2212010': 'Verduras y Hortalizas',
  '2212011': 'Congelados',
};

export const initialItems: Item[] = rawData.map(rawItem => {
    const groupCode = String(rawItem.codigo).substring(0, 7);
    const groupName = groupNames[groupCode] || `Grupo Desconocido`;
    
    return {
        id: String(rawItem.codigo),
        code: String(rawItem.codigo),
        description: rawItem.descripcion.charAt(0).toUpperCase() + rawItem.descripcion.slice(1),
        group: groupName,
        totalPossible: rawItem.maximo,
        unit: rawItem.um,
    };
});

export const initialGroups: Group[] = Object.values(groupNames).map(name => ({ name }));

    