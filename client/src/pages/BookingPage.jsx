import { useParams } from "react-router-dom"
import AccountNav from "../AccounNav";

export default function BookingPage(){
    const {id} = useParams();
    return (
        <div>
            <AccountNav/>
            
            Single booking page for : booking {id}
            
        </div>
    )
}