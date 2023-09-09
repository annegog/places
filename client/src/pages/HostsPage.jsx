import { useEffect, useState } from "react";
import AdminNav from "../AdminNav"
import ImageProfile from "../ImageProfile";
import axios from "axios";
import { Link } from "react-router-dom";

export default function HostsPage() {
    const [hosts, setHosts] = useState([]);
    useEffect(()=>{
      axios.get('/hosts').then(response =>{
          setHosts(response.data);
      });
    }, []);

    return (
       <div>
            <AdminNav />
            <div>
                {hosts.length > 0 && hosts.map(host => (
                    <Link to={host._id} className="bg-gray-500 mb-2 rounded-2xl flex space-x-2">
                        {/* <div>{host.profilephoto} </div> */}
                        {host.profilephoto?.[0] && ( 
                            <ImageProfile
                                className="rounded-3xl w-6 object-cover aspect-square"
                                src={host.profilephoto?.[0]}
                                alt="profile photo"
                            />
                            )}
                        <div>{host.first_name} </div>
                        <div>{host.last_name} </div>
                        <div>{host.hostname}</div>
                        {!!host.host && (
                            <div>Is Host</div>
                        )}
                        {!!host.tenant && (
                            <div>Is Tenant</div>
                        )}
                        {/* <div>{host.phone} </div>
                            <div>{host.email} </div>
                            <div>{host.profilephoto} </div> */}
                    </Link>
                ))}
            </div>
        </div>
    );
};