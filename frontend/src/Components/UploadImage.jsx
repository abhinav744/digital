import React, { useState } from "react";
import axios from "axios";

function UploadImage() {
  const [image, setImage] = useState(null);
  const [uploadedUrl, setUploadedUrl] = useState("");

  const handleFileChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!image) {
      alert("Please select an image first");
      return;
    }

    const formData = new FormData();
    formData.append("image", image);

    try {
      const res = await axios.post("http://localhost:4000/api/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setUploadedUrl(res.data.image_url); // ✅ backend returns Cloudinary URL
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ padding: "20px", border: "1px solid #ddd", borderRadius: "10px" }}>
      <h3>Upload Product Image</h3>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload} style={{ marginLeft: "10px" }}>
        Upload
      </button>

      {uploadedUrl && (
        <div style={{ marginTop: "20px" }}>
          <p>Preview:</p>
          <img src={uploadedUrl} alt="preview" width="200" />
        </div>
      )}
    </div>
  );
}

export default UploadImage;
