import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Image from "../Image";

export default function IndexPage() {
  const [places, setPlaces] = useState([]);
  useEffect(() => {
    axios.get("/places").then((response) => {
      setPlaces(response.data);
    });
  }, []);

  return (
    <div>
      <div className="mt-10 grid gap-x-6 gap-y-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-5">
        {places.length > 0 &&
          places.map((place) => (
            <Link key={place._id} to={"/place/" + place._id}>
              <div className="bg-gray-500 mb-2 rounded-2xl flex">
                {place.photos && (
                  <Image
                    className="rounded-2xl object-cover aspect-square"
                    src={place.photos}
                    alt=""
                  />
                )}
              </div>
              <h2 className="font-bold text-sm">{place.title}</h2>
              {/* <h3 className="text-sm text-gray-500">{place.title}</h3> */}
              <div className="info-container text-sm text-gray-800">
                <text>{place.maxGuests} guests</text>
                <text>{place.numBedrooms} bedrooms</text>
              </div>
              {place.averageRating === null ? (
                <p className="text-sm font-serif ">no reviews yes</p>
              ) : (
                <div className="flex align-baseline">
                  <svg
                    className="w-4 h-7 text-yellow-300 mr-1"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 22 20"
                  >
                    <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
                  </svg>
                  <p className="font-serif">{place.averageRating}/5</p>
                </div>
              )}

              <div className="mt-1">
                <span className="font-bold">€{place.price}</span> per night
              </div>
            </Link>
          ))}
      </div>
    </div>
  );
}
