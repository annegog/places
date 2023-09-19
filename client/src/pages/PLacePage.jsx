import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import Image from "../Image";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import BookingWindow from "../BookingWindow";
import ImageProfile from "../ImageProfile";
import PlaceGallery from "../PlaceGallery";
import Perks from "../Perks";
import PerksShow from "../PerksShow";
import { ReactComponent as HomeIcon } from "../assets/svg/home.svg";
import CategoryShow from "../CategoryShow";

export default function PlacePage() {
  const { id } = useParams();
  const [place, setPlace] = useState(null);
  const [host, setHost] = useState(null);
  const [showMap, setShowMap] = useState(false);
  const [open, setOpen] = useState(false); //for descriptions dialog

  // descriptions smaller than 5
  const [expanded, setExpanded] = useState(false);

  const toggleExpand = () => {
    setExpanded(!expanded);
  };

  const getDescription = () => {
    if (place && place.description) {
      if (expanded) {
        return place.description;
      } else {
        // Display only the first 5 rows
        const descriptionArray = place.description.split("\n");
        return descriptionArray.slice(0, 5).join("\n");
      }
    }
    return "";
  };

  const handleClickToOpen = () => {
    setOpen(true);
  };

  const handleToClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    if (!id) {
      return;
    }
    axios.get("/place/" + id).then((response) => {
      setPlace(response.data.place);
      setHost(response.data.host);
    });
  }, [id]);

  if (!place) return "";

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
            center={place.pinPosition}
            zoom={13}
            style={{ height: "500px", width: "100%" }}
            className="z-0"
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={place.pinPosition} />
          </MapContainer>
        </div>
        <div className="mt-4">
          <textarea
            className="font-semibold"
            readOnly
            style={{ whiteSpace: "pre", height: "350px" }}
          >
            {place.extraInfoAddress}
          </textarea>
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
    <div
      className="mt-4 -mx-2 lg:ml-4  sm:px-8 pt-8 justify-center"
      style={{ maxWidth: 1443 }}
    >
      <h1 className="text-3xl">{place.title}</h1>
      <Link
        onClick={() => setShowMap(true)}
        className="flex font-semibold underline"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className="w-4 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
          />
        </svg>
        {place.address}
      </Link>
      <PlaceGallery place={place} />

      <div className="mt-4 mb-8 grid gap-8 grid-cols-1 md:grid-cols-[2fr_1fr]">
        <div>
          <div className="my-4 grid gap-2">
            <h2 className="font-semibold text-2xl">About this place</h2>
            <div className="info-container text-gray-600">
              <text>{place.maxGuests} guests</text>
              <text>{place.numBedrooms} bedrooms</text>
              <text>{place.maxBeds} beds</text>
              <text>{place.numBaths} baths</text>
              <text className="font-bold">Category</text>
            </div>

            <hr className="mt-1 mb-3" />
            <p
              className={`text-justify align-baseline ${
                expanded ? "" : "line-clamp-5"
              }`}
            >
              {getDescription()}
            </p>
            {place.description.split("\n").length > 5 && (
              <button
                onClick={toggleExpand}
                className="text-gray-400 hover:underline focus:outline-none bg-white text-right"
              >
                {expanded ? "Show Less" : "Read More"}
              </button>
            )}
            <div>
              <Link className="underline" onClick={handleClickToOpen}>
                Show more
              </Link>
              <dialog
                style={{
                  width: "70%",
                  maxWidth: "800px",
                  position: "fixed",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  backgroundColor: "white",
                  boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.2)",
                  padding: "1rem",
                  zIndex: 1000,
                }}
                className=" rounded-2xl"
                open={open}
                onClose={handleToClose}
              >
                <button onClick={handleToClose} className="bg-transparent">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    class="w-6 h-6"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
                <header></header>
                <h2 className="mt-2 text-2xl font-semibold ">
                  About this place
                </h2>
                <div className="mt-2 mb-6">
                  <dialogContent>
                    <dialogContentText className="text-justify align-text-top">
                      {place.description}{" "}
                    </dialogContentText>
                    {place.extraInfo && place.extraInfo.length > 0 && (
                      <div>
                        <h3 className="mt-4 text-lg text-gray-700 font-semibold mb-2">
                          Extra informations
                        </h3>
                        <dialogContentText className="text-justify align-text-top">
                          {place.extraInfo}{" "}
                        </dialogContentText>
                        <div className="mt-2 text-lg text-gray-700 font-semibold">
                          <text>Area: {place.area} (m2)</text>
                        </div>
                      </div>
                    )}
                  </dialogContent>
                </div>
              </dialog>
            </div>
          </div>
          {/* <hr className="w-60" /> */}
          <div className="grid grid-cols-1 info-container">
            <text>Check-in: {place.checkIn}</text>
            <text>Check-out: {place.checkOut}</text>
            <text>Minimum Days: {place.minDays}</text>
          </div>
          <hr className="w-60 mt-10 mb-6" />
        </div>
        <BookingWindow place={place} />

        <div>
          <div>
            <h2 className="text-2xl font-semibold text-gray-700 mb-2">
              What this place offers
            </h2>
            <div className="bg-gray-200 shadow-xl rounded-2xl p-2 grid grid-cols-1">
              <div>
                <PerksShow selected={place.perks}/>
                {place.category && (
                  <CategoryShow selected={place.category}/>
                )}
              </div>
              
            </div>
          </div>
        </div>
      </div>

      <hr className="mt-6 mb-6" />
      <div className="grid grid-cols-2 mb-2">
        <div className="grid grid-cols-[0.1fr,0.8fr] gap-4">
          <div className="rounded-full item-button border border-gray-600 ">
            {host.photoprofile ? (
              <ImageProfile
                className="rounded-full object-cover"
                src={host.photoprofile?.[0]}
                alt=""
                style={{ width: "40px" }}
              />
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="rounded-full w-10 h-10 relative self-center left-2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                />
              </svg>
            )}
          </div>
          <h2 className="text-3xl font-light">Hosting by: {host.username}</h2>
        </div>
      </div>

      <div className="px-4">
        <button className="contact">contact with the host</button>
      </div>

      <hr className="mt-6 mb-6" />
      <div>
        <h2 className="font-semibold text-lg">Reviews </h2>
      </div>
      <hr className="mt-6 mb-6" />

      {/* <hr className="mt-3 mb-6" />
      <div className="mb-10">
        <h1 className="text-2xl font-semibold text-gray-700">
          Where you will be
        </h1>
        <div className="mt-3">
          <MapContainer
            center={place.pinPosition}
            zoom={13}
            style={{ height: "400px", width: "100%" }}
            className="z-0"
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={place.pinPosition} />
          </MapContainer>
          <Link
            onClick={() => setShowMap(true)}
            className="flex underline mt-2"
          >
            Additional Information Regarding the Location of the Place
          </Link>
        </div>
      </div> */}
    </div>
  );
}
