import React, { useState, useRef } from 'react';
import Tesseract from 'tesseract.js';

function OCRComponent({ mode, showAlert }) {
  const [file, setFile] = useState(null);
  const [text, setText] = useState("");
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef(null);

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type.startsWith('image/')) {
      setFile(droppedFile);
      handleOCR(droppedFile);
    } else {
      showAlert("Please drop a valid image file.", "danger");
    }
  };

  const handleFileUpload = (e) => {
    const uploadedFile = e.target.files[0];
    if (uploadedFile && uploadedFile.type.startsWith('image/')) {
      setFile(uploadedFile);
      handleOCR(uploadedFile);
    } else {
      showAlert("Please select a valid image file.", "danger");
    }
  };

  const handleOCR = (file) => {
    setProgress(0);
    setText("");
    Tesseract.recognize(
      file,
      'eng',
      {
        logger: (m) => {
          if (m.status === "recognizing text") {
            setProgress(Math.floor(m.progress * 100));
          }
        }
      }
    ).then(({ data: { text } }) => {
      setText(text);
      setProgress(100);
      showAlert("Text extraction completed!", "success");
    }).catch(err => {
      console.error(err);
      showAlert("OCR failed. Please try again.", "danger");
    });
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleCopyText = () => {
    if (text) {
      navigator.clipboard.writeText(text)
        .then(() => {
          showAlert("Text copied to clipboard!", "success");
        })
        .catch(() => {
          showAlert("Failed to copy text.", "danger");
        });
    }
  };

  return (
    <div className={`ocr-container ${mode}`}>
      <h1 style={{ color: mode === "dark" ? "white" : "#042743" }}>Image to Text (OCR)</h1>

      <div
        className="drop-zone"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onClick={() => fileInputRef.current.click()}
        style={{
          borderColor: mode === 'dark' ? '#555' : '#ccc',
          backgroundColor: mode === 'dark' ? '#333' : '#fafafa',
          color: mode === 'dark' ? '#fff' : '#333'
        }}
      >
        {file ? file.name : "Drag & Drop an image or Click to Upload"}
      </div>

      <input
        type="file"
        accept="image/*"
        onChange={handleFileUpload}
        style={{ display: "none" }}
        ref={fileInputRef}
      />

      {progress > 0 && (
        <div className="progress-bar">
          <div
            className="progress"
            style={{
              width: `${progress}%`,
              backgroundColor: mode === 'dark' ? '#4caf50' : '#007bff'
            }}
          ></div>
          <span>{progress}%</span>
        </div>
      )}

      {text && (
        <div className="output-section">
          <h2 style={{ color: mode === "dark" ? "white" : "#042743" }}>Extracted Text:</h2>
          <textarea
            value={text}
            rows="10"
            readOnly
            className={`output-text ${mode}`}
            style={{
              backgroundColor: mode === 'dark' ? '#13466e' : 'white',
              color: mode === 'dark' ? 'white' : '#042743'
            }}
          ></textarea>
          <button className="copy-btn" onClick={handleCopyText}>
            Copy Text
          </button>
        </div>
      )}
    </div>
  );
}

export default OCRComponent;
