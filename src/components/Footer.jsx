import { useContext } from "react";
import "./Footer.css";
import ModeContext from "../context/ModeContext";

export default function Footer() {
  const ctx = useContext(ModeContext);


  return (
    <div className={`footer1${ctx?.mode}`}>
      <footer className="footer1">
      @ 2026 All rights are reserved BlogPost
      </footer>
    </div>
  );
}