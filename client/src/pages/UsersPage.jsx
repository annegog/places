import { useEffect, useState } from "react";
import ImageProfile from "../ImageProfile";
import axios from "axios";
import { Link } from "react-router-dom";

export default function UsersPage() {
    const [users, setUsers] = useState([]);
    useEffect(()=>{
      axios.get('/users').then(response =>{
          setUsers(response.data);
      });
    }, []);

    //maybe and all the places a host has must be deleted
    const handleDelete = (userId, username) => {
        if (window.confirm(`Are you sure, you want to delete user: ${username}`)) {
            axios.post('/delete-user', {userId});
            setUsers(users.filter((user) => user._id !== userId));
        } 
    }

    const handleAccept = (userId) => {

    }
    
    return (
        <div>    
            {users.length > 0 && users.map(user => (
                <div key={user._id} className="bg-gray-200  mb-2 rounded-xl flex justify-between">
                    <Link to={user._id} className="font-bold m-1 pl-2">
                        {/* <div className=""> */}
                            {user.profilephoto?.[0] && ( 
                                <ImageProfile
                                    className="rounded-3xl w-10 object-cover aspect-square"
                                    src={user.profilephoto?.[0]}
                                    alt="profile photo"
                                />
                                )}
                            {user.username}
                        {/* </div> */}
                    </Link>

                    <div className="items-center flex gap-1">
                        <div className="text-gray-700 text-sm pl-4">First Name: </div> {user.first_name}
                        <div className="text-gray-700 text-sm pl-4">Last Name: </div> {user.last_name}
                        <div className="text-gray-700 text-sm pl-4">Roles: </div> {user.host && user.tenant ? "host, tenant" : user.host? "host": user.tenant? "tenant":""}
                        {/* <div>{user.phone} </div>
                        <div>{user.email} </div>
                        <div>{user.profilephoto} </div> */}
                    </div>
                    

                    <div className="flex gap-3 items-center">
                        {!user.isApproved && (
                            <div className=""> {/*flex gap-3*/}
                                <button 
                                className="bg-green-700 text-sm text-white p-2 rounded-2xl flex" 
                                onClick={() => handleAccept(user._id)}>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                    </svg>
                                    Accept
                                </button>
                                {/* <button 
                                className="bg-green-700 text-sm text-white p-2 rounded-2xl flex" 
                                onClick={() => handleAccept(user._id)}>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                    </svg>
                                    Decline
                                </button> */}
                            </div>
                        )}
                        <div className="mr-3">
                            <button 
                                className="bg-red-600 text-sm text-white fit-content p-2 rounded-2xl flex" 
                                onClick={() => handleDelete(user._id, user.username)} >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                </svg>
                                delete
                            </button>
                        </div>
                        
                    </div> 
                    
                </div>
                
            ))}
         </div>
    );
};