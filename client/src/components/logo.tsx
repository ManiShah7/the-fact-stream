import logo from "@/assets/logo.png";

const Logo = () => {
  return (
    <div className="w-16 h-16 border-2 rounded-xl flex items-center justify-center shadow-lg">
      <img src={logo} alt="Logo" className="w-10 h-10" />
    </div>
  );
};

export default Logo;
