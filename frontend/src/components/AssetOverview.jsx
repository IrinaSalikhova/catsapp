import React, { useEffect, useState } from 'react';

const FetchAssetDraft = () => {
  const [assetDraft, setAssetDraft] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAssetDraft = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/assetDrafts/1058`);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setAssetDraft(data);
      } catch (error) {
        console.error("Failed to fetch asset draft:", error);
        setError(`Failed to fetch asset draft: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchAssetDraft();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!assetDraft) return <p>No asset draft found</p>;

  return (
    <div>
      <h1>Asset Draft Details</h1>
      <p><strong>ID:</strong> {assetDraft.id}</p>
      <p><strong>Name:</strong> {assetDraft.name}</p>
      <p><strong>Description:</strong> {assetDraft.description}</p>
      {/* Add more details as needed */}
    </div>
  );
};

export default FetchAssetDraft;
