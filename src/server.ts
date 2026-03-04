import app from "./app";

// Start the server
const startServer = () => {
  console.log(process.env.PORT);
  try {
    app.listen(4000, () => {
      console.log(`Server is running on http://localhost:4000`);
    });
  } catch (error) {
    console.error("Error starting the server:", error);
  }
};

startServer();
