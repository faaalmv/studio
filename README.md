# Programación Mensual de Alimentos

## Descripción General

Esta es una aplicación web interactiva diseñada para la planificación y gestión mensual del consumo de alimentos en servicios de comedor o cocina. Permite a los usuarios programar las cantidades de diferentes insumos alimenticios para cada día del mes, ofreciendo una visión clara y detallada del inventario y su distribución.

La interfaz está diseñada para ser intuitiva y eficiente, con un diseño moderno de "Glassmorphism" que mejora la experiencia de usuario.

## Características Principales

*   **Planificación Mensual y por Servicio:** Seleccione un mes y un tipo de servicio específico para ver o crear una programación.
*   **Vista Dual (General y Detallada):**
    *   **Vista General:** Muestra un resumen de la cantidad total de cada alimento por día.
    *   **Vista Detallada:** Desglosa el consumo diario por tipo de comida (Desayuno, Almuerzo, Cena).
*   **Gestión de Inventario Visual:**
    *   Los alimentos están organizados en grupos colapsables (Abarrotes, Carnes, Frutas, etc.).
    *   Cada artículo muestra su código, descripción y unidad de medida.
*   **Interactividad Avanzada:**
    *   **Controles de Cantidad:** Ajuste fácilmente las cantidades de alimentos con steppers intuitivos.
    *   **Feedback en Tiempo Real:** Las celdas y los indicadores de estado cambian de color para reflejar la disponibilidad de los productos (verde para suficiente, ámbar para medio, rojo para excedido).
    *   **Efectos de Hover y Foco:** Las filas y columnas se resaltan para facilitar la navegación y la entrada de datos.
*   **Filtro Dinámico:** Busque y filtre rápidamente en la lista de alimentos por código, descripción o grupo.
*   **Exportación de Datos:** Incluye una función para exportar la programación actual (funcionalidad en desarrollo).
*   **Diseño Moderno y Responsivo:**
    *   Interfaz con efecto "Glassmorphism" para un look contemporáneo.
    *   Totalmente responsiva, adaptándose a diferentes tamaños de pantalla desde móviles hasta escritorios.

## Tecnologías Utilizadas

*   **Framework:** Next.js
*   **Lenguaje:** TypeScript
*   **Estilos:** Tailwind CSS
*   **Componentes:** Shadcn/ui

## Cómo Utilizar la Aplicación

1.  **Seleccione el Mes y Servicio:** Use los menús desplegables en la parte superior para elegir el mes y el servicio que desea gestionar.
2.  **Navegue por la Tabla:** Desplácese por la lista de alimentos. Puede expandir o contraer los grupos de alimentos para una mejor visualización.
3.  **Ajuste las Cantidades:**
    *   En la **Vista General**, use los controles `+` y `-` para asignar la cantidad total de un producto para un día.
    *   En la **Vista Detallada**, asigne cantidades específicas para el desayuno, almuerzo o cena de cada día.
4.  **Monitoree el Consumo:**
    *   La columna **"Total"** muestra la suma de lo programado para cada alimento.
    *   La columna **"Rest."** (Restante) le indica cuánto queda disponible según el máximo permitido, con un código de colores para una rápida identificación.
    *   La columna **"Estado"** le alerta si ha excedido el límite para un producto.
5.  **Filtre la Lista:** Si necesita encontrar un producto rápidamente, escriba su nombre, código o grupo en la barra de búsqueda.
