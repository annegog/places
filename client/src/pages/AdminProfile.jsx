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
            Admin Profile
            {/* <pre>{JSON.stringify(exportData, null, 2)}</pre> */}
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