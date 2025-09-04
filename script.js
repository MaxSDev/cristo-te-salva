document.addEventListener('DOMContentLoaded', () => {

    // --- DOM ELEMENTS ---
    const boardElement = document.getElementById('game-board');
    const rollDiceBtn = document.getElementById('roll-dice-btn');
    const diceResultElement = document.getElementById('dice-result');
    const turnIndicator = document.getElementById('turn-indicator');
    const gameTitleElement = document.getElementById('game-title');
    const backgroundMusic = document.getElementById('background-music');
    const muteBtn = document.getElementById('mute-btn');
    const diceSound = document.getElementById('dice-sound');
    const victorySound = document.getElementById('victory-sound');
    const cellSound = document.getElementById('cell-sound');
    const bonusSound = document.getElementById('bonus-sound');

    // --- MODAL ELEMENTS ---
    const eventModal = new bootstrap.Modal(document.getElementById('event-modal'));
    const modalTitle = document.getElementById('modal-title');
    const modalText = document.getElementById('modal-text');
    const modalIcon = document.getElementById('modal-icon');
    const modalFooter = document.getElementById('modal-footer');
    const instructionModal = new bootstrap.Modal(document.getElementById('instruction-modal'));
    const startGameBtn = document.getElementById('start-game-btn');
    const playerSetupModal = new bootstrap.Modal(document.getElementById('player-setup-modal'));
    const addPlayerBtn = document.getElementById('add-player-btn');
    const startGameSetupBtn = document.getElementById('start-game-setup-btn');
    const playerNameInput = document.getElementById('player-name');
    const tokenSelection = document.getElementById('token-selection');
    const playerList = document.getElementById('player-list');
    const victoryModal = new bootstrap.Modal(document.getElementById('victory-modal'));
    const doubleRollMessage = document.getElementById('double-roll-message');

    // --- GAME STATE ---
    let players = [];
    let currentPlayerIndex = 0;
    let currentStageIndex = 0;
    let boardLayout = [];
    let availableCards = {};
    let catchUpModeActive = false;
    let currentBg = null;

    // --- GAME CONFIGURATION ---
    const gameStages = [
        {
            name: "Estudios y Trabajo",
            background: "background.png",
            boardSize: 19,
            grid: { rows: 7, cols: 4 },
            cards: {
                piedra: [
                    "¿Qué presión en tus estudios o trabajo te ha quitado la paz últimamente?",
                    "Nombra un miedo o inseguridad que afecte tu forma de aprender o de trabajar",
                    "¿Te comparas con otros en tu rendimiento académico o laboral? (Si te sientes listo, cuéntanos un ejemplo breve)",
                    "Describe una meta que sientas fuera de tu alcance y que te frustra.",
                    "¿Qué tarea, proyecto o responsabilidad has estado posponiendo? (Compártelo y deja que la comunmidad te motive)",
                    "Anota algo que siempre esperas de ti mismo y que te agota",
                    "Piensa en el nombre de una persona con la que constantemente te comparas. Escribe su inicial",
                    "Haz un dibujo de cómo te sientes por dentro hoy",
                    "¿Cuándo fue la última vez que disfrutaste realmente aprender o trabajar?",
                    "¿Qué sueños has dejado en pausa por falta de tiempo o por miedo?",
                    "Si pudieras pedirle a Dios ayuda en una sola cosa de tus estudios o trabajo, ¿qué sería?",
                    "¿Sientes que tu esfuerzo es reconocido?",
                    "¿Sientes que estás dando lo mejor de ti en tus estudios/trabajo?",
                    "¿Has sentido que tu valor depende solo de tus calificaciones o resultados?",
                    "¿Qué error reciente no logras dejar de recordar?",
                    "¿Te has sentido solo o sin apoyo en tus estudios o trabajo?",
                    "¿Cuándo fue la última vez que pediste a Dios ayuda antes de un examen o tarea importante?",
                    "¿Te agota intentar cumplir con expectativas muy altas?",
                    "¿Has sentido que no tienes las habilidades suficientes para lo que se te pide?",
                    "¿Sientes que tu tiempo nunca alcanza para todo lo que debes hacer?",
                    "¿Te cuesta concentrarte porque tienes demasiadas preocupaciones?",
                    "¿Qué obstáculo está bloqueando tu motivación para aprender o rendir mejor?",
                    "¿Qué pensamiento negativo se repite más cuando enfrentas un examen, entrega o meta?",
                    "¿Qué responsabilidad llevas en silencio porque no quieres preocupar a otros?",
                    "¿Qué miedo tienes al futuro respecto a tu carrera o tu profesión?",
                    "¿Te sientes atrapado en la rutina de estudiar o trabajar sin un propósito claro?",
                    "¿Qué carga llevas por tratar de agradar siempre a los demás con tu rendimiento?",
                    "¿Qué parte de ti sientes que se está apagando en medio de tantas exigencias?",
                    "¿Cuál es el sacrificio más grande que has tenido que hacer últimamente en tu descanso o vida personal por causa de estudios/trabajo?",
                    "¿Sientes que te comparas constantemente con tus compañeros y no estás a la altura?",
                    "¿Piensas que podrías estar desperdiciando tu potencial?",
                    "¿Te cuestionas si has eligido la carrera o el trabajo correcto para ti?",
                    "¿Dudas de tu capacidad para adaptarte a los cambios o nuevas responsabilidades?",
                    "¿Qué es lo que más te frustra de tu ritmo actual?",
                    "¿Qué te roba más energía: la presión externa o tu autoexigencia? Pide a alguno de tus hermanos una palabra de apoyo",
                    "¿Qué parte de ti se siente más cansada: la mente, el corazón o el cuerpo"
                ],
                cruz: [
                    "¿Qué pequeño paso puedes dar para organizar mejor tu tiempo esta semana?",
                    "Decide una cosa que puedes delegar o en la que puedes pedir ayuda",
                    "Comprométete a celebrar un pequeño logro tuyo esta semana, sin compararlo",
                    "¿Qué puedes aprender de un error reciente en lugar de castigarte por él?",
                    "Elige una actividad que te dé energía y hazle un espacio en tu agenda",
                    "Revisa tus expectativas: ¿son realistas o te estás exigiendo demasiado?",
                    "Escribe una verdad sobre ti (ej. “soy valioso”) y guárdala",
                    "En tu oración diaria incluye anímate a decir: “Señor, yo no puedo, pero tú sí”",
                    "Durante esta semana levántate, estírate y respira profundamente durante un minuto",
                    "Anota en un papel una preocupación y entrégasela a Dios",
                    "Organiza tu espacio de estudio o trabajo para despejar tu mente",
                    "Dedica 5 minutos para hacer una lista de tus pendientes y ordénalos por prioridad",
                    "Ora antes de iniciar tu jornada y ofrécesela a Dios",
                    "Si tienes dudas durante la semana pide consejo a alguien con más experiencia en tu área. (Comprométete hoy y cuéntanos cómo te fue la próxima vez)",
                    "Dedica 5 minutos hoy a agradecer a Dios lo que has logrado, celebra tus pequeños y grandes logros",
                    "Identifica una distracción que puedas eliminar esta semana. (Compártela y pide al grupo que te ayude a recordarlo)",
                    "Escoge una tarea pendiente y hazla en los próximos dos días. (Dilo como compromiso en voz alta)",
                    "Ayuda a un compañero en algo que tú dominas. (Piensa en quién será y cuéntanos después cómo fue)",
                    "Cambia un hábito que te reste energía por uno que te acerque a Dios",
                    "Reza un Ave María antes de un momento importante",
                    "Ofrécele a Dios tu próximo examen o proyecto. (Compártelo ahora para que oremos por ello)",
                    "Aprende a decir no a compromisos que te sobrecarguen y te distraigan de tus objetivos",
                    "Divide una tarea grande en partes pequeñas y trabaja en una sola a la vez",
                    "Cambia tu ambiente de trabajo o estudio para darle un aire fresco y motivador",
                    "Haz una pausa activa o breve caminata cuando sientas que te falta energía o concentración",
                    "Busca un recurso o curso breve que te ayude a fortalecer una competencia que sientes débil",
                    "Haz una lista de tus habilidades y reconoce cuáles puedes usar más en tus tareas",
                    "Deja tu celular en otra habitación por media hora y usa ese tiempo para avanzar en algo importante",
                    "Ora un Padre Nuestro antes de empezar a estudiar o trabajar",
                    "Escribe una frase bíblica en tu cuaderno o escritorio y léela cada día de esta semana",
                    "Ofrece tu esfuerzo del día por alguien que necesite fuerza o ánimo",
                    "Comparte con el grupo un logro pequeño de la semana y celébralo en comunidad",
                    "Deja que cada uno de tus hermanos te diga una virtud que ve en ti",
                ],
                luz: [
                    "«Encomienda tus obras a Yavé, y tus proyectos se realizarán.» - Proverbios 16,3",
                    "Tu valor no se mide por tu productividad, sino por ser hijo de Dios.",
                    "El descanso no es un lujo, es un mandato divino para renovar cuerpo y espíritu.",
                    "No temas pedir ayuda. La comunidad está para sostenerte.",
                    "Jesús te llama a ser luz en tu lugar de trabajo o estudio, no a ser perfecto.",
                    "No estás solo: tu esfuerzo también es oración.",
                    "“Tu estudio y trabajo son parte del plan que Dios sueña contigo.”",
                    "San Josemaría Escrivá: “Santifica tu trabajo, y santifícate en tu trabajo.”",
                    "Dios ve tu esfuerzo incluso cuando nadie lo aplaude.",
                    "El Espíritu Santo quiere inspirarte incluso en tu tarea más pequeña.",
                    "«Confía en el Señor con todo el corazón, y no te fíes de tu propia sabiduría.» - Proverbios 3,5",
                    "«Buscad primero su Reino y su justicia, y todas esas cosas se os darán por añadidura.» - Mt 6,33",
                    "El trabajo y el estudio son caminos para servir a los demás.",
                    "«El que es fiel en lo mínimo, lo es también en lo mucho; y el que es injusto en lo mínimo, también lo es en lo mucho.» - Lc 16,10",
                    "Tu esfuerzo unido a la gracia de Dios produce frutos eternos.",
                    "Jesús, José y María te acompañan también en tus estudios y tu trabajo.",
                    "Cada esfuerzo sincero se convierte en semilla de futuro.",
                    "Descansa en Dios: Él conoce tu esfuerzo mejor que nadie.",
                    "«Todo cuanto hagáis, hacedlo de corazón, como para el Señor y no para los hombres» - Colosenses 3,23",
                    "Que cada palabra y acción en tu estudio sea reflejo del amor de Cristo.",
                    "Permite que la humildad guíe tu aprendizaje y desempeño diario.",
                    "Cada dificultad es una oportunidad para crecer en fe y fortaleza.",
                    "Confía en que Dios proveerá la sabiduría que necesitas en tus estudios.",
                    "El trabajo bien hecho, aunque invisible para el mundo, es visible para Dios.",
                    "Que tu esfuerzo sea un testimonio silencioso del valor del trabajo honesto.",
                    "Trabaja con alegría, como servicio a Dios y a tus hermanos.",
                    "Pide diariamente al Espíritu Santo que ilumine tu mente y fortalezca tu voluntad.",
                    "El verdadero descanso está en saber que Dios camina contigo en tu jornada.",
                    "El trabajo es santo cuando se hace con amor y sentido de entrega."
                ]
            }
        },
        {
            name: "Familia",
            background: "background-familia.png",
            boardSize: 19,
            grid: { rows: 7, cols: 4 },
            cards: {
                piedra: [
                    "¿Qué herida o conflicto familiar sigues cargando?",
                    "Nombra una expectativa de tu familia que te resulte pesada.",
                    "¿Sientes que no te comunicas bien con un ser querido? (Compártelo solo si te sientes listo)",
                    "Existe algún recuerdo doloroso en familia que no has sanado (Compártelo solo si te sientes listo o lista)",
                    "¿Qué rol o etiqueta familiar sientes que te limita?",
                    "¿Sentís que puedes ser tu mismo(a) en casa?",
                    "¿Cómo sería para ti el hogar ideal? ¿Se parece a donde tú vives hoy?",
                    "¿Hay algo que te gustaría decirle a tu familia, pero no te atreves?",
                    "¿Te cuesta perdonar algún error de tus padres, hermanos o familiares?",
                    "¿Te comparan con otros dentro de la familia? ¿Cómo te hace sentir eso?",
                    "Si pudieras pedirle a Dios un milagro para tu familia, ¿Cuál sería?",
                    "¿Hay algo que recuerdes con dolor de tu infancia?",
                    "Piensa en una dificultad familiar que te pesa. Si quieres, compártela brevemente con el grupo",
                    "Recuerda una situación reciente en la que te hayas sentido incomprendido en tu hogar. ¿Qué aprendiste de eso?",
                    "¿Hay alguna relación familiar que hoy sientas fría o distante?",
                    "Menciona algo que te cueste perdonar a un familiar, si te sientes cómodo(a)",
                    "Piensa en una discusión familiar que te dejó un sentimiento amargo. ¿Qué harías diferente ahora?",
                    "¿Qué hábito o actitud de un familiar te causa frustración constante?",
                    "Comparte una palabra que describa tu estado emocional en casa últimamente",
                    "¿Qué momento familiar reciente te hizo sentir desanimado?",
                    "Reflexiona sobre una promesa familiar que no se cumplió",
                    "¿Qué tensión en tu hogar preferirías evitar, pero sigue presente?",
                    "Piensa en una expectativa familiar que sientas difícil de cumplir",
                    "¿Hay algo que temes decirle a tu familia?",
                    "¿Qué situación familiar sientes que siempre se repite y te agota?",
                    "¿Qué momento familiar te ha hecho sentir solo/a, incluso rodeado de todos?",
                    "¿Qué aspecto de tu vida familiar no has entregado todavía a Dios?",
                    "¿Qué te gustaría cambiar en la manera en que tu familia se comunica?",
                    "¿Qué te ayuda a encontrar paz cuando hay conflictos familiares?",
                    "¿Cómo reaccionas cuando un familiar está pasando por un momento difícil",
                    "¿Hay algo que te gustaría pedirle perdón a un familiar pero no lo has hecho aún?",
                    "¿Qué sueñas para la relación con tus padres o hijos en el futuro?",
                    "¿Alguna vez has sentido que necesitas más espacio personal en tu hogar?",
                    "¿Qué es lo que más te cuesta expresar con tus familiares?",
                    "¿Cómo manejan en tu familia las diferencias de opinión o puntos de vista",
                    "¿Cómo te gustaría que tu familia vea tu crecimiento personal o profesional?",
                    "¿Sientes que tus límites son respetados en tu entorno familiar?",
                ],
                cruz: [
                    "Elige a un miembro de tu familia para tener un gesto de aprecio esta semana.",
                    "Dale las gracias a un miembro de tu familia por algo que haya hecho por ti hoy",
                    "Decide perdonar una pequeña ofensa familiar que te haya dolido",
                    "Busca un momento para escuchar a un familiar sin interrumpir",
                    "Comprométete a establecer un límite sano con un miembro de tu familia",
                    "¿Qué tradición familiar positiva puedes iniciar o revivir?",
                    "Antes de dormir, piensa en tres cosas por las que estás agradecido respecto a tu familia",
                    "Pregunta “¿Cómo estás?” a alguien de tu familia y escucha su respuesta",
                    "Decide no responder con enojo en una conversación difícil",
                    "Haz una oración por esa persona de tu familia con quien has tenido conflicto",
                    "Escoge tres palabras que describan para ti el “Hogar ideal” y pensá qué acciones podrían ayudarte a que esas palabras describan a tu hogar también",
                    "Piensa ¿Qué es lo que más te gusta hacer en familia?, busca una oportunidad para hacerlo",
                    "Piensa ¿Qué contribución personal te gustaría hacer para mejorar la convivencia familiar?",
                    "Comparte una comida en familia sin distracciones de tecnología",
                    "Ofrece tu ayuda para una tarea que sabes que alguien de tu familia debe hacer",
                    "Comparte una lectura o reflexión espiritual con tu familia",
                    "Haz un esfuerzo consciente para practicar la paciencia con un familiar",
                    "Planea una actividad divertida o relajante para compartir en casa",
                    "Pide disculpas si sientes que tú has causado daño en una discusión",
                    "Invita a un familiar a orar contigo, aunque sea por unos minutos",
                    "Escribe en un papel algo que admiras de cada integrante de tu familia",
                    "Tómate un tiempo para agradecer a Dios por tu familia",
                    "¿Cuál es la bendición más grande que ves hoy en tu hogar?",
                    "Piensa en un consejo de un familiar que te haya guiado bien",
                    "¿Qué enseñanza valiosa has recibido de tu hogar?",
                    "¿Qué sueño tienes para tu familia que te llena de ilusión?",
                    "¿Cómo celebras con tu familia las victorias, por pequeñas que sean?",
                    "¿Qué tradición familiar te llena de alegría?"
                ],
                luz: [
                    "«Honra a tu padre y a tu madre, para que se prolonguen tus días sobre la tierra que Yahveh, tu Dios, te va a dar.» - Éxodo 20,12",
                    "El amor de Dios es más grande que cualquier conflicto familiar.",
                    "Perdonar como hemos sido perdonados es el camino a la paz familiar.",
                    "Cada familia es un reflejo imperfecto del amor de la Trinidad.",
                    "No puedes cambiar a tu familia, pero puedes cambiar tu forma de amarlos.",
                    "“Tu familia es el primer regalo que Dios pensó para ti.”",
                    "“La paciencia es la llave para abrir corazones en casa.”",
                    "“Aunque haya diferencias, el amor siempre une.”",
                    "“Tus palabras pueden ser un refugio para los tuyos.”",
                    "“Un pequeño detalle puede alegrar el día de tu hogar.”",
                    "“Tu familia es la primera escuela del amor.”",
                    "“Dios bendice cada sacrificio hecho por amor en casa.”",
                    "“Un corazón agradecido transforma a la familia.”",
                    "“La fe compartida en familia es una fortaleza inquebrantable.”",
                    "“Tu familia es tu primer lugar de misión.”",
                    "“Dios no se equivoca: te puso en tu familia con un propósito.”",
                    "“Un hogar con oración se convierte en un pequeño cielo.”",
                    "“Un corazón que escucha trae paz al hogar.”",
                    "“Tu ejemplo puede ser la inspiración de alguien en tu casa.”",
                    "La oración en familia es el cimiento que fortalece el hogar.",
                    "Cada disculpa sincera sana una herida y construye puentes.",
                    "Confía en que Dios guía incluso los senderos difíciles de tu familia.",
                    "El amor verdadero sabe esperar, escuchar y perdonar sin condiciones.",
                    "La luz de Cristo puede transformar cualquier sombra en tu hogar.",
                    "«Hijos, obedezcan a sus padres, pues esto es un deber: Honra a tu padre y a tu madre. Es, además, el primer mandamiento que va acompañado de una promesa: para que seas feliz y goces de larga vida en la tierra.» - Efesios 6,1-2",
                    "«Sopórtense y perdónense unos a otros si uno tiene motivo de queja contra otro. Como el Señor los perdonó, a su vez hagan ustedes lo mismo.» - Colosenses 3,13"
                ]
            }
        },
        {
            name: "Amigos",
            background: "background-amigos.png",
            boardSize: 19,
            grid: { rows: 7, cols: 4 },
            cards: {
                piedra: [
                    "¿Te has sentido traicionado, abandonado o decepcionado por una amistad?",
                    "¿Has sentido alguna vez que un amigo te ha fallado? (Si quieres, comparte cómo te afectó)",
                    "Piensa en un miedo que te impide ser auténtico con tus amigos",
                    "¿Sientes envidia o competencia en alguna de tus amistades?",
                    "¿Hay una amistad que terminaste y aún te duele?",
                    "¿Existe alguna máscara o apariencia que usas para ser aceptado por tus amigos?",
                    "¿Guardas algo que quisieras decir a un amigo pero no te animas?",
                    "¿Cómo te sientes con tus amigos actualmente? ¿Te ofrecen un lugar seguro para ser tú mismo?",
                    "¿Te has sentido solo(a) aun estando rodeado de tus amigos?",
                    "¿Sientes que tus amistades actuales te acercan o te alejan de Dios?",
                    "¿Te comparas con tus amigos y eso te pesa?",
                    "¿Hay un amigo con quien ya no hablas y te gustaría recuperar la relación",
                    "¿Sientes que recibes el mismo apoyo que les das a tus amigos?",
                    "¿Te has sentido excluido de un grupo de amigos? ¿Cómo te afecta eso?",
                    "¿Te cuesta confiar debido a experiencias pasadas?",
                    "¿Tu fe ha sido motivo de conflicto o distanciamiento con algún amigo?",
                    "¿Qué te impide abrirte más con tus amigos?",
                    "¿Cómo reaccionas cuando un amigo comete un error contigo?",
                    "¿Sientes que has perdido paz interior por la influencia de algún amigo?",
                    "¿Algún amigo te ha hecho dudar de tu fe o principios?",
                    "¿Has sentido que una amistad te ha llevado a hacer cosas que antes evitabas?",
                    "¿Sientes que has descuidado tu relación con Dios por querer agradar a tus amigos?",
                    "¿Has experimentado ansiedad o estrés por amistades que exigen más de lo que puedes dar?",
                    "¿Algún amigo ha difundido cosas negativas o chismes que te han lastimado",
                    "¿Sientes que una amistad te ha desviado del camino que Dios quiere para ti?",
                    "¿Sientes que tus amigos no respetan tus decisiones basadas en tu fe?",
                    "¿Sientes que has tenido que ocultar partes de tu vida espiritual con amigos por miedo al rechazo?",
                    "¿Te has preguntado si alguna amistad está trayendo más oscuridad que luz a tu vida?"
                ],
                cruz: [
                    "Mándale un mensaje a un amigo con el que no hables seguido para preguntarle cómo está",
                    "Decide ser el primero en pedir perdón en un conflicto con un amigo",
                    "Comprométete a ser un oyente activo la próxima vez que un amigo te necesite",
                    "Atrévete a mostrarte vulnerable con un amigo de confianza",
                    "Organiza un encuentro que fomente la conversación real, más allá de lo superficial",
                    "Invita a alguien a pasar tiempo juntos, aunque sea un ratito",
                    "Ora por esas amistades con las que te has distanciado",
                    "Escribe en un papel el nombre de un amigo con quien quieras sanar tu relación y entrégaselo a Dios",
                    "Perdona en silencio a ese amigo que te hirió, aunque no lo sepa. Repítelo las veces que sea necesario. Dios no se cansa de escucharte",
                    "Agradece en tu oración por los amigos que Dios te ha regalado y por los que se han ido también, pues todos cumplieron una misión en tu vida",
                    "Comparte con alguien un reel, un tiktok, una canción o algo que le pueda dar ánimo",
                    "Elige hoy apoyar a un amigo que esté pasando por un momento difícil",
                    "Ora por la intención especial de un amigo cada día esta semana",
                    "Escucha atentamente cuando un amigo necesite hablar, sin interrumpir",
                    "Comparte con un amigo una palabra de aliento inspirada en la fe",
                    "Agradece sinceramente a un amigo por su amistad y apoyo constante",
                    "Establece un límite sano si una amistad te está causando malestar",
                    "Reconoce un buen gesto de un amigo para fortalecer su relación",
                    "Anima a un amigo a seguir adelante con palabras y acciones",
                    "Comparte un versículo bíblico que te haya ayudado en una situación difícil",
                    "Dedica tiempo de calidad para conocer más a fondo a un amigo que lo necesite",
                    "Escucha y sé paciente con un amigo que está pasando por procesos personales difíciles",
                    "Haz silencio un minuto y recuerda quién ha estado contigo en los momentos difíciles",
                    "Elige un amigo y mándale un mensaje agradeciéndole algo concreto que haya hecho por ti",
                    "Identifica si alguna amistad que no te está acercando a Dios y anótala para reflexionar en oración",
                    "Haz un pequeño gesto de servicio a un amigo sin que se dé cuenta",
                    "Ofrece un sacrificio (como no usar el celular un rato) por un amigo que esté luchando con algo",
                    "Piensa: ¿qué amigo tuyo necesita más apoyo emocional ahora? Comprométete a escucharlo esta semana",
                    "Haz memoria de tu mejor recuerdo con un amigo y compártelo en voz alta si te sientes listo",
                    "Regálale a un amigo una palabra de ánimo en la semana",
                    "Evalúa: ¿qué tanto tiempo dedicas a tus amigos y cuánto a Dios? Escríbelo en tu hoja",
                    "Atrévete a decirle a un amigo algo positivo que nunca le has expresado",
                    "Escribe una cualidad tuya que te hace un buen amigo y una que necesitas mejorar",
                    "Ora un Padre Nuestro por un amigo en silencio o en voz alta, ofreciéndole esa amistad a Dios"
                ],
                luz: [
                    "«El amigo ama en toda ocasión, el hermano nace para tiempo de angustia.» - Proverbios 17,17",
                    "Jesús es el amigo que nunca falla y que dio la vida por nosotros.",
                    "La verdadera amistad nos acerca a Dios.",
                    "Una amistad centrada en Cristo es un tesoro invaluable.",
                    "En cada amigo podemos ver un reflejo del amor incondicional de Cristo.",
                    "Confía en que Dios está obrando en cada relación para tu bien.",
                    "La luz de Cristo brilla en nosotros cuando somos amigos sinceros y fieles.",
                    "En la amistad genuina encontramos un refugio seguro para el alma.",
                    "Tu amistad puede ser un faro de esperanza para alguien que lo necesita.",
                    "En la compañía de amigos, la alegría de Dios renace y se renueva.",
                    "Nunca subestimes el poder de una palabra amable en una amistad.",
                    "El amor de Dios nos enseña a ser amigos fieles y comprensivos.",
                    "Confía en que tu vida en amistad tiene un propósito hermoso en el plan de Dios.",
                    "Las amistades fortalecidas por la oración son un gran tesoro que Dios cuida.",
                    "Dios bendice las amistades que nacen del amor sincero y el servicio mutuo.",
                    "Jesús también eligió amigos para caminar con Él.",
                    "Escuchar con el corazón es el mayor regalo a un amigo.",
                    "Tu ejemplo puede inspirar a tus amigos a acercarse más a Dios.",
                    "Caminar acompañado siempre es más fácil que ir solo.",
                    "El respeto fortalece cualquier amistad.",
                    "Cuando apoyas a un amigo en dificultad, reflejas el amor de Cristo.",
                    "Un amigo que te corrige con amor es un verdadero hermano.",
                    "Cada amigo verdadero tiene algo de Dios que mostrarte.",
                    "Tu sonrisa puede alegrar el corazón cansado de tu amigo.",
                    "Caminar en la fe con amigos fortalece el alma.",
                    "Los amigos verdaderos se cuidan mutuamente como un regalo sagrado.",
                    "Un corazón agradecido por sus amigos siempre brilla con alegría."
                ]
            }
        }
    ];

    // --- PLAYER SETUP ---
    function initializePlayerSetup() {
        playerSetupModal.show();
        let selectedColor = null;

        tokenSelection.addEventListener('click', (e) => {
            if (e.target.classList.contains('player-token-option') && !e.target.classList.contains('disabled')) {
                document.querySelectorAll('.player-token-option').forEach(el => el.classList.remove('selected'));
                e.target.classList.add('selected');
                selectedColor = e.target.dataset.color;
            }
        });

        addPlayerBtn.addEventListener('click', () => {
            const name = playerNameInput.value.trim();
            if (name && selectedColor) {
                players.push({ name, color: selectedColor, position: 0, id: players.length, finishedStage: false });
                renderPlayerList();
                playerNameInput.value = '';
                document.querySelectorAll('.player-token-option').forEach(el => el.classList.remove('selected'));
                const selectedToken = tokenSelection.querySelector(`[data-color='${selectedColor}']`);
                selectedToken.classList.add('disabled');
                selectedColor = null;
                startGameSetupBtn.disabled = false;
            }
        });

        startGameSetupBtn.addEventListener('click', () => {
            playerSetupModal.hide();
            instructionModal.show();
        });
    }

    function renderPlayerList() {
        playerList.innerHTML = '';
        players.forEach(player => {
            const li = document.createElement('li');
            li.className = 'list-group-item';
            li.textContent = player.name;
            const tokenImg = document.createElement('img');
            tokenImg.src = `${player.color}.svg`;
            tokenImg.style.width = '20px';
            tokenImg.style.height = '20px';
            tokenImg.style.marginLeft = '10px';
            li.appendChild(tokenImg);
            playerList.appendChild(li);
        });
    }

    // --- INITIALIZATION & STAGE MANAGEMENT ---
    function initializeGame() {
        currentStageIndex = 0;
        setupStage();
    }

    function setupStage() {
        const stage = gameStages[currentStageIndex];
        availableCards = JSON.parse(JSON.stringify(stage.cards));
        gameTitleElement.textContent = stage.name;

        // --- Lógica de Animación de Fondo con GSAP ---
        const newBgId = `#bg-stage-${currentStageIndex}`;
        const newBg = document.querySelector(newBgId);

        // Si hay un fondo anterior, lo desvanecemos
        if (currentBg) {
            gsap.to(currentBg, { opacity: 0, duration: 1.5 });
        }

        // Mostramos el nuevo fondo con una transición suave
        gsap.to(newBg, { opacity: 1, duration: 1.5 });
        currentBg = newBg; // Actualizamos el fondo actual
        // --- Fin de la lógica de animación ---

        boardLayout = generateSnakeBoardLayout(stage.boardSize, stage.grid.rows, stage.grid.cols);
        createBoard(stage.grid.rows, stage.grid.cols);
        
        players.forEach(p => {
            p.position = 0;
            p.finishedStage = false;
        });

        catchUpModeActive = false;
        doubleRollMessage.style.display = 'none';

        if (document.getElementById('player-token-0')) {
            players.forEach(p => movePlayerToken(p.id, 0, true));
        } else {
            createPlayerTokens();
        }
        
        setTimeout(() => repositionTokensOnCell(0), 100);
        updateTurnIndicator();
        rollDiceBtn.disabled = false;
    }

    function advanceToNextStage() {
        currentStageIndex++;
        if (currentStageIndex >= gameStages.length) {
            showFinalVictory();
        } else {
            const message = `¡Todos han llegado! Preparando la siguiente etapa: ${gameStages[currentStageIndex].name}`;
            doubleRollMessage.textContent = message;
            doubleRollMessage.style.display = 'block';

            setTimeout(() => {
                doubleRollMessage.style.display = 'none';
                setupStage();
            }, 2000); // 5-second delay
        }
    }

    function showFinalVictory() {
        backgroundMusic.pause();
        victorySound.play();
        victoryModal.show();
        document.getElementById('restart-game-btn').addEventListener('click', () => location.reload());
    }

    // --- BOARD CREATION ---
    function generateSnakeBoardLayout(pathSize, gridRows, gridCols) {
        const path = [];
        let x = 0;
        let y = gridRows - 1;
        let dir = 1;

        for (let i = 0; i < Math.ceil(pathSize / (gridCols + 1)); i++) {
            for (let j = 0; j < gridCols; j++) {
                if (path.length >= pathSize) break;
                path.push({ row: y + 1, col: x + 1 });
                if (j < gridCols - 1) {
                    x += dir;
                }
            }

            if (path.length >= pathSize) break;

            if (y > 0) {
                y--;
                path.push({ row: y + 1, col: x + 1 });
                y--;
                dir *= -1;
            }
        }

        const layout = { path, grid: { rows: gridRows, cols: gridCols } };
        const cellTypes = Array(path.length).fill('luz');
        cellTypes[0] = 'start';
        cellTypes[path.length - 1] = 'end';

        const bonusIndex = Math.floor(path.length / 2);
        cellTypes[bonusIndex] = 'bonus';

        const availableSquares = path.length - 3;
        const baseCount = Math.floor(availableSquares / 3);
        const numPiedra = baseCount;
        const numCruz = baseCount;

        let placed = 0;
        while(placed < numPiedra) {
            const index = Math.floor(Math.random() * (path.length - 2)) + 1;
            if (cellTypes[index] === 'luz') {
                cellTypes[index] = 'piedra';
                placed++;
            }
        }
        placed = 0;
        while(placed < numCruz) {
            const index = Math.floor(Math.random() * (path.length - 2)) + 1;
            if (cellTypes[index] === 'luz') {
                cellTypes[index] = 'cruz';
                placed++;
            }
        }

        layout.path.forEach((pos, i) => pos.type = cellTypes[i]);
        return layout;
    }

    function createBoard(rows, cols) {
        boardElement.innerHTML = '';
        boardElement.style.gridTemplateRows = `repeat(${rows}, 1fr)`;
        boardElement.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;

        const totalCells = rows * cols;
        const pathCoords = boardLayout.path.map(p => `${p.row}-${p.col}`);

        for (let i = 0; i < totalCells; i++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            const rowIndex = Math.floor(i / cols) + 1;
            const colIndex = (i % cols) + 1;

            const pathIndex = pathCoords.indexOf(`${rowIndex}-${colIndex}`);
            if (pathIndex !== -1) {
                cell.classList.add('path');
                cell.dataset.cellIndex = pathIndex;
                const cellConfig = boardLayout.path[pathIndex];
                let iconPath = '';
                switch (cellConfig.type) {
                    case 'start': cell.classList.add('start-cell'); iconPath = 'bi-play-fill'; break;
                    case 'end': cell.classList.add('end-cell'); iconPath = 'bi-door-open-fill'; break;
                    case 'bonus': cell.classList.add('bonus-cell'); break;
                    case 'piedra': iconPath = 'piedra.svg'; break;
                    case 'cruz': iconPath = 'cruz.svg'; break;
                    case 'luz': iconPath = 'fosforo.svg'; break;
                }
                if (iconPath) {
                    const icon = document.createElement(iconPath.endsWith('.svg') ? 'img' : 'i');
                    if (iconPath.endsWith('.svg')) { icon.src = iconPath; icon.className = 'game-icon'; }
                    else { icon.className = `bi ${iconPath}`; }
                    cell.appendChild(icon);
                }
            }
            boardElement.appendChild(cell);
        }
    }

    function createPlayerTokens() {
        players.forEach(player => {
            const token = document.createElement('img');
            token.id = `player-token-${player.id}`;
            token.className = 'player-token';
            token.src = `${player.color}.svg`;
            boardElement.appendChild(token);
            movePlayerToken(player.id, 0, true);
        });
    }

    // --- UI & VISUALS ---
    function movePlayerToken(playerId, pathIndex, instant = false) {
        const token = document.getElementById(`player-token-${playerId}`);
        if (!token) return;

        const cellElement = document.querySelector(`[data-cell-index='${pathIndex}']`);
        if (cellElement) {
            token.style.transition = instant ? 'none' : 'all 0.4s ease-in-out, transform 0.3s ease-in-out';
            const boardRect = boardElement.getBoundingClientRect();
            const cellRect = cellElement.getBoundingClientRect();
            token.style.top = `${cellRect.top - boardRect.top}px`;
            token.style.left = `${cellRect.left - boardRect.left}px`;
        }
    }

    function repositionTokensOnCell(pathIndex) {
        const playersOnCell = players.filter(p => p.position === pathIndex);
        const tokens = playersOnCell.map(p => document.getElementById(`player-token-${p.id}`));
        const numTokens = tokens.length;

        if (numTokens <= 1) {
            if(tokens[0]) {
                tokens[0].style.transform = 'translate(0, 0) scale(1)';
                tokens[0].classList.remove('stacked');
            }
            return;
        }

        const radius = 10;
        tokens.forEach((token, i) => {
            if(token) {
                const angle = (i / numTokens) * 2 * Math.PI;
                const x = radius * Math.cos(angle);
                const y = radius * Math.sin(angle);
                token.style.transform = `translate(${x}px, ${y}px) scale(0.8)`;
                token.classList.add('stacked');
            }
        });
    }

    function animateDice(result1, result2 = 0) {
        let rolls = 0;
        const maxRolls = 10;
        const interval = setInterval(() => {
            const randomFace1 = Math.floor(Math.random() * 6) + 1;
            let displayHtml = `<i class="bi bi-dice-${randomFace1}-fill"></i>`;
            if (result2 > 0) {
                const randomFace2 = Math.floor(Math.random() * 6) + 1;
                displayHtml += ` + <i class="bi bi-dice-${randomFace2}-fill"></i>`;
            }
            diceResultElement.innerHTML = displayHtml;
            rolls++;
            if (rolls >= maxRolls) {
                clearInterval(interval);
                let finalHtml = `<i class="bi bi-dice-${result1}-fill"></i>`;
                if (result2 > 0) {
                    finalHtml += ` + <i class="bi bi-dice-${result2}-fill"></i>`;
                }
                diceResultElement.innerHTML = finalHtml;
            }
        }, 100);
    }

    function updateTurnIndicator() {
        const currentPlayer = players[currentPlayerIndex];
        if (currentPlayer.finishedStage) {
            turnIndicator.textContent = `${currentPlayer.name} ha llegado.`;
        } else {
            let text = `Turno de: ${currentPlayer.name}`;
            if (catchUpModeActive && !currentPlayer.finishedStage) {
                text += ' (Tiro Doble)';
            }
            turnIndicator.textContent = text;
        }
    }

    // --- GAME LOGIC ---
    function drawCard(type) {
        if (availableCards[type] && availableCards[type].length > 0) {
            const cardIndex = Math.floor(Math.random() * availableCards[type].length);
            const card = availableCards[type].splice(cardIndex, 1)[0];
            return card;
        }
        return null;
    }

    function playDiceSound() {
        const animationDuration = 1.0; // Duración de la animación del dado en segundos

        const playSound = () => {
            if (diceSound.duration && isFinite(diceSound.duration)) {
                diceSound.playbackRate = diceSound.duration / animationDuration;
            } else {
                diceSound.playbackRate = 1.0; // Fallback si la duración no está disponible
            }
            diceSound.currentTime = 0;
            diceSound.play().catch(error => console.error("Error al reproducir el sonido del dado:", error));
        };

        // Si la metadata del audio ya está cargada, reproduce el sonido.
        // Si no, espera al evento 'loadedmetadata' que se dispara una sola vez.
        if (diceSound.readyState > 0) {
            playSound();
        } else {
            diceSound.addEventListener('loadedmetadata', playSound, { once: true });
        }
    }

    function rollDice() {
        playDiceSound();
        rollDiceBtn.disabled = true;
        const currentPlayer = players[currentPlayerIndex];
        let diceRoll1 = Math.floor(Math.random() * 6) + 1;
        let diceRoll2 = 0;

        if (catchUpModeActive && !currentPlayer.finishedStage) {
            diceRoll2 = Math.floor(Math.random() * 6) + 1;
            animateDice(diceRoll1, diceRoll2);
        } else {
            animateDice(diceRoll1);
        }
        
        const totalRoll = diceRoll1 + diceRoll2;

        setTimeout(() => {
            const oldPosition = currentPlayer.position;
            const finalCellIndex = gameStages[currentStageIndex].boardSize - 1;
            let newPosition = oldPosition + totalRoll;
            if (newPosition >= finalCellIndex) {
                newPosition = finalCellIndex;
            }
            movePlayer(currentPlayer.id, oldPosition, newPosition);
        }, 1200);
    }

    function movePlayer(playerId, oldPosition, newPosition) {
        if (newPosition === oldPosition) {
            handleCellEvent();
            return;
        }

        let currentStep = oldPosition;
        const moveInterval = setInterval(() => {
            currentStep++;
            if (currentStep <= newPosition) {
                movePlayerToken(playerId, currentStep);
                if (currentStep === newPosition) {
                    clearInterval(moveInterval);
                    players[currentPlayerIndex].position = newPosition;
                    repositionTokensOnCell(oldPosition);
                    repositionTokensOnCell(newPosition);
                    handleCellEvent();
                }
            }
        }, 400);
    }

    function playSound(soundElement) {
        soundElement.currentTime = 0;
        soundElement.play().catch(error => console.log(`Error al reproducir sonido: ${error}`));
    }

    function handleCellEvent() {
        const currentPlayer = players[currentPlayerIndex];
        const finalCellIndex = gameStages[currentStageIndex].boardSize - 1;

        if (currentPlayer.position === finalCellIndex) {
            handleStageEnd();
            return;
        }

        const cellType = boardLayout.path[currentPlayer.position].type;
        if (cellType === 'empty' || cellType === 'start') {
            nextTurn();
            return;
        }

        if (cellType === 'bonus') {
            playSound(bonusSound);
            showModal('¡Bonificación!', 'Tira el dado de nuevo.', 'bi-star-fill', 
                [{ text: 'Tirar de Nuevo', class: 'btn-primary', action: () => { eventModal.hide(); rollDiceBtn.disabled = false; } }]
            );
            return; // Don't go to next turn
        }

        const cardText = drawCard(cellType);
        if (cardText) {
            playSound(cellSound);
            let title = '';
            let icon = '';
            switch (cellType) {
                case 'piedra': title = 'Carga (Piedra)'; icon = 'piedra.svg'; break;
                case 'cruz': title = 'Acción (Cruz)'; icon = 'cruz.svg'; break;
                case 'luz': title = 'Luz (Fósforo)'; icon = 'fosforo.svg'; break;
            }
            showModal(title, cardText, icon, [{ text: 'Continuar', class: 'btn-primary', action: () => { eventModal.hide(); nextTurn(); }}]);
        } else {
            nextTurn();
        }
    }

    function handleStageEnd() {
        playSound(bonusSound);
        const currentPlayer = players[currentPlayerIndex];
        currentPlayer.finishedStage = true;
        updateTurnIndicator();
        checkForCatchUpMode();

        const allFinished = players.every(p => p.finishedStage);
        if (allFinished) {
            advanceToNextStage();
        } else {
            nextTurn();
        }
    }

    function checkForCatchUpMode() {
        if (catchUpModeActive) return;

        const finishedPlayers = players.filter(p => p.finishedStage).length;
        if (players.length > 1 && (finishedPlayers / players.length) >= 0.5) {
            catchUpModeActive = true;
            doubleRollMessage.textContent = '¡Más del 50% ha llegado! ¡Los demás reciben tiro doble!';
            doubleRollMessage.style.display = 'block';
            setTimeout(() => {
                doubleRollMessage.style.display = 'none';
            }, 5000);
        }
    }

    function nextTurn() {
        currentPlayerIndex = (currentPlayerIndex + 1) % players.length;
        if (players.length > 0 && players[currentPlayerIndex].finishedStage) {
            setTimeout(nextTurn, 100);
        } else {
            updateTurnIndicator();
            rollDiceBtn.disabled = false;
        }
    }

    function showModal(title, text, icon, buttons) {
        modalTitle.textContent = title;
        modalText.textContent = text;
        modalIcon.innerHTML = ''; // Reset icon content
        modalIcon.className = 'bi fs-3'; // Reset icon classes
        if (icon.endsWith('.svg')) {
            modalIcon.innerHTML = `<img src="${icon}" class="modal-game-icon">`;
        } else {
            modalIcon.className = `bi ${icon} fs-3`;
        }
        modalFooter.innerHTML = '';

        buttons.forEach(btnInfo => {
            const button = document.createElement('button');
            button.type = 'button';
            button.className = `btn ${btnInfo.class}`;
            button.textContent = btnInfo.text;
            button.onclick = btnInfo.action;
            modalFooter.appendChild(button);
        });

        eventModal.show();
    }

    // --- EVENT LISTENERS ---
    rollDiceBtn.addEventListener('click', rollDice);

    // --- AUDIO SETUP ---
    backgroundMusic.volume = 0.08;
    diceSound.volume = 0.2;
    victorySound.volume = 0.1;
    cellSound.volume = 0.2;
    bonusSound.volume = 0.2;

    startGameBtn.addEventListener('click', () => {
        instructionModal.hide();
        initializeGame();
        backgroundMusic.play().catch(error => {
            console.log("La reproducción de música fue bloqueada por el navegador:", error);
        });
    });

    muteBtn.addEventListener('click', () => {
        backgroundMusic.muted = !backgroundMusic.muted;
        const icon = muteBtn.querySelector('i');
        if (backgroundMusic.muted) {
            icon.className = 'bi bi-volume-mute-fill';
        } else {
            icon.className = 'bi bi-volume-up-fill';
        }
    });

    // --- START GAME ---
    initializePlayerSetup();
});