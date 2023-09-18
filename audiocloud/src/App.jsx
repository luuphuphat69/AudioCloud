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
    mini: false,
    autoplay: false,
    theme: '#FADFA3',
    loop: 'all',
    order: 'random',
    preload: 'auto',
    volume: 0.7,
    mutex: true,
    listFolded: false,
    listMaxHeight: 90,
    lrcType: 3,
    audio: [{
      name: 'name',
      artist: 'artist',
      // AudioURL MongoDb
      url: 'https://storage.googleapis.com/hosting-audio-398017.appspot.com/audio/VCC%20TOSKA%20x%20TRUNGNG%20-%20ROLE%20MODELS%20%28ft.%20VCC%20LEFT%20HAND%29.mp3?GoogleAccessId=firebase-adminsdk-rr6x7%40hosting-audio-398017.iam.gserviceaccount.com&Expires=4102419600&Signature=sqEhQt7lkG3Pa6o8J3JmhmWCDkp8ekQScfLYcliJQ%2Fw79awoMgL0T1Epl7kOyuT2fa%2F6G9wbwyLaarQDaTuaVnQZaZso96sJWD5b%2Bih2VNgU5faIqHwVdhAiFuZanhTazYRWvIYL2schlbQFQXbdDZYAhYZF8QImSpzmB%2F7GQSdLdiJINB2lmv4WpaTlG4AYNp%2BUI8sJqt6xR2RuKvmZEJjnWsaMweQFXYd0qffQEibdF%2BqedPbk3NVKKyaZkEdELTWaAB7vwXmopRMco0v90mD%2FMWYCKfl%2FoapoYQR4D%2FiiaMRU66aNTtqoOsgvhKCFtizmeDeWIBc6ikoN%2BpP45Q%3D%3D',
      cover: 'https://www.elle.vn/wp-content/uploads/2017/07/25/hinh-anh-dep-1.jpg'
  
    },{
      artist: "song 1",
      url:'https://storage.googleapis.com/hosting-audio-398017.appspot.com/audio/Song.MP3?GoogleAccessId=firebase-adminsdk-rr6x7%40hosting-audio-398017.iam.gserviceaccount.com&Expires=4102419600&Signature=BvyiQoXBNnQ%2B1eHknCJtiuCSlf5%2F6rCOvg7qQMX2DPs1E67lCVpQRDbw1D9NbNLSKgw2iUEOHri6j%2FhJxC8YOno7tIdhzmbjeQ691aJWWhAuDV0%2FEcalr7gl9vm7%2FKte83X0x7oBIB0bA1gK0SKv5J2RKVZNYiK8MWJPDY937tgajVufuvD2VwnsvKkZy81QqlmMs7yq%2FBgRWCOHkzyNPGZ%2Fm%2BF%2FdnjptSH3TuRiwYRIxqY8hp%2Fxstl5Oio2FYfXLGKRakEH9SOaQ5EOXucYs2SZC2VktnwBAqBXTu9S1AngQrVjrRZYYh1yiW2JYWXLPP4hsRhdZhjvnWsMArXHcw%3D%3D',
      cover:'https://www.elle.vn/wp-content/uploads/2017/07/25/hinh-anh-dep-1.jpg'
    }
  ]
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
