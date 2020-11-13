import React, { useState } from 'react';
import axios from 'axios';
axios.defaults.timeout=100000000;
const FileUpload=() => {
  const [file, setFile] = useState<FileList | null>(null);

  const submitFile = async () => {
    try {
      if (!file) {
        throw new Error('Select a file first!');
      }
      const formData = new FormData();
      formData.append('file', file[0]);
      // await axios.post(`http://localhost:9000/test-upload`, formData, {
      //   headers: {
      //     'Content-Type': 'multipart/form-data',
      //   },
    
      axios({
        method: 'post',
        url:`http://localhost:9000/test-upload`  ,
       
        headers: {
            'Content-Type': 'multipart/form-data',
        },
        data : formData
      });
  
      // handle success
    } catch (error) {
      // handle error
      alert(error.message)
    }
  };

  return (
    <form onSubmit={submitFile}>
      <label>Upload file</label>
      <input type="file" onChange={event => setFile(event.target.files)} />
      <button type="submit">Send</button>
    </form>
  );
};

export default FileUpload;
