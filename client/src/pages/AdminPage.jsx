import { useContext, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import axios from "axios";
import { AdminContext } from "../AdminContext.jsx";

export default function AdminPage() {
  const [redirect, setRedirect] = useState(false);
  const { ready, admin, setAdmin } = useContext(AdminContext);

  const [users, setUsers] = useState([]);
  // useEffect(()=>{
  //   axios.get('/users').then(response =>{
  //       setUsers(response.data);
  //   });
  // }, []);
  
  if (!ready) {
    return "Loading...";
  }

  async function logout() {
    await axios.post("/logout");
    setAdmin(null);
    setRedirect(true);
  }

  if (redirect) {
    return <Navigate to={"/"} />;
  }

  return (
    <div>
        <div className="text-center ">
          Logged in as {admin.username} ({}) <br />
          <button onClick={logout} className="primary max-w-xs mt-10">
            {" "}
            Logout{" "}
          </button>
        </div>
    </div>
  );
}
