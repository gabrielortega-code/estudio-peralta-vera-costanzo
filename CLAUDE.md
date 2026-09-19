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

## Infraestructura: lo que hay que saber antes de tocar nada

> La versión extendida de esto está en `SETUP.md`, que **no está versionado**
> (lo ignora `.gitignore` junto con `Branding/` y `docs/`). Este resumen sí viaja
> con el repo.

### Los correos salen por dos canales distintos, a propósito

El servidor de correo del estudio (`c205.dattaweb.com`, hosting DonWeb) **rechaza
los correos que manda Brevo**: `550 5.7.1 Blacklisted [France, Europe]`. Brevo
envía desde rangos europeos y DonWeb los tiene en lista negra. El bloqueo es **a
nivel servidor**, así que cualquier dirección `@estudiojuridicoperalta.com`
alojada ahí rebota igual — no se arregla cambiando `EMAIL_ADMIN` a otra casilla
del mismo dominio.

Por eso `src/lib/email.ts` tiene dos canales:

| Correo | Canal | Por qué |
|---|---|---|
| Confirmación **al cliente** | Brevo | Va a dominios externos (Gmail, Hotmail); ahí la entregabilidad de Brevo es buena |
| Aviso de turno nuevo **al estudio** | SMTP propio del hosting | Entrega local dentro del mismo servidor: no pasa por el filtro de listas negras |

Configuración del SMTP (cuatro variables, en `.env` y en Vercel):

```
SMTP_HOST = c205.ferozo.com
SMTP_PORT = 465
SMTP_USER = turnero@estudiojuridicoperalta.com
SMTP_PASS = (la de esa casilla)
```

⚠️ **El host es `c205.ferozo.com`, no `mail.estudiojuridicoperalta.com`.** Los dos
resuelven a `200.58.112.97`, pero el servidor presenta un certificado
`CN=*.ferozo.com` que no cubre el dominio del estudio. Con el otro nombre falla la
verificación TLS y habría que desactivarla; con este valida limpio.

`turnero@` es **solo el remitente**. El destinatario sigue siendo `EMAIL_ADMIN`
(`javier@estudiojuridicoperalta.com`), en su casilla de siempre. La casilla ya
existía sin uso en el hosting y se reutilizó; se administra desde el panel de
DonWeb, en Correos.

El aviso interno **no reintenta por Brevo** si el SMTP falla: cada rebote acerca la
dirección a la lista de bloqueados de Brevo, donde después falla en silencio. Si
falla, se registra en el log y el estudio ve la reserva en `/admin`, que se
refresca solo cada 60 segundos. El fallback a Brevo queda activo únicamente cuando
no hay variables SMTP, o sea en desarrollo y previews.

⚠️ **No mandar correos de prueba *por Brevo* a casillas
`@estudiojuridicoperalta.com`**: los rebotes acumulados hacen que Brevo agregue la
dirección a su lista de bloqueados y después falle en silencio. Por el SMTP propio
no aplica: Brevo no participa y probar contra esas casillas es seguro.

### El sitio se publica en `www`, no en la raíz

`NEXT_PUBLIC_SITE_URL` es `https://www.estudiojuridicoperalta.com` y ese es el
dominio canónico. La raíz se queda apuntando a DonWeb y redirige con un 301 desde
el `.htaccess` del hosting. **Conectado el 04/09/2026**: el CNAME de `www` apunta a
`90816cf90d9467b7.vercel-dns-017.com` (valor propio del proyecto, no el genérico
`cname.vercel-dns.com`) y el redirect de la raíz está acotado por `HTTP_HOST`,
porque el `.com` y el `.site` comparten document root.

No es una preferencia estética: en la zona DNS, `autodiscover` y `autoconfig` —los
nombres que Outlook usa para configurarse— son CNAME apuntando a la raíz. Un
intento anterior de mover la raíz a Vercel se los llevó puestos y **cortó el correo
del estudio**. Dejando la raíz quieta, el único cambio de DNS es el CNAME de `www`,
del que no depende nada del correo.

Si alguna vez se lleva la raíz a Vercel: desacoplar primero `autodiscover` y
`autoconfig` (de CNAME a registro A directo a `200.58.112.97`), y **eliminar el
registro AAAA de la raíz**, o todos los visitantes con IPv6 siguen viendo el sitio
viejo.

### El panel de admin: contraseña propia y código por email

Desde la reunión de septiembre de 2026, Javier tiene **su propia contraseña** y
la puede cambiar solo, desde "Seguridad" en el panel. El login tiene dos pasos:
la contraseña, y después un **código de 6 dígitos** que llega a su correo (vence
a los 10 minutos, un solo uso, 5 intentos, máximo 3 códigos por hora).

