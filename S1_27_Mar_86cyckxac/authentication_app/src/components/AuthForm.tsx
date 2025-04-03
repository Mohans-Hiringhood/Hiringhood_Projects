import { Button, TextField, Typography } from "@mui/material";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import styled from "styled-components";
import { Link } from "react-router-dom";
import wavyBg from "../landscape.jpg";

const Container = styled.div`
  display: flex;
  height: 100vh;
  align-items: center;
  justify-content: center;
`;

const Wrapper = styled.div`
  display: flex;
  background: white;
  border-radius: 10px;
  box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.1);
  width: 90vw;
  max-width: 90%;
  overflow: hidden;

  @media (max-width: 425px) {
    flex-direction: column;
    border-radius: 0;
    width: 100%;
    height: 100vh;
    box-shadow: none;
  }
`;

const LeftPanel = styled.div`
  flex: 1;
  background: url(${wavyBg}) right/cover no-repeat;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  padding: 3rem;
  text-align: center;
  min-height: 80vh;

  @media (max-width: 425px) {
    flex: none;
    min-height: 30vh;
  }
`;

const RightPanel = styled.div`
  flex: 1;
  padding: 3rem;
  display: flex;
  flex-direction: column;
  justify-content: center;

  @media (max-width: 425px) {
    padding: 2rem;
  }
`;

const StyledForm = styled(Form)`
  display: flex;
  flex-direction: column;
  gap: 1.8rem;
`;

const StyledTextField = styled(TextField)`
  width: 100%;
`;

const StyledButton = styled(Button)`
  width: 50%;
  font-size: 16px;
  text-transform: none;
  background: linear-gradient(135deg, #6a11cb, #2575fc);
`;

const StyledLink = styled(Link)`
  text-decoration: none;
  color: #6a11cb;
  font-weight: 600;
`;

const Label = styled(Typography)`
  font-weight: 600;
  font-size: 14px;
  margin-bottom: 4px;
`;

interface AuthFormProps {
  type: "login" | "signup";
  onSubmit: (values: { email: string; password: string }) => void;
  errorMessage: string;
}

const AuthForm: React.FC<AuthFormProps> = ({ type, onSubmit, errorMessage }) => {
  return (
    <Container>
      <Wrapper>
        {/* Left Panel */}
        <LeftPanel>
          <Typography variant="h3" fontWeight="bold">
            {type === "login" ? "Welcome Back!" : "Join Us Today!"}
          </Typography>
        </LeftPanel>

        {/* Right Panel - Form Section */}
        <RightPanel>
          <Typography variant="h5" fontWeight="bold" gutterBottom>
            {type === "login" ? "Login" : "Sign Up"}
          </Typography>
          <Typography variant="body2" color="textSecondary" gutterBottom>
            {type === "login"
              ? "Sign in to access your account"
              : "Create an account to get started"}
          </Typography>

          <Formik
            initialValues={{ email: "", password: "" }}
            validationSchema={Yup.object({
              email: Yup.string().email("Invalid email").required("Required"),
              password: Yup.string().min(6, "Must be at least 6 characters").required("Required"),
            })}
            onSubmit={onSubmit}
          >
            {({ errors, touched, handleChange, handleBlur, values }) => (
              <StyledForm>
                <div>
                  <Label>Email</Label>
                  <StyledTextField
                    name="email"
                    variant="outlined"
                    fullWidth
                    value={values.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.email && !!errors.email}
                    helperText={touched.email && errors.email}
                  />
                </div>

                <div>
                  <Label>Password</Label>
                  <StyledTextField
                    name="password"
                    type="password"
                    variant="outlined"
                    fullWidth
                    value={values.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.password && !!errors.password}
                    helperText={touched.password && errors.password}
                  />
                </div>

                {errorMessage && <Typography color="error">{errorMessage}</Typography>}

                <StyledButton type="submit" variant="contained" color="primary" sx={{margin:"0px auto"}}>
                  {type === "login" ? "Login" : "Sign Up"}
                </StyledButton>

                <Typography variant="body2" align="center">
                  {type === "login" ? (
                    <>
                      Don't have an account? <StyledLink to="/signup">Sign Up</StyledLink>
                    </>
                  ) : (
                    <>
                      Already have an account? <StyledLink to="/login">Login</StyledLink>
                    </>
                  )}
                </Typography>
              </StyledForm>
            )}
          </Formik>
        </RightPanel>
      </Wrapper>
    </Container>
  );
};

export default AuthForm;
