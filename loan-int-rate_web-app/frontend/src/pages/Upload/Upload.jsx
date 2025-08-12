import React, { useState } from 'react';
import SideNav from '../../components/SideNav';
import { useDropzone } from 'react-dropzone';
import { FaUpload } from 'react-icons/fa';
import './Upload.css';

const Upload = () => {
  const [file, setFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState(null);

  const onDrop = (acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
      setUploadStatus(null);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'text/csv': ['.csv'] },
    multiple: false,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      alert('Please upload a CSV file.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    // eslint-disable-next-line no-undef
    const API_BASE_URL = process.env.NODE_ENV === 'production' ? '' : 'http://localhost:8001';

    try {
      const response = await fetch(`${API_BASE_URL}/api/upload`, {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });

      if (response.ok) {
        setUploadStatus('Upload successful!');
        setFile(null);
      } else {
        const error = await response.text();
        setUploadStatus(`Upload failed: ${error}`);
      }
    } catch (error) {
      setUploadStatus(`Upload error: ${error.message}`);
    }
  };

  return (
    <div className="layout">
      <SideNav />
      <main className="upload-content">
        <h1>Upload Loan Data CSV</h1>
        <p>Attach your loan data file in CSV format below.</p>

        <div
          {...getRootProps({ className: `dropzone ${isDragActive ? 'active' : ''}` })}
        >
          <input {...getInputProps()} />
          <FaUpload className="upload-icon" />
          {file ? (
            <p className="file-name">{file.name}</p>
          ) : (
            <p>Drag & drop your CSV file here, or click to select</p>
          )}
        </div>

        <button
          type="button"
          className="btn btn-primary"
          onClick={handleSubmit}
          disabled={!file}
        >
          Upload
        </button>

        {uploadStatus && (
          <div
            className={`upload-status ${
              uploadStatus.includes('successful') ? 'success' : 'error'
            }`}
          >
            {uploadStatus}
          </div>
        )}
      </main>
    </div>
  );
};

export default Upload;