- La contraseña se guarda **hasheada con scrypt** en la tabla `admin_user`
  (`src/lib/adminAuth.ts`). El formato `scrypt$N$r$p$salt$hash` lleva los
  parámetros adentro, así que se pueden cambiar sin invalidar los hashes viejos.
- El código del segundo factor sale por el **SMTP propio del hosting**, nunca por
  Brevo, por lo mismo que el aviso de turnos (ver más arriba).
- El alta inicial y la recuperación se hacen con `npm run admin:password`, un
  script de línea de comandos. No hay registro público, a propósito.
- Cambiar la contraseña incrementa `tokenVersion` y con eso **cierra todas las
  sesiones abiertas** y da de baja los dispositivos de confianza: las dos cookies
  llevan la versión adentro de la firma.

**La sesión dura 30 días y se renueva sola.** Cuando le queda menos de la mitad,
`GET /api/admin/turnos` —que el panel consulta al abrirse y cada 60 segundos—
devuelve una cookie nueva. Usando el panel con cierta regularidad, Javier no
vuelve a ver la pantalla de login.

**Dispositivo de confianza.** En la pantalla del código hay una casilla, *apagada
por defecto*, para no volver a pedirlo en esa computadora. Marca una cookie
`admin_device` de 90 días; con ella presente, el paso 1 abre la sesión con solo
la contraseña. No debilita el segundo factor: el código protege contra quien
averigua la contraseña **sin** tener el navegador de Javier, y una cookie
`httpOnly` en su máquina no le sirve a esa persona. Salir del panel **no** borra
la marca, a propósito.

La contraparte de una sesión larga es **"Cerrar sesión en todos los
dispositivos"** (`DELETE /api/admin/sesiones`, botón en Seguridad): incrementa
`tokenVersion` sin tocar la contraseña, así que corta todo de una si se pierde un
equipo. La pestaña desde la que se aprieta recibe una sesión nueva.

Las cookies de sesión y de dispositivo se firman con propósitos distintos
(`sesion:` y `dispositivo:` adentro del HMAC), así que una no puede presentarse
como la otra.

⚠️ **`ADMIN_SECRET` ya no es la contraseña del panel.** Quedó con dos usos, los
dos de quien administra el sitio, no del cliente:

1. Firma las cookies de sesión. Rotarla cierra todas las sesiones.
2. Habilita el acceso de emergencia por header `x-admin-secret`, **sin** el
   código por correo, para poder entrar si el correo de Javier deja de
   funcionar.

Por eso tiene que ser un valor aleatorio largo y **no** hay que compartirla con
el cliente.

### Turnos: la exclusión de horarios vive en la aplicación

Cada consulta dura una hora (`DURACION_MIN` en `src/lib/turnos.ts`) pero la
grilla ofrece slots cada 30 minutos, así que reservar las 10:00 también bloquea
las 09:30 y las 10:30. La regla la comparten el formulario, el panel y la API.

**No hay constraint de unicidad en la base**: un `@@unique(fecha, horaInicio)`
impediría volver a reservar un horario cuyo turno fue cancelado, y tampoco
cubriría el solapamiento de ±30 minutos. La exclusión mutua la garantiza
`src/lib/disponibilidad.ts`, con `pg_advisory_xact_lock` por fecha y un
re-chequeo dentro de la misma transacción. Funciona mientras **toda** escritura
pase por las rutas de la API: una carga a mano desde Prisma Studio o por SQL
directo puede duplicar un horario.

Las fechas se comparan en hora argentina con `hoyEnArgentina()`, no con la del
servidor: en Vercel el servidor está en UTC y después de las 21:00 de acá ya
pasó al día siguiente.

### Horarios configurables por día

`CalendarConfig` (tabla `calendar_config`, un `Json`) ya manejaba la modalidad
por día; desde septiembre de 2026 maneja además **qué horas se atienden**, con
`weekdayHours` (por día de la semana) y `dayHours` (excepción de una fecha
puntual). Se guardan los horarios **habilitados**, no los bloqueados: una
configuración vieja sin esos campos significa "se atiende en todos los
horarios", así que no hubo que migrar nada. El helper es `horariosHabilitados()`
en `src/lib/calendar.ts`.

Javier lo configura desde "Calendario" en el panel. Si un cambio deja turnos ya
agendados fuera de horario, el panel los lista antes de guardar — pero **no los
cancela**: eso lo decide él.

La configuración limita lo que el público puede reservar solo. En la
reprogramación desde el panel, los horarios fuera de agenda aparecen marcados
pero se pueden elegir igual.

### Remitente de Brevo

`EMAIL_FROM` es `turnos@mail.estudiojuridicoperalta.com`. Ese **subdominio** está
autenticado en Brevo (DKIM + verificación por DNS); el dominio raíz **no**. No
cambiarlo al raíz "para que quede más prolijo": se cae la entregabilidad.
