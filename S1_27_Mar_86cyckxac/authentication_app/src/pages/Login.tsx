import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthForm from "../components/AuthForm";
import { getUser } from "../utils/indexedDB";

const Login = () => {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");

  const handleLogin = async ({ email, password }: { email: string; password: string }) => {
    setErrorMessage("");
    const user = await getUser(email);

    if (!user) {
      setErrorMessage("User doesn't exist. Please sign up.");
    } else if (user.password !== password) {
      setErrorMessage("Invalid credentials.");
    } else {
      localStorage.setItem("authUser", JSON.stringify({ email }));
      navigate("/home"); // Redirect to home
    }
  };

  return <AuthForm type="login" onSubmit={handleLogin} errorMessage={errorMessage} />;
};

export default Login;
