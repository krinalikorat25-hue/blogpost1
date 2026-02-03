import React, { useEffect, useState } from "react";
import "./EditProfileModal.css";

export default function EditProfileModal({ onClose, userId }) {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const loginData = JSON.parse(localStorage.getItem("loginData")) || {};

  const [formData, setFormData] = useState({
    fullName: "",
    mobilenumber: "",
    otp: "",
    role: ""
  });

  useEffect(() => {
    if (!userId) return;

    const fetchUser = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `https://696b4a91624d7ddccaa0b716.mockapi.io/users/${userId}`
        );

        if (!response.ok) throw new Error("HTTP error " + response.status);

        const data = await response.json();

        setFormData({
          fullName: data?.name || loginData?.fullName || "",
          mobilenumber: (data?.mobilenumber || loginData?.mobilenumber || "").toString(),
          otp: data?.otp || loginData?.otp || "",
          role: data?.role || loginData?.role || ""
        });
      } catch (err) {
        setError("Failed to load user data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError("");

      const response = await fetch(
        `https://696b4a91624d7ddccaa0b716.mockapi.io/users/${userId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: formData.fullName,
            mobilenumber: formData.mobilenumber,
            role: formData.role,
            otp: formData.otp
          })
        }
      );

      if (!response.ok) throw new Error("Save failed");

      const updated = await response.json();
      console.log("Updated user:", updated);

      localStorage.setItem(
        "loginData",
        JSON.stringify({
          ...loginData,
          fullName: formData.fullName,
          mobilenumber: formData.mobilenumber
        })
      );

      onClose();
    } catch (err) {
      setError("Failed to save user data. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <h2>Edit Profile</h2>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <>
            {error && <p style={{ color: "red" }}>{error}</p>}

            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Full Name"
            />

            <input
              type="text"
              name="mobilenumber"
              value={formData.mobilenumber}
              onChange={handleChange}
              placeholder="Mobile Number"
            />

            <input
              type="text"
              name="role"
              value={formData.role}
              disabled
              placeholder="Role"
            />

            <input
              type="text"
              name="otp"
              value={formData.otp}
              disabled
              placeholder="OTP"
            />

            <div className="modal-actions">
              <button
                onClick={onClose}
                disabled={saving}
                className="epm-btn-cancel"
              >
                Cancel
              </button>

              <button
                onClick={handleSave}
                disabled={saving}
                className="epm-btn-save"
              >
                {saving ? "Saving..." : "Save"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
