import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

export default function UserPage () {
    const {id} = useParams(); //user id
    const [places, setPlaces] = useState([]);

    useEffect(()=> {
        axios.get('/admin-user-places/'+id).then(response =>{
        setPlaces(response.data);
      });
    }, []);

    return (
        <div className="mt-4 grid gap-2 lg:ml-10 lg:mr-10">
          {places.length > 0 && places.map(place => (
            <Link key={place._id} to={''} className="flex cursor-pointer gap-4 bg-gray-100 p-4 rounded-2xl">
              <div className="flex w-32 h-32 bg-gray-300 grow shrink-0 rounded-lg">
                <img className="object-cover aspect-square rounded-lg" src={'http://localhost:4000/Uploads/' + place.photos[0]} alt=""/>
              </div>
              <div className="grow-0 shrink">
                <h2 className="text-xl">{place.title}</h2>
                <div className="info-container text-gray-700">
                  <text>{place.maxGuests} guests</text>
                  <text>{place.numBedrooms} bedrooms</text>
                  <text>{place.maxBeds} beds</text>
                  <text>{place.numBaths} baths</text>
                </div> 
                <text className="font-semibold">${place.price} per night</text>
                <p className="text-sm mt-2">{place.description}</p>
              </div>
            </Link>
          ))}
        </div>
    );
};