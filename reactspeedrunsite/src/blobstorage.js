import { BlobServiceClient } from '@azure/storage-blob';

// Initialize the blob service client
const blobServiceClient = new BlobServiceClient(
  `https://${process.env.REACT_APP_STORAGE_ACCOUNT}.blob.core.windows.net/?${process.env.REACT_APP_STORAGE_SAS}`
);
const containerClient = blobServiceClient.getContainerClient(process.env.REACT_APP_STORAGE_CONTAINER);

export const uploadBlob = async (file) => {
  const blobName = `${Date.now()}-${file.name}`; // Unique blob name
  const blobClient = containerClient.getBlockBlobClient(blobName);
  await blobClient.uploadData(file, { blobHTTPHeaders: { blobContentType: file.type } });
  return blobName;
};

export const listBlobs = async () => {
  const blobItems = containerClient.listBlobsFlat();
  const blobs = [];
  for await (const blob of blobItems) {
    const blobClient = containerClient.getBlockBlobClient(blob.name);
    blobs.push({ name: blob.name, url: blobClient.url });
  }
  return blobs;
};

export const deleteBlob = async (blobName) => {
  const blobClient = containerClient.getBlockBlobClient(blobName);
  await blobClient.delete();
};
