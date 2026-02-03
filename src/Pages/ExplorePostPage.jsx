import { useContext, useEffect } from "react";
import ExplorePost from "../components/ExplorePost";
import ModeContext from "../context/ModeContext";

export default function ExplorePostPage() {
  const ctx = useContext(ModeContext);

  // આખા body (સ્ક્રીન) નો કલર થીમ મુજબ સેટ કરવા માટે
  useEffect(() => {
    if (ctx?.mode === 'dark') {
      document.body.style.backgroundColor = "#121212"; 
      document.body.style.color = "white";
    } else {
      document.body.style.backgroundColor = "white"; 
      document.body.style.color = "black";
    }
  }, [ctx?.mode]);

  return (
    <div 
      className={`explore-post-wrapper ${ctx?.mode === 'dark' ? 'dark-theme' : 'light-theme'}`}
      style={{ 
        minHeight: "100vh", 
        width: "100%", 
        transition: "all 0.3s ease",
        paddingBottom: "50px"
      }}
    >
      <ExplorePost />
    </div>
  );
}