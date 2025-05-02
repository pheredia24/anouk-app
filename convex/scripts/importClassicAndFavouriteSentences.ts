import { internalMutation } from "../_generated/server";
import { v } from "convex/values";

interface Sentence {
  text: string;
  translation: string;
  type: "classic_sentence" | "favourite_sentence";
  addedBy?: string;
  explanation?: string;
  explanationTranslated?: string;
  distractorWords?: string[];
}

// Include the sentences data directly
const sentences: Sentence[] = [
  {
    "text": "You're quite a character",
    "translation": "Eres un personaje",
    "type": "favourite_sentence",
    "addedBy": "Pablo",
    "explanation": "Playful way to say someone is quirky and entertaining",
    "explanationTranslated": "Forma divertida de decir que alguien es peculiar y entretenido",
    "distractorWords": [
      "protagonista",
      "personajillo",
      "figura",
      "tipazo",
      "carácter"
    ]
  },
  {
    "text": "Cove",
    "translation": "Cala",
    "type": "favourite_sentence",
    "addedBy": "Alex",
    "explanation": "A tiny sheltered beach in Spanish, perfect for sneaking a swim",
    "explanationTranslated": "Una pequeña playa resguardada en español, ideal para un baño furtivo",
    "distractorWords": [
      "caleta",
      "cal",
      "calla",
      "calaña",
      "calor"
    ]
  },
  {
    "text": "Soliloquy",
    "translation": "Soliloquio",
    "type": "favourite_sentence",
    "addedBy": "Almu",
    "explanation": "Dramatic speech you give to yourself, Shakespeare‑style",
    "explanationTranslated": "Discurso dramático que te das a ti mismo, al estilo de Shakespeare",
    "distractorWords": [
      "monólogo",
      "soliloquios",
      "soliloquía",
      "solaz",
      "parlamento"
    ]
  },
  {
    "text": "Absolute banger",
    "translation": "Temarraco",
    "type": "favourite_sentence",
    "addedBy": "Ame",
    "explanation": "A song so good it forces you to dance instantly",
    "explanationTranslated": "Una canción tan buena que te obliga a bailar al instante",
    "distractorWords": [
      "temazo",
      "temita",
      "temón",
      "temarrote",
      "temático"
    ]
  },
  {
    "text": "I've already been there, done that",
    "translation": "Cuando tu vas yo vengo de allí",
    "type": "favourite_sentence",
    "addedBy": "Clara",
    "explanation": "Sassy way to say you know exactly what's going on and are one step ahead",
    "explanationTranslated": "Forma chulesca de decir que ya sabes de qué va la cosa y vas un paso por delante",
    "distractorWords": [
      "Ya estuve allí",
      "De allí vengo",
      "Cuando llegas ya me fui",
      "Ya he pasado por eso",
      "Te llevo ventaja"
    ]
  },
  {
    "text": "Custard apple",
    "translation": "Chirimoya",
    "type": "favourite_sentence",
    "addedBy": "Ame",
    "explanation": "A deliciously weird tropical fruit with dinosaur‑egg vibes",
    "explanationTranslated": "Una fruta tropical deliciosamente rara con pinta de huevo de dinosaurio",
    "distractorWords": [
      "cherimoya",
      "guanábana",
      "papaya",
      "mangostán",
      "anon"
    ]
  },
  {
    "text": "Grump",
    "translation": "Cascarrabias",
    "type": "favourite_sentence",
    "addedBy": "Falero",
    "explanation": "Nickname for the resident grouchy person",
    "explanationTranslated": "Apodo para la persona gruñona del grupo",
    "distractorWords": [
      "gruñón",
      "malhumorado",
      "rezongón",
      "enfadón",
      "renegón"
    ]
  },
  {
    "text": "You're going to erase my name",
    "translation": "Me vas a borrar el nombre",
    "type": "favourite_sentence",
    "addedBy": "Almu",
    "explanation": "Said when someone scrubs so hard (or criticises so much) you fear you'll disappear",
    "explanationTranslated": "Se dice cuando alguien frota tan fuerte (o critica tanto) que temes desaparecer",
    "distractorWords": [
      "me borrarás",
      "desapareceré",
      "me quitarás la firma",
      "me vas a borrar",
      "me vas a tachar"
    ]
  },
  {
    "text": "Unbearable",
    "translation": "Infumable",
    "type": "favourite_sentence",
    "addedBy": "Toño",
    "explanation": "So bad it cannot be endured even metaphorically",
    "explanationTranslated": "Tan malo que no se puede aguantar ni en sentido figurado",
    "distractorWords": [
      "intragable",
      "indigerible",
      "insoportable",
      "inaguantable",
      "impresentable"
    ]
  },
  {
    "text": "Abioncillo (a village in Spain)",
    "translation": "Abioncillo",
    "type": "favourite_sentence",
    "addedBy": "Paula",
    "explanation": "Tiny rural hamlet we reference like it is Las Vegas",
    "explanationTranslated": "Pequeña aldea rural que mencionamos como si fuera Las Vegas",
    "distractorWords": [
      "Alborello",
      "Abloncillo",
      "Arjoncillo",
      "Albioncillo",
      "Abadillo"
    ]
  },
  {
    "text": "Gosh!",
    "translation": "Cáspita",
    "type": "favourite_sentence",
    "addedBy": "Juan",
    "explanation": "Old‑school exclamation of surprise, 100% grandma‑approved",
    "explanationTranslated": "Exclamación antigua de sorpresa, 100% aprobada por las abuelas",
    "distractorWords": [
      "caramba",
      "córcholis",
      "rayos",
      "diantres",
      "zás"
    ]
  },
  {
    "text": "What a massive hangover",
    "translation": "Vaya resacón",
    "type": "favourite_sentence",
    "addedBy": "Pablo",
    "explanation": "Morning slogan when your head feels like a marching band",
    "explanationTranslated": "Lema matutino cuando la cabeza suena como una banda de música",
    "distractorWords": [
      "menuda resaca",
      "tremendo guayabo",
      "qué jaqueca",
      "pedazo de resaca",
      "resacón brutal"
    ]
  },
  {
    "text": "Third wheel",
    "translation": "Sujetavelas",
    "type": "favourite_sentence",
    "addedBy": "Juli",
    "explanation": "The extra friend awkwardly tagging along on a date",
    "explanationTranslated": "El amigo extra que acompaña incómodamente a una cita",
    "distractorWords": [
      "aguafiestas",
      "carabina",
      "candelero",
      "velero",
      "pagafantas"
    ]
  },
  {
    "text": "Delighted to do business with you",
    "translation": "Encantado de hacer negocios con usted",
    "type": "favourite_sentence",
    "addedBy": "Juli",
    "explanation": "Mock‑formal phrase we use after trading the last slice of pizza",
    "explanationTranslated": "Frase formal en broma que usamos después de intercambiar la última porción de pizza",
    "distractorWords": [
      "un placer tratar con usted",
      "agradezco su trato",
      "es un honor negociar",
      "encantado de colaborar",
      "estoy a su servicio"
    ]
  },
  {
    "text": "You're so clingy",
    "translation": "Eres una lapa",
    "type": "favourite_sentence",
    "addedBy": "Juli",
    "explanation": "Saying someone sticks to you like chewing gum on a shoe",
    "explanationTranslated": "Decir que alguien se pega a ti como chicle a la suela",
    "distractorWords": [
      "pegajoso",
      "garrapata",
      "koala",
      "chicle",
      "parásito"
    ]
  },
  {
    "text": "You only live once",
    "translation": "Un dia es un dia",
    "type": "favourite_sentence",
    "addedBy": "Juli",
    "explanation": "Justification for ordering dessert… and another round",
    "explanationTranslated": "Justificación para pedir postre… y otra ronda",
    "distractorWords": [
      "la vida es corta",
      "carpe diem",
      "solo se vive una vez",
      "hoy es hoy",
      "mañana veremos"
    ]
  },
  {
    "text": "Do you think I was born yesterday?",
    "translation": "Que te crees, que nací ayer?",
    "type": "favourite_sentence",
    "addedBy": "Juli",
    "explanation": "Polite way to say you cannot fool me, pal",
    "explanationTranslated": "Manera educada de decir no me engañas, colega",
    "distractorWords": [
      "no soy tonto",
      "no nací ayer",
      "crees que soy idiota",
      "ya me la sé",
      "no me duermas"
    ]
  },
  {
    "text": "Maybe it'll work",
    "translation": "A lo mejor cuela",
    "type": "favourite_sentence",
    "addedBy": "Juli",
    "explanation": "Optimistic shrug before a risky plan",
    "explanationTranslated": "Encogimiento de hombros optimista antes de un plan arriesgado",
    "distractorWords": [
      "quizá funcione",
      "igual pasa",
      "tal vez sirva",
      "puede que cuele",
      "si suena la flauta"
    ]
  },
  {
    "text": "I'd rather die than be plain",
    "translation": "Antes muerta que sencilla",
    "type": "favourite_sentence",
    "addedBy": "Juli",
    "explanation": "Battling mediocrity with extra sparkle and drama",
    "explanationTranslated": "Combatiendo la mediocridad con brillo y dramatismo extra",
    "distractorWords": [
      "vivir con estilo",
      "muerta pero digna",
      "jamás sin glamour",
      "nunca básica",
      "glamour ante todo"
    ]
  },
  {
    "text": "Let's smoke a fat one",
    "translation": "Nos fumamos un trujas",
    "type": "classic_sentence",
    "addedBy": "",
    "explanation": "Invitation to roll an oversized joint and chill",
    "explanationTranslated": "Invitación a liarse un canuto enorme y relajarse",
    "distractorWords": [
      "liamos uno",
      "nos echamos un porro",
      "quemamos un troncho",
      "prendemos uno gordo",
      "nos fumamos un canuto"
    ]
  },
  {
    "text": "You're such a lad",
    "translation": "Eres un que chaval",
    "type": "classic_sentence",
    "addedBy": "",
    "explanation": "Playful compliment for someone with big bro energy",
    "explanationTranslated": "Cumplido en broma para alguien con mucha energía de coleguita",
    "distractorWords": [
      "qué chaval eres",
      "eres un chavalón",
      "vaya chaval",
      "menudo chaval",
      "eres un tío"
    ]
  },
  {
    "text": "Absolute banger",
    "translation": "Temarraco",
    "type": "classic_sentence",
    "addedBy": "",
    "explanation": "Song that turns any room into a dance floor",
    "explanationTranslated": "Canción que convierte cualquier sala en pista de baile",
    "distractorWords": [
      "temazo",
      "temita",
      "temón",
      "hitazo",
      "rolón"
    ]
  },
  {
    "text": "Well, there are several theories",
    "translation": "Sí bueno, hay varias teorias",
    "type": "classic_sentence",
    "addedBy": "",
    "explanation": "Start of a pseudo‑scientific rant when nobody asked",
    "explanationTranslated": "Inicio de una perorata pseudocientífica cuando nadie la pidió",
    "distractorWords": [
      "bueno, depende",
      "hay distintas versiones",
      "existen varias ideas",
      "hay teorías",
      "pues hay hipótesis"
    ]
  },
  {
    "text": "That's a bit sketchy",
    "translation": "Eso es un poco charca",
    "type": "classic_sentence",
    "addedBy": "",
    "explanation": "Polite red flag alert: something feels off",
    "explanationTranslated": "Alerta educada de bandera roja: algo huele raro",
    "distractorWords": [
      "es algo turbio",
      "está fangoso",
      "suena raro",
      "es un charco",
      "es húmedo"
    ]
  },
  {
    "text": "I'll tank it",
    "translation": "Me lo tanqueo",
    "type": "classic_sentence",
    "addedBy": "",
    "explanation": "I'll take the hit so the team survives (video‑game spirit)",
    "explanationTranslated": "Recibiré el golpe para que el equipo sobreviva (espíritu gamer)",
    "distractorWords": [
      "lo aguanto",
      "lo tanquearé",
      "lo soporto",
      "lo bloqueo",
      "lo resisto"
    ]
  },
  {
    "text": "Through the anus",
    "translation": "Por el ano",
    "type": "classic_sentence",
    "addedBy": "",
    "explanation": "Crude way to denote the worst possible route",
    "explanationTranslated": "Forma cruda de señalar la peor ruta posible",
    "distractorWords": [
      "por detrás",
      "anal",
      "ano",
      "trasero",
      "recto"
    ]
  },
  {
    "text": "Pal bote",
    "translation": "Pal bote",
    "type": "classic_sentence",
    "addedBy": "",
    "explanation": "Shout said when money goes straight into the group kitty",
    "explanationTranslated": "Grito que se suelta cuando el dinero va directo a la hucha común",
    "distractorWords": [
      "para el bote",
      "al bote",
      "al pote",
      "a la hucha",
      "al fondo"
    ]
  },
  {
    "text": "Pooooor thing",
    "translation": "Popopopopooobrecito",
    "type": "classic_sentence",
    "addedBy": "",
    "explanation": "Over‑dramatic pity cry stretching the word poor for comedic effect",
    "explanationTranslated": "Lamento sobreactuado alargando pobre para efecto cómico",
    "distractorWords": [
      "poooobrecito",
      "popopobre",
      "pobrecillo",
      "pobrín",
      "ay pobre"
    ]
  },
  {
    "text": "Babbaro",
    "translation": "Babbaro",
    "type": "classic_sentence",
    "addedBy": "",
    "explanation": "Nonsense catchphrase we yell for hype with zero meaning",
    "explanationTranslated": "Muletilla sin sentido que gritamos para animar, sin significado alguno",
    "distractorWords": [
      "bárbaro",
      "baboso",
      "bárbarro",
      "babarrón",
      "babar"
    ]
  },
  {
    "text": "Bódegas",
    "translation": "Bódegas",
    "type": "classic_sentence",
    "addedBy": "",
    "explanation": "Go‑to word when you need an excuse to visit yet another wine cellar",
    "explanationTranslated": "Palabra comodín para justificar visitar otra bodega más",
    "distractorWords": [
      "bodegas",
      "borregas",
      "bótigas",
      "bodegón",
      "bodega"
    ]
  },
  {
    "text": "Let's calm down",
    "translation": "Vamo a calmarno",
    "type": "classic_sentence",
    "addedBy": "",
    "explanation": "Internet meme line to defuse chaos before it starts",
    "explanationTranslated": "Frase meme de internet para calmar el caos antes de que empiece",
    "distractorWords": [
      "vamos a calmarnos",
      "calmémonos",
      "tranquis",
      "relaja",
      "calma"
    ]
  },
  {
    "text": "Baboons!",
    "translation": "Mandriles!",
    "type": "classic_sentence",
    "addedBy": "",
    "explanation": "Random animal insult hurled with cartoonish fury",
    "explanationTranslated": "Insulto animal aleatorio lanzado con furia de dibujos animados",
    "distractorWords": [
      "babuinos",
      "monos",
      "orangutanes",
      "chimpancés",
      "gorilas"
    ]
  },
  {
    "text": "Top notch",
    "translation": "Puturrudefua",
    "type": "classic_sentence",
    "addedBy": "",
    "explanation": "Cheesy 80s‑style expression meaning super fancy quality",
    "explanationTranslated": "Expresión ochentera cursi que significa calidad super fina",
    "distractorWords": [
      "de rechupete",
      "delicioso",
      "canela en rama",
      "de lujo",
      "fetén"
    ]
  },
  {
    "text": "Apalanque",
    "translation": "Apalanque",
    "type": "classic_sentence",
    "addedBy": "",
    "explanation": "State of extreme couch‑potato paralysis",
    "explanationTranslated": "Estado de parálisis absoluta estilo mueble",
    "distractorWords": [
      "apalancamiento",
      "apalanqué",
      "aplanque",
      "aplatane",
      "aplomo"
    ]
  },
  {
    "text": "Brrrrrrrrrrrrrr",
    "translation": "Brrrrrrrrrrrrrr",
    "type": "classic_sentence",
    "addedBy": "",
    "explanation": "Onomatopoeic noise for excitement, cold or engine revs—take your pick",
    "explanationTranslated": "Ruido onomatopéyico para emoción, frío o acelerón de motor—tú eliges",
    "distractorWords": [
      "grrrrr",
      "brrr",
      "prrrrr",
      "buzzzz",
      "rrr"
    ]
  },
  {
    "text": "Baroy",
    "translation": "Baroy",
    "type": "classic_sentence",
    "addedBy": "",
    "explanation": "Secret code word whose meaning changes every time we say it",
    "explanationTranslated": "Palabra código secreta cuyo significado cambia cada vez que la usamos",
    "distractorWords": [
      "barro",
      "Barói",
      "baloy",
      "boroy",
      "baroi"
    ]
  },
  {
    "text": "Barbecue at Falero's house",
    "translation": "Barbacoa en casa de Falero",
    "type": "classic_sentence",
    "addedBy": "",
    "explanation": "Instant rally cry guaranteeing sun, smoke and questionable playlists",
    "explanationTranslated": "Grito de convocatoria instantánea que asegura sol, humo y playlists cuestionables",
    "distractorWords": [
      "asado en lo de Falero",
      "parrillada en casa de F.",
      "barbi en Falero",
      "carne en Falero",
      "BBQ en lo de Falero"
    ]
  },
  {
    "text": "Too elaborate",
    "translation": "Demasiado elaborado",
    "type": "classic_sentence",
    "addedBy": "",
    "explanation": "Critique reserved for desserts that look like engineering projects",
    "explanationTranslated": "Crítica reservada para postres que parecen proyectos de ingeniería",
    "distractorWords": [
      "muy complicado",
      "excesivo",
      "sobreproducido",
      "recargado",
      "enrevesado"
    ]
  },
  {
    "text": "Check out my egg",
    "translation": "Mira mi huevo",
    "type": "classic_sentence",
    "addedBy": "",
    "explanation": "Absurd brag said while proudly presenting… well, an egg",
    "explanationTranslated": "Presumida frase absurda mientras enseñas con orgullo… pues, un huevo",
    "distractorWords": [
      "mira mi pollo",
      "observa mi huevo",
      "mira este huevo",
      "mira mi bola",
      "mira mi esfera"
    ]
  },
  {
    "text": "You're a mastodon",
    "translation": "Eres un mastodonte",
    "type": "classic_sentence",
    "addedBy": "",
    "explanation": "Compliment‑insult for someone massive and unstoppable",
    "explanationTranslated": "Cumplido‑insulto para alguien enorme e imparable",
    "distractorWords": [
      "Ceres",
      "Hieres",
      "rinoceronte",
      "bastante",
      "montón"
    ]
  }
];

export const importClassicAndFavouriteSentences = internalMutation({
  args: {},
  handler: async (ctx) => {
    const results = [];
    
    for (const sentence of sentences) {
      const result = await ctx.db.insert("sentences", {
        text: sentence.text,
        translation: sentence.translation,
        type: sentence.type,
        addedBy: sentence.addedBy || undefined,
        explanation: sentence.explanation,
        explanationTranslated: sentence.explanationTranslated,
        distractorWords: sentence.distractorWords
      });
      results.push(result);
    }

    return {
      message: `Successfully imported ${results.length} classic and favourite sentences`,
      results
    };
  },
}); 