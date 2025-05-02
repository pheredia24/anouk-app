import { internalMutation } from "../_generated/server";
import { v } from "convex/values";

interface Anecdote {
  text: string;
  translation: string;
  type: "anecdote";
  addedBy: string;
}

// Include the anecdotes data directly
const anecdotes: Anecdote[] = [
  {
    "text": "When we wrapped up a night in Copenhagen—Juli, you and I under a bridge drinking beers—and we could only take a sip after proposing a toast.",
    "translation": "Cuando acabamos una noche en Copenhague Juli tú y yo debajo de un puente bebiendo cervezas y solo podíamos beber tras proponer un brindis",
    "type": "anecdote",
    "addedBy": "Pablo"
  },
  {
    "text": "When we went to listen to the Taylor Swift concert from outside, we saw all the Swifties and ended up chatting about our stuff without hearing any of the show.",
    "translation": "Cuando fuimos a escuchar el concierto de Taylor Swift desde fuera, vimos a todos los swifters y acabamos hablando de nuestras cosas sin escuchar nada del concierto.",
    "type": "anecdote",
    "addedBy": "Almu"
  },
  {
    "text": "When we met one‑on‑one in London to go to a pub quiz, we looked for it for ages and never found it—but we didn't care.",
    "translation": "Cuando quedamos mano a mano en Londres para ir a un pub quiz, lo buscamos mazo rato y no lo encontramos, pero nos dio igual.",
    "type": "anecdote",
    "addedBy": "Toño"
  },
  {
    "text": "Last Christmas when I gave you and Zahra a tour around Madrid.",
    "translation": "Cuando las navidades pasadas os hice un tour por Madrid a Zahra y a ti.",
    "type": "anecdote",
    "addedBy": "Guille"
  },
  {
    "text": "When we went out to the Moulin Rouge in Paris and vibed with the music.",
    "translation": "Cuando salimos al Moulin Rouge en París y vibramos con la música.",
    "type": "anecdote",
    "addedBy": "Clara"
  },
  {
    "text": "When I stayed at the bar with you and Juli in the early hours and showed you how to play darts.",
    "translation": "Cuando me quedé en el bar contigo y Juli de madrugada y os enseñé cómo se juega a los dardos.",
    "type": "anecdote",
    "addedBy": "Javi"
  },
  {
    "text": "When I gave passes for the SIAL fair in Paris to you and Juli, and you were investigating food companies focused on sustainability and tasting new veggie products.",
    "translation": "Cuando os di pases para la feria Sial en Paris a Juli y a ti y estuvisteis investigando empresas de alimentación relacionada con sostenibilidad y probando cosas veggies nuevas.",
    "type": "anecdote",
    "addedBy": "Paula"
  },
  {
    "text": "When I first met you forming the Kitchen Team and you taught me how to make avocado pancakes.",
    "translation": "Cuando te conocí por primera vez formando el Team Cocina y me enseñaste a hacer panqueques de aguacate.",
    "type": "anecdote",
    "addedBy": "Manuela"
  },
  {
    "text": "The night before Mathilde's wedding in Paris: drunk and high, in our pajamas brushing our teeth, acting as vocal coaches for Manuela who was going to sing 'Blue Jeans' at Mathilde's wedding the next day.",
    "translation": "La noche antes de la boda de Mathilde, en París, borrachas y fumadas, en pijama y lavándonos los dientes, haciendo de coaches vocales para Manuela, que iba a cantar Blue Jeans en la boda de Mathilde al día siguiente.",
    "type": "anecdote",
    "addedBy": "Irene"
  },
  {
    "text": "When we went out one January night in Madrid with Guille, Zahra, your other friends and Juli's, Bilal, random people, and we went to Café La Palma, having a surreal night.",
    "translation": "Cuando salimos una noche en enero por Madrid con Guille, Zahra, otros amigos tuyos y de Juli, Bilal, gente aleatoria y fuimos al Café La Palma, pasando una noche surrealista.",
    "type": "anecdote",
    "addedBy": "Jaime"
  },
  {
    "text": "When we came up with TV series ideas in the club after Guille's party.",
    "translation": "Cuando inventamos ideas para series de televisión en la disco después de la fiesta de Guille.",
    "type": "anecdote",
    "addedBy": "Juan"
  },
  {
    "text": "When Jaime, you and I—after drinking who knows how many bottles of cider—tried to communicate in a very funny Spanglish.",
    "translation": "Cuando Jaime tu y yo, después de haber bebido no sé cuantas botellas de sidra, intentamos comunicarnos en un espanglis muy divertido.",
    "type": "anecdote",
    "addedBy": "Nerea"
  },
  {
    "text": "When we cooked and laughed together in the house in La Vera.",
    "translation": "Cuando cocinamos y reímos juntos en la casa de La Vera",
    "type": "anecdote",
    "addedBy": "Lucas"
  },
  {
    "text": "When you got up on stage in Paris to recite a poem about love.",
    "translation": "Cuando te subiste al escenario en París para recitar un poema sobre amor",
    "type": "anecdote",
    "addedBy": "Juli"
  },
  {
    "text": "When we went to Riaza and were on the same team for the Olympics.",
    "translation": "Cuando fuimos a Riaza y estuvimos en el mismo equipo para las olimpiadas",
    "type": "anecdote",
    "addedBy": "Ame"
  },
  {
    "text": "When we took an \"Olympic stroll\" with a chat included around Paris.",
    "translation": "Cuando dimos un paseo olímpico con charla incluida por Paris",
    "type": "anecdote",
    "addedBy": "Falero"
  },
  {
    "text": "When we were all on the terrace of the house in Riaza with nice sunshine and beers, everyone feeling great.",
    "translation": "Cuando estuvimos todos en la terraza de la casa de Riaza con un buen sol y cervecitas todos a gustirrinin",
    "type": "anecdote",
    "addedBy": "Alex"
  },
  {
    "text": "When we were at the La Paz campsite and you handed cider out to all of us.",
    "translation": "Cuando estuvimos en el camping de La Paz y nos repartiste sidra a todos",
    "type": "anecdote",
    "addedBy": "Clau"
  }
];

export const importAnecdotes = internalMutation({
  args: {},
  handler: async (ctx) => {
    const results = [];
    
    for (const anecdote of anecdotes) {
      const result = await ctx.db.insert("sentences", {
        text: anecdote.text,
        translation: anecdote.translation,
        type: "anecdote" as const,
        addedBy: anecdote.addedBy
      });
      results.push(result);
    }

    return {
      message: `Successfully imported ${results.length} anecdotes`,
      results
    };
  },
}); 