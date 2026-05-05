import React, { useState } from "react";

function EditProfile() {
  const [bio, setBio] = useState("");
  const [skills, setSkills] = useState("");

  const token = localStorage.getItem("token");

  const handleUpdate = () => {
    fetch("http://localhost:8001/accounts/api/profile/update/", {
      method: "PATCH",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ bio, skills }),
    })
      .then((res) => res.json())
      .then((data) => alert("Profile updated"));
  };

  return (
    <div className="profile-container">
      <h2>Edit Profile</h2>

      <input placeholder="Bio" onChange={(e) => setBio(e.target.value)} />
      <input placeholder="Skills" onChange={(e) => setSkills(e.target.value)} />

      <button onClick={handleUpdate}>Save</button>
    </div>
  );
}

export default EditProfile;