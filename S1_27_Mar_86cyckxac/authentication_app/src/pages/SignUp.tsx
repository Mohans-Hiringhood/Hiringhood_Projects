import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthForm from "../components/AuthForm";
import { addUser } from "../utils/indexedDB";

const SignUp = () => {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");

  const handleSignUp = async ({ email, password }: { email: string; password: string }) => {
    setErrorMessage("");
    try {
      await addUser(email, password);
      navigate("/login"); // Redirect to login after sign-up
    } catch (error) {
      setErrorMessage(error as string); // Show error if user exists
    }
  };

  return <AuthForm type="signup" onSubmit={handleSignUp} errorMessage={errorMessage} />;
};

export default SignUp;
