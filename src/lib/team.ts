export type Member = {
  slug: string;
  name: string;
  role: string;
  roleType: "Socio/a" | "Asociado/a";
  matricula: string;
  title: string;
  photo: string;
  /** Bullet de presentación corto para la tarjeta de la home */
  summary: string;
  /** Perfil profesional completo (página Sobre Nosotros) */
  profile: string;
  areas: string[];
  background: string[];
  /** true cuando la ficha definitiva aún no fue provista por el cliente */
  pending?: boolean;
};

export const team: Member[] = [
  {
    slug: "virginia-vera-costanzo",
    name: "Paola Virginia Vera Costanzo",
    role: "Socia fundadora",
    roleType: "Socio/a",
    matricula: "Mat. 1-39560",
    title: "Abogada — Derecho de Seguros, Responsabilidad Civil y Daños",
    photo: "/equipo/virginia-vera-costanzo.jpg",
    summary:
      "Socia fundadora y referente en la dirección estratégica de los casos.",
    profile:
      "Abogada con formación específica en Derecho de Seguros y Daños, egresada de la Universidad Nacional de Córdoba. Socia del estudio y referente en la dirección estratégica de los casos. Miembro Titular de la Asociación Argentina de Derecho de Seguros (A.I.D.A.).",
    areas: [
      "Derecho de Seguros",
      "Responsabilidad Civil",
      "Daños y Perjuicios",
      "Accidentes de Tránsito",
      "Derecho Previsional",
    ],
    background: [
      "Egresada de la UNC – Facultad de Derecho.",
      "Miembro Titular de la Asociación Argentina de Derecho de Seguros / A.I.D.A.",
      "Diplomatura en Derecho de Daños y Perjuicios.",
      "Especialización en Derecho Previsional.",
      "Formación continua en Derecho de Seguros, accidentes de tránsito y litigación oral.",
    ],
  },
  {
    slug: "javier-peralta",
    name: "Javier Alberto Peralta",
    role: "Socio fundador",
    roleType: "Socio/a",
    matricula: "Mat. 1-37973",
    title: "Abogado — Derecho de Seguros, Responsabilidad Civil y Daños",
    photo: "/equipo/javier-peralta.jpg",
    summary: "Socio fundador del estudio.",
    profile:
      "Abogado y socio fundador del Estudio, dedicado al Derecho de Seguros, la Responsabilidad Civil y los Daños. Acompaña la dirección del estudio en la representación judicial y extrajudicial de asegurados, damnificados y terceros afectados por siniestros.",
    areas: [
      "Derecho de Seguros",
      "Responsabilidad Civil",
      "Daños y Perjuicios",
      "Accidentes de Tránsito",
    ],
    background: [
      "Socio fundador del Estudio Jurídico Peralta & Vera Costanzo.",
      "Matrícula profesional 1-37973.",
    ],
    pending: true,
  },
  {
    slug: "valentin-britos",
    name: "José Valentín Britos Candan",
    role: "Asociado",
    roleType: "Asociado/a",
    matricula: "Mat. 10-768",
    title: "Abogado — Derecho de Seguros, Responsabilidad Civil y Daños",
    photo: "/equipo/valentin-britos.jpg",
    summary:
      "Práctica en Derecho de Seguros, cuantificación del daño y litigación oral.",
    profile:
      "Abogado egresado de la Universidad Nacional de Córdoba, con formación continua en Derecho de Seguros, cuantificación del daño y litigación oral. Miembro Titular de la Asociación Argentina de Derecho de Seguros (A.I.D.A.). Cuenta con práctica profesional en Derecho Laboral y empresarial.",
    areas: [
      "Derecho de Seguros",
      "Responsabilidad Civil",
      "Derecho Procesal",
      "Litigación Oral",
    ],
    background: [
      "Egresado de la UNC – Facultad de Derecho.",
      "Miembro Titular de la Asociación Argentina de Derecho de Seguros / A.I.D.A.",
      "Diplomatura en Derecho Procesal Civil.",
      "Práctica profesional en Derecho Laboral y empresarial.",
      "Formación continua en Derecho de Seguros, cuantificación del daño y litigación oral.",
    ],
  },
  {
    slug: "luciana-garcia-vidal",
    name: "Luciana García Vidal",
    role: "Asociada",
    roleType: "Asociado/a",
    matricula: "Mat. 1-42830",
    title: "Abogada — Derecho de Seguros, Responsabilidad Civil y Daños",
    photo: "/equipo/luciana-garcia-vidal.jpg",
    summary:
      "Especializada en accidentes de tránsito, cuantificación del daño y litigación oral.",
    profile:
      "Abogada egresada sobresaliente de la Universidad Nacional de Córdoba. Miembro Titular de la Asociación Argentina de Derecho de Seguros (A.I.D.A.). Con formación en Derecho de Daños y especialización en accidentes de tránsito, cuantificación del daño y litigación oral.",
    areas: [
      "Derecho de Seguros",
      "Derecho de Daños",
      "Accidentes de Tránsito",
      "Litigación Oral",
    ],
    background: [
      "Egresada sobresaliente de la UNC – Facultad de Derecho.",
      "Miembro Titular de la Asociación Argentina de Derecho de Seguros / A.I.D.A.",
      "Posgrado en acompañamiento a varones que ejercen violencia de género.",
      "Diplomatura en Derecho de Daños.",
      "Formación continua en Derecho de Seguros, accidentes de tránsito, litigación oral y cuantificación del daño.",
    ],
  },
];

export const teamIntro =
  "Nuestro equipo está integrado por abogados dedicados a la litigación y al Derecho de Seguros, con experiencia en la representación judicial y extrajudicial de asegurados, damnificados y personas afectadas por conflictos derivados de siniestros. Combinamos formación específica, práctica forense y trabajo coordinado para brindar un abordaje integral de cada caso.";
