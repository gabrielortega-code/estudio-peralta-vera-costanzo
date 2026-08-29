# CLAUDE.md — Estudio Jurídico Peralta & Vera Costanzo

## Contexto del proyecto

Sitio web para el **Estudio Jurídico Peralta & Vera Costanzo**, especializado en Derecho de Seguros y Daños. El foco principal es el **turno digital** (sistema de reserva de turnos online).

Stack: **Next.js + Tailwind CSS + Prisma**. La página principal (`page.tsx`) ensambla los componentes: Header → Hero → HeroFaqStrip → Services → WhyUs → Team → Contact → Footer. El sistema de turnos vive en `/turnos` y el panel admin en `/admin`.

---

## Sobre el estudio

- Más de **14 años** de trayectoria.
- Atienden a más de **50 productores de seguros**.
- Representan a **asegurados, damnificados y terceros** en conflictos con compañías aseguradoras.

> Las cifras de "+40 reclamos extrajudiciales por mes" y "+10 demandas judiciales por mes" se
> retiraron del sitio por pedido del cliente (reunión con Javier Peralta). El Hero muestra
> únicamente las dos métricas de arriba.

---

## Copy aprobado por el cliente

### Hero (versión vigente)

- **Título**: "Especialistas en Derecho de Seguros. En defensa del asegurado" — la segunda oración va en dorado y **debe caer en una sola línea propia** (salto forzado).
- **Subtítulo (capa 1)**: "Asesoramos, defendemos y representamos a los asegurados frente a todo tipo de incumplimiento contractual por parte de las aseguradoras."
- **Imagen**: el Hero abre con la foto grupal (`/equipo/equipo-completo.png`, recorte con fondo transparente), con dos tratamientos según breakpoint —decisión del cliente tras comparar ambas versiones—: en **desktop (lg+)** va de fondo sobre el borde derecho, con el degradé cortado antes de llegar a las personas; en **mobile/tablet** baja como recuadro redondeado con fondo propio, entre los botones y las métricas. En los dos casos hay una luz difusa detrás del grupo: sobre el navy plano los trajes oscuros pierden silueta. Por usarse acá, esa misma foto ya **no** se repite en la sección "Nuestro equipo" de la home; sigue estando en `/nosotros`.
- **Franja secundaria (capa 2, componente `HeroFaqStrip`)** — el primer bloque es destacado (tiene que verse y leerse), los otros dos quedan chicos como complemento:
  - **¿Problemas con tu aseguradora?** Te asesoramos y representamos ante conflictos derivados de siniestros, análisis de póliza, incumplimiento de la aseguradora, demoras injustificadas, liquidaciones de pago insuficientes, rechazos de cobertura, toda controversia en el vínculo contractual entre asegurado y aseguradora.
  - ¿Sufriste un accidente de tránsito? Reclamamos tus daños.
  - ¿Te reclaman por un siniestro? Te defendemos.

### Descripción del estudio (versión completa para sección "Nosotros")

Estudio Jurídico especializado en Derechos de Seguros y Daños, en defensa de los derechos del asegurado desde hace más de 14 años.

### Sección "¿Por qué elegirnos?" — Versión con íconos (WhyUs)

| Diferencial | Descripción |
|---|---|
| **Especialización** | Nos dedicamos especialmente al Derecho de Seguros, con experiencia en reclamos contra compañías aseguradoras y conflictos derivados de siniestros. |
| **Experiencia práctica** | Conocemos el funcionamiento del mercado asegurador, sus procedimientos internos y las defensas habituales frente a los reclamos. |
| **Estrategia jurídica** | Analizamos cada caso en profundidad para definir la vía más conveniente: negociación, mediación, reclamo administrativo o acción judicial. |
| **Atención personalizada** | Cada cliente recibe un acompañamiento directo, claro y constante durante todo el proceso. |
| **Gestión integral del reclamo** | Intervenimos desde el análisis inicial de la póliza y/o del siniestro hasta la resolución extrajudicial o judicial del conflicto. |
| **Compromiso profesional** | Trabajamos con seriedad, transparencia y orientación a resultados concretos. |

### Servicios (Services)

