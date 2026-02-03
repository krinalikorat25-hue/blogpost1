import "./Navbar.css";
import "./Card.css";
import { useContext, useEffect, useState } from "react";
import ModeContext from "../context/ModeContext";

const Card = (props) => {
    const ctx = useContext(ModeContext);
  const loginData = localStorage.getItem("logindata");
  const LoggedInUserData = loginData ? JSON.parse(loginData) : null;

  const displayImage = props.image || `https://picsum.photos/seed/${props.id}/300/200`;

  return (
    <div className={`card ${ctx.mode}`}>
      <div className="icon-center" onClick={props.onRedirect}>
        <img src={displayImage} alt={props.title} />
      </div>

      <div className="card-content">
        <h1>{props.title}</h1>
        <p>
          {props.desc && props.desc.length > 100
            ? props.desc.substring(0, 100) + "..."
            : props.desc}
        </p>
      </div>

    
      {LoggedInUserData?.role === "admin" && (
        <div className="button">
          <button className="btn-edit" onClick={props.onEdit}>
            Edit
          </button>
          <button className="btn-delete" onClick={props.onDelete}>
            Delete
          </button>
        </div>
      )}
    </div>
  );
};


export default Card;