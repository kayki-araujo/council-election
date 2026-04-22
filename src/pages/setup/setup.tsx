import { Button, Card } from "@/components"; // Assume you export from an index or import directly
import { useElectionStore } from "@/stores";
import { Participant, Role } from "@/types";
import { useNavigate } from "@tanstack/react-router";
import { FC, useCallback, useState } from "react";
const checkIfFormIsValid = (participants: Participant[], roles: Role[]) => {
  const isParticipantsEmpty = participants.length < 1;
  const isRolesEmpty = roles.length < 1;

  const isThereEmptyParticipantName = participants.some(
    (participant) => participant.name.length < 1,
  );

  const isThereEmptyRoleName = roles.some((role) => role.name.length < 1);

  const isThereEqualParticipantsNames =
    new Set(participants.map((participant) => participant.name)).size !==
    participants.length;

  const isThereEqualRolesNames =
    new Set(roles.map((role) => role.name)).size !== roles.length;

  console.log({
    isParticipantsEmpty,
    isRolesEmpty,
    isThereEmptyParticipantName,
    isThereEmptyRoleName,
    isThereEqualParticipantsNames,
    isThereEqualRolesNames,
  });

  if (
    isParticipantsEmpty ||
    isRolesEmpty ||
    isThereEmptyParticipantName ||
    isThereEmptyRoleName ||
    isThereEqualParticipantsNames ||
    isThereEqualRolesNames
  )
    return false;
  return true;
};

export const Setup: FC = () => {
  const navigate = useNavigate();
  const { config, setConfig } = useElectionStore();

  const [participants, setParticipants] = useState<Participant[]>(
    config?.participants ?? [
      { name: "Participante", eligible: true, voter: true },
    ],
  );
  const [roles, setRoles] = useState<Role[]>(
    config?.roles ?? [{ name: "Presidente", priority: 1 }],
  );

  const isFormValid = checkIfFormIsValid(participants, roles);

  const handleSubmit = useCallback(() => {
    // Ordenamos os cargos por prioridade antes de salvar para garantir consistência
    const sortedRoles = [...roles].sort((a, b) => a.priority - b.priority);
    setConfig({ participants, roles: sortedRoles });
    navigate({ to: "/vote" });
  }, [setConfig, participants, roles, navigate]);

  return (
    <div className="flex flex-col gap-8">
      <header>
        <h1 className="text-3xl font-bold text-gray-900">Configuração</h1>
        <p className="text-gray-500">Defina os detalhes da sua eleição.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        <Card title="Participantes">
          <div className="flex flex-col gap-4">
            {participants.map((p, i) => (
              <div
                key={i}
                className="flex flex-col p-3 border border-gray-100 rounded-lg gap-2 bg-gray-50/30"
              >
                <div className="flex gap-2">
                  <input
                    className="flex-1 px-3 py-1 bg-white border border-gray-200 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                    type="text"
                    value={p.name}
                    placeholder="Nome do participante"
                    onChange={(e) =>
                      setParticipants(
                        participants.toSpliced(i, 1, {
                          ...p,
                          name: e.target.value,
                        }),
                      )
                    }
                  />
                  <Button
                    variant="danger"
                    className="px-3"
                    onClick={() =>
                      setParticipants(participants.toSpliced(i, 1))
                    }
                  >
                    ✕
                  </Button>
                </div>
                <div className="flex gap-4 text-sm text-gray-600 px-1">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={p.voter}
                      onChange={(e) =>
                        setParticipants(
                          participants.toSpliced(i, 1, {
                            ...p,
                            voter: e.target.checked,
                          }),
                        )
                      }
                    />
                    Votante
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={p.eligible}
                      onChange={(e) =>
                        setParticipants(
                          participants.toSpliced(i, 1, {
                            ...p,
                            eligible: e.target.checked,
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
                setParticipants([
                  ...participants,
                  { name: "", eligible: true, voter: true },
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
            {roles.map((r, i) => (
              <div
                key={i}
                className="flex gap-2 items-center p-3 border border-gray-100 rounded-lg bg-gray-50/30"
              >
                <input
                  className="flex-1 px-3 py-1 bg-white border border-gray-200 rounded-md outline-none focus:ring-2 focus:ring-blue-500"
                  type="text"
                  value={r.name}
                  placeholder="Ex: Presidente"
                  onChange={(e) =>
                    setRoles(
                      roles.toSpliced(i, 1, { ...r, name: e.target.value }),
                    )
                  }
                />

                <div className="flex items-center gap-1">
                  <input
                    className="w-16 px-2 py-1 bg-white border border-gray-200 rounded-md outline-none focus:ring-2 focus:ring-blue-500 text-center"
                    type="number"
                    min="1"
                    value={r.priority}
                    onChange={(e) =>
                      setRoles(
                        roles.toSpliced(i, 1, {
                          ...r,
                          priority: parseInt(e.target.value) || 0,
                        }),
                      )
                    }
                  />
                </div>

                <Button
                  variant="danger"
                  className="px-3"
                  onClick={() => setRoles(roles.toSpliced(i, 1))}
                >
                  ✕
                </Button>
              </div>
            ))}
            <Button
              variant="ghost"
              onClick={() =>
                setRoles([...roles, { name: "", priority: roles.length + 1 }])
              }
            >
              + Adicionar Cargo
            </Button>
          </div>
        </Card>
      </div>

      <div className="flex justify-center pt-4">
        <Button
          disabled={!isFormValid}
          onClick={handleSubmit}
          className="w-full max-w-xs py-3 text-lg"
        >
          Iniciar Votação
        </Button>
      </div>
    </div>
  );
};
