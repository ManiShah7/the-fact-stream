import { LoginForm } from "@/components/login-form";

const LoginPage = () => {
  return (
    <div className="flex w-full items-center justify-center">
      <div className="w-full max-w-sm">
        <LoginForm />
      </div>
    </div>
  );
};

export default LoginPage;
