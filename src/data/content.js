// All the copy of the portfolio. `**double asterisks**` mark the highlighted words (shown in #FFF3BD).
// An array of strings inside a block means a line break between them.

export const HERO = {
  title: ['PORTFOLIO', 'AUDIOVISUAL'],
  name: 'Elena Morales Jiménez',
};

export const ABOUT = {
  title: ['¿Quién Soy?'],
  blocks: [
    ['¡Hola! Mi nombre es Elena Morales Jiménez y si me tuviera que describir…', 'Diría que soy…'],
    ['¡Una radio andante!'],
    ['Pero … ¿Por qué?'],
    [
      'Las personas a mi alrededor dicen que soy un libro cerrado esperando a ser abierto, una caja de Pandora: si me abres, ya no me puedes cerrar. Que parezco misteriosa, pero luego no me callo, vaya. Y ya no es solo hablar, sino también cantar. Y es que no soy cantante, pero siempre hay alguna melodía sonando en mi cabeza, y mis amigos se sorprenden con la amplia biblioteca de canciones que existe en mi cerebro. Y, aunque nunca nadie me lo ha dicho, yo supongo que llega un momento en el que se cansan de oírme.',
      'Además, soy una persona bastante nostálgica, vivo pensando en mi pasado y en un mundo anterior a mí. Hasta guardo las invitaciones de cumpleaños de personas que nunca he vuelto a ver. Es por eso que, como persona que ha vivido siempre pegada a una pantalla (de la TV, al ordenador familiar, a la Nintendo, a una tablet y hasta llegar al teléfono), decidí comenzar a documentarlo todo y a plasmar mi subconsciente en una, con banda sonora incluida.',
      'Mis mayores intereses más allá de lo audiovisual son la música, el baile, la moda, la psicología, la nutrición y el deporte.',
    ],
  ],
};

export const JOURNEY = {
  title: ['Mi trayectoria'],
  paragraph:
    'Mi primera cámara fue acuática, para poder seguir relatando hasta debajo del agua. Con ella, a los 10 años, grabé mi primer corto sobre la desaparición de tres niñas: “Las trillizas y el misterio de la oscuridad”. Por desgracia, la grabación desapareció con ellas. Desde entonces, me adentré en el mundo de las **redes sociales** con 4 cuentas diferentes: la personal, la del intento de influencer, la de los juegos interactivos y la del club de fans. Todas ellas con ediciones de imagen y vídeo muy elaboradas y dignas de ser virales, o eso me creía yo. Además, todo lo que consumía y creaba era en **inglés** con la intención de ampliar mi público. Actualmente, he terminado la carrera de **Comunicación Audiovisual** (bilingüe) en la Universidad Carlos III de Madrid, con un año cursado en **San Francisco**, California. Fui instructora de **radio** en un campamento audiovisual y, en el proyecto más grande de la carrera, un programa televisivo, fui **ayudante de realización**, encargándome de emitir las imágenes correctas y coordinando los diferentes equipos de reportaje en directo. En el resto de proyectos he adoptado mayoritariamente los puestos de **iluminación** y **sonido**, profesionalizados, junto al puesto de **cámara**, gracias a mis prácticas en el **Teatro Azarte** de Madrid, en donde trabajé mano a mano con directores de cine y de casting. También he asistido en **videoclips musicales** como ayudante de producción y dirección, alimentando mi pasión por la música desde otra perspectiva. Como ves, me adapto muy fácilmente. No obstante, mi verdadero interés es la **edición** de imagen y vídeo.',
  closing: 'El resto de mi historia estará en manos de quien me quiera contratar…',
};

export const SOFTWARE_TITLE = ['Softwares de edición'];

export const PODCAST = {
  title: ['Podcast'],
  coverAlt: 'Portada animada del podcast ¡Oye, tía!, con las dos presentadoras dibujadas',
  date: 'Septiembre 2026',
  intro: [
    '¡Oye, tía! es el producto resultante de mi Trabajo de Fin de Grado.',
    'Un proyecto entre dos personas con una idea en común:',
    '“Contar nuestra vida”',
  ],
  rolesHeading: 'Pero, ¿CUÁL FUE MI PAPEL EXACTO EN ESTE PROYECTO?:',
  roles: [
    'Creación del concepto y dirección artística: una canción = un tema',
    'Desarrollo del formato: una ficción conversacional',
    'Desarrollo de los episodios y escritura del guión',
    'Desarrollo del ambiente sonoro y composición de una melodía original',
    'Gestión del alquiler del material',
    'Actriz de voz',
    'Diseño de la identidad visual: animaciones y miniatura',
    // `link` is the underlined text of the reference (it becomes clickable once PODCAST_WEBSITE is set).
    { before: 'Dirección en la creación de la ', link: 'página web', after: ' (escucha el episodio 5)' },
    'Dirección en la edición del producto final',
  ],
};

export const CONTACT_COPY = {
  title: ['¡Contáctame!'],
  instagramLabel: 'Instagram de Elena (@eleemj)',
  linkedinLabel: 'LinkedIn de Elena (eleemj)',
  emailLabel: 'Escribir un correo a Elena',
  qrAlt: 'Código QR del Instagram @eleemj',
};

// Order and names of the slides, used by the dot navigation on the right edge.
export const SLIDE_NAV = [
  { id: 'inicio', label: 'Inicio' },
  { id: 'quien-soy', label: 'Quién soy' },
  { id: 'trayectoria', label: 'Mi trayectoria' },
  { id: 'softwares', label: 'Softwares de edición' },
  { id: 'podcast', label: 'Podcast' },
  { id: 'videos', label: 'Vídeos' },
  { id: 'videoclips', label: 'Videoclips musicales' },
  { id: 'redes-sociales', label: 'Redes sociales' },
  { id: 'guiones', label: 'Guiones' },
  { id: 'contacto', label: 'Contáctame' },
];
