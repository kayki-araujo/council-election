import { Button, Card } from "@/components";
import { useElectionStore } from "@/stores";
import { Ballot, ElectionConfig } from "@/types";
import { computeElection } from "@/utils";
import { Link, Navigate } from "@tanstack/react-router";
import { FC, useEffect, useState } from "react";

type ResultsPageProps = {
  config: ElectionConfig;
  ballots: Ballot[];
};

const ResultsPage: FC<ResultsPageProps> = ({ config, ballots }) => {
  const [electionResults, setElectionResults] = useState<
    null | Record<string, string>[]
  >(null);

  useEffect(() => {
    // Usamos um setTimeout para permitir que a tela de carregamento
    // seja renderizada antes do cálculo pesado bloquear a thread principal.
    const timer = setTimeout(() => {
      setElectionResults(computeElection(config, ballots));
    }, 100);

    return () => clearTimeout(timer);
  }, [ballots, config]);

  // Estado de Carregamento
  if (electionResults === null) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-6">
        <div className="w-14 h-14 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin"></div>
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-gray-800 animate-pulse">
            Apurando os votos...
          </h2>
          <p className="text-gray-500 text-sm">
            Isso pode levar alguns segundos dependendo do número de combinações.
          </p>
        </div>
      </div>
    );
  }

  // Estado Concluído
  return (
    <div className="flex flex-col gap-8 animate-in fade-in duration-500">
      <header className="text-center space-y-3 mt-4">
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
          Resultados Oficiais
        </h1>
        <p className="text-gray-500 text-lg">
          A apuração combinatória foi concluída com sucesso.
        </p>
      </header>

      {electionResults.length === 0 ? (
        <Card>
          <div className="text-center py-12 text-gray-500 text-lg">
            Nenhum resultado válido encontrado com as configurações e votos
            atuais.
          </div>
        </Card>
      ) : (
        <div className="flex flex-col gap-8">
          {/* Alerta de Empate (Múltiplas Realidades) */}
          {electionResults.length > 1 && (
            <div className="bg-amber-50 border border-amber-200 text-amber-800 p-5 rounded-xl text-center shadow-sm">
              <span className="font-bold text-lg block mb-1">
                Atenção: Houve um empate!
              </span>
              Abaixo estão as <strong>{electionResults.length}</strong>{" "}
              combinações ideais possíveis baseadas na aprovação harmônica.
            </div>
          )}

          {/* Exibição dos Resultados */}
          {electionResults.map((result, index) => (
            <Card
              key={index}
              title={
                electionResults.length > 1
                  ? `Possibilidade ${index + 1}`
                  : "Candidatos Eleitos"
              }
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(result).map(([role, candidate]) => (
                  <div
                    key={role}
                    className="flex flex-col p-4 bg-gray-50/50 border border-gray-100 rounded-xl transition-colors hover:bg-blue-50/30"
                  >
                    <span className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">
                      {role}
                    </span>
                    <span className="text-xl font-bold text-gray-800">
                      {candidate}
                    </span>
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>
      )}

      <div className="flex justify-center pt-8 pb-4">
        <Link to="/">
          <Button className="px-10 py-4 text-lg shadow-lg hover:shadow-blue-200">
            Iniciar Nova Eleição
          </Button>
        </Link>
      </div>
    </div>
  );
};

export const Results: FC = () => {
  const { config, ballots } = useElectionStore();

  if (!config || !ballots) {
    return <Navigate to="/vote" />;
  }

  return <ResultsPage config={config} ballots={ballots} />;
};