Áreas de práctica del estudio (`src/lib/services.ts`). Solo **Derecho de Seguros** y **Accidentes de Tránsito** están marcadas `featured: true` y se muestran como tarjetas en la home y en `/servicios` — decisión del cliente para no saturar esas secciones. Las otras 4 áreas siguen existiendo como páginas de detalle accesibles por URL directa (SEO), pero no se listan:
- Derecho de Seguros *(featured)*
- Rechazos de cobertura e incumplimientos
- Accidentes de Tránsito *(featured)*
- Responsabilidad Civil y Daños
- Destrucción total, infraseguro y liquidación de siniestros
- Mediaciones, negociaciones y ejecución de sentencias

---

## Equipo (Team)

Frase institucional para mostrar antes de las fichas:

> Nuestro equipo está integrado por abogados dedicados a la litigación y al Derecho de Seguros, con experiencia en la representación judicial y extrajudicial de asegurados, damnificados y personas afectadas por conflictos derivados de siniestros. Combinamos formación específica, práctica forense y trabajo coordinado para brindar un abordaje integral de cada caso.

Estructura uniforme para cada ficha:
- **Nombre**
- **Título**
- **Perfil profesional** (párrafo breve)
- **Áreas de intervención** (tags)
- **Antecedentes destacados** (lista de 4-5 puntos)

**Orden de aparición aprobado por el cliente**: Javier → Virginia → Luciana → Valentín (así están ordenados en `src/lib/team.ts`, que es la fuente que consumen `Team.tsx` y `nosotros/page.tsx`).

### Javier Alberto Peralta — Director
**Rol**: Director  
**Título**: Director del Estudio Jurídico Peralta & Vera Costanzo

Abogado y socio fundador del Estudio, dedicado al Derecho de Seguros, la Responsabilidad Civil y los Daños. Lleva la dirección del estudio en la representación judicial y extrajudicial de asegurados, damnificados y terceros afectados por siniestros.

Antecedentes:
- Miembro Titular de la Asociación Argentina de Derecho de Seguros.
- Abogado egresado de la Universidad Nacional de Córdoba.
- Maestrando en Derecho y Argumentación (UNC).
- Diplomatura en Derecho de Seguros — Universidad Católica de Buenos Aires.
- Diplomatura en Derecho de Seguros — Club de Derecho.

Áreas: Derecho de Seguros · Responsabilidad Civil · Daños y Perjuicios · Accidentes de Tránsito

---

### Paola Virginia Vera Costanzo — Socia
**Rol**: Socia  
**Título**: Abogada — Derecho de Seguros, Responsabilidad Civil y Daños

Abogada con formación específica en Derecho de Seguros y Daños, egresada de la Universidad Nacional de Córdoba. Socia del estudio y referente en la dirección estratégica de los casos. Miembro Titular de la Asociación Argentina de Derecho de Seguros (A.I.D.A.).

Antecedentes:
- Egresada de la UNC – Facultad de Derecho.
- Miembro Titular de la Asociación Argentina de Derecho de Seguros / A.I.D.A.
- Diplomatura en Derecho de Daños y Perjuicios.
- Especialización en Derecho Previsional.
- Formación continua en Derecho de Seguros, accidentes de tránsito y litigación oral.

Áreas: Derecho de Seguros · Responsabilidad Civil · Daños y Perjuicios · Accidentes de Tránsito · Derecho Previsional

---

### Luciana García Vidal — Asociada
**Rol**: Asociada  
**Título**: Abogada — Derecho de Seguros, Responsabilidad Civil y Daños

Abogada egresada sobresaliente de la Universidad Nacional de Córdoba. Miembro Titular de la Asociación Argentina de Derecho de Seguros (A.I.D.A.). Con formación en Derecho de Daños y especialización en accidentes de tránsito, cuantificación del daño y litigación oral.

Antecedentes:
- Egresada sobresaliente de la UNC – Facultad de Derecho.
- Miembro Titular de la Asociación Argentina de Derecho de Seguros / A.I.D.A.
- Posgrado en acompañamiento a varones que ejercen violencia de género.
- Diplomatura en Derecho de Daños.
- Formación continua en Derecho de Seguros, accidentes de tránsito, litigación oral y cuantificación del daño.

Áreas: Derecho de Seguros · Derecho de Daños · Accidentes de Tránsito · Litigación Oral

---

### José Valentín Britos Candan — Asociado
**Rol**: Asociado  
**Título**: Abogado — Derecho de Seguros, Responsabilidad Civil y Daños

Abogado egresado de la Universidad Nacional de Córdoba, con formación continua en Derecho de Seguros, cuantificación del daño y litigación oral. Miembro Titular de la Asociación Argentina de Derecho de Seguros (A.I.D.A.). Cuenta con práctica profesional en Derecho Laboral y empresarial.

