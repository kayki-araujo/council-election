import { useState, type FC } from "react";

export const App: FC = () => {
  const [participants, setParticipants] = useState<string[]>(["Kayki", ""]);
  const [roles, setRoles] = useState<{ name: string; priority: number }[]>([
    { name: "Presidente", priority: 1 },
  ]);

  return (
    <main className="bg-amber-300 p-5 flex flex-col gap-5">
      <div className="bg-green-400 border-2 flex flex-col">
        <h2 className="text-center">Participantes</h2>
        <div>
          {participants.map((participant, participantIdx) => (
            <div key={participantIdx}>
              <input
                type="text"
                value={participant}
                onChange={(e) =>
                  setParticipants(
                    participants.toSpliced(participantIdx, 1, e.target.value),
                  )
                }
                placeholder={`Novo Participante ${participantIdx + 1}`}
              />
              <button
                onClick={() =>
                  setParticipants(participants.toSpliced(participantIdx, 1))
                }
              >
                X
              </button>
            </div>
          ))}
        </div>
        <button onClick={() => setParticipants([...participants, ""])}>
          +
        </button>
      </div>
      <div className="bg-green-400 border-2 flex flex-col">
        <h2 className="text-center">Cargos</h2>
        <div>
          {roles.map((role, roleIdx) => (
            <div key={roleIdx} className="flex">
              <input
                type="text"
                value={role.name}
                onChange={(e) =>
                  setRoles(
                    roles.toSpliced(roleIdx, 1, {
                      ...role,
                      name: e.target.value,
                    }),
                  )
                }
                placeholder={`Novo cargo ${roleIdx + 1}`}
              />
              <div className="flex">
                <div>Prioridade:</div>
                <input
                  type="number"
                  value={role.priority}
                  onChange={(e) =>
                    setRoles(
                      roles.toSpliced(roleIdx, 1, {
                        ...role,
                        priority: parseInt(e.target.value),
                      }),
                    )
                  }
                />
              </div>
              <button onClick={() => setRoles(roles.toSpliced(roleIdx, 1))}>
                X
              </button>
            </div>
          ))}
        </div>
        <button onClick={() => setRoles([...roles, { name: "", priority: 0 }])}>
          +
        </button>
      </div>
      <button>continuar</button>
    </main>
  );
};
