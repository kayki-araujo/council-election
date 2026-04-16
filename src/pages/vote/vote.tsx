import { Button, Card } from "@/components";
import { useElectionStore } from "@/stores";
import { ElectionConfig } from "@/types";
import { Navigate, useNavigate } from "@tanstack/react-router";
import { FC, useCallback, useState } from "react";

const VoteContent: FC<{ config: ElectionConfig }> = ({ config }) => {
  const { ballots, setBallots } = useElectionStore();
  const navigate = useNavigate();

  const electors = config.participants.filter((p) => p.voter);
  const electables = config.participants.filter((p) => p.electable);
  const totalVotes = electors.length;

  const [currentVote, setCurrentVote] = useState(1);
  const [votes, setVotes] = useState(
    ballots ??
      Array.from({ length: totalVotes }, () =>
        Object.fromEntries(
          config.roles.map((r) => [
            r.name,
            Object.fromEntries(electables.map((e) => [e.name, false])),
          ]),
        ),
      ),
  );

  const progress = (currentVote / totalVotes) * 100;

  const handleContinue = useCallback(() => {
    setBallots(votes);
    navigate({ to: "/results" });
  }, [setBallots, navigate, votes]);

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
        title={`Cédula de Votação - ${electors[currentVote - 1]?.name || "Eleitor"}`}
      >
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="text-left border-b border-gray-100">
                <th className="py-4 px-2 text-gray-400 text-xs uppercase">
                  Cargo
                </th>
                {electables.map((p) => (
                  <th key={p.name} className="py-4 px-2 text-center text-sm">
                    {p.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {config.roles.map((role) => (
                <tr key={role.name} className="hover:bg-gray-50/50">
                  <td className="py-4 px-2 font-medium">{role.name}</td>
                  {electables.map((p) => (
                    <td key={p.name} className="py-4 px-2 text-center">
                      <input
                        type="checkbox"
                        className="w-5 h-5 accent-blue-600 cursor-pointer"
                        checked={
                          votes[currentVote - 1]?.[role.name]?.[p.name] ?? false
                        }
                        onChange={(e) => {
                          const checked = e.target.checked;
                          setVotes((prev) =>
                            prev.map((b, i) =>
                              i !== currentVote - 1
                                ? b
                                : {
                                    ...b,
                                    [role.name]: {
                                      ...b[role.name],
                                      [p.name]: checked,
                                    },
                                  },
                            ),
                          );
                        }}
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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
  const { config } = useElectionStore();
  if (!config) return <Navigate to="/setup" />;
  return <VoteContent config={config} />;
};
