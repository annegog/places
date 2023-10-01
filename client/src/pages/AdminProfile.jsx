import { useContext, useEffect, useState } from "react";
import { AdminContext } from "../AdminContext";
import axios from "axios";
import { Navigate } from "react-router-dom";
import ImageProfile from "../ImageProfile";

export default function AdminProfile () {
  const {admin, setAdmin, ready} = useContext(AdminContext)

  const [allData, setAllData] = useState([]);
  const [xmlData, setXMLdata] = useState([]);

  const [edit, setEdit] = useState(false);

  const [first_name, setFirstName] = useState("");
  const [last_name, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [phone, setPhoneNumber] = useState("");
  const [profilephoto, setProfilePhoto] = useState([]);
  const [email, setEmail] = useState("");

  const [uploadedProfilePhoto, setUploadedProfilePhoto] = useState(true);

  const [current_password, setCurrentPassword] = useState("");
  const [new_password, setNewPassword] = useState("");
  const [confirm_password, setConfirmPassword] = useState("");
  const [currentPasswordsMatch, setCurrentPasswordsMatch] = useState(true);
  const [newPasswordsMatch, setNewPasswordsMatch] = useState(true);


  useEffect(()=> {
      axios.get('/JSON-data').then(response => {
          setAllData(response.data);
      });
      axios.get('/XML-data').then(response => {
          setXMLdata(response.data);
      });
  }, []);

  const exportToJSON = () => {
    const jsonData = JSON.stringify(allData, null, 2); // Convert data to JSON format with 2-space indentation
    // Create a Blob object containing the JSON data
    //A Blob is a binary large object that can represent data
    const blob = new Blob([jsonData], { type: "application/json" });
    
    // Create a download link and trigger the download
    const url = URL.createObjectURL(blob);
    const downloadLink = document.createElement("a");
    downloadLink.href = url;
    downloadLink.download = "FindYourPlace.json";
    document.body.appendChild(downloadLink);
    downloadLink.click();

    URL.revokeObjectURL(url); //revokes (deallocates) the blob URL
    document.body.removeChild(downloadLink); //cleans up the dynamically created anchor element
  };

  const exportToXML = () => {
      const blob = new Blob([xmlData], { type: "application/xml" });
  
      const url = URL.createObjectURL(blob);
      const downloadLink = document.createElement("a");
      downloadLink.href = url;
      downloadLink.download = "FindYourPlace.xml";
      document.body.appendChild(downloadLink);
      downloadLink.click();

      URL.revokeObjectURL(url);
      document.body.removeChild(downloadLink);
  };
/////-----------------------------

  useEffect(() => {
    // Check if user data is available from the context
    if (admin) {
      setFirstName(admin.first_name);
      setLastName(admin.last_name);
      setUsername(admin.username);
      setPhoneNumber(admin.phone);
      setEmail(admin.email);
      setProfilePhoto(admin.profilephoto);
    }
  }, [admin]);

  if (!ready) {
    return (
      <div className="flex justify-center items-center ">
        <div className="mt-20 text-lg text-white bg-gray-500 rounded-full w-fit px-4 py-1">
          Data Loading... Try to refresh!
        </div>
      </div>
    );
  }

  async function logout() {
    await axios.post("/logout");
    setAdmin(null);
  }

  if (admin === null){
    return <Navigate to={"/"} />;
  }

  const handleEdit = () => {
    setEdit(!edit);
  };

  async function updateAdmin (ev) {
    ev.preventDefault();
    try {
      await axios.post('/update-profile-admin', {
        first_name,
        last_name,
        username,
        phone,
        profilephoto,
        email,
      });
      window.location.reload();
    } catch (error) {
      alert(`Something went wrong with updating the profile's informations: "${error}"`);
    }
  };

  //----------------------------profile photo--------------------------------//
  function uploadPhoto(ev) {
    ev.preventDefault();
    try {
      const files = ev.target.files;
      const data = new FormData();
      for (let i = 0; i < files.length; i++) {
        data.append("profilephoto", files[i]);
      }
      axios.post("/upload-profilePhoto", data, {
          headers: { "Content-Type": "multipart/form-data" },
        })
        .then((response) => {
          const { data: filenames } = response;
          setProfilePhoto((prev) => {
            return [...prev, ...filenames];
          });
          console.log("Image uploaded from your device:", files);
        });
        setUploadedProfilePhoto(true);
    } catch (error) {
      console.error("Error uploading the photo from your device:", error);
    }
  }

  function removePhoto(filename){
    setProfilePhoto([...profilephoto.filter(profilephoto => profilephoto !== filename)]);
    setUploadedProfilePhoto(false);
  }

  const handleProfileSubmit = (ev) => {
    if (profilephoto.length === 0) {
      ev.preventDefault();
      setUploadedProfilePhoto(false);
    }
  };

  //---------------------------password----------------------------------//
  async function updatePassword (ev) {
    ev.preventDefault();
    try {
      await axios.post('/check-password-admin', {current_password}).then( async ({data}) => {
        if (data) {
          await axios.post('/change-password-admin', { 
            new_password
          });
          setCurrentPassword('');
          setNewPassword('');
          setConfirmPassword('');
          alert("Password changed succesfully!");
        }
        setCurrentPasswordsMatch(data);
      });
    } catch (error) {
      alert(`Something went wrong with changing the password: "${error}"`);
    }
  };

  async function handleCurrentPassword (ev) {
    const currentPassword = ev.target.value;
    setCurrentPassword(currentPassword);
  }

  const handlePasswordChange = (ev) => {
    const newPassword = ev.target.value;
    setNewPassword(newPassword);

    setNewPasswordsMatch(
      newPassword === confirm_password || confirm_password === ""
    );
  }

  const handleConfirmPasswordChange = (ev) => {
    const confirmPassword = ev.target.value;
    setConfirmPassword(confirmPassword);

    setNewPasswordsMatch(new_password === confirmPassword);
  }


  return (
      <div>
        <div className="mt-4 grow flex items-center justify-around">
        <div className="mt-34">
          <h1 className="text-3xl text-center mt-6">Personal Informations</h1>
          {!edit && (
            <div >
              <div className="grid gap-4 mb-2 md:grid-cols-1 mt-6 mb-6">

                <div>
                  <label
                    for="first_name"
                    className="block mb-2 text-sm font-medium text-gray-900" >
                    First name
                  </label>
                  <div className="bg-gray-50 border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 " >
                    {first_name}
                  </div>
                </div>
                  
                <div>
                  <label
                    for="last_name"
                    className="block mb-2 text-sm font-medium text-gray-900" >
                    Last name
                  </label>
                  <div className="bg-gray-50 border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 " >
                    {last_name}
                  </div>
                </div>

                <div>
                  <label
                    for="photo"
                    className="block mb-2 text-sm font-medium text-gray-900">
                    Profile Photo
                  </label>

                  {profilephoto?.[0] && ( 
                    <ImageProfile
                        className="w-full h-36 object-cover aspect-square rounded-lg"
                        src={profilephoto?.[0]}
                        alt="profile photo"
                    />
                  )}
                </div>

                <div>
                  <label
                    for="username"
                    className="block mb-2 text-sm font-medium text-gray-900">
                    Username
                  </label>
                  <div className="bg-gray-50 border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 " >
                    {username}
                  </div>
                </div>

                <div>
                  <label
                    for="phone"
                    className="block mb-2 text-sm font-medium text-gray-900">
                    Phone number
                  </label>
                  <div className="bg-gray-50 border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 " >
                    {phone}
                  </div>
                </div>

                <div className="">
                  <label
                    for="email"
                    className="block mb-2 text-sm font-medium text-gray-900">
                    Email address
                  </label>
                  <div className="bg-gray-50 border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 " >
                    {email}
                  </div>
                </div>

                <div>
                  <label
                    for="role"
                    className="block mb-2 text-sm font-medium text-gray-900">
                    Role
                  </label>
                  <div className="bg-gray-50 border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 " >
                    admin
                  </div>
                </div>

              </div>

            <button
              className="primary"
              onClick={() => handleEdit()}>
              Edit Profile
            </button>
            </div>
          )}

          {edit && (
            <div>
              <form onSubmit={updateAdmin}>
                <div className="grid gap-4 mb-2 md:grid-cols-1 mt-6 mb-6">

                  <div>
                    <label
                      for="first_name"
                      className="block mb-2 text-sm font-medium text-gray-900">
                      First name
                    </label>
                    <input
                      type="text"
                      id="first_name"
                      className="bg-gray-50 border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
                      value={first_name}
                      onChange={(ev) => setFirstName(ev.target.value)}
                      required
                    />
                  </div>
                    
                  <div>
                    <label
                      for="last_name"
                      className="block mb-2 text-sm font-medium text-gray-900">
                      Last name
                    </label>
                    <input
                      type="text"
                      id="last_name"
                      className="bg-gray-50 border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
                      value={last_name}
                      onChange={(ev) => setLastName(ev.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <label
                      for="photo"
                      className="block mb-2 text-sm font-medium text-gray-900">
                      Profile Photo
                    </label>

                    {profilephoto && profilephoto.length > 0 ? 
                      profilephoto.map((filename) => (
                          <div
                            className="h-32 flex relative cursor-pointer"
                            key={filename}>
                            <ImageProfile
                              className="rounded-3xl w-full object-cover aspect-square"
                              src={filename}
                              alt="image profile"/>
                            <button onClick={() => removePhoto(filename)} className="cursor-pointer absolute buttom-2 right-2 text-gray-400 bg-black bg-opacity-50 rounded-lg p-1 px-2">
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6" >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"/>
                              </svg>
                            </button>
                          </div>
                        )) : null}

                    {profilephoto && profilephoto.length === 0 ? (
                      <label className="cursor-pointer flex items-center justify-center border bg-transparent rounded-3xl p-10 text-sm text-gray-450">
                        <input
                          type="file"
                          className="hidden"
                          onChange={uploadPhoto}
                          required
                        />
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-7 h-7">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 8.25H7.5a2.25 2.25 0 00-2.25 2.25v9a2.25 2.25 0 002.25 2.25h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25H15m0-3l-3-3m0 0l-3 3m3-3V15"/>
                        </svg>
                      </label>
                    ) : null} 

                    {!uploadedProfilePhoto && (
                      <p className="mt-2 text-red-500 text-xs">Profile photo is required!</p>
                    )}
                  </div>

                  <div>
                    <label
                      for="username"
                      className="block mb-2 text-sm font-medium text-gray-900">
                      Username
                    </label>
                    <input
                      type="text"
                      id="username"
                      className=" bg-gray-50 border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
                      value={username}
                      onChange={(ev) => setUsername(ev.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <label
                      for="phone"
                      className="block mb-2 text-sm font-medium text-gray-900">
                      Phone number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      className="bg-gray-50 border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
                      value={phone}
                      onChange={(ev) => setPhoneNumber(ev.target.value)}
                      pattern="[0-9]{10}"
                      required
                    />
                  </div>

                  <div>
                    <label
                      for="email"
                      className="block mb-2 text-sm font-medium text-gray-900">
                      Email address
                    </label>
                    <input
                      type="email"
                      id="email"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                      value={email}
                      onChange={(ev) => setEmail(ev.target.value)}
                      required
                    />
                  </div>
                </div>
                
                <button
                  type="submit"
                  className="primary"
                  onClick={handleProfileSubmit}>
                  Save Changes
                </button>
              </form>
            </div>
          )}

          <div className="mt-12 mb-8">
            <h1 className="text-3xl text-center my-6">Change Password</h1>
            <form onSubmit={updatePassword}>
              <div>
                <label
                  for="current_password"
                  className="block mb-2 text-sm font-medium text-gray-900">
                  Current password
                </label>
                <input
                  type="password"
                  id="current_password"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
                  value={current_password}
                  onChange={handleCurrentPassword}
                  required
                />
                {!currentPasswordsMatch && (
                  <p className="text-red-500 text-xs">Your current passwords is wrong!</p>
                )}
              </div>

              <div>
                <label
                  for="new_password"
                  className="block mb-2 text-sm font-medium text-gray-900">
                  New password
                </label>
                <input
                  type="password"
                  id="new_password"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  value={new_password}
                  onChange={handlePasswordChange}
                  required
                />
                {!newPasswordsMatch && (
                  <p className="text-red-500 text-xs">Passwords do not match!</p>
                )}
              </div>

              <div>
                <label
                  for="confirm_password"
                  className="block mb-2 text-sm font-medium text-gray-900">
                  Confirm new password
                </label>
                <input
                  type="password"
                  id="confirm_password"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  value={confirm_password}
                  onChange={handleConfirmPasswordChange}
                  required
                />
                {!newPasswordsMatch && (
                  <p className="text-red-500 text-xs">Passwords do not match!</p>
                )}
              </div>

              <button
                type="submit"
                className="primary mt-4"
                disabled={!newPasswordsMatch}>
                Change password
              </button> 
            </form>

            
          </div>

          <div className="mt-12">
            <h1 className="text-3xl text-center">Export Website's Informations</h1>
            <div className="flex justify-center items-center mt-8">
              <button 
                  className="primary mr-5" 
                  onClick={exportToJSON}>Export to JSON
              </button>

              <button 
                  className="primary" 
                  onClick={exportToXML}>Export to XML
              </button>
            </div>
          </div>

          <div className="flex justify-center items-center mt-10">
            <button
              className="bg-red-700 text-white rounded-full py-2 px-6"
              onClick={logout}>
              Logout
            </button>
          </div>

        </div>
    </div>

          
      </div>
  );

}
