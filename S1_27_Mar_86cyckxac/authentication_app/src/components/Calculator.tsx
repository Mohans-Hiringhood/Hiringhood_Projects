import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Grid,
  Snackbar,
  Alert,
  Slide,
  Typography
} from "@mui/material";

interface CalculatorButton {
  label: string;
  value: string;
  gridSize: number;
  color?: string;
  hoverColor?: string;
}

const Calculator: React.FC = () => {
  const [input, setInput] = useState("0");
  const [previousExpression, setPreviousExpression] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showError, setShowError] = useState(false);
  const [snackbarKey, setSnackbarKey] = useState(0); // New key to force snackbar remount

  const clearError = () => {
    setError(null);
    setShowError(false);
    setSnackbarKey(prev => prev + 1); // Change key to force snackbar remount
  };

  const evaluateExpression = (expression: string): string => {
    clearError(); // Clear error state before evaluation
    try {
      if (expression.includes("/0") && !expression.includes("/0.")) {
        throw new Error("Cannot divide by zero");
      }
      
      const processedExpression = expression.replace(/(\d+(?:\.\d+)?)%/g, '($1/100) *');
      const result = new Function(`return ${processedExpression}`)();
      
      if (isNaN(result)) {
        throw new Error("Invalid calculation");
      }
      if (!isFinite(result)) {
        throw new Error("Result is too large");
      }
      return Number.isInteger(result) ? result.toString() : result.toFixed(8).replace(/\.?0+$/, "");
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred";
      setError(errorMessage);
      setShowError(true);
      setInput("0");
      return "";
    }
  };

  const handleButtonClick = (value: string): void => {
    try {
      clearError(); // Clear error state before handling new input
      
      switch (value) {
        case "C":
          setInput("0");
          setPreviousExpression(null);
          break;
        case "DEL":
          setInput(prev => prev.length > 1 ? prev.slice(0, -1) : "0");
          break;
        case "=":
        case "Enter":
          if (input === "0") return;
          setPreviousExpression(input);
          const result = evaluateExpression(input);
          if (result) setInput(result);
          break;
        case "√":
          const num = parseFloat(input);
          if (num < 0) {
            throw new Error("Cannot calculate square root of a negative number");
          }
          setInput(Math.sqrt(num).toString());
          break;
        case "%":
          setInput(prev => prev + "%");
          break;
        default:
          if (input === "0" && value !== ".") {
            setInput(value);
            return;
          }
          if (value === "." && input === "0") {
            setInput("0.");
            return;
          }
          if (value === ".") {
            const parts = input.split(/[+\-*/]/);
            if (parts[parts.length - 1].includes(".")) {
              throw new Error("A number can only have one decimal point");
            }
          }
          if (/[+\-*/.]$/.test(input) && /[+*/.]/.test(value)) {
            throw new Error("Cannot have multiple operators in sequence");
          }
          setInput(prev => (prev === "0" ? value : prev + value));
          break;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred";
      setError(errorMessage);
      setShowError(true);
      setInput("0");
    }
  };

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent): void => {
      const key = event.key;
      
      if (['Enter', 'Backspace', 'Escape', ...'0123456789+-*/.%()='.split('')].includes(key)) {
        event.preventDefault();
      }
      
      if (key === 'Enter' || key === '=') {
        handleButtonClick("=");
      } else if (key === 'Backspace') {
        handleButtonClick("DEL");
      } else if (key === 'Escape') {
        handleButtonClick("C");
      } else if (key === '(' || key === ')') {
        handleButtonClick(key);
      } else if ('0123456789+-*/.%'.includes(key)) {
        handleButtonClick(key);
      }
    };
  
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [input]);

  const buttons: CalculatorButton[] = [
    { label: "C", value: "C", gridSize: 3, color: "#F8F8F8" },
    { label: "DEL", value: "DEL", gridSize: 3, color: "#F8F8F8" },
    { label: "%", value: "%", gridSize: 3, color: "#F8F8F8" },
    { label: "/", value: "/", gridSize: 3, color: "#F8F8F8" },
    { label: "7", value: "7", gridSize: 3, color: "#F8F8F8" },
    { label: "8", value: "8", gridSize: 3, color: "#F8F8F8" },
    { label: "9", value: "9", gridSize: 3, color: "#F8F8F8" },
    { label: "*", value: "*", gridSize: 3, color: "#F8F8F8" },
    { label: "4", value: "4", gridSize: 3, color: "#F8F8F8" },
    { label: "5", value: "5", gridSize: 3, color: "#F8F8F8" },
    { label: "6", value: "6", gridSize: 3, color: "#F8F8F8" },
    { label: "-", value: "-", gridSize: 3, color: "#F8F8F8" },
    { label: "1", value: "1", gridSize: 3, color: "#F8F8F8" },
    { label: "2", value: "2", gridSize: 3, color: "#F8F8F8" },
    { label: "3", value: "3", gridSize: 3, color: "#F8F8F8" },
    { label: "+", value: "+", gridSize: 3, color: "#F8F8F8" },
    { label: ".", value: ".", gridSize: 3, color: "#F8F8F8" },
    { label: "0", value: "0", gridSize: 3, color: "#F8F8F8" },
    { label: "√", value: "√", gridSize: 3, color: "#F8F8F8" },
    { label: "=", value: "=", gridSize: 3, color: "#E6A6B0", hoverColor: "#E08E99" },
  ];

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "fit-content",
        padding: "30px",
        borderRadius: "30px",
        backgroundColor: "#E6CFF8", 
      }}
    >
      <Box
        sx={{
          width: 300,
          minHeight: 450,
          padding: 3,
          backgroundColor: "#FFF",
          borderRadius: "30px",
          boxShadow: "10px 10px 20px #b5a9c4, -10px -10px 20px #ffffff",
          textAlign: "center",
        }}
      >
        {/* Display Area */}
        <Box
          sx={{
            mb: 2,
            backgroundColor: "#EAF4ED",
            borderRadius: "20px",
            padding: "10px",
            marginBottom: "30px",
            textAlign: "right",
            minHeight: "80px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          {previousExpression && (
            <Typography
              variant="body2"
              sx={{
                fontSize: "0.9rem",
                color: "#666",
                opacity: 0.7,
                wordBreak: "break-word",
              }}
            >
              {previousExpression}
            </Typography>
          )}
          <Typography
            variant="h4"
            sx={{
              fontSize: "1.8rem",
              color: "#333",
              fontWeight: "bold",
              wordBreak: "break-word",
            }}
          >
            {input}
          </Typography>
        </Box>

        {/* Buttons Grid */}
        <Grid container spacing={1.5}>
          {buttons.map(({ label, value, gridSize, color, hoverColor }) => (
            <Grid key={value}>
              <Button
                variant="contained"
                fullWidth
                sx={{
                  fontSize: "1.2rem",
                  height: 50,
                  borderRadius: "50%",
                  backgroundColor: color,
                  color: "#333",
                  boxShadow: "5px 5px 10px #d1c7d6, -5px -5px 10px #ffffff",
                  "&:hover": {
                    backgroundColor: hoverColor || "#EDEDED",
                    transform: "scale(1.05)",
                  },
                  "&:active": {
                    transform: "scale(0.95)",
                  },
                  transition: "all 0.2s ease-in-out",
                }}
                onClick={() => handleButtonClick(value)}
              >
                {label}
              </Button>
            </Grid>
          ))}
        </Grid>

        {/* Error Snackbar - using key to force remount */}
        <Snackbar
          key={snackbarKey}
          open={showError}
          autoHideDuration={3000}
          onClose={() => setShowError(false)}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
          TransitionComponent={(props) => <Slide {...props} direction="down" />}
        >
          <Alert severity="error" sx={{ width: "100%" }}>
            {error}
          </Alert>
        </Snackbar>
      </Box>
    </Box>
  );
};

export default Calculator;