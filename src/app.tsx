import { useElectionStore } from "@/stores";
import { Participant, Role } from "@/types";
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

type EditableListProps<T> = {
  title: string;
  items: T[];
  onAdd: () => void;
  renderItem: (item: T, index: number) => React.ReactNode;
  error?: string;
};

const EditableList = <T,>({
  title,
  items,
  onAdd,
  renderItem,
  error,
}: EditableListProps<T>) => (
  <div className="bg-green-400 border-2 flex flex-col">
    <h2 className="text-center">{title}</h2>
    {error && <p className="error">{error}</p>}
    {items.map((item, i) => (
      <div key={i}>{renderItem(item, i)}</div>
    ))}
    <button onClick={onAdd} className="">
      +
    </button>
  </div>
);

export const App: FC = () => {
  const { config, setConfig } = useElectionStore();

  const [participants, setParticipants] = useState<Participant[]>(
    config?.participants ?? [
      { name: "Participante", electable: true, voter: true },
    ],
  );
  const [roles, setRoles] = useState<Role[]>(
    config?.roles ?? [{ name: "Presidente", priority: 1 }],
  );

  const isFormValid = checkIfFormIsValid(participants, roles);

  const handleSubmit = useCallback(() => {
    setConfig({ participants, roles });
    alert("all set");
  }, [participants, roles]);

  return (
    <main className="bg-amber-300 p-5 flex flex-col gap-5">
      <EditableList
        title="Participantes"
        items={participants}
        onAdd={() =>
          setParticipants([
            ...participants,
            { name: "", electable: true, voter: true },
          ])
        }
        renderItem={(participant, participantIdx) => (
          <div className="flex">
            <input
              type="text"
              value={participant.name}
              onChange={(e) =>
                setParticipants(
                  participants.toSpliced(participantIdx, 1, {
                    ...participant,
                    name: e.target.value,
                  }),
                )
              }
              placeholder={`Novo Participante ${participantIdx + 1}`}
            />
            <div className="flex">
              <div>Eleitor:</div>
              <input
                type="checkbox"
                checked={participant.voter}
                onChange={(e) =>
                  setParticipants(
                    participants.toSpliced(participantIdx, 1, {
                      ...participant,
                      voter: e.target.checked,
                    }),
                  )
                }
              />
            </div>
            <div className="flex">
              <div>Elegível:</div>
              <input
                type="checkbox"
                checked={participant.electable}
                onChange={(e) =>
                  setParticipants(
                    participants.toSpliced(participantIdx, 1, {
                      ...participant,
                      electable: e.target.checked,
                    }),
                  )
                }
              />
            </div>
            <button
              onClick={() =>
                setParticipants(participants.toSpliced(participantIdx, 1))
              }
            >
              X
            </button>
          </div>
        )}
      />
      <EditableList
        title="Cargos"
        items={roles}
        onAdd={() => setRoles([...roles, { name: "", priority: 1 }])}
        renderItem={(role, roleIdx) => (
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
        )}
      />
      <button
        className={`${isFormValid ? "bg-green-500" : "bg-red-500"}`}
        onClick={handleSubmit}
      >
        continuar
      </button>
    </main>
  );
};
