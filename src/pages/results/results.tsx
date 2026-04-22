import { AppointmentCard, Button, Card } from "@/components";
import { useElectionStore } from "@/stores";
import { Ballot, Charter } from "@/types";
import { convene } from "@/utils";
import { Link, Navigate } from "@tanstack/react-router";
import { FC, useEffect, useState } from "react";

const ResultsPage: FC<{ charter: Charter; ballots: Ballot[] }> = ({
  charter,
  ballots,
}) => {
  const [appointments, setAppointments] = useState<
    Record<string, string>[] | null
  >(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAppointments(convene(charter, ballots));
    }, 100);
    return () => clearTimeout(timer);
  }, [charter, ballots]);

  if (appointments === null) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-6">
        <div className="w-14 h-14 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin" />
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

  return (
    <div className="flex flex-col gap-8 animate-in fade-in duration-500">
      <header className="text-center space-y-3 mt-4">
        <h1 className="text-4xl font-extrabold text-blue-700 tracking-tight">
          Resultados
        </h1>
        <p className="text-gray-500 text-lg">
          A apuração combinatória foi concluída com sucesso.
        </p>
      </header>

      {appointments.length === 0 ? (
        <Card>
          <div className="text-center py-12 text-gray-500 text-lg">
            Nenhum resultado válido encontrado com as configurações e votos
            atuais.
          </div>
        </Card>
      ) : (
        <div className="flex flex-col gap-8">
          {appointments.length > 1 && (
            <div className="bg-amber-50 border border-amber-200 text-amber-800 p-5 rounded-xl text-center shadow-sm">
              <span className="font-bold text-lg block mb-1">
                Atenção: Houve um empate!
              </span>
              Abaixo estão as <strong>{appointments.length}</strong> combinações
              ideais possíveis.
            </div>
          )}
          {appointments.map((result, i) => (
            <AppointmentCard
              key={i}
              appointments={result}
              title={
                appointments.length > 1
                  ? `Possibilidade ${i + 1}`
                  : "Candidatos Eleitos"
              }
            />
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
  const { charter, ballots } = useElectionStore();
  if (!charter || !ballots) return <Navigate to="/vote" />;
  return <ResultsPage charter={charter} ballots={ballots} />;
};