Antecedentes:
- Egresado de la UNC – Facultad de Derecho.
- Miembro Titular de la Asociación Argentina de Derecho de Seguros / A.I.D.A.
- Diplomatura en Derecho Procesal Civil.
- Práctica profesional en Derecho Laboral y empresarial.
- Formación continua en Derecho de Seguros, cuantificación del daño y litigación oral.

Áreas: Derecho de Seguros · Responsabilidad Civil · Derecho Procesal · Litigación Oral

---

## Notas para Claude

- El **turno digital** es el feature central del sitio — priorizar claridad y facilidad de uso en `/turnos`.
- El tono del copy es **profesional pero accesible**: evitar lenguaje excesivamente técnico-legal en secciones dirigidas al cliente final.
- El cliente aprobó tanto la versión larga como la versión con íconos de los diferenciales — elegir según el componente que corresponda.
- **Nada de "sin cargo/gratis" NI de "sin compromiso"**: el código de ética profesional no permite ofrecer la primera consulta como gratuita, y en la reunión con Javier Peralta el cliente pidió eliminar además toda referencia a "primera consulta sin compromiso". Hoy no queda ninguna de las dos fórmulas en el sitio (Contact, BookingForm, /turnos, /nosotros, /servicios y las páginas de área). El cliente evalúa un esquema alternativo (p. ej. mencionar productores con convenio, o aclarar la gratuidad recién al confirmar el turno) pero todavía no lo definió — no reintroducir ese lenguaje sin confirmación explícita del cliente.

---

## Infraestructura: dos cosas que hay que saber antes de tocar nada

> La versión extendida de esto está en `SETUP.md`, que **no está versionado**
> (lo ignora `.gitignore` junto con `Branding/` y `docs/`). Este resumen sí viaja
> con el repo.

### 🔴 Los avisos de turno al estudio no llegan

El servidor de correo del estudio (`c205.dattaweb.com`, hosting DonWeb) **rechaza
los correos que manda Brevo**: `550 5.7.1 Blacklisted [France, Europe]`. Brevo
envía desde rangos europeos y DonWeb los tiene en lista negra. El bloqueo es **a
nivel servidor**, así que cualquier dirección `@estudiojuridicoperalta.com`
alojada ahí rebota igual — no se arregla cambiando `EMAIL_ADMIN` a otra casilla
del mismo dominio.

Los correos **al cliente sí funcionan** (verificado contra Hotmail). El problema
es solo el aviso interno.

Opción recomendada, pendiente de decisión del cliente: mandar el aviso interno por
el **SMTP propio de DonWeb** (`mail.estudiojuridicoperalta.com:465`, autenticado
con una casilla `turnos@estudiojuridicoperalta.com`), y dejar Brevo para los
correos al cliente. La entrega autenticada al propio servidor no pasa por el
filtro de listas negras.

Mientras tanto el estudio ve las reservas en `/admin`, que se refresca solo cada
60 segundos.

⚠️ **No mandar correos de prueba a casillas `@estudiojuridicoperalta.com`**: los
rebotes acumulados hacen que Brevo agregue la dirección a su lista de bloqueados y
después falle en silencio.

### El sitio se publica en `www`, no en la raíz

`NEXT_PUBLIC_SITE_URL` es `https://www.estudiojuridicoperalta.com` y ese es el
dominio canónico. La raíz se queda apuntando a DonWeb y redirige con un 301 desde
el `.htaccess` del hosting.

No es una preferencia estética: en la zona DNS, `autodiscover` y `autoconfig` —los
nombres que Outlook usa para configurarse— son CNAME apuntando a la raíz. Un
intento anterior de mover la raíz a Vercel se los llevó puestos y **cortó el correo
del estudio**. Dejando la raíz quieta, el único cambio de DNS es el CNAME de `www`,
del que no depende nada del correo.

Si alguna vez se lleva la raíz a Vercel: desacoplar primero `autodiscover` y
`autoconfig` (de CNAME a registro A directo a `200.58.112.97`), y **eliminar el
registro AAAA de la raíz**, o todos los visitantes con IPv6 siguen viendo el sitio
viejo.

### Remitente de Brevo

`EMAIL_FROM` es `turnos@mail.estudiojuridicoperalta.com`. Ese **subdominio** está
autenticado en Brevo (DKIM + verificación por DNS); el dominio raíz **no**. No
cambiarlo al raíz "para que quede más prolijo": se cae la entregabilidad.
