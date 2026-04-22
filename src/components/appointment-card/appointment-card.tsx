import { FC } from "react";
import { Card } from "../card";

type AppointmentCardProps = {
  appointments: Record<string, string>;
  title: string;
};

export const AppointmentCard: FC<AppointmentCardProps> = ({
  appointments,
  title,
}) => (
  <Card title={title}>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {Object.entries(appointments).map(([seat, nominee]) => (
        <div
          key={seat}
          className="flex flex-col p-4 bg-gray-50/50 border border-gray-100 rounded-xl hover:bg-blue-50/30 transition-colors"
        >
          <span className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">
            {seat}
          </span>
          <span className="text-xl font-bold text-gray-800">{nominee}</span>
        </div>
      ))}
    </div>
  </Card>
);
