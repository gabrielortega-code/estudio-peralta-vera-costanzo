export type Service = {
  slug: string;
  /** true para las áreas que se muestran como tarjeta en home y /servicios */
  featured?: boolean;
  /** Título corto para tarjeta de home y navegación */
  title: string;
  /** Título extendido para el encabezado de la página de detalle */
  longTitle: string;
  /** Descripción breve para la tarjeta de la home (2 líneas) */
  cardDescription: string;
  /** Bajada del hero en la página de detalle */
  lead: string;
  /** Párrafos de introducción en la página de detalle */
  intro: string[];
  /** Situaciones típicas en las que interviene el estudio */
  situations: string[];
  /** Cómo interviene el estudio (acciones concretas) */
  howWeHelp: string[];
};

export const services: Service[] = [
  {
    slug: "derecho-de-seguros",
    featured: true,
    title: "Derecho de Seguros",
    longTitle: "Derecho de Seguros",
    cardDescription:
      "Reclamos contra compañías aseguradoras y defensa integral de asegurados, damnificados y terceros frente a conflictos derivados de siniestros.",
    lead: "Defendemos a asegurados, damnificados y terceros en todo tipo de conflicto con compañías aseguradoras.",
    intro: [
      "El Derecho de Seguros es el eje de nuestro trabajo. Conocemos en profundidad el funcionamiento del mercado asegurador, sus procedimientos internos y las defensas que habitualmente oponen las compañías frente a un reclamo.",
      "Esa experiencia nos permite anticipar la estrategia de la aseguradora y definir, para cada caso, la vía más conveniente: negociación, mediación, reclamo administrativo o acción judicial.",
    ],
    situations: [
      "La compañía rechazó o demora el pago de su indemnización.",
      "Recibió una liquidación por un monto menor al que corresponde.",
      "Tiene un conflicto por la interpretación o el alcance de su póliza.",
      "Es un tercero damnificado y la aseguradora no responde.",
    ],
    howWeHelp: [
      "Analizamos la póliza, el siniestro y la documentación del caso.",
      "Definimos la estrategia más conveniente según el conflicto.",
      "Reclamamos en sede administrativa, prejudicial y judicial.",
      "Acompañamos el caso hasta la resolución y el efectivo cobro.",
    ],
  },
  {
    slug: "rechazos-de-cobertura",
    title: "Rechazos de cobertura e incumplimientos",
    longTitle: "Rechazos de cobertura e incumplimientos contractuales",
    cardDescription:
      "Intervenimos ante rechazos de cobertura, incumplimientos contractuales y demoras en el pago de indemnizaciones por parte de la aseguradora.",
    lead: "Cuando la aseguradora rechaza la cobertura o incumple lo pactado, evaluamos la legalidad de esa decisión y la revertimos.",
    intro: [
      "Muchos rechazos de cobertura se apoyan en cláusulas de difícil lectura, plazos vencidos o supuestas exclusiones que no siempre son válidas. Revisamos cada fundamento esgrimido por la compañía para determinar si el rechazo es legítimo o abusivo.",
      "También intervenimos ante incumplimientos contractuales y demoras injustificadas en el pago de la indemnización, que pueden generar intereses y resarcimientos adicionales a favor del asegurado.",
    ],
    situations: [
      "Le rechazaron el siniestro invocando una exclusión de póliza.",
      "La aseguradora alega falta de pago, mora o reticencia.",
      "Se vencieron los plazos legales y no le pagaron.",
      "Le ofrecen un acuerdo muy por debajo de lo que corresponde.",
    ],
    howWeHelp: [
      "Verificamos la validez del rechazo y de las cláusulas invocadas.",
      "Reclamamos formalmente la cobertura ante la compañía.",
      "Exigimos los intereses y resarcimientos por la demora.",
      "Iniciamos la acción judicial cuando es la vía adecuada.",
    ],
  },
  {
    slug: "accidentes-de-transito",
    featured: true,
    title: "Accidentes de Tránsito",
    longTitle: "Accidentes de Tránsito",
    cardDescription:
      "Representación de víctimas de accidentes de tránsito en el reclamo de los daños sufridos, en sede administrativa, prejudicial y judicial.",
    lead: "Representamos a víctimas de accidentes de tránsito en el reclamo integral de los daños sufridos.",
    intro: [
      "Un accidente de tránsito puede generar daños materiales, lesiones físicas, gastos médicos, lucro cesante y daño moral. Reclamamos cada uno de esos rubros con respaldo técnico y criterio jurídico, contra el responsable y su aseguradora.",
      "Acompañamos a la víctima desde el primer momento, organizando la prueba y la documentación necesaria para sostener un reclamo sólido.",
    ],
    situations: [
      "Sufrió lesiones o daños en un accidente de tránsito.",
      "El responsable o su seguro no quieren hacerse cargo.",
      "No sabe qué daños puede reclamar ni cómo cuantificarlos.",
      "Un familiar resultó gravemente afectado en un siniestro vial.",
    ],
    howWeHelp: [
      "Reunimos y organizamos la prueba del accidente y de los daños.",
      "Cuantificamos los daños materiales, físicos y morales.",
      "Reclamamos al responsable y a su compañía de seguros.",
      "Llevamos el caso a juicio cuando no hay acuerdo razonable.",
    ],
  },
  {
    slug: "responsabilidad-civil-y-danos",
    title: "Responsabilidad Civil y Daños",
    longTitle: "Responsabilidad Civil y Daños y Perjuicios",
    cardDescription:
      "Cuantificación y reclamo de daños y perjuicios, responsabilidad civil contractual y extracontractual, con criterio jurídico y respaldo técnico.",
    lead: "Reclamamos la reparación de daños y perjuicios derivados de la responsabilidad civil contractual y extracontractual.",
    intro: [
      "Cuando una persona sufre un daño por la acción u omisión de un tercero, tiene derecho a una reparación integral. Trabajamos en la cuantificación precisa de ese daño y en la acreditación de la responsabilidad del obligado a repararlo.",
      "Abordamos tanto la responsabilidad contractual (incumplimiento de un acuerdo) como la extracontractual (daños sin vínculo previo), con el respaldo técnico necesario para sostener cada rubro reclamado.",
    ],
    situations: [
      "Sufrió un daño por la conducta o negligencia de un tercero.",
      "Le incumplieron un contrato y eso le generó perjuicios.",
      "Necesita cuantificar correctamente el daño sufrido.",
      "Le reclaman a usted una responsabilidad que considera injusta.",
    ],
    howWeHelp: [
      "Determinamos la responsabilidad y los rubros reclamables.",
      "Cuantificamos el daño con respaldo técnico y jurisprudencial.",
      "Negociamos la reparación o la reclamamos judicialmente.",
      "Asumimos también la defensa frente a reclamos infundados.",
    ],
  },
  {
    slug: "destruccion-total-e-infraseguro",
    title: "Destrucción total, infraseguro y liquidación de siniestros",
    longTitle: "Destrucción total, infraseguro y liquidación de siniestros",
    cardDescription:
      "Análisis de la póliza y del siniestro en casos de destrucción total e infraseguro, y revisión de la liquidación ofrecida por la compañía.",
    lead: "Revisamos la liquidación de su siniestro para que cobre lo que realmente corresponde.",
    intro: [
      "En casos de destrucción total o infraseguro, el monto que ofrece la compañía suele estar por debajo del valor real. Analizamos la póliza, la suma asegurada y los criterios de valuación aplicados para detectar diferencias en su contra.",
      "Controlamos la liquidación ofrecida y, cuando corresponde, la impugnamos para reclamar el valor correcto del bien siniestrado.",
    ],
    situations: [
      "Le declararon destrucción total y la oferta le parece baja.",
      "Sospecha que su póliza tiene infraseguro.",
      "No entiende cómo la compañía calculó la indemnización.",
      "Quiere una revisión independiente de la liquidación.",
    ],
    howWeHelp: [
      "Analizamos la póliza, la suma asegurada y la valuación.",
      "Detectamos infraseguro y errores en la liquidación.",
      "Impugnamos la liquidación cuando es insuficiente.",
      "Reclamamos el valor correcto del bien siniestrado.",
    ],
  },
  {
    slug: "mediaciones-y-ejecucion",
    title: "Mediaciones, negociaciones y ejecución de sentencias",
    longTitle: "Mediaciones, negociaciones y ejecución de sentencias",
    cardDescription:
      "Negociaciones prejudiciales, mediaciones y reclamos administrativos, hasta la ejecución de las sentencias obtenidas a favor de nuestros clientes.",
    lead: "Acompañamos el conflicto en todas sus instancias, desde la negociación inicial hasta la ejecución de la sentencia.",
    intro: [
      "No todos los conflictos requieren un juicio. Muchas veces una negociación prejudicial o una mediación bien planteada permite resolver el reclamo en menos tiempo y con menor desgaste para el cliente.",
      "Y cuando llegamos a una sentencia favorable, nos ocupamos de su ejecución para que el reconocimiento del derecho se traduzca en el cobro efectivo.",
    ],
    situations: [
      "Quiere intentar un acuerdo antes de litigar.",
      "Fue citado a una mediación y necesita representación.",
      "Tiene una sentencia favorable que no se cumple.",
      "Busca resolver el conflicto en el menor tiempo posible.",
    ],
    howWeHelp: [
      "Diseñamos y conducimos la negociación prejudicial.",
      "Lo representamos en mediaciones y reclamos administrativos.",
      "Evaluamos cada acuerdo para proteger sus intereses.",
      "Ejecutamos las sentencias obtenidas hasta el cobro efectivo.",
    ],
  },
];

export function getService(slug: string): Service | undefined {
  return services.find((s) => s.slug === slug);
}

export const servicesIntro =
  "Acompañamos cada caso desde el análisis inicial de la póliza y/o del siniestro hasta la resolución extrajudicial o judicial del conflicto.";
