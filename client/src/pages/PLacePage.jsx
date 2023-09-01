import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import Image from "../Image";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import BookingWindow from "../BookingWindow";

export default function PlacePage() {
  const { id } = useParams();
  const [place, setPlace] = useState(null);
  const [showAllPhotos, setShowAllPhotos] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [open, setOpen] = useState(false); //for descriptions dialog

  // descriptions smaller than 5
  const [expanded, setExpanded] = useState(false);

  const toggleExpand = () => {
    setExpanded(!expanded);
  };

  const getDescription = () => {
    if (expanded) {
      return place.description;
    } else {
      // Display only the first 5 rows
      const descriptionArray = place.description.split("\n");
      return descriptionArray.slice(0, 5).join("\n");
    }
  };

  const handleClickToOpen = () => {
    setOpen(true);
  };

  const handleToClose = () => {
    setOpen(false);
  };

  //

  useEffect(() => {
    if (!id) {
      return;
    }
    axios.get("/places/" + id).then((response) => {
      setPlace(response.data);
    });
    // axios.get("/profile").then((res) => {
    //   setHost(res.data);
    // });
  }, [id]);

  if (!place) return "";

  if (showMap) {
    return (
      <div className="absolute inset-4 bg-white min-h-screen">
        <div className="p-8 grid gap-4">
          <div>
            <button
              onClick={() => setShowMap(false)}
              className="fixed flex py-2 px-4 rounded-2xl bg-transparent "
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
            center={[51.5, -0.09]}
            zoom={13}
            style={{ height: "400px", width: "100%" }}
            className="z-0"
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={[51.5, -0.09]} />
          </MapContainer>
        </div>
      </div>
    );
  }

  if (showAllPhotos) {
    return (
      <div className="absolute inset-0 bg-white ">
        <div className="p-8 grid gap-4 mr-5 ml-5">
          <div>
            <button
              onClick={() => setShowAllPhotos(false)}
              className="fixed flex py-2 px-4 rounded-2xl bg-transparent "
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
            <h2 className="text-2xl text-right text-black">{place.title}</h2>
          </div>
          {place?.photos?.length > 0 &&
            place.photos.map((photo) => (
              <div className="grid grid-cols-[2fr] gap-2" style={{ maxWidth: 1000 }}>
                <Image src={photo} alt="" />
              </div>
            ))}
        </div>
      </div>
    );
  }

  return (
    <div
      className="mt-4 -mx-2 lg:mx-8 sm:px-8 md:px-3 pt-8"
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
      <div className="relative">
        <div className="grid gap-2 grid-cols-[2fr_1fr] rounded-lg overflow-hidden">
          <div>
            {place.photos?.[0] && (
              <div>
                <Image
                  onClick={() => setShowAllPhotos(true)}
                  className="aspect-square cursor-pointer object-cover"
                  src={place.photos[0]}
                />
              </div>
            )}
          </div>
          <div className="grid">
            {place.photos?.[1] && (
              <Image
                onClick={() => setShowAllPhotos(true)}
                className="aspect-square cursor-pointer object-cover"
                src={place.photos[1]}
              />
            )}

            <div className="overflow-hidden ">
              {place.photos?.[2] && (
                <Image
                  onClick={() => setShowAllPhotos(true)}
                  className="aspect-square cursor-pointer object-cover relative top-2"
                  src={place.photos[2]}
                />
              )}
            </div>
          </div>
        </div>
        <button
          onClick={() => setShowAllPhotos(true)}
          className="flex gap-1 absolute bottom-2 right-2 py-2 px-4 bg-slate-50 rounded-2xl shadow-md shadow-gray-600"
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
              d="M2.25 7.125C2.25 6.504 2.754 6 3.375 6h6c.621 0 1.125.504 1.125 1.125v3.75c0 .621-.504 1.125-1.125 1.125h-6a1.125 1.125 0 01-1.125-1.125v-3.75zM14.25 8.625c0-.621.504-1.125 1.125-1.125h5.25c.621 0 1.125.504 1.125 1.125v8.25c0 .621-.504 1.125-1.125 1.125h-5.25a1.125 1.125 0 01-1.125-1.125v-8.25zM3.75 16.125c0-.621.504-1.125 1.125-1.125h5.25c.621 0 1.125.504 1.125 1.125v2.25c0 .621-.504 1.125-1.125 1.125h-5.25a1.125 1.125 0 01-1.125-1.125v-2.25z"
            />
          </svg>
          Show all photos
        </button>
      </div>

      <div className="mt-4 mb-8 grid gap-8 grid-cols-1 md:grid-cols-[2fr_1fr]">
        <div>
          <div className="my-4 grid gap-2">
            <h2 className="font-semibold text-2xl">About this place</h2>
            <div className="info-container text-gray-600">
              <text>{place.maxGuests} guests</text>
              <text>{place.numBedrooms} bedrooms</text>
              <text>{place.maxBeds} beds</text>
              <text>{place.numBaths} baths</text>
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
                <div className="mt-2 mb-8">
                  <dialogContent>
                    <dialogContentText className="text-justify align-text-top">
                      {place.description}{" "}
                    </dialogContentText>
                    {place.extraInfo.length && place.extraInfo.length > 0 && (
                      <div>
                        <h3 className="mt-4 text-lg text-gray-700 font-semibold mb-2">
                          Extra informations
                        </h3>
                        <dialogContentText className="text-justify align-text-top">
                          {place.extraInfo}{" "}
                        </dialogContentText>
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
              <text>Area: {place.area} (cm)</text>
              <text className="text-lg">Perks</text>
            </div>
          </div>
        </div>
      </div>

      <hr className="mt-6 mb-6" />
      <div>
        <h2 className="font-semibold text-lg">Reviews </h2>
      </div>

      <hr className="mt-6 mb-6" />
      <div>
        <h2 className="text-xl font-semibold">Hosting by </h2>
        <h2>contact with the host</h2>
      </div>

      <hr className="mt-3 mb-6" />
      <div className="mb-10">
        <h1 className="text-2xl font-semibold text-gray-700">
          Where you will be
        </h1>
        <div className="relative mt-3">
          <MapContainer
            center={[51.5, -0.09]}
            zoom={13}
            style={{ height: "400px", width: "100%" }}
            className="z-0"
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={[51.5, -0.09]} />
          </MapContainer>
        </div>
      </div>

    </div>
  );
}
