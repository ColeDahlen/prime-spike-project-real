import React from 'react';
import {useState} from 'react'
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';

// This is one of our simplest components
// It doesn't have local state
// It doesn't dispatch any redux actions or display any part of redux state
// or even care what the redux state is

function InfoPage() {

 
const dispatch = useDispatch();
let images = useSelector((store) => store.imagesReducer)
const [ fileInput , setFileInput ] = useState(null)
const onFileChange = (event) => {
     
  // Update the state
  setFileInput({ selectedFile: event.target.files[0] });
 
};
const handleUpload = (event) =>{
  event.preventDefault();
  const data = new FormData();
  data.append(
  'file', 
  fileInput.selectedFile,
  fileInput.selectedFile.name
  );
 console.log(fileInput.selectedFile)
  // console.log('*********', fileInput)
  console.log(data)
  dispatch({
    type: 'SEND_FILE',
    payload: data
  })
}
  return (
    <div className="container">
      <p>Info Page</p>
      <form onSubmit={handleUpload}>

        <input type="file" 
        placeholder='Upload File' 
        onChange={onFileChange}
        />

        <button type='submit'>Submit</button>
      </form>
      <img src={images.result.Location} />
    </div>
  );
}

export default InfoPage;
