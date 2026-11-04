# Propuesta y Caso de Ejemplo para el Botón `Profundizar`

## ¿Qué te aconsejo para que `Profundizar` sea realmente útil y fácil de leer?

Cuando alguien toca **`Profundizar`**, ya leyó en la página principal *para qué sirve* la herramienta y quiere entender **cómo se calcula el número, qué significan sus valores límite y cómo interpretarlo con un ejemplo real**, pero sin chocarse contra un pizarrón académico incomprensible.

Además, muchas subsecciones agrupan 2 o 3 modelos distintos (por ejemplo, en **Pulso 24h** conviven el **RSI**, el **Isolation Forest P-06** y el **Z-Score de Volumen**). Si metemos las tres explicaciones técnicas seguidas hacia abajo, la ventana queda larga y pesada.

### Las 3 claves que te propongo (siguiendo el estilo del video de Docker Docs):

1. **Pestañas simples con línea inferior (como *"Using the GUI | Using the CLI"* en el video):**
   - Si la sección tiene 2 o 3 métricas técnicas, arriba del modal aparecen como pestañas limpias para ver **un solo cálculo a la vez**, sin scroll innecesario.
2. **Molde fijo de 3 pasos cortos por cada cálculo:**
   - **La idea y su fórmula:** 1 párrafo conversacional explicando la lógica + la ecuación escrita en limpio y qué significa cada término.
   - **Cómo leer los valores en pantalla:** Viñetas con los rangos exactos entre paréntesis (cuándo está en verde, cuándo es normal y cuándo se prende la alerta roja).
   - **Ejemplo con números redondos:** 2 renglones con un caso real para que cualquiera lo entienda en el acto.
3. **Ventana modal más cómoda (`720px` de ancho):**
   - Usa exactamente la misma tipografía descansada que elegiste para la guía.

---

## Caso de Ejemplo Real: Modal `Profundizar` de `Pulso 24h` (en Screener)

*(En la ventana emergente, el usuario ve arriba las 3 pestañas: **`AVG RSI (14)`** | **`Régimen Normal (P-06)`** | **`Desvío Volumen (Z-Score)`**)*

---

### Pestaña 1: `AVG RSI (14)`

¿Cómo medís si un mercado viene subiendo con fuerza genuina o si ya subió demasiado rápido y está agotado? El **Índice de Fuerza Relativa (RSI)** compara el tamaño de las subas recientes contra el tamaño de las bajas durante las últimas 14 ruedas, llevándolo a una escala única de 0 a 100. En la tarjeta de pulso, la plataforma promedia el RSI de todos los activos de la categoría activa.

```text
RSI (14) = 100 - [ 100 / (1 + RS) ]
donde RS = Promedio de subas de 14 ruedas / Promedio de bajas de 14 ruedas
```

Así se interpretan los tres tramos de la escala:

- **Fuerza compradora y sobrecompra (70 a 100).** Las subas superan ampliamente a las bajas recientes. Muestra gran envión alcista, aunque por encima de 70 advierte que el precio puede necesitar una pausa.
- **Zona de equilibrio (30 a 70).** El mercado se mueve a un ritmo sostenible. En la tarjeta superior, cruzar el nivel intermedio **(> 50 en verde)** confirma que ganan los compradores, mientras que caer debajo **(< 50 en rojo)** indica dominio vendedor.
- **Castigo y sobreventa (0 a 30).** Las caídas fueron tan seguidas y pronunciadas que el activo empieza a quedar estadísticamente barato y propenso a un rebote técnico.

**Ejemplo rápido:** Si en las últimas 14 ruedas un grupo de acciones subió en promedio $2 por día alcista y sólo cayó $1 por día bajista, su relación de fuerza (RS) es 2 y su RSI marca **66.7** (empuje alcista firme en verde).

---

### Pestaña 2: `Régimen Normal (P-06)`

Un activo puede parecer tranquilo si sólo mirás su precio, pero estar sufriendo al mismo tiempo un salto extraño de volumen y una apertura anormal en sus puntas de compra y venta. El motor **Isolation Forest (P-06)** cruza esas variables a la vez para detectar qué activos se están comportando de forma atípica respecto a su propia historia.

```text
Score P-06 (0.00 a 1.00) = 2 ^ ( - Profundidad media de aislamiento / c(n) )
Variables combinadas: Retorno 24h + Vol Z-Score (20d) + Realized Vol (30d) + Spread (bps)
```

Cuanto más rápido logra el algoritmo "aislar" un dato del resto de las ruedas normales, más cerca de 1.00 da el puntaje:

- **Régimen normal (0.00 a 0.49).** El precio, el volumen y la liquidez se mueven en sintonía con el promedio histórico del activo.
- **Atención o actividad elevada (0.50 a 0.64).** Al menos una de las variables empezó a despegarse de su comportamiento habitual; conviene seguir de cerca el flujo de órdenes.
- **Dislocación o anomalía crítica (0.65 a 1.00).** El activo registra un comportamiento estadísticamente extremo. En el módulo de carteras, superar este umbral activa el freno de seguridad que limita el tamaño de la posición.

**Ejemplo rápido:** Si un bono soberano apenas se mueve un 0.1% en precio pero su volumen se multiplica por cuatro y su spread se triplica en minutos, el detector cruza los tres datos y eleva su puntaje a **0.74 (Dislocación en rojo)**.

---

### Pestaña 3: `Desvío Volumen (Z-Score)`

Decir que hoy se operaron 500 millones de dólares en un activo es mucho para una empresa mediana, pero es poquísimo para el S&P 500 o el Bitcoin. ¿Cómo comparás en una misma tabla qué activo está recibiendo hoy una avalancha de dinero fuera de lo común? El **Z-Score de Volumen** mide cuántas desviaciones estándar (`σ`) se aleja el volumen de hoy respecto de su propio promedio de los últimos 20 días.

```text
Vol Z-Score (20d) = ( Volumen 24h - Promedio 20d ) / Desvío Estándar (20d)
```

De esta forma, todos los activos quedan expresados en la misma unidad universal (`σ`):

- **Actividad habitual (-1.0σ a +1.0σ).** El volumen del día está completamente dentro de la rutina de las últimas cuatro semanas.
- **Participación alta (+1.0σ a +2.0σ).** Hay un interés superior al promedio que empieza a darle validez a la tendencia del día.
- **Choque institucional (> +2.0σ).** Ocurre en menos del 5% de las ruedas del año y suele reflejar la entrada o salida masiva de fondos institucionales tras una noticia o balance.

**Ejemplo rápido:** Si una acción suele operar $100M diarios con una variación habitual de ±$20M y hoy negocia **$160M**, está **$60M** por encima de su media, lo que equivale exactamente a **+3.0σ**.

