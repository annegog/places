import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import ImageProfile from "../ImageProfile";

export default function UserPage () {
    const {id} = useParams(); //user id
    const [places, setPlaces] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [user, setUser] = useState([]);

    useEffect(()=> {
        axios.get('/admin-user-places/'+id).then(response => {
            setPlaces(response.data);
        });

        axios.get('/admin-user-bookings/'+id).then(response => {
            setBookings(response.data);
        });

        axios.get('/user/'+id).then(response => {
            setUser(response.data);
        });

    }, []);

    return (
        <div>
            {/* user infos */}
            <div className="flex justify-center items-center">
            <div className="my-10 ">
                <h1 className="font-bold text-lg mb-2 text-center">{user.username}'s Personal Informations</h1>
                <div className="flex gap-6 bg-gray-100 p-4 rounded-2xl">
                    <div className="flex w-36 h-36 bg-gray-300 shrink-0 rounded-lg ml-4">
                        {user.profilephoto?.[0] && ( 
                            <ImageProfile
                                className="object-cover aspect-square rounded-lg"
                                src={user.profilephoto?.[0]}
                                alt="profile photo"
                            />
                        )}
                    </div>

                    <div className="mr-4">
                        <text className="text-gray-700"> Username: </text> {user.username} <br />
                        <text className="text-gray-700"> Fisrt Name:</text> {user.first_name} <br />
                        <text className="text-gray-700"> Last Name: </text> {user.last_name} <br />
                        <text className="text-gray-700"> Roles: </text> {user.host && user.tenant ? "host, tenant" : user.host? "host": user.tenant? "tenant":""} <br />
                        <text className="text-gray-700"> Phone Number: </text> {user.phone} <br />
                        <text className="text-gray-700"> Email: </text> {user.email} <br />
                    </div> 
                </div>
            </div>
            </div>

            {/* the places of the user as host */}
            {user && user.host && (
                <div className="mb-10 grid gap-2 lg:ml-10 lg:mr-10">
                    <h1 className="font-bold text-lg">{user.username}'s Accommodations</h1>
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
                    {places.length === 0 && (
                        <div>
                            <text>No accommodations yet!</text>
                        </div>
                    )}
                </div>
            )}

            {/* users booking as host or as tenant */}
            <div className="">
                {user && user.tenant && (
                    <div className="mb-10">
                        <h1 className="font-bold text-lg">{user.username}'s Bookings As Tenant</h1>
                        No Bookings Yet!
                    </div>
                )}

                {user && user.host && (
                    <div>
                        <h1 className="font-bold text-lg">{user.username}'s Bookings As Host</h1>
                        No Bookings Yet!
                    </div>
                )}
            </div>

        </div>
    );
};