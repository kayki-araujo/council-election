import { Button, Card } from "@/components";
import { useElectionStore } from "@/stores";
import { Nominee, Seat } from "@/types";
import { useNavigate } from "@tanstack/react-router";
import { FC, useCallback, useState } from "react";

const isCharterValid = (nominees: Nominee[], seats: Seat[]): boolean => {
  if (nominees.length < 1 || seats.length < 1) return false;
  if (nominees.some((n) => n.name.length < 1)) return false;
  if (seats.some((s) => s.name.length < 1)) return false;
  if (new Set(nominees.map((n) => n.name)).size !== nominees.length)
    return false;
  if (new Set(seats.map((s) => s.name)).size !== seats.length) return false;
  return true;
};

export const Setup: FC = () => {
  const navigate = useNavigate();
  const { charter, setCharter } = useElectionStore();

  const [nominees, setNominees] = useState<Nominee[]>(
    charter?.nominees ?? [
      { name: "Participante", isEligible: true, isElector: true },
    ],
  );
  const [seats, setSeats] = useState<Seat[]>(
    charter?.seats ?? [{ name: "Presidente", priority: 1 }],
  );

  const handleSubmit = useCallback(() => {
    const sortedSeats = [...seats].sort((a, b) => a.priority - b.priority);
    setCharter({ nominees, seats: sortedSeats });
    navigate({ to: "/vote" });
  }, [setCharter, nominees, seats, navigate]);

  return (
    <div className="flex flex-col gap-8">
      <header>
        <h1 className="text-3xl font-bold text-gray-900">Configuração</h1>
        <p className="text-gray-500">Defina os detalhes da sua eleição.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        <Card title="Participantes">
          <div className="flex flex-col gap-4">
            {nominees.map((n, i) => (
              <div
                key={i}
                className="flex flex-col p-3 border border-gray-100 rounded-lg gap-2 bg-gray-50/30"
              >
                <div className="flex gap-2">
                  <input
                    className="flex-1 px-3 py-1 bg-white border border-gray-200 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                    type="text"
                    value={n.name}
                    placeholder="Nome do participante"
                    onChange={(e) =>
                      setNominees(
                        nominees.toSpliced(i, 1, {
                          ...n,
                          name: e.target.value,
                        }),
                      )
                    }
                  />
                  <Button
                    variant="danger"
                    className="px-3"
                    onClick={() => setNominees(nominees.toSpliced(i, 1))}
                  >
                    ✕
                  </Button>
                </div>
                <div className="flex gap-4 text-sm text-gray-600 px-1">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={n.isElector}
                      onChange={(e) =>
                        setNominees(
                          nominees.toSpliced(i, 1, {
                            ...n,
                            isElector: e.target.checked,
                          }),
                        )
                      }
                    />
                    Votante
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={n.isEligible}
                      onChange={(e) =>
                        setNominees(
                          nominees.toSpliced(i, 1, {
                            ...n,
                            isEligible: e.target.checked,
                          }),
                        )
                      }
                    />
                    Elegível
                  </label>
                </div>
              </div>
            ))}
            <Button
              variant="ghost"
              onClick={() =>
                setNominees([
                  ...nominees,
                  { name: "", isEligible: true, isElector: true },
                ])
              }
            >
              + Adicionar Participante
            </Button>
          </div>
        </Card>

        <Card title="Cargos e Prioridades">
          <div className="flex flex-col gap-4">
            <p className="text-xs text-gray-400 uppercase font-semibold mb-2">
              Nome do Cargo / Prioridade
            </p>
            {seats.map((s, i) => (
              <div
                key={i}
                className="flex gap-2 items-center p-3 border border-gray-100 rounded-lg bg-gray-50/30"
              >
                <input
                  className="flex-1 px-3 py-1 bg-white border border-gray-200 rounded-md outline-none focus:ring-2 focus:ring-blue-500"
                  type="text"
                  value={s.name}
                  placeholder="Ex: Presidente"
                  onChange={(e) =>
                    setSeats(
                      seats.toSpliced(i, 1, { ...s, name: e.target.value }),
                    )
                  }
                />
                <input
                  className="w-16 px-2 py-1 bg-white border border-gray-200 rounded-md outline-none focus:ring-2 focus:ring-blue-500 text-center"
                  type="number"
                  min="1"
                  value={s.priority}
                  onChange={(e) =>
                    setSeats(
                      seats.toSpliced(i, 1, {
                        ...s,
                        priority: parseInt(e.target.value) || 0,
                      }),
                    )
                  }
                />
                <Button
                  variant="danger"
                  className="px-3"
                  onClick={() => setSeats(seats.toSpliced(i, 1))}
                >
                  ✕
                </Button>
              </div>
            ))}
            <Button
              variant="ghost"
              onClick={() =>
                setSeats([...seats, { name: "", priority: seats.length + 1 }])
              }
            >
              + Adicionar Cargo
            </Button>
          </div>
        </Card>
      </div>

      <div className="flex justify-center pt-4">
        <Button
          disabled={!isCharterValid(nominees, seats)}
          onClick={handleSubmit}
          className="w-full max-w-xs py-3 text-lg"
        >
          Iniciar Votação
        </Button>
      </div>
    </div>
  );
};
