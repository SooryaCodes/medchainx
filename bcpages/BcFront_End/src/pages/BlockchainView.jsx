import React, { useEffect, useState } from "react";

const BlockchainView = () => {
  const [blockchain, setBlockchain] = useState([]);

  useEffect(() => {
    const fetchBlockchain = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/patient/get-blockchain");
        if (!response.ok) throw new Error("Failed to fetch blockchain data");
        const data = await response.json();
        setBlockchain(data);
      } catch (error) {
        console.error("Error fetching blockchain data:", error);
      }
    };

    fetchBlockchain();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Blockchain Data</h1>
      {blockchain.length === 0 ? (
        <p>Loading blockchain data...</p>
      ) : (
        <ul className="list-disc ml-4">
          {blockchain.map((block, index) => (
            <li key={index} className="mb-4">
              <p><strong>Index:</strong> {block.index}</p>
              <p><strong>Timestamp:</strong> {block.timestamp}</p>
              <p><strong>Data:</strong> {JSON.stringify(block.data)}</p>
              <p><strong>Previous Hash:</strong> {block.previousHash}</p>
              <p><strong>Hash:</strong> {block.hash}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default BlockchainView;