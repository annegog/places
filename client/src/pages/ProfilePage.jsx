import { useContext, useState } from "react";
import { UserContext } from "../UserContext.jsx";
import { Navigate } from "react-router-dom";
import axios from "axios";
import ImageProfile from "../ImageProfile";

export default function ProfilePage() {
  const [redirect, setRedirect] = useState(false);
  const { ready, user, setUser } = useContext(UserContext);

    if (!ready) {
        return "Loading...";
    }
    
     async function logout() {
        await axios.post("/logout");
        setUser(null);
        setRedirect(true);
     }
    
    if (redirect) {
        return <Navigate to={"/"} />;
    }

    return (
        <div className=""> {/*flex justify-center items-center && max-w-sm*/}
          <div className="text-center ">

            <div className="font-bold bg-gray-300 rounded-3xl py-6 mb-10">
              Profile Photo
              {user.profilephoto?.[0] && ( 
                <div className="flex justify-center items-center mt-2">
                  <ImageProfile
                      className="rounded-3xl w-40 object-cover aspect-square"
                      src={user.profilephoto?.[0]}
                      alt="profile photo"
                  />
                </div>
              )}
            </div>

            <div className=" bg-gray-300 rounded-full py-2 mb-5 "> 
              <span className="font-bold mr-1"> Username: </span> {user.username}
            </div> 

            <div className=" bg-gray-300  rounded-full py-2 mb-5"> 
              <span className="font-bold mr-1"> Fisrt Name: </span> {user.first_name}
            </div>
            
            <div className=" bg-gray-300  rounded-full py-2 mb-5"> 
              <span className="font-bold mr-1"> Last Name: </span> {user.last_name}
            </div>

            <div className=" bg-gray-300  rounded-full py-2 mb-5"> 
              <span className="font-bold mr-1"> Email: </span> {user.email}
            </div>

            <div className=" bg-gray-300  rounded-full py-2 mb-5"> 
              <span className="font-bold mr-1"> Phone Number: </span> {user.phone}
            </div>
            
            {/* <div className="font-bold">
              Role??
            </div> */}
            <button
              className="primary max-w-fit "
              onClick>
              Edit Profile
            </button>
          </div>

          <div className="text-center mt-10">

            <div className=" bg-gray-300 rounded-full py-2 mb-5 "> 
              <label 
                className="font-bold mr-1"
                for="">
                  Current Password:
              </label>
              <input 
                className="max-w-fit"
                type="text" />
            </div> 

            <div className=" bg-gray-300 rounded-full py-2 mb-5 "> 
              <label 
                className="font-bold mr-1"
                for="">
                  New Password:
              </label>
              <input 
                className="max-w-fit"
                type="text" />
            </div> 
            
            <button
              className="primary max-w-fit "
              onClick>
              Change password
            </button>
          </div>
          
          <div className="flex justify-end">
            <button
              className="primary max-w-fit mt-5"
              onClick={logout}>
              Logout
            </button>
          </div>
        </div>
        
    );
}