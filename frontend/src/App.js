import React, { useState, useRef } from "react";
import "./style.css";

function App() {
  const [files, setFiles] = useState([]);
  const [mode, setMode] = useState("ebook");
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const dropRef = useRef(null);

  const handleFiles = (selectedFiles) => {
    setFiles((prev) => [...prev, ...Array.from(selectedFiles)]);
  };

  const removeFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    dropRef.current.classList.add("drag-over");
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    dropRef.current.classList.remove("drag-over");
  };

  const handleDrop = (e) => {
    e.preventDefault();
    dropRef.current.classList.remove("drag-over");
    handleFiles(e.dataTransfer.files);
  };

  const handleUpload = async (action) => {
    if (files.length === 0) {
      alert("Please select files");
      return;
    }

    const formData = new FormData();
    files.forEach((file) => formData.append("files", file));
    formData.append("mode", mode);
    formData.append("action", action);

    setLoading(true);
    setProgress(0);

    try {
      const response = await fetch(
        `http://localhost:8000/process/?mode=${mode}&action=${action}`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) throw new Error("Server error");

      // Fake progress (since backend doesn't send real-time progress)
      let interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + 10;
        });
      }, 150);

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "result.pdf";
      a.click();

      setTimeout(() => {
        setProgress(0);
      }, 500);
    } catch (err) {
      alert("Error processing files: " + err.message);
      setProgress(0);
    }

    setLoading(false);
  };

  return (
    <div className="container">
      <div className="card">
        <h2>PDF Tool</h2>

        {/* Drag & Drop area */}
        <div
          ref={dropRef}
          className="drop-area"
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {files.length === 0 ? (
            "Drag & drop PDF files here or click to select"
          ) : (
            files.map((file, idx) => (
              <div key={idx} className="file-item">
                {file.name} ({(file.size / 1024).toFixed(2)} KB)
                <div className="file-actions">
                  <label className="add-file">
                    +
                    <input
                      type="file"
                      multiple
                      accept="application/pdf"
                      onChange={(e) => handleFiles(e.target.files)}
                    />
                  </label>
                  <span className="remove-file" onClick={() => removeFile(idx)}>
                    ×
                  </span>
                </div>
              </div>
            ))
          )}
          {files.length === 0 && (
            <input
              type="file"
              multiple
              accept="application/pdf"
              onChange={(e) => handleFiles(e.target.files)}
            />
          )}
        </div>

        {/* Mode selector */}
        <select value={mode} onChange={(e) => setMode(e.target.value)}>
          <option value="screen">Low (Small)</option>
          <option value="ebook">Medium</option>
          <option value="printer">High</option>
        </select>

        {/* Progress bar */}
        {loading && (
          <div className="progress-bar">
            <div className="progress" style={{ width: `${progress}%` }}></div>
          </div>
        )}

        {/* Action buttons */}
        <div className="button-group">
          <button onClick={() => handleUpload("compress")} disabled={loading}>
            {loading ? "Processing..." : "Compress"}
          </button>
          <button onClick={() => handleUpload("merge")} disabled={loading}>
            {loading ? "Processing..." : "Merge"}
          </button>
          <button
            onClick={() => handleUpload("merge_compress")}
            disabled={loading}
          >
            {loading ? "Processing..." : "Merge + Compress"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;