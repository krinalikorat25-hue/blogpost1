import { useEffect, useState } from "react";
import "./ExplorePost.css";
import { FaSearch } from "react-icons/fa";
import Card from "../components/Card";
import { Pagination } from "./Pagination";

export default function ExplorePost() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const loginData = localStorage.getItem("logindata");
  const loggedInUserData = loginData ? JSON.parse(loginData) : null;
  const isAdmin = loggedInUserData?.Role === "admin" || loggedInUserData?.role === "admin";

  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [title, setTitle] = useState("");
  const [titlevalidation, settitlevalidation] = useState("");
  const [body, setBody] = useState("");
  const [bodyvalidation, setbodyvalidation] = useState("");
  const [editingId, setEditingId] = useState(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [postToDelete, setPostToDelete] = useState(null);

  const startIndex = (currentPage - 1) * pageSize;
  const totalPages = Math.ceil(filteredPosts.length / pageSize);

  const handlePageSizeChange = (value) => {
    setPageSize(Number(value));
    setCurrentPage(1);
  };

  // API માંથી લેટેસ્ટ ડેટા ખેંચવાનું ફંક્શન
  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await fetch("https://696b4a91624d7ddccaa0b716.mockapi.io/blogpost");
      if (!response.ok) {
        alert("Failed to fetch data!");
        return;
      }
      const data = await response.json();
      const reverseData = [...data].reverse(); 
      setPosts(reverseData);
      setFilteredPosts(reverseData);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearch(value);
    const result = posts.filter(
      (item) =>
        item.title.toLowerCase().includes(value.toLowerCase()) ||
        item.body.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredPosts(result);
    setCurrentPage(1);
  };

  const fetchPostById = async (id) => {
    try {
      const response = await fetch(`https://696b4a91624d7ddccaa0b716.mockapi.io/blogpost/${id}`);
      if (response.ok) {
        const singlePost = await response.json();
        setTitle(singlePost.title);
        setBody(singlePost.body);
        setEditingId(id);
        setShowForm(true);
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    } catch (error) {
      console.error("Error fetching post by ID:", error);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (isSubmitting) return;

    if (!title) settitlevalidation("Title is required");
    if (!body) setbodyvalidation("Body is required");
    if (!title || !body) return;

    try {
      setIsSubmitting(true);
      const url = editingId
        ? `https://696b4a91624d7ddccaa0b716.mockapi.io/blogpost/${editingId}`
        : "https://696b4a91624d7ddccaa0b716.mockapi.io/blogpost";

      const method = editingId ? "PUT" : "POST";

      const response = await fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title,
          body: body,
          image: `https://picsum.photos/seed/${editingId || Date.now()}/300/200`,
        }),
      });

      if (response.ok) {
        alert(editingId ? "Post updated successfully!" : "Post added successfully!");
        handleCancel(); 
        // ફોર્મ સબમિટ થયા પછી તરત લિસ્ટ અપડેટ કરવા માટે
        await fetchData(); 
      } else {
        alert("Error while processing data!");
      }
    } catch (error) {
      console.error("Error saving post:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const openDeleteModal = (id) => {
    setPostToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    try {
      const response = await fetch(`https://696b4a91624d7ddccaa0b716.mockapi.io/blogpost/${postToDelete}`, {
        method: "DELETE",
      });
      if (response.ok) {
        alert("Deleted Successfully!");
        setIsDeleteModalOpen(false);
        setPostToDelete(null);
        // ડીલીટ થયા પછી તરત લિસ્ટ અપડેટ કરવા માટે
        await fetchData(); 
      }
    } catch (err) {
      console.error("Delete Error:", err);
    }
  };

  const handleCancel = () => {
    setTitle("");
    setBody("");
    settitlevalidation("");
    setbodyvalidation("");
    setEditingId(null);
    setShowForm(false);
  };

  return (
    <>
      <div className="explore-posts">
        <h1>Explore Posts</h1>
        <div className="search-box-wrapper">
          <FaSearch className="search-icon" />
          <input
            type="text"
            className="input-box"
            placeholder="Search Posts"
            value={search}
            onChange={handleSearch}
          />
        </div>
      </div>

      {isDeleteModalOpen && (
        <div className="modal-overlay">
          <div className="delete-modal">
            <h2>Delete Post?</h2>
            <p>Are you sure you want to delete this post? This action cannot be undone.</p>
            <div className="modal-buttons">
              <button className="btn-cancel-modal" onClick={() => setIsDeleteModalOpen(false)}>
                Cancel
              </button>
              <button className="btn-delete-modal" onClick={confirmDelete}>
                 Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="ex">
        {isAdmin && !showForm && (
          <button className="crete" onClick={() => setShowForm(true)}>
            Create Form
          </button>
        )}

        {showForm && (
          <div className="form-container">
            <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
              {editingId ? "Edit Post" : "Create New Post"}
            </h2>
            
            <div style={{ display: "flex", flexDirection: "column", width: "100%", marginBottom: "20px" }}>
              <input
                type="text"
                placeholder="Enter Title"
                className="form-input-field"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  settitlevalidation("");
                }}
              />
              {titlevalidation && <p style={{ color: "red", fontSize: "12px", margin: "5px 0" }}>{titlevalidation}</p>}
            </div>

            <div style={{ display: "flex", flexDirection: "column", width: "100%", marginBottom: "20px" }}>
              <input
                type="text"
                placeholder="Enter Body"
                className="form-input-field"
                value={body}
                onChange={(e) => {
                  setBody(e.target.value);
                  setbodyvalidation("");
                }}
              />
              {bodyvalidation && <p style={{ color: "red", fontSize: "12px", margin: "5px 0" }}>{bodyvalidation}</p>}
            </div>

            <div className="group">
              <button className="submit" onClick={handleSubmit} disabled={isSubmitting}>
                {editingId ? "Update" : "Submit"}
              </button>
              <button className="cancel" onClick={handleCancel}>Cancel</button>
            </div>
          </div>
        )}
      </div>

      <div className="card-container">
        {loading ? (
          <p style={{ textAlign: "center" }}>Loading...</p>
        ) : filteredPosts.length > 0 ? (
          filteredPosts.slice(startIndex, startIndex + pageSize).map((item) => (
            <Card
              key={item.id}
              title={item.title}
              desc={item.body}
              id={item.id}
              image={item.image}
              from={"explore"}
              isAdmin={isAdmin}
              onDelete={() => openDeleteModal(item.id)}
              onEdit={() => fetchPostById(item.id)}
              onRedirect={() => fetchPostById(item.id)}
            />
          ))
        ) : (
          <p style={{ textAlign: "center" }}>No posts found.</p>
        )}
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPrev={() => setCurrentPage((p) => Math.max(p - 1, 1))}
        onNext={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
        onPageSizeChange={handlePageSizeChange}
      />
    </>
  );
}