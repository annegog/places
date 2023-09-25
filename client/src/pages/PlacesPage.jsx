import { Link, useNavigate, useParams } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import PlacesFormPage from "./PlacesFormPage";
import AccountNav from "../AccounNav";
import { UserContext } from "../UserContext";
import ImagePlace from "../ImagePlace";

export default function PlacesPage() {
  const { id } = useParams();

  const {user} = useContext(UserContext);

  const [places, setPlaces] = useState([]);
  useEffect(() => {
    axios.get('/user-places').then(({data}) => {
      setPlaces(data);
    });
  }, []);

  return (
    <div>
      <AccountNav />
      {/* user.isApproved === "true" */}
      {user && user.isApproved && (<div className="text-center">
        <Link
          className="inline-flex gap-1 bg-primary text-white py-2 px-6 rounded-full"
          to={"/account/places/new"}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-6 h-6"
          >
            <path
              fillRule="evenodd"
              d="M12 3.75a.75.75 0 01.75.75v6.75h6.75a.75.75 0 010 1.5h-6.75v6.75a.75.75 0 01-1.5 0v-6.75H4.5a.75.75 0 010-1.5h6.75V4.5a.75.75 0 01.75-.75z"
              clipRule="evenodd"
            />
          </svg>
          Add a new place
        </Link>
      </div>)}

      {user && !user.isApproved &&( //user.isApproved === "render"
        <div className="flex justify-center">
          <p className="text-center text-lg font-bold mt-48 bg-primary text-white rounded-full py-4 px-10">
            Your account, as host, must first be approved! <br />
            The Admin will accept you soon (or not :D)!
          </p>
        </div>
      )}
      
      <div className="mt-4 grid gap-2 lg:ml-10 lg:mr-10">
          {places.length > 0 && places.map(place => (
            <Link key={place._id} to={'/account/places/'+place._id} className="flex cursor-pointer gap-4 bg-gray-100 p-4 rounded-2xl">
              <div className="flex w-32 h-32 bg-gray-300 grow shrink-0 rounded-lg">
              {place && <ImagePlace place={place}/>}
              </div>
              <div className="grow-0 shrink">
                <h2 className="text-xl">{place.title}</h2>
                <div className="info-container text-gray-700">
                  <text>{place.maxGuests} guests</text>
                  <text>{place.numBedrooms} bedrooms</text>
                  <text>{place.maxBeds} beds</text>
                  <text>{place.numBaths} baths</text>
                </div> 
                <text className="font-semibold">€{place.price} per night</text>
                <p className="text-sm mt-2">{place.description}</p>
              </div>
            </Link>
          ))}
        </div>
    </div>
  );
}
