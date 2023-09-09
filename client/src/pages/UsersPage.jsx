import { useEffect, useState } from "react";
import AdminNav from "../AdminNav"
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
    
    return (
        <div>
            <AdminNav />
            <div>
                {users.length > 0 && users.map(user => (
                    <Link to={user._id} className="bg-gray-500 mb-2 rounded-2xl flex space-x-2">
                        {/* <div>{user.profilephoto} </div> */}
                        {user.profilephoto?.[0] && ( 
                            <ImageProfile
                                className="rounded-3xl w-6 object-cover aspect-square"
                                src={user.profilephoto?.[0]}
                                alt="profile photo"
                            />
                            )}
                        <div>{user.first_name} </div>
                        <div>{user.last_name} </div>
                        <div>{user.username}</div>
                        {!!user.host && (
                            <div>Is Host</div>
                        )}
                        {!!user.tenant && (
                            <div>Is Tenant</div>
                        )}
                        {/* <div>{user.phone} </div>
                            <div>{user.email} </div>
                            <div>{user.profilephoto} </div> */}
                    </Link>
                ))}
            </div>
        </div>
    );
};