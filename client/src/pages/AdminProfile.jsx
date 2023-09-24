import { useContext, useEffect, useState } from "react";
import { AdminContext } from "../AdminContext";
import axios from "axios";
// import js2xml from "js2xml";
// import {json2xml} from "xml-js";
// const { json2xml } = require('xml-js');

export default function AdminProfile () {
    const {admin} = useContext(AdminContext)
    const [placesData, setPlacesData] = useState([]);
    const [xmlData, setXMLdata] = useState([]);

    useEffect(()=> {
        axios.get('/JSON-data').then(response => {
            setPlacesData(response.data);
        });
        axios.get('/XML-data').then(response => {
            setXMLdata(response.data);
        });
    }, []);

    const exportToJSON = () => {
        const jsonData = JSON.stringify(placesData, null, 2); // Convert data to JSON format with 2-space indentation
        // Create a Blob object containing the JSON data
        //A Blob is a binary large object that can represent data
        const blob = new Blob([jsonData], { type: "application/json" });
        
        // Create a download link and trigger the download
        const url = URL.createObjectURL(blob);
        const downloadLink = document.createElement("a");
        downloadLink.href = url;
        downloadLink.download = "FindYourPlace.json";
        document.body.appendChild(downloadLink);
        downloadLink.click();

        URL.revokeObjectURL(url); //revokes (deallocates) the blob URL
        document.body.removeChild(downloadLink); //cleans up the dynamically created anchor element
    };

    const exportToXML = () => {
        const blob = new Blob([xmlData], { type: "application/xml" });
    
        const url = URL.createObjectURL(blob);
        const downloadLink = document.createElement("a");
        downloadLink.href = url;
        downloadLink.download = "FindYourPlace.xml";
        document.body.appendChild(downloadLink);
        downloadLink.click();

        URL.revokeObjectURL(url);
        document.body.removeChild(downloadLink);
    };

    return (
        <div>
            {/*
            <div className="mt-4 grow flex items-center justify-around">
            <div className="mt-34 text-center">
            <h1 className="text-3xl text-center mt-6">Personal Informations</h1>
            <div >

            <div className="grid gap-4 mb-2 md:grid-cols-1 mt-6 mb-6">

              <div>
                <label
                  for="first_name"
                  className="block mb-2 text-sm font-medium text-gray-900" >
                  First name
                </label>
                <div className="bg-gray-200 border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 " >
                  {admin.first_name}
                </div>
              </div>
                
              <div>
                <label
                  for="last_name"
                  className="block mb-2 text-sm font-medium text-gray-900" >
                  Last name
                </label>
                <div className="bg-gray-200 border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 " >
                  {admin.last_name}
                </div>
              </div>

            //   <div>
            //     <label
            //       for="photo"
            //       className="block mb-2 text-sm font-medium text-gray-900">
            //       Profile Photo
            //     </label>

            //     {profilephoto?.[0] && ( 
            //       <ImageProfile
            //           className="w-full h-36 object-cover aspect-square rounded-lg"
            //           src={profilephoto?.[0]}
            //           alt="profile photo"
            //       />
            //     )}
            //   </div>

              <div>
                <label
                  for="username"
                  className="block mb-2 text-sm font-medium text-gray-900">
                  Username
                </label>
                <div className="bg-gray-200 border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 " >
                  {admin.username}
                </div>
              </div>

              <div>
                <label
                  for="phone"
                  className="block mb-2 text-sm font-medium text-gray-900">
                  Phone number
                </label>
                <div className="bg-gray-200 border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 " >
                  {admin.phone}
                </div>
              </div>

              <div className="">
                <label
                  for="email"
                  className="block mb-2 text-sm font-medium text-gray-900">
                  Email address
                </label>
                <div className="bg-gray-200 border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 " >
                  {admin.email}
                </div>
              </div>

              <div>
                <label
                  for="role"
                  className="block mb-2 text-sm font-medium text-gray-900">
                  Role
                </label>
                <div className="bg-gray-200 border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 " >
                   Admin
                </div>
              </div>

            </div>
          </div>    

          </div>
          </div>
            */}

            <button 
                className="primary max-w-fit" 
                onClick={exportToJSON}>Export to JSON
            </button>

            <button 
                className="primary max-w-fit" 
                onClick={exportToXML}>Export to XML
            </button>

            <button 
                className="primary max-w-fit" 
                onClick={""}>logout??
            </button>
        </div>
    );

}