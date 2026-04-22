import { BallotTable, Button, Card } from "@/components";
import { useElectionStore } from "@/stores";
import { Charter } from "@/types";
import { Navigate, useNavigate } from "@tanstack/react-router";
import { FC, useCallback, useState } from "react";

const VoteContent: FC<{ charter: Charter }> = ({ charter }) => {
  const { ballots, setBallots } = useElectionStore();
  const navigate = useNavigate();

  const electors = charter.nominees.filter((n) => n.isElector);
  const totalVotes = electors.length;
  const [currentVote, setCurrentVote] = useState(1);

  const [votes, setVotes] = useState(
    ballots ??
      Array.from({ length: totalVotes }, () =>
        Object.fromEntries(
          charter.seats.map((s) => [
            s.name,
            Object.fromEntries(
              charter.nominees
                .filter((n) => n.isEligible)
                .map((n) => [n.name, false]),
            ),
          ]),
        ),
      ),
  );

  const progress = (currentVote / totalVotes) * 100;

  const handleContinue = useCallback(() => {
    setBallots(votes);
    navigate({ to: "/results" });
  }, [setBallots, navigate, votes]);

  const handleVoteChange = useCallback(
    (seat: string, nominee: string, value: boolean) => {
      setVotes((prev) =>
        prev.map((b, i) =>
          i !== currentVote - 1
            ? b
            : { ...b, [seat]: { ...b[seat], [nominee]: value } },
        ),
      );
    },
    [currentVote],
  );

  if (currentVote > totalVotes) {
    return (
      <Card>
        <div className="text-center py-10">
          <div className="text-5xl mb-4">✅</div>
          <h2 className="text-2xl font-bold mb-2">Votação Concluída</h2>
          <p className="text-gray-500 mb-6">Todos os votos foram coletados.</p>
          <Button onClick={handleContinue} className="w-full max-w-xs">
            Ver Resultados
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="space-y-2">
        <div className="flex justify-between text-sm font-medium text-gray-600">
          <span>
            Eleitor {currentVote} de {totalVotes}
          </span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-600 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <Card
        title={`Cédula de Votação - ${electors[currentVote - 1]?.name ?? "Eleitor"}`}
      >
        <BallotTable
          seats={charter.seats}
          nominees={charter.nominees}
          votes={votes[currentVote - 1]}
          onChange={handleVoteChange}
        />
      </Card>

      <div className="flex justify-end">
        <Button onClick={() => setCurrentVote((v) => v + 1)} className="px-8">
          Próximo Voto
        </Button>
      </div>
    </div>
  );
};

export const Vote: FC = () => {
  const { charter } = useElectionStore();
  if (!charter) return <Navigate to="/setup" />;
  return <VoteContent charter={charter} />;
};
