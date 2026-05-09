# IA-USO

## Modelos utilizados

**Claude (Anthropic)** para el desarrollo y corrección

Utilicé dos chats de Claude con los cuales fui armando el Stopwatch:

1. **Chat de Prompt y correcciones:** En un principio se le pidió que cree un prompt (ubicado en **Prompts claves**) para armar el Stopwatch, para luego pedir que revise el código creado con el otro chat.
2. **Chat del código:** En el Claude del cmd le dejé una carpeta con el prompt brindado por el otro chat, le pedí que analice dicho prompt y que cree la app-web.

**Gemini (Google)** para la corrección: Le pasé el código y bajo el mismo prompt brindado a Claude le pedí que revise el código y que realice cambios para optimizarlo.

> **Nota:** Ambos chats tenían diferentes correcciones, a ambos se les pidió que analicen las correcciones del otro y se unificaron ambas correcciones, dando como resultado los 3 archivos subidos al repositorio.

---

## Prompts Claves

### Prompt 1 - Planteamiento del desafío

> Necesito que me des un prompt (no código) que sirva para replicar el funcionamiento de la página: [Online Stopwatch](https://www.online-stopwatch.com/), la cual será desarrollada en dos partes, el cronómetro y el temporizador con los siguientes elementos:
>
> **Para el cronómetro:**
> - **HTML:** que genere un título, el display de tiempo (horas, minutos, segundos y milisegundos —los milisegundos serán de un tamaño más reducido que los otros y se ubicarán abajo a la derecha—), y los botones que accionarán este display (pausa, inicio, reiniciar, vuelta). También se contará con un pequeño display donde se mostrarán las vueltas/laps.
> - **CSS:** El cual le dará un estilo sobrio y ordenado al cronómetro y creará en conjunto con JavaScript animaciones para el cronómetro y resaltará los botones con estados hover/active. Para las vueltas/laps se mostrará en un recuadro con fondo difuminado.
> - **JavaScript (IMPORTANTE):** El cual implementa la lógica del cronómetro: el inicio y la detención del conteo (cabe aclarar que una vez que inicie el cronómetro el botón de inicio se cambiará por uno que sirva para pausar y reanudar), el reseteo de tiempo (que también aparecerá como un botón cuando se apriete el inicio y reiniciará el contador haciendo aparecer el botón inicio).
>
> **Para el temporizador:**
> - **HTML:** Se mostrará un display en donde correrá el tiempo y será editable para que el usuario asigne las horas, minutos, segundos y milisegundos. Tendrá 3 botones, uno de inicio, otro de pausa y otro de reinicio.
> - **CSS:** Comparte el mismo diseño que el anterior, solo que junto a JS se pintará el timer de rojo y tendrá un efecto de parpadeo lento cuando queden menos de 15 segundos.
> - **JavaScript (IMPORTANTE):** El encargado de señalar el funcionamiento teniendo en cuenta ciertos aspectos, como evitar desfases de tiempo si se pausa o se realiza algún cambio que pueda afectar el funcionamiento del mismo, también como se mencionó en el CSS, se encargará de definir el color y el efecto de parpadeo lento. Es importante que te restrinjas a utilizar solamente estos 3 lenguajes y no añadir nada que no forme parte de las instrucciones brindadas.
>
> Es necesario que separes el cronómetro y el temporizador en 2 tabs así como se indica en la página, dándole un formato estático en la parte superior al medio y un efecto hover sobre el modo en el que se encuentre parado el usuario.
>
> Tendrás que linkear los tres archivos para que funcionen desde el HTML, así cuando el usuario quiera entrar al cronómetro solo tenga que tocar el index.
>
> A modo de guía para entender este código vas a ingresar mediante comentarios qué función cumple cada parte del código y separar cada script/contenedor/estilo para organizar mejor el código. Ten en cuenta a la hora de escribir el código que no tenga comentarios que puedan resultar innecesarios.
>
> A la hora de realizar este Stopwatch es necesario tener en cuenta que la optimización es una parte fundamental, por lo cual siempre que se pueda intenta crear una lógica reutilizable para ambos modos.

*Me respondió con un `.md` llamado "Prompt" el cual utilicé para que el Claude en el cmd pudiese crear el Stopwatch. Una vez creado se verificó su funcionamiento y se le hicieron algunas correcciones.*

---

### Prompt 2 - Correcciones al código

> Necesito que revises el código, corrigiendo alguna inconsistencia u error si es que lo encuentras y veas de optimizarlo en el caso de que sea posible. Importante aclarar que el Stopwatch tiene que mantener su estructura y funcionamiento.

*Este fue un paso importante porque si bien el Stopwatch funcionaba, su código tenía algunos errores puntuales y algunas redundancias que se debían corregir o eliminar.*

Como a ambos se les fue entregado este mismo prompt se obtuvieron respuestas, y para mi sorpresa, cada uno tenía su propia corrección totalmente diferente. Algunos ejemplos:

- Una misma función para controlar el show/hide de los botones (llamada `toggleControlVisuals`), que antes se repetía 4 veces en el código.
- Una reconstrucción de un pedazo del código que controlaba la animación del parpadeo en rojo del timer para su activación en una sola línea.
- El operador `+` que convierte un string a número de forma más concisa que `parseInt`, siendo intercambiables en este caso porque los inputs solo aceptan dígitos. Cualquier valor vacío o inválido que ambos conviertan a `NaN` queda cubierto por el `|| 0` que los reemplaza por cero.

---

### Respuestas que corregí/utilicé

- **Corregido:** Negativa por parte de Claude en aceptar cambios para la animación de parpadeo debido a una equivocación que tuvo, suponiendo que su código mostraría la animación sin siquiera correr el temporizador.
- **Utilizado:** En algunas de las correcciones que brindó Gemini me daba errores, por lo cual al pedirle a Claude que las analizara me mostró por qué fallaban, por lo cual decidí utilizar su código para corregir esos errores puntuales.

---

## Reflexión

Ambas IA utilizadas sirven para el propósito que se les fue dado. Si bien me percaté que Gemini era más susceptible ante afirmaciones del usuario, es capaz de brindar correcciones útiles.

Claude hace un muy buen trabajo en la creación de prompts y correcciones (siendo más crítica ante algunos cambios de Gemini), pero tampoco es algo perfecto: hizo lo que se le pidió pero en ciertas instancias, quizás por una mala interpretación o quizás porque faltó especificar, dio un código que no era del todo lo que esperaba, aunque a fin de cuentas se pudieron resolver.

En futuros usos tengo en claro que la IA requiere un análisis exhaustivo por parte del usuario cuando se le pide un prompt y por lo tanto deberé ser más precavido a la hora de pedirle uno.

Si pudiera cambiar algo de este proyecto desde un principio, sería dar especificaciones más "profundas" sobre cómo hacer el prompt y de esta manera evitar correcciones innecesarias.
