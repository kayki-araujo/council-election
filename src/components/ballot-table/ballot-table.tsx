import { Nominee, Seat } from "@/types";
import { FC } from "react";

type BallotTableProps = {
  seats: Seat[];
  nominees: Nominee[];
  votes: Record<string, Record<string, boolean>>;
  onChange: (seat: string, nominee: string, value: boolean) => void;
};

export const BallotTable: FC<BallotTableProps> = ({
  seats,
  nominees,
  votes,
  onChange,
}) => {
  const eligibles = nominees.filter((n) => n.isEligible);

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="text-left border-b border-gray-100">
            <th className="py-4 px-2 text-gray-400 text-xs uppercase">Cargo</th>
            {eligibles.map((n) => (
              <th key={n.name} className="py-4 px-2 text-center text-sm">
                {n.name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {seats.map((seat) => (
            <tr key={seat.name} className="hover:bg-gray-50/50">
              <td className="py-4 px-2 font-medium">{seat.name}</td>
              {eligibles.map((n) => (
                <td key={n.name} className="py-4 px-2 text-center">
                  <input
                    type="checkbox"
                    className="w-5 h-5 accent-blue-600 cursor-pointer"
                    checked={votes[seat.name]?.[n.name] ?? false}
                    onChange={(e) =>
                      onChange(seat.name, n.name, e.target.checked)
                    }
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
