import { useContext } from "react";

export default function RegisterBPage(){
    return (
        <div className="mt-4 grow flex items-center justify-around">
            <div className="mt-34">
                <h1 className="text-2xl text-center mt-6">Continue the Registeration</h1>
                <form className="max-w-md mx-auto" > 
                    <input type="text" placeholder="username"/>
                    
                    <input type="text" id="phone" 
                           placeholder="Phone Number" pattern="[0-9]{3}-[0-9]{2}-[0-9]{3}" required/>
                    
                    <button className="primary">Register</button>

                </form>
            </div>
        </div>
    );
}
