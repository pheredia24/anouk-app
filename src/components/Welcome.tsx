import { useNavigate } from "react-router-dom";

export default function Welcome() {
  const navigate = useNavigate();

  return (
    <div className="h-screen overflow-hidden flex flex-col items-center justify-start bg-white px-5 pt-16">
      <div className="w-full max-w-md flex flex-col items-center gap-8">
        <h1 className="text-3xl font-semibold text-center text-[#4B4B4B]">
          ¡Feliz día de la madre!
        </h1>
        
        <div className="w-full rounded-lg bg-[rgba(137,226,25,0)] p-6 text-center">
          <p className="text-lg text-[#4B4B4B]">
            No podemos dejar que te vayas a Francia sin que aprendas a decir (y escribir) todas tus expresiones favoritas.
            <br /> 
            <br />
            Esperamos que te guste este Duolingo personalizado, hecho con mucho amor y con sentido del humor.
            <br /> 
            <br />
            ¡On t'aime beaucoup! ❤️
          </p>
        </div>

        <button
          onClick={() => navigate("/profiles")}
          className="w-full rounded-full bg-[#58CC02] text-white py-3 px-6 text-lg font-semibold hover:bg-[#89E219] transition-colors"
        >
          C'est parti ! 🚀
        </button>
      </div>
    </div>
  );
} 