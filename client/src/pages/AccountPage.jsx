import { useContext } from "react";
import { UserContext } from "../UserContext";

export default function AccountPage(){
    const {user} = useContext(UserContext);
    return (
        <div>Account Page for {user.name}</div>
    );
}