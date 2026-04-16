import { FC, ReactNode } from "react";

export const Card: FC<{ children: ReactNode; title?: string }> = ({
  children,
  title,
}) => (
  <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
    {title && (
      <div className="border-b border-gray-100 bg-gray-50/50 px-6 py-4">
        <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
      </div>
    )}
    <div className="p-6">{children}</div>
  </div>
);
