import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Image from "../Image";
import Categories from "../Categories";

export default function IndexPage(){
    const [places, setPlaces] = useState([]);
    useEffect(()=>{
        axios.get('/places').then(response =>{
            setPlaces(response.data);
        });
    }, []);

    return(
    <div>
      <Categories/>
      <div className="mt-8 grid gap-x-6 gap-y-8 grid-cols-3 lg:grid-cols-3 xl:grid-cols-5">
        {places.length > 0 && places.map(place => (
          <Link key={place._id} to={'/place/'+place._id}>
            <div className="bg-gray-500 mb-2 rounded-2xl flex">
              {place.photos?.[0] && (
                <Image className="rounded-2xl object-cover aspect-square" src={place.photos?.[0]} alt=""/>
              )}
            </div>
            <h2 className="font-bold text-sm">{place.address}</h2>
            {/* <h3 className="text-sm text-gray-500">{place.title}</h3> */}
            <div className="info-container text-sm text-gray-800">
              <text>{place.maxGuests} guests</text>
              <text>{place.numBedrooms} bedrooms</text>
            </div>
            <p className="font-serif">place.stars/5</p> 
            <div className="mt-1">
              <span className="font-bold">€{place.price}</span> per night
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}