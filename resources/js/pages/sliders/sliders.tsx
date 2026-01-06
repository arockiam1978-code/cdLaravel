import React, { useEffect, useState } from "react";
import axios from "axios";
import { Url } from "url";

interface Slider {
  id: number;
  title: string;
  link: string;
  image: string;
}

const SliderPage: React.FC = () => {
  const [sliders, setSliders] = useState<Slider[]>([]);
  const [title, setTitle] = useState("");
  const [link, setLink] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [editId, setEditId] = useState<number | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const API = "http://localhost:8000/sliders";
  const APILIST = "http://localhost:8000/api/sliders";

  // Load sliders
  const fetchSliders = async () => {
    const response = await axios.get(APILIST);
    console.log(response.data);
    setSliders(response.data);
    console.log("Sliders:", sliders);
  };

  useEffect(() => {
    fetchSliders();
  }, []);

  // Handle Image Change
  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImage(file);

      const url = URL.createObjectURL(file);
      setPreview(url);
    }
  };

  // Create or Update Slider
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", title);
    formData.append("link", link);
    if (image) formData.append("image", image);

    if (editId) {
      console.log("Updating slider with ID:", formData);
      await axios.patch(API + `/${editId}`, formData);
    } else {
      await axios.post(API, formData);
    }

    setTitle("");
    setLink("");
    setImage(null);
    setEditId(null);
    setPreview(null);

    fetchSliders();
  };

  // Edit slider
  const handleEdit = (slider: Slider) => {
    setEditId(slider.id);
    setTitle(slider.title);
    setLink(slider.link);
    setPreview(`${slider.image}`);
  };

  // Delete slider
  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure to delete?")) {
      await axios.delete(`${API}/${id}`);
      fetchSliders();
    }
  };

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: 20 }}>
      <h2>Slider CRUD</h2>

      {/* FORM */}
      <form onSubmit={handleSubmit} style={{ marginBottom: 30 }}>
        <input
          type="text"
          placeholder="Slider Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{ display: "block", marginBottom: 10, width: "100%", padding: 10 }}
        />

        <input
          type="text"
          placeholder="Slider Link"
          value={link}
          onChange={(e) => setLink(e.target.value)}
          style={{ display: "block", marginBottom: 10, width: "100%", padding: 10 }}
        />

        <input type="file" accept="image/*" onChange={handleImage} />

        {preview && (
          <img
            src={preview}
            alt="Preview"
            width="300"
            style={{ marginTop: 10, borderRadius: 8 }}
          />
        )}

        <button
          type="submit"
          style={{
            marginTop: 10,
            padding: "10px 20px",
            background: "#007bff",
            color: "#fff",
            border: "none",
            borderRadius: 5,
          }}
        >
          {editId ? "Update Slider" : "Add Slider"}
        </button>
      </form>

      {/* SLIDER LIST */}
      <h3>Existing Sliders</h3>
      <table width="100%" border={1} cellPadding={10}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Image</th>
            <th>Title</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {sliders.map((slider) => (
            <tr key={slider.id}>
              <td>{slider.id}</td>
              <td>
                <img
                  src={`${slider.image}`}
                  alt=""
                  width="150"
                />
              </td>
              <td>{slider.title}</td>
              <td>
                <button
                  onClick={() => handleEdit(slider)}
                  style={{ marginRight: 10 }}
                >
                  Edit
                </button>
                <button onClick={() => handleDelete(slider.id)}>Delete</button>
              </td>
            </tr>
          )
          )}
        </tbody>
      </table>
    </div>

  );
};

export default SliderPage;