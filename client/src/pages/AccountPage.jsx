import { useContext } from "react";
import { UserContext } from "../UserContext";
import { Navigate } from "react-router-dom";

export default function AccountPage(){
    const {ready, user} = useContext(UserContext);

    if(!ready) {
        return 'Loading your data..!';
    }

    if (ready && !user) {
        return <Navigate to={'/login'} />
    }

    return (
        <div>
            <nav>
                {/* <Link to={'/account/bookings'}> My bookings </Link>
                <Link to={'/account/accomodations'}> My accomodations </Link> */}
            </nav>
        </div>
    );
}