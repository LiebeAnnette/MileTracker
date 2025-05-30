const Card: React.FC<{
  title?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
}> = ({ title, children, footer }) => {
  return (
    <div className="bg-[color:var(--teal)] shadow-md border border-[color:var(--sky)] rounded-xl p-4 mb-6">
      {title && (
        <div className="text-black font-semibold text-xl mb-2">{title}</div>
      )}
      <div className="text-black">{children}</div>
      {footer && <div className="mt-4">{footer}</div>}
    </div>
  );
};

export default Card;
