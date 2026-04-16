import { ButtonHTMLAttributes, FC } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "danger" | "ghost";
}

export const Button: FC<ButtonProps> = ({
  variant = "primary",
  className,
  ...props
}) => {
  const base =
    "px-4 py-2 rounded-lg font-medium transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none";
  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 shadow-sm",
    danger: "bg-red-100 text-red-600 hover:bg-red-600 hover:text-white",
    ghost: "bg-gray-100 text-gray-600 hover:bg-gray-200",
  };

  return (
    <button
      className={`${base} ${variants[variant]} ${className}`}
      {...props}
    />
  );
};
