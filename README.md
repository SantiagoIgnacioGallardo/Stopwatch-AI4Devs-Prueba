# Stopwatch-AI4Devs

**Cronómetro y Temporizador**

Aplicación web de cronómetro y temporizador construida con HTML, CSS y JavaScript puro.

**Caracteristicas**

-Display HH:MM:SS con centisegundos actualizados en tiempo real.
-Botones Inicio / Pausa / Reanudar / Reiniciar con visibilidad dinámica.
-Registro de laps con historial desplazable y fondo blur.
-Animación de pulso mientras el cronómetro está corriendo.

**Temporizador**

-Display editable: clic en cada campo para configurar (horas, minutos, segundos, centisegundos) el valor.
-Validación automática de rangos al iniciar y al perder el foco.
-Alerta visual cuando quedan menos de 15 segundos: display rojo con parpadeo / CSS.
-Estado de alerta persiste al llegar a cero hasta que el usuario reinicia.

**Precisión de tiempo**

Ambos modos usan Date.now() con lógica de offset acumulado para evitar desfases al pausar y reanudar. El render corre con requestAnimationFrame, recalculando desde el timestamp real en cada frame.

**Archivos**

index.html -> Estructura y punto de entrada
styles.css -> Estilos, animaciones y estados de alerta
script-js -> Lógica de tabs, cronómetro y temporizador

**Uso**

Abrir index.html directamente en el navegador.
