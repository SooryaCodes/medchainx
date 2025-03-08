import { useState } from "react";

export default function DoctorDashboard() {
  const [token, setToken] = useState("");
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState(new Set());
  const [previewFile, setPreviewFile] = useState(null);
  const [doctorNotes, setDoctorNotes] = useState("");
  const [serverFiles, setServerFiles] = useState([]);
  const [showPreviewModal, setShowPreviewModal] = useState(false); // New state for modal

  const fakePatientData = {
    name: "John Doe",
    age: 45,
    condition: "Hypertension, Diabetes",
    bloodType: "O+",
    gender: "Male",
    nationality: "American",
  };

  const handleAuth = () => {
    if (token === "token123") setIsAuthorized(true);
    else alert("Invalid Token");
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setSelectedFile(e.dataTransfer.files[0]);
  };

  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleUpload = async () => {
    let newFile;

    if (doctorNotes.trim()) {
      const textFile = new Blob([doctorNotes], { type: "text/plain" });
      newFile = {
        id: Date.now(),
        name: `Doctor_Notes_${Date.now()}.txt`,
        type: "text/plain",
        date: new Date().toLocaleString(),
        base64: await fileToBase64(textFile),
        isUploaded: false,
      };
      setDoctorNotes("");
    } else if (selectedFile) {
      newFile = {
        id: Date.now(),
        name: selectedFile.name,
        type: selectedFile.type,
        date: new Date().toLocaleString(),
        base64: await fileToBase64(selectedFile),
        isUploaded: false,
      };
      setSelectedFile(null);
    } else {
      alert("No file or text to upload");
      return;
    }

    setUploadedFiles((prev) => [newFile, ...prev]);
    alert("File added to history!");
  };

  const handleUploadToServer = () => {
    if (selectedFiles.size === 0) {
      alert("No files selected for upload");
      return;
    }

    setUploadedFiles((prevFiles) =>
      prevFiles.map((file) =>
        selectedFiles.has(file.id) ? { ...file, isUploaded: true } : file
      )
    );

    const uploaded = uploadedFiles.filter((file) => selectedFiles.has(file.id));
    setServerFiles((prev) => [...uploaded, ...prev]);

    setSelectedFiles(new Set());
    alert("Selected files uploaded to server!");
  };

  const toggleFileSelection = (fileId) => {
    setSelectedFiles((prev) => {
      const newSet = new Set(prev);
      newSet.has(fileId) ? newSet.delete(fileId) : newSet.add(fileId);
      return newSet;
    });
  };

  const deleteFile = (fileId) => {
    setUploadedFiles((prev) => prev.filter((file) => file.id !== fileId));
  };

  // New function to handle preview click
  const handlePreviewClick = (file) => {
    setPreviewFile(file.base64);
    setShowPreviewModal(true);
  };

  // New function to close modal
  const closePreviewModal = () => {
    setShowPreviewModal(false);
    setPreviewFile(null);
  };

  return (
    <div className="p-6 space-y-4">
      {!isAuthorized ? (
        <div className="flex flex-col items-center">
          <input
            type="password"
            placeholder="Enter Access Token"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            className="w-64 p-2 border rounded-md"
          />
          <button
            onClick={handleAuth}
            className="mt-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Authenticate
          </button>
        </div>
      ) : (
        <>
          {/* Patient Info and Upload Section */}
          <div className="flex space-x-4">
            <div className="bg-white shadow-md p-4 rounded-lg w-1/3 text-center border">
              <h2 className="text-xl font-bold">{fakePatientData.name}</h2>
              <p className="text-gray-500">Age: {fakePatientData.age}</p>
              <p className="text-gray-600">{fakePatientData.condition}</p>
              <p className="text-gray-600">Blood Type: {fakePatientData.bloodType}</p>
              <p className="text-gray-600">Gender: {fakePatientData.gender}</p>
              <p className="text-gray-600">Nationality: {fakePatientData.nationality}</p>
            </div>

            <div className="bg-white shadow-md p-4 rounded-lg w-2/3 border">
              <div
                className="border-dashed border-2 border-gray-400 p-10 text-center cursor-pointer rounded-md"
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
              >
                {selectedFile ? selectedFile.name : "Drop files here"}
              </div>
              <input type="file" onChange={handleFileChange} className="mt-2 hidden" id="fileInput" />
              <label htmlFor="fileInput" className="block text-center text-blue-600 cursor-pointer mt-2">
                Or Click to Select File
              </label>
              <textarea
                className="w-full h-20 p-2 border mt-4 rounded-md"
                placeholder="Type here..."
                value={doctorNotes}
                onChange={(e) => setDoctorNotes(e.target.value)}
              ></textarea>
              <div className="flex space-x-2 mt-3">
                <button onClick={handleUpload} className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex-1">
                  Add to History
                </button>
              </div>
            </div>
          </div>

          {/* File Sections */}
          <div className="flex space-x-4 mt-4">
            {/* File History */}
            <div className="bg-white shadow-md p-4 rounded-md border w-1/2">
              <h2 className="text-xl font-bold">File History</h2>
              <button
                onClick={handleUploadToServer}
                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 mb-2"
              >
                Upload Selected
              </button>
              <div className="flex flex-col space-y-2 mt-2">
                {uploadedFiles.map((file) => (
                  <div key={file.id} className="p-2 border rounded-lg shadow flex justify-between items-center text-sm">
                    <input type="checkbox" checked={selectedFiles.has(file.id)} onChange={() => toggleFileSelection(file.id)} />
                    <span 
                      onClick={() => handlePreviewClick(file)} 
                      className="cursor-pointer hover:text-blue-600 flex-1 mx-2"
                    >
                      {file.name}
                    </span>
                    <button onClick={() => deleteFile(file.id)} className="text-red-600">Delete</button>
                  </div>
                ))}
              </div>
            </div>

            {/* Medical Records */}
            <div className="bg-white shadow-md p-4 rounded-md border w-1/2">
              <h2 className="text-xl font-bold">Medical Records</h2>
              {serverFiles.length > 0 ? serverFiles.map((file) => (
                <div key={file.id} className="p-2 border rounded-lg shadow text-sm">
                  <span className="cursor-pointer hover:text-blue-600">{file.name}</span>
                </div>
              )) : <p className="text-gray-500 text-center">No files uploaded yet.</p>}
            </div>
          </div>

          {/* Preview Modal */}
          {showPreviewModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded-lg max-w-2xl max-h-[80vh] overflow-auto">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-bold">File Preview</h3>
                  <button 
                    onClick={closePreviewModal}
                    className="text-gray-600 hover:text-gray-800"
                  >
                    ×
                  </button>
                </div>
                {previewFile && (
                  <div>
                    {previewFile.startsWith('data:image') ? (
                      <img src={previewFile} alt="Preview" className="max-w-full h-auto" />
                    ) : previewFile.startsWith('data:text') ? (
                      <pre className="whitespace-pre-wrap">{atob(previewFile.split(',')[1])}</pre>
                    ) : (
                      <p>Preview not available for this file type</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};