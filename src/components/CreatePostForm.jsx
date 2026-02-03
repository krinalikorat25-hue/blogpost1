import React, { useContext , useEffect, useState } from "react";
import "./CreatePostForm.css";
import { useLocation, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { v4 as uuidv4 } from "uuid";
import Snowfall from "react-snowfall";
import Loader from "../components/Loader.jsx"; 
import ModeContext from "../context/ModeContext.jsx";

export default function CreatePostForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const editPostId = location.state?.id || null;

  const [loading, setLoading] = useState(false); 

  const [createPostFormData, setCreatePostFormData] = useState({
    title: "",
    body: "",
    image: "",
  });

  const [errors, setErrors] = useState({});
  const ctx = useContext(ModeContext);
  const handleChange = (field, value) => {
    setErrors((e) => ({ ...e, [field]: "" }));
    setCreatePostFormData({ ...createPostFormData, [field]: value });
  };

  useEffect(() => {
    if (!editPostId) return;

    const posts = JSON.parse(localStorage.getItem("postData")) || [];
    const postToEdit = posts.find(
      (p) => String(p.id) === String(editPostId)
    );

    if (postToEdit) {
      setCreatePostFormData({
        title: postToEdit.title,
        body: postToEdit.body,
        image: postToEdit.image,
      });
    }
  }, [editPostId]);

  const handleImageChange = (file) => {
    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
    if (!allowedTypes.includes(file.type)) {
      setErrors((e) => ({
        ...e,
        image: "Only JPG, JPEG, PNG images are allowed",
      }));
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setCreatePostFormData({
        ...createPostFormData,
        image: reader.result,
      });
      setErrors((e) => ({ ...e, image: "" }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newErrors = {};
    if (!createPostFormData.title.trim())
      newErrors.title = "Title is required";
    if (!createPostFormData.body.trim())
      newErrors.body = "Body is required";
    if (!createPostFormData.image)
      newErrors.image = "Image is required";

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    const existingPosts =
      JSON.parse(localStorage.getItem("postData")) || [];

    setLoading(true); 

    if (editPostId) {
      const updatedPosts = existingPosts.map((p) =>
        String(p.id) === String(editPostId)
          ? { ...p, ...createPostFormData }
          : p
      );

      localStorage.setItem("postData", JSON.stringify(updatedPosts));
      toast.success("Post updated successfully!");

      setTimeout(() => {
        setLoading(false);
        navigate("/");
      }, 3000); 
      return;
    }

    const updatedPosts = [
      ...existingPosts,
      { id: uuidv4(), ...createPostFormData },
    ];

    localStorage.setItem("postData", JSON.stringify(updatedPosts));
    toast.success("Post created successfully!");

    setTimeout(() => {
      setLoading(false);
      navigate("/");
    }, 3000); 
  };

  return (
    <>
      {loading && <Loader />} 

      {/* <Snowfall snowflakeCount={100} color="#5a8af0" /> */}
      <ToastContainer />
      <div className={`newpost${ctx?.mode}`}>
      <div className="form-wrapper">
        <form onSubmit={handleSubmit}>
          <h1>{editPostId ? "Let's Edit Post" : "Let's Create New Post"}</h1>

          <input
            type="text"
            placeholder="Enter Title"
            value={createPostFormData.title}
            onChange={(e) => handleChange("title", e.target.value)}
          />
          {errors.title && <span className="error">{errors.title}</span>}

          <textarea
            placeholder="Enter Body"
            value={createPostFormData.body}
            onChange={(e) => handleChange("body", e.target.value)}
          />
          {errors.body && <span className="error">{errors.body}</span>}

          <input
            type="file"
            accept="image/jpeg,image/jpg,image/png"
            onChange={(e) => handleImageChange(e.target.files[0])}
          />
          {errors.image && <span className="error">{errors.image}</span>}

          {createPostFormData.image && (
            <img
              src={createPostFormData.image}
              alt="preview"
              style={{ marginTop: "10px" }}
            />
          )}

          <div>
            <button type="submit" disabled={loading}>
              {editPostId ? "Update Post" : "Add Post"}
            </button>

            {editPostId && (
              <button
                type="button"
                className="btn-cancel"
                onClick={() => navigate("/")}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>
      </div>
    </>
  );
}
