import { useContext } from "react";

export default function AccountPage(){
    const {user} = useContext(UserContext);
    return (
        <div>Account Page </div>
    );
}