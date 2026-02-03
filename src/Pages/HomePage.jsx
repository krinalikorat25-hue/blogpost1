import { MdKeyboardArrowUp, MdKeyboardArrowDown } from "react-icons/md";
import Card from "../components/Card";
import { useContext, useEffect, useState } from "react";
import ConfirmationModal from "../components/Confirmationmodal"; 
import { useNavigate } from "react-router-dom";
import Snowfall from 'react-snowfall';
import ModeContext from "../context/ModeContext";

export function HomePage() {
  const [allPostData, setAllPostData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(null);

  const navigate = useNavigate();
  const ctx = useContext(ModeContext);

  // ૧. થીમ આખી સ્ક્રીનમાં લાગુ કરવા માટેનું લોજિક
  useEffect(() => {
    if (ctx?.mode === 'dark') {
      document.body.style.backgroundColor = "#121212"; // Dark background
      document.body.style.color = "white";
    } else {
      document.body.style.backgroundColor = "white"; // Light background
      document.body.style.color = "black";
    }
  }, [ctx?.mode]);

  useEffect(() => {
    const storedData = localStorage.getItem("postData");
    const data = storedData ? JSON.parse(storedData) : [];
    setAllPostData(data);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });
  const scrollToBottom = () => window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'smooth' });

  const openDeleteModal = (index) => {
    setSelectedIndex(index);
    setShowModal(true);
  };

  const confirmDelete = () => {
    const updatedData = allPostData.filter((_, i) => i !== selectedIndex);
    setAllPostData(updatedData);
    localStorage.setItem("postData", JSON.stringify(updatedData));
    setShowModal(false);
  };

  // --- Inline CSS Styles ---
  const scrollButtonsStyle = {
    position: 'fixed', bottom: '30px', right: '30px',
    display: 'flex', flexDirection: 'column', gap: '15px', zIndex: 9999,
  };

  const scrollBtnStyle = {
    width: '50px', height: '50px', borderRadius: '50%',
    backgroundColor: '#007bff', color: 'white', border: 'none',
    fontSize: '30px', display: 'flex', alignItems: 'center',
    justifyContent: 'center', cursor: 'pointer', boxShadow: '0 4px 15px rgba(0, 0, 0, 0.3)',
    transition: 'all 0.3s ease',
  };

  return (
    <>
      {/* ૨. minHeight: "100vh" થી આખા પેજ પર થીમ દેખાશે */}
      <div className={`container-home ${ctx?.mode === 'dark' ? 'dark-theme' : 'light-theme'}`} 
           style={{ 
             minHeight: "100vh", 
             width: "100%", 
             paddingBottom: "50px",
             transition: "all 0.3s ease" 
           }}>
        
        <Snowfall snowflakeCount={100} color={ctx?.mode === 'dark' ? "white" : "blue"} />
        
        <h1 style={{ textAlign: "center", paddingTop: "20px" }}>Created Posts</h1>

        <div className="container" style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "20px" }}>
          {allPostData.length === 0 ? (
            <p>No Data Found</p>
          ) : (
            allPostData.map((item, index) => (
              <Card
                key={index}
                title={item.title}
                desc={item.body}
                image={item.image}
                onDelete={() => openDeleteModal(index)}
                onRedirect={() => navigate(`/posts/${item.id}`)}
                onEdit={() => navigate("/newpost", { state: { id: item.id } })}
              />
            ))
          )}
        </div>

        {/* Floating Scroll Buttons */}
        <div style={scrollButtonsStyle}>
          <button 
            style={scrollBtnStyle} 
            onClick={scrollToTop} 
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#0056b3'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#007bff'}
          >
            <MdKeyboardArrowUp />
          </button>
          <button 
            style={scrollBtnStyle} 
            onClick={scrollToBottom}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#0056b3'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#007bff'}
          >
            <MdKeyboardArrowDown />
          </button>
        </div>

        {showModal && (
          <ConfirmationModal
            title="Delete Post?"
            desc="Are you sure you want to delete this post?"
            confirmBtnText="Delete"
            onConfirm={confirmDelete}
            onClose={() => setShowModal(false)}
          />
        )}
      </div>
    </>
  );
}