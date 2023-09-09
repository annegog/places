import { useEffect, useState } from "react";
import AdminNav from "../AdminNav"
import ImageProfile from "../ImageProfile";
import axios from "axios";
import { Link } from "react-router-dom";

export default function TenantsPage() {
    const [tenants, setTenants] = useState([]);
    useEffect(()=>{
      axios.get('/tenants').then(response =>{
        setTenants(response.data);
      });
    }, []);
    
    return (
        <div>
            <AdminNav />
            <div>
                {tenants.length > 0 && tenants.map(tenant => (
                    <Link to={tenant._id} className="bg-gray-500 mb-2 rounded-2xl flex space-x-2">
                        {/* <div>{tenant.profilephoto} </div> */}
                        {tenant.profilephoto?.[0] && ( 
                            <ImageProfile
                                className="rounded-3xl w-6 object-cover aspect-square"
                                src={tenant.profilephoto?.[0]}
                                alt="profile photo"
                            />
                            )}
                        <div>{tenant.first_name} </div>
                        <div>{tenant.last_name} </div>
                        <div>{tenant.tenantname}</div>
                        {!!tenant.host && (
                            <div>Is Host</div>
                        )}
                        {!!tenant.tenant && (
                            <div>Is Tenant</div>
                        )}
                        {/* <div>{tenant.phone} </div>
                            <div>{tenant.email} </div>
                            <div>{tenant.profilephoto} </div> */}
                    </Link>
                ))}
            </div>
        </div>
    );
};