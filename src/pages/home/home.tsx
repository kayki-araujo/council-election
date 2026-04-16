import { Link } from "@tanstack/react-router";
import { FC } from "react";

export const Home: FC = () => {
  return (
    <div className="flex flex-col h-full">
      <h1 className="text-6xl font-extrabold tracking-tight text-blue-800 text-center">
        Sistema Eleitoral Combinatório
      </h1>
      <div className="mt-32 h-max flex justify-center">
        <Link
          to="/setup"
          className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-blue-700 transition-all shadow-lg hover:shadow-blue-200 active:scale-95"
        >
          Começar
        </Link>
      </div>
    </div>
  );
};
