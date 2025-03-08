import { useState, useEffect } from 'react';

function BlockchainView() {
  const [blockchainData, setBlockchainData] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3000/blockchain')
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => setBlockchainData(data))
      .catch(error => console.error('Error fetching blockchain data:', error));
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Blockchain Data</h1>
      {blockchainData.length > 0 ? (
        <ul className="list-disc ml-4">
          {blockchainData.map((block, index) => (
            <li key={index}>
              <p><strong>Index:</strong> {block.index}</p>
              <p><strong>Timestamp:</strong> {block.timestamp}</p>
              <p><strong>Data:</strong> {JSON.stringify(block.data)}</p>
              <p><strong>Previous Hash:</strong> {block.previousHash}</p>
              <p><strong>Hash:</strong> {block.hash}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No blockchain data available</p>
      )}
    </div>
  );
}

export default BlockchainView;