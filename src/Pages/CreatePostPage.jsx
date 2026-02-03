import { useContext, useEffect } from "react";
import CreatePostForm from "../components/CreatePostForm";
import ModeContext from "../context/ModeContext";

export const CreatePostPage = () => {
  const ctx = useContext(ModeContext);

  // આખી સ્ક્રીન (body) નો કલર થીમ મુજબ બદલવા માટે
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
      className={`create-post-wrapper ${ctx?.mode === 'dark' ? 'dark-theme' : 'light-theme'}`}
      style={{ 
        minHeight: "100vh", 
        width: "100%", 
        transition: "all 0.3s ease" 
      }}
    >
      <CreatePostForm />
    </div>
  );
};