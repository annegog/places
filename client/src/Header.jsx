import {Link, Navigate} from "react-router-dom";
import React, { useContext, useState } from 'react';
import './App.css';
import { UserContext } from "./UserContext";
import ImageProfile from "./ImageProfile";
import logo from "./logo.png"

export default function Header(){
    const {user, setUser} = useContext(UserContext);

    return(
        <div>
            <header className="header"> 
                <Link to={'/'} className="text-center flex items-center"> 
                    <img src={logo} alt="logo" className="object-f w-12 rounded-lg mr-2"/> 
                    <span className="text-indigo-400 tracking-tighter font-bold text-xl logo-text">Find Your Place</span>
                </Link>
                
                <div className="flex gap-6 items-center border border-gray-300 rounded-full py-2 px-4 shadow-md shadow-gray-250">
                    <div> Anywhere </div>
                    <div className="border-l border-gray-300"></div>
                    <div> Any week </div>
                    <div className="border-l border-gray-300"></div>
                    <div> Guests </div>
                    <button className="bg-primary text-white p-2 rounded-full"> 
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                        </svg>
                    </button>
                </div>

                <div className="flex gap-2 items-center border border-gray-300 rounded-full py-2 px-4 shadow-md shadow-gray-250">
                    <Link to={user?'/account':'/login'} className="flex gap-2 items-center">
                        <div className="rounded-full item-button border border-gray-600 overflow-hidden">  
                            {user && user.profilephoto?.[0] ?  ( 
                                <ImageProfile
                                className="rounded-3xl w-8 object-cover aspect-square"
                                src={user.profilephoto?.[0]}
                                alt=""
                            />
                            ) : (
                                <div className="flex">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 relative top-1">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                                    </svg>
                                </div>                        
                            )}
                        </div>
                        {!!!user &&
                            <text className="">login/register </text>
                        }
                        
                        {!!user && (
                            <div>
                                {user.username}
                            </div>
                        )}
                    </Link> 
                </div>

                
            </header>
            
        </div>
    )
}