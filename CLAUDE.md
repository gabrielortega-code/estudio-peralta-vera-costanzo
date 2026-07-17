# CLAUDE.md — Estudio Jurídico Peralta & Vera Costanzo

## Contexto del proyecto

Sitio web para el **Estudio Jurídico Peralta & Vera Costanzo**, especializado en Derecho de Seguros y Daños. El foco principal es el **turno digital** (sistema de reserva de turnos online).

Stack: **Next.js + Tailwind CSS + Prisma**. La página principal (`page.tsx`) ensambla los componentes: Header → Hero → HeroFaqStrip → Services → WhyUs → Team → Contact → Footer. El sistema de turnos vive en `/turnos` y el panel admin en `/admin`.

---

## Sobre el estudio

- Más de **22 años** de trayectoria.
- Presentan más de **40 reclamos extrajudiciales por mes**.
- Inician más de **10 demandas judiciales por mes** en derecho de seguros.
- Atienden a más de **20 productores de seguros**.
- Representan a **asegurados, damnificados y terceros** en conflictos con compañías aseguradoras.

---

## Copy aprobado por el cliente

### Hero (versión vigente)

- **Título**: "Especialistas en seguros. En defensa del asegurado"
- **Subtítulo (capa 1)**: "Representamos a asegurados, en conflictos derivados de siniestros: demoras, rechazos de cobertura, liquidaciones insuficientes e indemnizaciones impagas."
- **Franja secundaria (capa 2, componente `HeroFaqStrip`)** — más chica, como complemento del Hero, no como bandera:
  - ¿Tu compañía de seguros no responde? Defendemos al asegurado.
  - ¿Sufriste un accidente de tránsito? Reclamamos tus daños.
  - ¿Te reclaman por un siniestro? Te defendemos.

### Descripción del estudio (versión completa para sección "Nosotros")

Estudio Jurídico especializado en Derechos de Seguros y Daños, en defensa de los derechos del asegurado desde hace más de 22 años.

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
- Diplomatura en Derecho de Seguros — Universidad de Buenos Aires.
- Diplomatura en Derecho de Seguros — Club de Derecho (UNC).

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
- **"Consulta sin cargo/gratis" — pendiente de definición**: el código de ética profesional no permite ofrecer la primera consulta como gratuita. Se retiró toda mención de "sin cargo"/"gratuita" del sitio (Contact, BookingForm, /turnos), dejando solo "sin compromiso" donde correspondía. El cliente evalúa un esquema alternativo (p. ej. mencionar productores con convenio, o aclarar la gratuidad recién al confirmar el turno) pero todavía no lo definió — no reintroducir lenguaje de gratuidad sin confirmación explícita del cliente.
