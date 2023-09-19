import { useEffect, useState } from "react";
import ImageProfile from "../ImageProfile";
import axios from "axios";
import { Link } from "react-router-dom";

export default function UsersPage() {
    const [users, setUsers] = useState([]);
    useEffect(() => {
        axios.get('/users').then(response => {
            setUsers(response.data);
        });
    }, []);

    //maybe and all the places a host has must be deleted
    const handleDelete = async (userId, username) => {
        if (window.confirm(`Are you sure, you want to DELETE user: ${username}`)) {
            await axios.post('/delete-user', {userId});
            // setUsers(users.filter((user) => user._id !== userId));
            const response = await axios.get('/users');
            setUsers(response.data);
        } 
    };

    const handleAccept = async (userId, username) => {
        if (window.confirm(`Are you sure, you want to ACCEPT host: ${username}`)) {
            await axios.post('/accept-host', {userId});
            // setUsers((prevUsers) => prevUsers.filter((user) => user._id !== userId));
            // setUsers(users.filter((user) => user._id !== userId));
            const response = await axios.get('/users');
            setUsers(response.data);
        } 
    };

    const handleDecline = async (userId, username) => {
        if (window.confirm(`Are you sure, you want to DECLINE host: ${username}`)) {
        }
    };
    
    return (
        //grid
        <div className="flex justify-center items-center ">
        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-4">   
            {users.length > 0 && users.map(user => (
                <div key={user._id} 
                    className="relative flex gap-4 bg-gray-100 p-4 rounded-2xl mb-4">
                    
                    <Link to={user._id} className="flex w-36 h-36 bg-gray-300 shrink-0 rounded-lg">
                        {user.profilephoto?.[0] && ( 
                            <ImageProfile
                                className="object-cover aspect-square rounded-lg"
                                src={user.profilephoto?.[0]}
                                alt="profile photo"
                            />
                        )}
                    </Link>

                    <div className="grow-0 shrink ">
                        <h2 className="text-xl">{user.username}</h2>
                        <div className="text-gray-700">
                            <text className="text-sm"> Fisrt Name:</text> {user.first_name} <br />
                            <text className="text-sm"> Last Name: </text> {user.last_name} <br />
                            <text className="text-sm"> Roles: </text> {user.host && user.tenant ? "host, tenant" : user.host? "host": user.tenant? "tenant":""} <br />
                            <text className="text-sm"> Phone Number: </text> {user.phone} <br />
                            <text className="text-sm"> Email: </text> {user.email} <br />
                        </div> 
                        {/* <text className="font-semibold">${} per night</text>
                        <p className="text-sm mt-2">{}</p> */}
                    </div> 
                    
                    <div className="ml-32">
                        {!user.isApproved && (
                            <div className="flex absolute top-2 right-2 "> 
                                <button 
                                    className="bg-green-700 text-sm text-white p-2 rounded-2xl flex mr-2" 
                                    onClick={() => handleAccept(user._id, user.username)}>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                    </svg>
                                    <text className="">Accept</text>
                                </button>

                                <button 
                                    className="bg-yellow-500 text-sm text-white p-2 rounded-2xl flex" 
                                    onClick={() => handleDecline(user._id, user.username)}>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                    Decline
                                </button> 
                            </div>
                        )}

                        <div className="absolute bottom-2 right-2">
                            <button 
                                className="bg-red-600 text-sm text-white fit-content p-2 rounded-2xl flex" 
                                onClick={() => handleDelete(user._id, user.username)} >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                </svg>
                                <text>delete</text>
                            </button>
                        </div>
                    </div>
                    
                </div>
            ))}
         </div>
         </div>
    );
};

// <div key={user._id} className="bg-gray-200  mb-2 rounded-xl flex justify-between">
//     <Link to={user._id} className="font-bold m-1 pl-2">
//         {/* <div className=""> */}
//             {user.profilephoto?.[0] && ( 
//                 <ImageProfile
//                     className="rounded-3xl w-10 object-cover aspect-square"
//                     src={user.profilephoto?.[0]}
//                     alt="profile photo"
//                 />
//                 )}
//             {user.username}
//         {/* </div> */}
//     </Link>

//     <div className="items-center flex gap-1">
//         <div className="text-gray-700 text-sm pl-4">First Name: </div> {user.first_name}
//         <div className="text-gray-700 text-sm pl-4">Last Name: </div> {user.last_name}
//         <div className="text-gray-700 text-sm pl-4">Roles: </div> {user.host && user.tenant ? "host, tenant" : user.host? "host": user.tenant? "tenant":""}
//         {/* <div>{user.phone} </div>
//         <div>{user.email} </div>
//         <div>{user.profilephoto} </div> */}
//     </div>
    

    // <div className="flex gap-3 items-center">
    //     {!user.isApproved && (
    //         <div className=""> {/*flex gap-3*/}
    //             <button 
    //             className="bg-green-700 text-sm text-white p-2 rounded-2xl flex" 
    //             onClick={() => handleAccept(user._id, user.username)}>
    //                 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
    //                     <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
    //                 </svg>
    //                 Accept
    //             </button>
    //             {/* <button 
    //             className="bg-green-700 text-sm text-white p-2 rounded-2xl flex" 
    //             onClick={() => handleAccept(user._id)}>
    //                 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
    //                     <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
    //                 </svg>
    //                 Decline
    //             </button> */}
    //         </div>
    //     )}
    //     <div className="mr-3">
    //         <button 
    //             className="bg-red-600 text-sm text-white fit-content p-2 rounded-2xl flex" 
    //             onClick={() => handleDelete(user._id, user.username)} >
    //             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
    //                 <path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
    //             </svg>
    //             delete
    //         </button>
    //     </div>
        
    // </div>