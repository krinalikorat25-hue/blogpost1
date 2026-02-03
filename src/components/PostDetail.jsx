import React, { useEffect, useState } from "react";
import "./PostDetail.css";
import img from "../assets/img1.jpg";
import { useNavigate, useParams } from "react-router-dom";
import Snowfall from 'react-snowfall'

const PostDetail = () => {
  const LoggedInUserData = JSON.parse(localStorage.getItem("logindata")) || {};
  const loginData = localStorage.getItem("logindata");
  const [showModal, setShowModal] = useState(false);
  const PostData=JSON.parse(localStorage.getItem("postData"))||[];
  const {postId}=useParams();//used to get dynamic value from url
  const navigate= useNavigate();
  const[CurrentPost,setCurrentPost]=useState({});//used to store single page data
  useEffect(()=>{
    //find() method - apply only on array,return single object 
    const filtered =PostData.find(item=>String(item.id)===String(postId));
    console.log({PostData,postId,filtered});
    if(filtered)setCurrentPost(filtered);
  },[postId,localStorage]);
  

  // const post = {
  //   title: "Dwarka information",
  //   desc: "Dwarka is a sacred, ancient city in Gujarat, India, famed as the legendary kingdom of Lord Krishna, a major Hindu pilgrimage site (Char Dham), and a significant archaeological location with underwater ruins suggesting a once-great port city swallowed by the sea, featuring the prominent Dwarkadhish Temple.",
  //   image: img,
  // };
  const handleEdit = () => {
    navigate("/newpost", { state: { id:postId } });
  };

  const handleDelete = () => {
    const updatedPosts=PostData.filter(
      item => String(item.id)!==String(postId)
    );
    localStorage.setItem("postData",JSON.stringify(updatedPosts));
    setShowModal(false);
    navigate("/");

 
    
  };

  return (
    <>
    <Snowfall  snowflakeCount={100} color="blue"/>
      <div className="post-container">
        <div className="post-card">
          <div className="post-content">
            <div className="post-image">
              <img src={CurrentPost.image||"/assets/img1.jpg"} alt="preview"/>
            </div>

            <div className="post-info">
              <h1>{CurrentPost.title}</h1>
              <p>{CurrentPost.body}</p>
            </div>
          </div>
          {LoggedInUserData?.role==="admin"?
          <div className="post-btn">
            <button className="btn-edit" onClick={handleEdit}>Edit</button>
            <button
              className="btn-delete"
              onClick={() => setShowModal(true)}
            >
              Delete
            </button>
            
          </div>
          :<></>}
        </div>
      </div>

      
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h2>Delete Post?</h2>
            <p>Are you sure you want to delete this post?</p>

            <div className="modal-actions">
              <button
                className="btn-cancel"
                onClick={handleEdit => setShowModal(false)}
              >
                Cancel
              </button>
              <button className="btn-confirm" onClick={handleDelete}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PostDetail;
