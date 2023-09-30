import { useParams, Link } from "react-router-dom";
import { useEffect, useState, useContext} from "react";
import { UserContext } from "../UserContext";
import axios from "axios";
import AccountNav from "../AccounNav";
// import PlaceGallery from "../PlaceGallery";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import format from "date-fns/format";
import PlaceGallery from "../PlaceGallery";
import moment from "moment";

export default function BookingPageTenant() {
  const { id } = useParams();
  const { user, setUser } = useContext(UserContext);
  const [booking, setBooking] = useState(null);
  const [showMap, setShowMap] = useState(false);
  const [stars, setStars] = useState(0);
  const [review, setReview] = useState("");
  const [canceled, setCanceled] = useState(null);
  const [hasReview, setHasReview] = useState(false);
  const reviewDate = new Date();

  useEffect(() => {
    if (id) {
      axios.get("/bookings").then((response) => {
        const foundBooking = response.data.find(({ _id }) => _id === id);
        if (foundBooking) {
          setBooking(foundBooking);
          // setCanceled(booking.canceled)
        }
      });
    }
  }, [id]);

  useEffect(() => {
    if (!id) {
      return;
    }
    axios.get("/review/" + id)
    .then((response) => {
      if (response.data && response.data.stars && response.data.review) {
        setHasReview(true);
        setStars(response.data.stars);
        setReview(response.data.review);
      } else {
        setHasReview(false);
      }
    }).catch((error) => {
      console.error("Error fetching review:", error);
      setHasReview(false);
    });
}, [id]);

  if (!booking) {
    return "";
  }

  async function reviewIt(ev) {
    ev.preventDefault();
    try {
      const response = await axios.post("/review", {
        place: booking.place, 
        booking: booking._id,
        first_name: booking.first_name,
        stars,
        review,
        reviewDate,
      });
      const reviewID = response.data._id;
      window.location.reload();
    } catch (error) {
      console.error("Error on review:", error);
    }
  }

  async function handleCancelation () {
    axios.post('/booking-cancelation/'+id);
    window.location.reload();
  }

  if (showMap) {
    return (
      <div className="absolute inset-4 bg-white min-h-screen mr-5 ml-5 xl:mr-30 xl:ml-30">
        <div className="p-8 grid gap-4 ">
          <div className="grid grid-cols-2">
            <button
              onClick={() => setShowMap(false)}
              className="flex py-2 px-4 rounded-2xl bg-transparent "
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
                />
              </svg>
            </button>
            <h2 className="text-2xl text-right text-black">
              Take a closer look on the Map
            </h2>
          </div>
        </div>
        <div className="relative">
          <MapContainer
            center={booking.place.pinPosition}
            zoom={13}
            style={{ height: "500px", width: "100%" }}
            className="z-0"
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={booking.place.pinPosition} />
          </MapContainer>
        </div>
        <hr className="mt-6 mb-4 w-80" />
        <text className="text-gray-500 font-serif">
          This is not the exact location of the property, as we prioritize
          security. Please reach out to the host after making a reservation to
          obtain the precise location.
        </text>
        <hr className="mt-10" />
      </div>
    );
  }

  return (
    <div className="my-8 mx-12">
      <AccountNav />
      <div className="flex">
        <h1 className="text-xl">Your reservation in: </h1>
        <Link className="text-xl" to={"/place/" + booking.place._id}>
          {booking.place.title}
        </Link>
      </div>
      <Link
        onClick={() => setShowMap(true)}
        className="flex font-semibold underline mb-2"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z"
          />
        </svg>
        {booking.place.address}
      </Link>
      <hr className="w-72 mt-4" />
      <div className="bg-gray-200 p-4 my-6 rounded-2xl flex items-center justify-between">
        <div>
          <h2 className="text-2xl mb-2">Your booking information:</h2>
          <div className="flex gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5m-9-6h.008v.008H12v-.008zM12 15h.008v.008H12V15zm0 2.25h.008v.008H12v-.008zM9.75 15h.008v.008H9.75V15zm0 2.25h.008v.008H9.75v-.008zM7.5 15h.008v.008H7.5V15zm0 2.25h.008v.008H7.5v-.008zm6.75-4.5h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V15zm0 2.25h.008v.008h-.008v-.008zm2.25-4.5h.008v.008H16.5v-.008zm0 2.25h.008v.008H16.5V15z"
              />
            </svg>
            {format(new Date(booking.checkIn), "MMMM dd, yyyy")} -{" "}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5m-9-6h.008v.008H12v-.008zM12 15h.008v.008H12V15zm0 2.25h.008v.008H12v-.008zM9.75 15h.008v.008H9.75V15zm0 2.25h.008v.008H9.75v-.008zM7.5 15h.008v.008H7.5V15zm0 2.25h.008v.008H7.5v-.008zm6.75-4.5h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V15zm0 2.25h.008v.008h-.008v-.008zm2.25-4.5h.008v.008H16.5v-.008zm0 2.25h.008v.008H16.5V15z"
              />
            </svg>
            {format(new Date(booking.checkOut), "MMMM dd, yyyy")}
            {"."}
          </div>
          <div className="mt-1 info-container text-gray-700">
            <text>{booking.numGuests} guests</text>
            <text>{booking.place.maxBeds} beds</text>
            <text>{booking.place.numBaths} baths</text>
            <text>{booking.stayNights} nights</text>
          </div>
        </div>
        <div className="bg-indigo-400 text-center p-6 text-white rounded-2xl">
          <div>Total price</div>
          <div className="text-3xl">€ {booking.price}</div>
        </div>
      </div>
      <div className="my-6">
        <PlaceGallery place={booking.place} />
      </div>
      <div className="mt-4 mb-4">
        <Link
          className="gap-1 py-3 px-4 bg-indigo-200 rounded-2xl shadow-md shadow-gray-600"
          to={"/place/" + booking.place._id}
        >
          Take a look at the place
        </Link>
      </div>
      {moment().startOf('day') <= moment(booking.checkOut).startOf('day') && !booking.canceled && (
        <div>
          <p className="text-gray-700 text-sm">
            To cancel your reservation, please provide us with a minimum of{" "}
            <span className="font-semibold">20 days'</span> notice before your
            intended cancellation date. This allows us to efficiently handle any
            necessary arrangements. Your cooperation is greatly appreciated.
          </p>
          <button 
            className="bg-red-700 p-3 mt-1 text-white rounded-2xl text-right"
            onClick={handleCancelation}>
            Cancel the Reservation
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
      {moment().startOf('day') >= moment(booking.checkIn).startOf('day') && !hasReview && !booking.canceled && (
        <div>
            <h2 className="text-2xl">Leave your Review</h2>
            <div className="flex align-baseline">
              <svg
                className="w-6 h-6 text-yellow-300 mr-1"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 22 20"
              >
                <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
              </svg>
              <input
                type="number"
                className="w-4 h-8 p-4 rounded-md border border-gray-300 text-gray-700"
                min="1" max="5" step="1" placeholder="Rate" value={stars}
                onChange={(ev) => setStars(ev.target.value)}
              />
              /5
            </div>
            <textarea placeholder="Write your opinion about this place. The host, the city, the neighborhood ..."
            value={review}
            onChange={(ev) => setReview(ev.target.value)}/>
            <button className="bg-indigo-400 p-3 text-white rounded-2xl text-right" 
                  onClick={reviewIt}>
              Save Review
            </button>
          </div>
        )}
        {hasReview && (
          <div>
          <h2 className="text-2xl">Your Review</h2>
          <div className="flex align-baseline">
            <svg className="w-6 h-7 text-yellow-300 mr-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 22 20">
              <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
            </svg>
            <text className="font-serif text-lg">{stars}/5</text>
          </div>
          <textarea readOnly value={review}/>
        </div>
        )}
      </div>
      <div className="mt-4">
        <h2 className="text-2xl">Messages with the Host</h2>
        {/* <Messages></Messages> */}
      </div>
    </div>
  );
}
