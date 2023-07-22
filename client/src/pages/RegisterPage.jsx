import {Link} from "react-router-dom";
import {useState} from "react";
import axios from "axios";

export default function RegisterPage(){
    const [name,setName] = useState('');
    const [email,setEmail] = useState('');
    const [password,setPassword] = useState('');
    
    function registerUser(){
       axios.post('/register', {
        name,
        email,
        password
       });
    }

    return (
        <div className="mt-4 grow flex items-center justify-around">
            <div className="mt-34">
                <h1 className="text-4xl text-center mt-6">Create an account</h1>
                <form className="max-w-md mx-auto" onSubmit={registerUser}>
                    <input type="text" placeholder="Full Name"
                           value={name} onChange={ev => setName(ev.target.value)} />
                    <input type="email" placeholder="your@email.com"
                           value={email} onChange={ev => setEmail(ev.target.value)} />
                    <input type="password" placeholder="password"
                           value={password} onChange={ev => setPassword(ev.target.value)} />
                    <input type="password" placeholder="verified password"  
                            // sygkrish me to password gia na einai idio
                           />
                    {/* if everything is okay, go to next page */}
                    <button className="primary">Register</button>
                    <div className="text-center py-2 text-gray-500">
                        Already a member? <Link className="underline text-black" to={"/login"}>Login now</Link>
                    </div>
                </form>
            </div>
        </div>

);
}