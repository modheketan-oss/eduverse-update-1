import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline' | 'ghost' | 'gradient';
  fullWidth?: boolean;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({ 
  variant = 'primary', 
  fullWidth = false, 
  className = '', 
  children, 
  ...props 
}) => {
  const baseStyles = "py-3.5 px-6 rounded-full font-semibold transition-all duration-200 flex items-center justify-center gap-2";
  
  const variants = {
    primary: "bg-white text-purple-600 hover:bg-gray-100 shadow-md",
    outline: "border-2 border-white text-white hover:bg-white/10",
    ghost: "text-slate-600 hover:bg-slate-100",
    gradient: "bg-gradient-to-r from-indigo-900 to-slate-900 text-white shadow-lg hover:shadow-xl"
  };

  const widthClass = fullWidth ? "w-full" : "";

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${widthClass} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};