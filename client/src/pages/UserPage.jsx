import axios from "axios";
import { useEffect, useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import ImageProfile from "../ImageProfile";
import ImagePlace from "../ImagePlace";
import { format } from "date-fns";

export default function UserPage () {
    const {id} = useParams(); //user id
    const [places, setPlaces] = useState([]);
    const [tenantBookings, setTenantBookings] = useState([]);
    const [hostBookings, setHostBookings] = useState([]);
    const [user, setUser] = useState([]);

    useEffect(()=> {
        axios.get('/admin-user-places/'+id).then(response => {
            setPlaces(response.data);
        });

        axios.get('/admin-tenant-bookings/'+id).then(response => {
            setTenantBookings(response.data);
        });

        axios.get('/admin-host-bookings/'+id).then(response => {
            setHostBookings(response.data);
        });

        axios.get('/user/'+id).then(response => {
            setUser(response.data);
        });

    }, []);

    const handleDelete = async (userId, username) => {
        if (window.confirm(`Are you sure, you want to DELETE user: ${username}`)) {
            await axios.post('/delete-user', {userId});
            axios.get('/user/'+id).then(response => {
                setUser(response.data);
            });
        } 
    };

    const handleAccept = async (userId, username) => {
        if (window.confirm(`Are you sure, you want to ACCEPT host: ${username}`)) {
            await axios.post('/accept-host', {userId});
            axios.get('/user/'+id).then(response => {
                setUser(response.data);
            });
        } 
    };

    const handleDecline = async (userId, username) => {
        if (window.confirm(`Are you sure, you want to DECLINE host: ${username}`)) {
            await axios.post('/decline-host', {userId});
            axios.get('/user/'+id).then(response => {
                setUser(response.data);
            });
        }
    };

    if (user === null) {
        return <Navigate to={"/admin/users"} />;
    }

    return (
        <div className="relative">
            {/* user infos */}
            <div className="flex justify-center items-center">
            <div className="my-10 ">
                <h1 className="font-bold text-xl mb-2 text-center">{user.username}'s Personal Informations</h1>
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
                    <h1 className="font-bold text-xl">{user.username}'s Accommodations</h1>
                    {places.length > 0 && places.map(place => (
                        <div key={place._id} to={''} className="flex gap-4 bg-gray-100 p-4 rounded-2xl">
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
                        </div>
                    ))}
                    {places.length === 0 && (
                        <div className="text-xl text-slate-600 mb-4">
                            No accommodations yet.
                        </div>
                    )}
                </div>
            )}

            {/* users booking as host or as tenant */}
            {user && user.tenant && (
                <div className="mb-10">
                    <div className="mt-4 grid gap-2 lg:ml-10 lg:mr-10">
                        <h1 className="font-bold text-xl">{user.username}'s Bookings As Tenant</h1>
                        {tenantBookings?.length > 0 ? (
                            tenantBookings.map((booking) => (
                                <div key={booking._id} className="flex gap-4 bg-gray-100 p-4 rounded-2xl">
                                    <div className="flex w-32 h-32 bg-gray-300  shrink-0 rounded-lg">
                                        {booking.place && <ImagePlace place={booking.place} />}
                                    </div>
                                    <div className="grow-2 shrink">
                                        <h2 className="text-xl">{booking.place.title}</h2>
                                        <div>
                                            You reserve this place for a duration spanning from{" "}
                                            {format(new Date(booking.checkIn), "MMMM dd, yyyy")} -{" "}
                                            {format(new Date(booking.checkOut), "MMMM dd, yyyy")}
                                            {"."}
                                        </div>
                                        <div className="info-container text-sm text-gray-800">
                                            <text>{booking.stayNights} nights</text>
                                            <text>{booking.numGuests} guests</text>
                                            <text>{booking.extraPerson}</text>
                                        </div>
                                        <div className="flex gap-1 mt-1">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-8">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z"/>
                                            </svg>
                                            <span className="text-2xl">
                                                Total price: €{booking.price}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-xl text-slate-600 mb-4">
                                No reservations yet.
                            </div>
                        )}
                    </div>
                </div>
            )}

            {user && user.host && (
                <div>
                    <div className="mt-4 grid gap-2 lg:ml-10 lg:mr-10">
                    <h1 className="font-bold text-xl">{user.username}'s Bookings As Host</h1>
                        {places.length > 0 && places.map((place) => (
                            <div key={place._id} className="flex gap-4 bg-gray-100 p-4 rounded-2xl">
                                <div className="flex w-32 h-32 bg-gray-300 shrink-0 rounded-lg">
                                    {place && <ImagePlace place={place} />}
                                </div>
                                <div className="grow shrink">
                                    <h2 className="text-xl">{place.title}</h2>
                                    {hostBookings?.length > 0 && hostBookings.some((booking) => booking.place === place._id) ? (hostBookings
                                        .filter((booking) => booking.place === place._id)
                                        .sort((a, b) => new Date(a.checkIn) - new Date(b.checkIn))
                                        .map((booking) => (
                                            <div
                                                key={booking._id}
                                                to={`/account/forbookings/${booking._id}`}
                                                className="border mt-2 flex gap-4 bg-slate-300 p-4 rounded-3xl">

                                                <div className="grow-2 shrink">
                                                    <div>
                                                        <text className="underline">
                                                        {booking.first_name} {booking.last_name}
                                                        </text>{" "}
                                                        reserve this place.
                                                    </div>
                                                    <div>
                                                        <text className="font-semibold">Reservation Dates:</text>{" "}
                                                        {format(new Date(booking.checkIn), "MMM dd, yyyy")} -{" "}
                                                        {format(new Date(booking.checkOut), "MMM dd, yyyy")}
                                                    </div>
                                                    <div className="info-container text-sm text-gray-800">
                                                        <text>{booking.stayNights} nights</text>
                                                        <text>{booking.numGuests} guests</text>
                                                        <text> extra guests</text>
                                                    </div>
                                                    <span className="text-2xl">
                                                        Total price: €{booking.price}
                                                    </span>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="mt-6 text-center">
                                            <div className="text-2xl text-slate-600 mb-4">
                                                No reservations for this place yet.
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                        {places.length === 0 && (
                            <div>
                                <div className="text-xl text-slate-600 mb-4">
                                    No reservations yet.
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
            
            <div className="flex justify-between mt-10">
                        {!user.isApproved && (
                            <div className="flex"> 
                                <button 
                                    className="bg-green-700 text-sm text-white p-2 rounded-2xl flex mr-2" 
                                    onClick={() => handleAccept(user._id, user.username)}>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                    </svg>
                                    <text className="">Accept</text>
                                </button>

                                <button 
                                    className="bg-yellow-500 text-sm text-white p-2 rounded-2xl flex" 
                                    onClick={() => handleDecline(user._id, user.username)}>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                    Decline
                                </button> 
                            </div>
                        )}

                        <div>
                            <button 
                                className="bg-red-600 text-sm text-white fit-content p-2 rounded-2xl flex" 
                                onClick={() => handleDelete(user._id, user.username)} >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                </svg>
                                <text>delete</text>
                            </button>
                        </div>
                    </div>
        </div>
    );
};