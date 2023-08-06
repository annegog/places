import { useContext, useState } from "react";
import { UserContext } from "../UserContext";
import { Link, Navigate, useParams } from "react-router-dom";
import axios from "axios";

export default function AccountPage(){
    const {user, setUser, ready} = useContext(UserContext);
    const [redirect, setRedirect] = useState(false);

    let {subpage} = useParams();

    if (subpage === undefined) {
        subpage = 'profile';
    }

    // if(!ready) {
    //     return 'Loading your data..!';
    // }

    // if (ready && !user) {
    //     return <Navigate to={'/login'} />
    // }
    // i dont know why this exist but if we put it in our code
    // should also write !redirect in if condition

    function linkClasses(type=null) {
        let classes = ' py-2 px-6 ';
        if (type === subpage) {
            classes += ' account-navigation text-white rounded-full ';
        }
        return classes;
    }

    async function logout() {
        await axios.post('/logout');
        setUser(null);
        setRedirect(true);
    }

    if (redirect) {
        return <Navigate to={'/'} />
      }

    return (
        <div>
            <nav className="w-full flex justify-center mt-8 mb-8 gap-3">
                <Link className={linkClasses('profile')} 
                to={'/account'}>
                    My profile 
                </Link>
                <Link className={linkClasses('bookings')} 
                to={'/account/bookings'}>
                    My bookings 
                </Link>
                <Link className={linkClasses('accommodations')}
                to={'/account/accommodations'}>
                    My accommodations 
                </Link> 
                
            </nav>
            {subpage === 'profile' && (
                <div className="text-center ">
                    Logged in as {user.username} ({}) <br />
                    <button onClick={logout} className="primary max-w-xs mt-10"> Logout </button>
                </div>
            )

            }
        </div>
    );
}