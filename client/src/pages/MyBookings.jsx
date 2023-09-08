import AccountNav from "../AccounNav";
import { useContext } from "react"; // Import useContext
import { UserContext } from "../UserContext";


export default function MyBookings() {
    const { user } = useContext(UserContext); // Access user data from UserContext

    const isHost = () => {
        return user && user.host;
    };

    const isTenant = () => {
        return user && user.tenant;
    };
    
    return(
        <div>
            <AccountNav/>
            Myyyyyyy Bookings are here
        </div>
    )
}
