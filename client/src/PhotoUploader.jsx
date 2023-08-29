import axios from "axios";
import { useState } from "react";
import Image from "./Image";

export default function PhotosUploader({ addedPhotos, onChange }) {
  const [photoLink, setPhotoLink] = useState([]);

  // upload photos by url
  async function addPhotoByLink(ev) {
    ev.preventDefault();
    try {
      const { data: filename } = await axios.post("/upload-by-link", {
        link: photoLink,
      });
      onChange((prev) => {
        return [...prev, filename];
      });
      console.log("Image uploaded:", filename.data);
    } catch (error) {
      console.error("Error uploading the image:", error);
    }
    setPhotoLink("");
  }

  // uploads photos from a device
  function uploadPhoto(ev) {
    ev.preventDefault();
    try {
      const files = ev.target.files;
      const data = new FormData();
      for (let i = 0; i < files.length; i++) {
        data.append("photos", files[i]);
      }
      axios
        .post("/upload-photos", data, {
          headers: { "Content-Type": "multipart/form-data" },
        })
        .then((response) => {
          const { data: filenames } = response;
          onChange((prev) => {
            return [...prev, ...filenames];
          });
          console.log("Image uploaded from your device:", files);
        });
    } catch (error) {
      console.error("Error uploading the photo from your device:", error);
    }
  }

  function removePhoto(filename){
    onChange([...addedPhotos.filter(photo => photo !== filename)]);
  }

  return (
    <>
      <div className="flex gap-2">
        <input
          type="text"
          value={photoLink}
          onChange={(ev) => setPhotoLink(ev.target.value)}
          placeholder={"Add using a link ... jpg"}
        />
        <button onClick={addPhotoByLink} className="add text-center">
          Add Photo
        </button>
      </div>

      <div className="mt-2 grid gap-2 grid-cols-3 lg:grid-cols-6 md:grid-cols-4">
        {addedPhotos &&
          addedPhotos.length > 0 &&
          addedPhotos.map((filename) => (
            <div className="h-32 flex relative" key={filename}>
              <Image
                className="rounded-2xl w-full object-cover"
                src={filename}
                alt=""
              />
              <button onClick={() => removePhoto(filename)} className="cursor-pointer absolute buttom-2 right-2 text-gray-400 bg-black bg-opacity-50 rounded-lg p-1 px-2">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5}
                  stroke="currentColor" className="w-6 h-6" >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                  />
                </svg>
              </button>
            </div>
          ))}
        <label className="cursor-pointer flex items-center justify-center border bg-transparent rounded-xl p-8 text-2xl text-gray-450 ">
          <input
            type="file"
            multiple
            className="hidden"
            onChange={uploadPhoto}
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="w-7 h-7"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 8.25H7.5a2.25 2.25 0 00-2.25 2.25v9a2.25 2.25 0 002.25 2.25h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25H15m0-3l-3-3m0 0l-3 3m3-3V15"
            />
          </svg>
          Upload
        </label>
      </div>
    </>
  );
}
