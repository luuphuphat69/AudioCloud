import React, { useEffect, useState } from 'react';
import APlayer from 'aplayer';
import 'aplayer/dist/APlayer.min.css'
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

  const player = new APlayer({
    container: document.getElementById('aplayer'),
    audio: [{
      name: 'name',
      artist: 'artist',
      // AudioURL MongoDb
      url: 'https://storage.googleapis.com/hosting-audio-398017.appspot.com/audio/Di%C3%A1%C2%BB%C2%85m%20X%C3%86%C2%B0a.mp3?GoogleAccessId=firebase-adminsdk-rr6x7%40hosting-audio-398017.iam.gserviceaccount.com&Expires=4102419600&Signature=h2S%2FCKmi4p2PyG1THDZnWgIY%2FLFqPidWW1xHoZ2b7A6b95vr3JARBndrHqFQZySxjmkFyL%2FokNRr1rkijCq0Mq9qsDKgs8ZVFjzyDCPF7qxWqA%2BLmay5zSLTal3cb5w3wNuRlm8MOL1iRMUWwxQC1iAVgJ5S1loOgGpO9UDBqIo%2F1kC1uDzeg%2F1f%2FOXxMHPpGEFdG%2FdXjCnRW18b%2BO6EPGn21yiZIu4%2Bz2pClzs0D8JmBTsK1Y5QZ6IeSWm53AwSdHJutnYyxusnfYzmJL4DYEOjlg66kjTzslg5amg2JDPN%2Bxe2FFlY484NsJlIQ%2B6TLzf33QACpMgmyV2XFmZn3A%3D%3D',
      cover: 'https://www.elle.vn/wp-content/uploads/2017/07/25/hinh-anh-dep-1.jpg'
  }]
  });

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

      <div id="aplayer"></div>

      <h1>File Upload</h1>
      <input
        type="file"
        accept=".wav, .flac, .mp3, .aiff, .alac"
        onChange={handleFileInputChange}/>
      <button onClick={handleFileUpload}>Upload File</button>
    </div>
  );
}

export default App;
