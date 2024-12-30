interface MenuHeaderProps {
  title?: string;
}

const MenuHeader = ({ title = "Restaurant Menu" }: MenuHeaderProps) => {
  return (
    <div className="bg-primary text-white p-6 mb-6">
      <h1 className="text-2xl font-bold text-center">{title}</h1>
    </div>
  );
};

export default MenuHeader;