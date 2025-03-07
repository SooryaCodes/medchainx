import { useState } from "react";

export default function DoctorDashboard() {
  const [token, setToken] = useState("");
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [previewFile, setPreviewFile] = useState(null);
  const [doctorNotes, setDoctorNotes] = useState("");

  const fakePatientData = {
    name: "John Doe",
    age: 45,
    condition: "Hypertension, Diabetes",
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

  const handleUpload = () => {
    if (!selectedFile) {
      alert("No file selected");
      return;
    }

    const newFile = {
      id: Date.now(),
      name: selectedFile.name,
      type: selectedFile.type,
      date: new Date().toLocaleString(),
      url: URL.createObjectURL(selectedFile),
      isUploaded: false,
    };

    setUploadedFiles([newFile, ...uploadedFiles]);
    setSelectedFile(null);
    alert("File added to history!");
  };

  const handleSaveNotes = () => {
    if (!doctorNotes.trim()) {
      alert("Note is empty");
      return;
    }

    const noteBlob = new Blob([doctorNotes], { type: "text/plain" });
    const noteFile = new File([noteBlob], `Doctor_Note_${Date.now()}.txt`, { type: "text/plain" });

    const newFile = {
      id: Date.now(),
      name: noteFile.name,
      type: "text/plain",
      date: new Date().toLocaleString(),
      url: URL.createObjectURL(noteFile),
      isUploaded: false,
    };

    setUploadedFiles([newFile, ...uploadedFiles]);
    setDoctorNotes("");
    alert("Doctor's note saved to history!");
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
                <button
                  onClick={handleUpload}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex-1"
                >
                  Add to History
                </button>
                <button
                  onClick={handleSaveNotes}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex-1"
                >
                  Save Note
                </button>
              </div>
            </div>
          </div>

          {/* File History Section */}
          <div className="bg-white shadow-md p-4 rounded-md mt-4 border">
            <h2 className="text-xl font-bold">File History</h2>
            <div className="flex flex-col space-y-2 mt-2">
              {uploadedFiles.length === 0 ? (
                <p className="text-gray-500 text-sm">No files in history</p>
              ) : (
                uploadedFiles.map((file) => (
                  <div
                    key={file.id}
                    className="p-2 border rounded-lg shadow cursor-pointer hover:bg-gray-100 flex justify-between items-center text-sm"
                    onClick={() => setPreviewFile(file)}
                  >
                    <div>
                      <p className="font-semibold">{file.name}</p>
                      <p className="text-xs text-gray-400">{file.date}</p>
                      <p className="text-xs text-blue-600">{file.isUploaded ? "Uploaded" : "Pending Upload"}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}