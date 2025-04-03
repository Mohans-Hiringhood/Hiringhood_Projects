import { Button, Typography, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../utils/auth";
import { styled } from "@mui/system";
import gradientBg from "../landscape.jpg"; 

const HomeContainer = styled(Box)(({ theme }) => ({
  minHeight: "95vh",
  backgroundImage: `url(${gradientBg})`,
  backgroundSize: "cover",
  backgroundPosition: "center",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  padding: theme.spacing(4),
  textAlign: "center",
  color: "#ffffff",
}));

const ContentBox = styled(Box)(({ theme }) => ({
  backgroundColor: "rgba(0, 0, 0, 0.7)",
  padding: theme.spacing(6),
  borderRadius: "16px",
  maxWidth: "800px",
  backdropFilter: "blur(8px)",
  boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
  [theme.breakpoints.down("sm")]: {
    padding: theme.spacing(4),
    width: "90%",
  },
  "@media (max-width: 375px)": {
    padding: theme.spacing(3),
    "& h1": {
      fontSize: "1.8rem",
    },
    "& h2": {
      fontSize: "1.2rem",
    }
  },
}));

const StyledButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(4),
  padding: "12px 32px",
  fontSize: "1rem",
  fontWeight: "bold",
  background: "linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)",
  color: "white",
  borderRadius: "50px",
  textTransform: "none",
  transition: "all 0.3s ease",
  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow: "0 6px 20px rgba(106, 17, 203, 0.5)",
    background: "linear-gradient(135deg, #2575fc 0%, #6a11cb 100%)",
  },
  "@media (max-width: 375px)": {
    padding: "10px 24px",
    fontSize: "0.9rem",
  },
}));

const Home = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutUser();
    navigate("/login");
  };

  return (
    <HomeContainer>
      <ContentBox>
        <Typography
          variant="h2"
          component="h1"
          gutterBottom
          sx={{
            fontWeight: 700,
            background: "linear-gradient(135deg, #6a11cb, #2575fc)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            mb: 3,
            fontSize: {
              xs: "1.8rem",  // Extra small devices (phones, 0px and up)
              sm: "2.4rem",  // Small devices (tablets, 600px and up)
              md: "3rem",    // Medium devices (desktops, 900px and up)
            },
            lineHeight: {
              xs: 1.2,       // Tighter line height for mobile
              sm: 1.3,       // Slightly looser for tablets
            }
          }}
        >
          Welcome to Your Dashboard
        </Typography>
        
        <Typography 
          variant="h5" 
          component="h2" 
          gutterBottom 
          sx={{ 
            mb: 3,
            fontSize: {
              xs: "1.2rem",
              sm: "1.5rem",
            }
          }}
        >
          You're successfully logged in!
        </Typography>
        
        <Typography 
          variant="body1" 
          sx={{ 
            mb: 4, 
            width: "80%",
            margin: "0px auto",
            fontSize: {
              xs: "0.95rem",
              sm: "1.1rem",
            }
          }}
        >
          Thank you for using our application. Whenever you're ready, you can securely log out using the button below.
        </Typography>
        
        <StyledButton
          variant="contained"
          size="large"
          onClick={handleLogout}
        >
          Logout
        </StyledButton>
      </ContentBox>
    </HomeContainer>
  );
};

export default Home;