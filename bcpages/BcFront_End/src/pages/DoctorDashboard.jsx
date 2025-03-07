import { useState } from "react";

export default function DoctorDashboard() {
  const [token, setToken] = useState("");
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState(new Set());
  const [previewFile, setPreviewFile] = useState(null);
  const [doctorNotes, setDoctorNotes] = useState("");
  const [showBase64, setShowBase64] = useState(false); // New state for toggle

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
    if (!selectedFile) {
      alert("No file selected");
      return;
    }

    try {
      const base64Data = await fileToBase64(selectedFile);
      const newFile = {
        id: Date.now(),
        name: selectedFile.name,
        type: selectedFile.type,
        date: new Date().toLocaleString(),
        base64: base64Data,
        isUploaded: false,
      };

      setUploadedFiles([newFile, ...uploadedFiles]);
      setSelectedFile(null);
      alert("File added to history!");
    } catch (error) {
      console.error("Error converting file to Base64:", error);
      alert("Failed to process file");
    }
  };

  const handleSaveNotes = async () => {
    if (!doctorNotes.trim()) {
      alert("Note is empty");
      return;
    }

    const noteBlob = new Blob([doctorNotes], { type: "text/plain" });
    const noteFile = new File([noteBlob], `Doctor_Note_${Date.now()}.txt`, { type: "text/plain" });

    try {
      const base64Data = await fileToBase64(noteFile);
      const newFile = {
        id: Date.now(),
        name: noteFile.name,
        type: "text/plain",
        date: new Date().toLocaleString(),
        base64: base64Data,
        isUploaded: false,
      };

      setUploadedFiles([newFile, ...uploadedFiles]);
      setDoctorNotes("");
      alert("Doctor's note saved to history!");
    } catch (error) {
      console.error("Error converting note to Base64:", error);
      alert("Failed to save note");
    }
  };

  const handleDeleteFile = (fileId) => {
    setUploadedFiles(uploadedFiles.filter(file => file.id !== fileId));
    if (previewFile?.id === fileId) setPreviewFile(null);
  };

  const toggleFileSelection = (fileId) => {
    setSelectedFiles(prev => {
      const newSelection = new Set(prev);
      if (newSelection.has(fileId)) newSelection.delete(fileId);
      else newSelection.add(fileId);
      return newSelection;
    });
  };

  const handleUploadToServer = () => {
    if (selectedFiles.size === 0) {
      alert("No files selected for upload");
      return;
    }

    setUploadedFiles(prevFiles =>
      prevFiles.map(file =>
        selectedFiles.has(file.id) ? { ...file, isUploaded: true } : file
      )
    );
    setSelectedFiles(new Set());
    alert("Selected files uploaded to server!");
  };

  const handlePreviewNavigation = (direction) => {
    if (!previewFile) return;
    const currentIndex = uploadedFiles.findIndex(file => file.id === previewFile.id);
    if (direction === 'prev' && currentIndex < uploadedFiles.length - 1) {
      setPreviewFile(uploadedFiles[currentIndex + 1]);
    } else if (direction === 'next' && currentIndex > 0) {
      setPreviewFile(uploadedFiles[currentIndex - 1]);
    }
  };

  const toggleBase64View = () => {
    setShowBase64(prev => !prev);
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
            {/* Patient Info */}
            <div className="bg-white shadow-md p-4 rounded-lg w-1/3 text-center border">
              <h2 className="text-xl font-bold">{fakePatientData.name}</h2>
              <p className="text-gray-500">Age: {fakePatientData.age}</p>
              <p className="text-gray-600">{fakePatientData.condition}</p>
              <p className="text-gray-600">Blood Type: {fakePatientData.bloodType}</p>
              <p className="text-gray-600">Gender: {fakePatientData.gender}</p>
              <p className="text-gray-600">Nationality: {fakePatientData.nationality}</p>
            </div>

            {/* Upload & Notes Section */}
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
                <button onClick={handleSaveNotes} className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex-1">
                  Save Note
                </button>
              </div>
            </div>
          </div>

          {/* File History Section */}
          <div className="bg-white shadow-md p-4 rounded-md mt-4 border">
            <h2 className="text-xl font-bold">File History</h2>
            <button onClick={handleUploadToServer} className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 mb-2">
              Upload Selected
            </button>
            <div className="flex flex-col space-y-2 mt-2">
              {uploadedFiles.map((file) => (
                <div key={file.id} className="p-2 border rounded-lg shadow flex justify-between items-center text-sm">
                  <input type="checkbox" checked={selectedFiles.has(file.id)} onChange={() => toggleFileSelection(file.id)} />
                  <div onClick={() => setPreviewFile(file)} className="cursor-pointer hover:text-blue-600">{file.name}</div>
                  <button onClick={() => handleDeleteFile(file.id)} className="text-red-500">Delete</button>
                </div>
              ))}
            </div>
          </div>

          {/* Preview Popup */}
          {previewFile && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white p-4 rounded-2xl shadow-lg max-w-md w-full relative">
                <button
                  onClick={() => setPreviewFile(null)}
                  className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
                <h3 className="text-lg font-semibold text-center mb-4">{previewFile.name}</h3>
                <div className="flex items-center">
                  <button
                    onClick={() => handlePreviewNavigation('prev')}
                    className="text-gray-500 hover:text-gray-700 text-4xl disabled:opacity-50 mr-4"
                    disabled={uploadedFiles.findIndex(f => f.id === previewFile.id) === uploadedFiles.length - 1}
                  >
                    ◄
                  </button>
                  <div className="max-h-64 overflow-auto flex-1">
                    {showBase64 ? (
                      <textarea
                        className="w-full h-64 p-2 border rounded-md text-sm"
                        value={previewFile.base64}
                        readOnly
                      />
                    ) : previewFile.type.startsWith('image/') ? (
                      <img src={previewFile.base64} alt={previewFile.name} className="max-w-full h-auto" />
                    ) : (
                      <iframe src={previewFile.base64} className="w-full h-64" title={previewFile.name} />
                    )}
                  </div>
                  <button
                    onClick={() => handlePreviewNavigation('next')}
                    className="text-gray-500 hover:text-gray-700 text-4xl disabled:opacity-50 ml-4"
                    disabled={uploadedFiles.findIndex(f => f.id === previewFile.id) === 0}
                  >
                    ►
                  </button>
                </div>
                <div className="mt-2 text-center">
                  <p className="text-sm text-gray-500">Uploaded: {previewFile.date}</p>
                  <button
                    onClick={toggleBase64View}
                    className="mt-2 bg-gray-200 text-gray-700 px-3 py-1 rounded-md hover:bg-gray-300 text-sm"
                  >
                    {showBase64 ? "Show Preview" : "Show Base64"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}