import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import AccountNav from "../AccounNav";
import format from "date-fns/format";
import PlaceGallery from "../PlaceGallery";

export default function BookingPageHost() {
  const { id } = useParams();
  const [booking, setBooking] = useState(null);

  useEffect(() => {
    if (id) {
      axios.get("/bookings-host").then((response) => {
        const foundBooking = response.data.find(({ _id }) => _id === id);
        if (foundBooking) {
          setBooking(foundBooking);
          console.log(foundBooking);
        }
      });
    }
  }, [id]);

  if (!booking) {
    return "";
  }

  async function handleCancelation () {
    axios.post('/booking-cancelation/'+id);
    window.location.reload();
  }

  return (
    <div className="my-8">
      <AccountNav />
      <div className="bg-gray-200 p-6 my-6 rounded-2xl flex items-center justify-between md:ml-10 md:mr-10 lg:ml-28 lg:mr-28">
        <div>
          <h2 className="text-2xl">Booking information:</h2>
          <text className="underline text-xl">
            {booking.first_name} {booking.last_name}
          </text>
          <div>
            <text className="font-semibold">Reservation Dates:</text>{" "}
            {format(new Date(booking.checkIn), "MMM dd, yyyy")} -{" "}
            {format(new Date(booking.checkOut), "MMM dd, yyyy")}
          </div>
          <div className="info-container text-sm text-gray-800">
            <text>{booking.stayNights} nights</text>
            <text>{booking.numGuests} guests</text>
            <text>{booking.extraCharges} extraCharges</text>
          </div>
        </div>
        <div className="bg-indigo-400 p-6 text-white rounded-2xl">
          <div>Total price</div>
          <div className="text-3xl">€ {booking.price}</div>
        </div>
      </div>
      {!booking.canceled && (
        <div className="">
          <button 
            className="bg-red-700 p-2 text-white rounded-2xl text-right"
            onClick={handleCancelation}>
            Cancel the reservation
          </button>
        </div>
      )}
       {booking.canceled && (
        <div className="text-center text-white bg-red-800 py-2 mt-10 font-bold text-xl rounded-xl">
            Your Reservation is Canceled!
        </div>
      )}
      <hr className="mt-6 mb-2" />
      <div className="mt-4">
        <h2 className="text-2xl">
          Messages with {booking.first_name} {booking.last_name}
        </h2>
        {/* <Messages></Messages> */}
      </div>
      
    </div>
  );
}
