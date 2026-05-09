# Prompt — Stopwatch & Timer Web App

Crea una aplicación web de cronómetro y temporizador compuesta por tres archivos vinculados: `index.html`, `styles.css` y `script.js`. El archivo HTML debe ser el punto de entrada único. A continuación se detallan todos los requisitos:

---

## Estructura General

La interfaz contará con dos pestañas estáticas ubicadas en la parte superior centrada de la página: **Stopwatch** y **Timer**. Ambas pestañas deben tener un efecto hover visible y marcar visualmente cuál está activa. Solo se mostrará el contenido de la pestaña activa. La lógica de cambio de pestaña debe ser reutilizable y controlada desde `script.js`.

---

## Archivos y Vinculación

- `index.html`: estructura completa de ambas pestañas (stopwatch y timer), vincula `styles.css` en el `<head>` y `script.js` antes del cierre de `<body>`.
- `styles.css`: todos los estilos visuales, animaciones y efectos.
- `script.js`: toda la lógica de ambos modos.

---

## Pestaña 1 — Stopwatch (Cronómetro)

### HTML
- Un título identificador del modo.
- Un display de tiempo que muestre horas, minutos y segundos en tamaño grande. Los milisegundos deben mostrarse en tamaño reducido, posicionados abajo a la derecha del display principal.
- Botones con los siguientes comportamientos:
  - Antes de iniciar: se muestra el botón **Start** y el botón **Reset** (deshabilitado visualmente).
  - Al presionar Start: el botón Start desaparece y aparecen los botones **Pause** y **Reset**.
  - Al presionar Pause: el botón cambia a **Resume**.
  - Al presionar Reset: el contador vuelve a cero, desaparecen Pause/Resume/Reset y vuelve a aparecer Start.
  - Botón **Lap**: registra la vuelta actual. Aparece junto a Pause y desaparece al resetear.
- Un recuadro debajo de los botones que muestra el historial de laps, con fondo difuminado (blur). Cada entrada debe mostrar el número de vuelta y el tiempo registrado. Si no hay laps, el recuadro no se muestra.

### CSS
- Diseño sobrio y ordenado.
- Animación en el display mientras el cronómetro está corriendo (por ejemplo, un pulso sutil o brillo en el texto).
- Estados `:hover` y `:active` claramente definidos para todos los botones.
- El recuadro de laps debe tener fondo con `backdrop-filter: blur`.

### JavaScript
- Usar `performance.now()` o `Date.now()` con lógica de offset para evitar desfases en pausa/reanudación.
- Actualizar el display con `requestAnimationFrame` o `setInterval` a 10ms para reflejar los milisegundos.
- La lógica de formateo de tiempo (HH:MM:SS.ms) debe ser una función utilitaria reutilizable también por el timer.
- Al registrar un lap, guardar el tiempo transcurrido en ese momento y renderizarlo en el recuadro.

---

## Pestaña 2 — Timer (Temporizador)

### HTML
- Un display de tiempo editable directamente por el usuario: al hacer clic en las horas, minutos, segundos o milisegundos, el usuario debe poder ingresar el valor deseado (usar inputs o contenteditable acotado).
- Tres botones: **Start**, **Pause/Resume** y **Reset**, con el mismo patrón de visibilidad que el stopwatch (Start visible al inicio; al iniciar, aparecen Pause y Reset; al resetear, vuelve Start).
- Sin recuadro de laps.

### CSS
- Comparte la misma hoja de estilos y el mismo diseño base que el stopwatch.
- Cuando queden menos de 15 segundos en el conteo, el display debe pintarse de rojo y aplicar una animación de parpadeo lento (CSS `@keyframes` con `opacity`).
- La clase que activa el estado de alerta debe añadirse/quitarse desde JavaScript.

### JavaScript
- Usar la misma función utilitaria de formateo de tiempo del stopwatch.
- Calcular el tiempo restante usando timestamps (`Date.now()`) para evitar desfases al pausar, reanudar o si el navegador throttlea los intervalos.
- Al llegar a cero, detener el conteo y mantener el display en `00:00:00.00` con el estado de alerta activo hasta que el usuario presione Reset.
- Validar que el usuario no ingrese valores fuera de rango (ej. minutos > 59) antes de iniciar.
- Al pausar, conservar el tiempo restante exacto para reanudarlo sin pérdida.

---

## Comentarios en el Código

- En `index.html`: comentar cada sección principal (tabs, contenedor stopwatch, contenedor timer, laps).
- En `styles.css`: separar y comentar cada bloque (estilos base, tabs, stopwatch, timer, laps, animaciones, estados de alerta).
- En `script.js`: separar y comentar cada sección (utilidades compartidas, lógica de tabs, lógica stopwatch, lógica timer). Usar comentarios concisos que expliquen el *por qué* de la lógica, no el *qué* obvio.

---

## Restricciones

- Usar únicamente HTML, CSS y JavaScript puro. Sin frameworks, librerías externas ni preprocesadores.
- No incluir ningún elemento, estilo o comportamiento que no esté explícitamente descrito en este prompt.
- El código debe estar organizado, legible y optimizado: evitar duplicación de lógica entre los dos modos siempre que sea posible.
