import React, { useEffect, useState } from 'react';
import axios from 'axios'

function App() {
  const [data, setData] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const apiEndpoint = 'http://localhost:8000/v1/user/getAll'; // Default api end point

  useEffect(() => {
    // Fetch data from the API endpoint
    axios.get(apiEndpoint)
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, [apiEndpoint]);


  const handleFileInputChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleFileUpload = () => {
    if (selectedFile) {
      // Implement the backend route to handle the file upload.
      const formData = new FormData();
      formData.append('file', selectedFile);
      axios.post('http://localhost:8000/v1/audio/postAudio', formData, {
        headers:{
          'Content-Type': 'multipart/form-data',
        }
      }).then((response) => {
        console.log(response.data);
        alert('File uploaded successfully.');
      }).catch((error) => {
        console.log('Error uploading file:', error);
        alert('File upload failed.');
      });

      console.log('Uploading file:', selectedFile);
    } else {
      alert('Please select a file before uploading.');
    }
  };

  return (
    <div className="App">
      <h1>Data from Backend:</h1>
      <ul>
        {data.map((item) => (
          <li key={item._id}>
            {item.Displayname}
          </li>
        ))}
      </ul>
      
      <h1>Google Drive File Upload</h1>
      <input
        type="file"
        accept=".wav, .flac, .mp3, .aiff, .alac"
        onChange={handleFileInputChange}/>
      <button onClick={handleFileUpload}>Upload File</button>
    </div>
  );
}

export default App;
