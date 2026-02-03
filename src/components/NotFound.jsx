
import Lottie from "react-lottie-player";
import  Error from "../assets/Error404.json"; 
import Navbar from "./Navbar";

export default function NotFound() {
  return (
    <>
      <Navbar />

      <div
        style={{
          textAlign: "center",
          padding: "40px",
          minHeight: "80vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <h1>404 - Page Not Found</h1>
        <p>The page you are looking for does not exist.</p>

        <Lottie
          loop
          animationData={Error}
          play
          style={{ width: 250, height: 250 }}
        />
      </div>
    </>
  );
}