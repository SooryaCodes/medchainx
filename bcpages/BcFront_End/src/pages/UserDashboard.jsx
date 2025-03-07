import { useState, useEffect } from "react";

export default function PatientDashboard({ userId }) {
  const [previewFile, setPreviewFile] = useState(null);
  const [showBase64, setShowBase64] = useState(false);
  const [patientData, setPatientData] = useState(null);

  useEffect(() => {
    if (!userId) return;
    
    fetch(`/users/${userId}.json`)
      .then((response) => {
        if (!response.ok) throw new Error("User data not found");
        return response.json();
      })
      .then((data) => setPatientData(data))
      .catch((err) => console.error("Error loading patient data:", err));
  }, [userId]);

  const handleDownload = (file) => {
    if (!file?.base64) return;
    
    const link = document.createElement("a");
    link.href = file.base64;
    link.download = file.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePreviewNavigation = (direction) => {
    if (!previewFile || !patientData?.medicalHistory) return;
    
    const currentIndex = patientData.medicalHistory.findIndex(file => file.id === previewFile.id);
    if (direction === "prev" && currentIndex < patientData.medicalHistory.length - 1) {
      setPreviewFile(patientData.medicalHistory[currentIndex + 1]);
    } else if (direction === "next" && currentIndex > 0) {
      setPreviewFile(patientData.medicalHistory[currentIndex - 1]);
    }
  };

  const toggleBase64View = () => setShowBase64((prev) => !prev);

  if (!patientData) return <div className="text-center text-gray-600">Loading patient data...</div>;

  return (
    <div className="p-6 space-y-4">
      {/* Patient Info */}
      <div className="bg-white shadow-md p-4 rounded-lg text-center border">
        <h2 className="text-xl font-bold">{patientData.name}</h2>
        <p className="text-gray-500">Age: {patientData.age}</p>
        <p className="text-gray-600">{patientData.condition}</p>
        <p className="text-gray-600">Blood Type: {patientData.bloodType}</p>
        <p className="text-gray-600">Gender: {patientData.gender}</p>
        <p className="text-gray-600">Nationality: {patientData.nationality}</p>
      </div>

      {/* Medical History */}
      <div className="bg-white shadow-md p-4 rounded-md border">
        <h2 className="text-xl font-bold">Medical History</h2>
        <div className="flex flex-col space-y-2 mt-2">
          {patientData.medicalHistory?.length ? (
            patientData.medicalHistory.map((file) => (
              <div key={file.id} className="p-2 border rounded-lg shadow flex justify-between items-center text-sm">
                <div onClick={() => setPreviewFile(file)} className="cursor-pointer hover:text-blue-600">{file.name}</div>
                <button onClick={() => handleDownload(file)} className="text-blue-600">Download</button>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No medical history available.</p>
          )}
        </div>
      </div>

      {/* Preview Popup */}
      {previewFile && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-2xl shadow-lg max-w-md w-full relative">
            <button onClick={() => setPreviewFile(null)} className="absolute top-2 right-2 text-gray-500 hover:text-gray-700">✕</button>
            <h3 className="text-lg font-semibold text-center mb-4">{previewFile.name}</h3>
            <div className="flex items-center">
              <button onClick={() => handlePreviewNavigation("prev")} className="text-gray-500 hover:text-gray-700 text-4xl disabled:opacity-50 mr-4">◄</button>
              <div className="max-h-64 overflow-auto flex-1">
                {showBase64 ? (
                  <textarea className="w-full h-64 p-2 border rounded-md text-sm" value={previewFile.base64} readOnly />
                ) : previewFile.type.startsWith("image/") ? (
                  <img src={previewFile.base64} alt={previewFile.name} className="max-w-full h-auto" />
                ) : (
                  <iframe src={previewFile.base64} className="w-full h-64" title={previewFile.name} />
                )}
              </div>
              <button onClick={() => handlePreviewNavigation("next")} className="text-gray-500 hover:text-gray-700 text-4xl disabled:opacity-50 ml-4">►</button>
            </div>
            <div className="mt-2 text-center">
              <p className="text-sm text-gray-500">Uploaded: {previewFile.date}</p>
              <button onClick={toggleBase64View} className="mt-2 bg-gray-200 text-gray-700 px-3 py-1 rounded-md hover:bg-gray-300 text-sm">
                {showBase64 ? "Show Preview" : "Show Base64"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
