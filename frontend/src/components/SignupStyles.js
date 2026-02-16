export const styles = {
  container: {
    width: "100vw",
    height: "calc(100vh - 64px)", // subtract navbar height (64px is default MUI AppBar height)
    background: "linear-gradient(to bottom right, #9be8e8, #b9d0ff)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center", // vertical & horizontal centering
    boxSizing: "border-box",
    overflow: "hidden", // removes scroll
    margin: 0,
  },
  card: {
    width: "100%",
    maxWidth: "500px",
    background: "white",
    padding: "35px",
    borderRadius: "20px",
    boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },
  input: {
    width: "100%",
    padding: "14px",
    borderRadius: "10px",
    border: "1px solid #ccc",
    outline: "none",
    transition: "0.2s",
    marginBottom: "15px",
  },
  inputFocus: {
    border: "1.5px solid #007bff",
    boxShadow: "0 0 5px rgba(0,123,255,0.5)",
  },
  button: {
    padding: "14px",
    width: "100%",
    background: "#007bff",
    color: "white",
    borderRadius: "10px",
    fontSize: "16px",
    cursor: "pointer",
    border: "none",
    transition: "0.2s",
  },
  buttonHover: {
    transform: "scale(1.03)",
    background: "#0063d4",
  },
  infoText: {
    textAlign: "center",
    fontSize: "15px",
  },
  successMsg: {
    color: "green",
    textAlign: "center",
  },
};
