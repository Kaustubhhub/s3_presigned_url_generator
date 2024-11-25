"use client"
import { useState } from "react";
import AWS from "aws-sdk";

export default function Home() {
  const [accessKeyId, setAccessKeyId] = useState("");
  const [secretAccessKey, setSecretAccessKey] = useState("");
  const [region, setRegion] = useState("");
  const [bucketName, setBucketName] = useState("");
  const [objectKey, setObjectKey] = useState("");
  const [presignedUrl, setPresignedUrl] = useState("");

  const generatePresignedUrl = async () => {
    try {
      if (!accessKeyId || !secretAccessKey || !region || !bucketName || !objectKey) {
        alert("Please fill in all fields!");
        return;
      }

      // Configure AWS SDK dynamically with user inputs
      const s3 = new AWS.S3({
        accessKeyId,
        secretAccessKey,
        region,
      });

      // Generate Presigned URL
      const params = {
        Bucket: bucketName,
        Key: objectKey,
        Expires: 60, // URL valid for 60 seconds
      };

      const url = await s3.getSignedUrlPromise("getObject", params);
      setPresignedUrl(url);
    } catch (error) {
      console.error("Error generating presigned URL:", error);
      alert("Failed to generate presigned URL. Please check your inputs!");
    }
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1>S3 Presigned URL Generator</h1>
      <div style={{ marginBottom: "10px" }}>
        <label>Access Key ID:</label>
        <input
          type="text"
          value={accessKeyId}
          onChange={(e) => setAccessKeyId(e.target.value)}
          placeholder="Enter AWS Access Key ID"
          style={{ marginLeft: "10px", width: "300px" }}
        />
      </div>
      <div style={{ marginBottom: "10px" }}>
        <label>Secret Access Key:</label>
        <input
          type="text"
          value={secretAccessKey}
          onChange={(e) => setSecretAccessKey(e.target.value)}
          placeholder="Enter AWS Secret Access Key"
          style={{ marginLeft: "10px", width: "300px" }}
        />
      </div>
      <div style={{ marginBottom: "10px" }}>
        <label>Region:</label>
        <input
          type="text"
          value={region}
          onChange={(e) => setRegion(e.target.value)}
          placeholder="Enter AWS Region (e.g., us-east-1)"
          style={{ marginLeft: "10px", width: "300px" }}
        />
      </div>
      <div style={{ marginBottom: "10px" }}>
        <label>Bucket Name:</label>
        <input
          type="text"
          value={bucketName}
          onChange={(e) => setBucketName(e.target.value)}
          placeholder="Enter S3 Bucket Name"
          style={{ marginLeft: "10px", width: "300px" }}
        />
      </div>
      <div style={{ marginBottom: "10px" }}>
        <label>Object Key:</label>
        <input
          type="text"
          value={objectKey}
          onChange={(e) => setObjectKey(e.target.value)}
          placeholder="Enter Object Key (e.g., folder/file.txt)"
          style={{ marginLeft: "10px", width: "300px" }}
        />
      </div>
      <button
        onClick={generatePresignedUrl}
        style={{
          padding: "10px 20px",
          backgroundColor: "#0070f3",
          color: "white",
          border: "none",
          cursor: "pointer",
          borderRadius: "5px",
        }}
      >
        Generate Presigned URL
      </button>
      {presignedUrl && (
        <div style={{ marginTop: "20px" }}>
          <h3>Generated Presigned URL:</h3>
          <textarea
            value={presignedUrl}
            readOnly
            style={{ width: "100%", padding: "10px" }}
          />
          <button
            onClick={() => navigator.clipboard.writeText(presignedUrl)}
            style={{
              marginTop: "10px",
              padding: "10px 20px",
              backgroundColor: "#28a745",
              color: "white",
              border: "none",
              cursor: "pointer",
              borderRadius: "5px",
            }}
          >
            Copy to Clipboard
          </button>
        </div>
      )}
    </div>
  );
}
