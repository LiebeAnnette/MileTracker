const Button: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = ({
  children,
  className = "",
  ...props
}) => {
  return (
    <button
      className={`bg-[color:var(--orange)] text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-[color:var(--yellow)] focus:outline-none focus:ring-2 focus:ring-[color:var(--sky)] disabled:opacity-50 disabled:cursor-not-allowed transition duration-200 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
