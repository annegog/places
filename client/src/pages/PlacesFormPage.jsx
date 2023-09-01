import { useEffect, useState, useMapEvents } from "react";
import axios from "axios";
import Perks from "../Perks";
import AccountNav from "../AccounNav";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import PhotosUploader from "../PhotoUploader";
import "leaflet/dist/leaflet.css";

import { MapContainer, TileLayer, Marker } from "react-leaflet";

export default function PlacesFormPage() {
  const { id } = useParams();
  console.log({ id });
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [address, setAddress] = useState("");
  // const [addedPhotos, setAddedPhotos] = useState<string[]>([]);
  const [addedPhotos, setAddedPhotos] = useState([]);
  const [description, setDescription] = useState("");
  const [perks, setPerks] = useState([]);
  const [extraInfo, setExtraInfo] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [maxGuests, setMaxGuests] = useState(1);
  const [maxBeds, setMaxBeds] = useState(1);
  const [numBaths, setNumBaths] = useState(1);
  const [numBedrooms, setNumBedrooms] = useState(1);
  const [area, setArea] = useState(50);
  const [minDays, setMinDays] = useState(2);
  const [price, setPrice] = useState(1);

  const [redirect, setRedirect] = useState(false);

  useEffect(() => {
    if (!id) {
      return;
    }
    console.log("Fetching place with ID:", id);
    axios
      .get("/places/" + id)
      .then((response) => {
        const { data } = response;
        setTitle(data.title);
        setAddress(data.address);
        setDescription(data.description);
        setAddedPhotos(data.addedPhotos);
        setPerks(data.perks);
        setExtraInfo(data.extraInfo);
        setCheckIn(data.checkIn);
        setCheckOut(data.checkOut);
        setMaxGuests(data.maxGuests);
        setMaxBeds(data.maxBeds);
        setNumBaths(data.numBaths);
        setNumBedrooms(data.numBedrooms);
        setArea(data.area);
        setMinDays(data.minDays);
        setPrice(data.price);
      })
      .catch((error) => {
        if (error.response && error.response.status === 404) {
          console.error("Resource not found:", error);
        } else {
          console.error("An error occurred:", error);
        }
      });
  }, [id]);

  // headers
  function inputHeader(text) {
    return <h2 className="text-xl mt-4">{text}</h2>;
  }

  // Adding the new place
  async function savePlace(ev) {
    ev.preventDefault();
    try {
      const placeData = {
        title,
        address,
        addedPhotos,
        description,
        perks,
        extraInfo,
        checkIn,
        checkOut,
        maxGuests,
        numBaths,
        maxBeds,
        numBedrooms,
        area,
        minDays,
        price,
      };
      if (id) {
        // update- edit existing place
        await axios.put("/places/" + id, { id, ...placeData });
        console.log("updating the place:", id);
        // Navigate to the Places page
        navigate("/account/places");
      } else {
        // Place new place
        await axios.post("/places", placeData);
        console.log("New place is ready");
        // Navigate to the Places page
        navigate("/account/places");
      }
    } catch (error) {
      console.error("Error uploading/editting the place:", error);
    }
  }

  if (redirect) {
    return <Navigator to={"/account/places"} />;
  }

  return (
    <div>
      <AccountNav />
      <div className="mt-4 grow items-center flex justify-around">
        <form onSubmit={savePlace}>
          {inputHeader("Title")}
          <input
            type="text"
            value={title}
            onChange={(ev) => setTitle(ev.target.value)}
            placeholder="for example: My exotic house"
          />

          {inputHeader("Address")}
          <input
            type="text"
            value={address}
            onChange={(ev) => setAddress(ev.target.value)}
            placeholder="address"
          />

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

          {inputHeader("Extra informations")}
          <div className="mt-2 grid gap-2 sm:grid-cols-3">
            <div>
              <h3 className="mb-2">Bedrooms</h3>
              <input
                type="number"
                value={numBedrooms}
                onChange={(ev) => setNumBedrooms(ev.target.value)}
                placeholder="3"
              />
            </div>
            <div>
              <h3 className="mb-2">Number of Beds</h3>
              <input
                type="number"
                value={maxBeds}
                onChange={(ev) => setMaxBeds(ev.target.value)}
                placeholder="4"
              />
            </div>
            <div>
              <h3 className="mb-2">Number of Baths</h3>
              <input
                type="number"
                value={numBaths}
                onChange={(ev) => setNumBaths(ev.target.value)}
                placeholder="2"
              />
            </div>
            <div>
              <h3 className="mb-2">Maximum guests</h3>
              <input
                type="number"
                value={maxGuests}
                onChange={(ev) => setMaxGuests(ev.target.value)}
                placeholder="6"
              />
            </div>
            <div>
              <h3 className="mb-2">Min Days</h3>
              <input
                type="number"
                value={minDays}
                onChange={(ev) => setMinDays(ev.target.value)}
                placeholder="2"
              />
            </div>
            <div>
              <h3 className="mb-2">Area(cm)</h3>
              <input
                type="number"
                value={area}
                onChange={(ev) => setArea(ev.target.value)}
                placeholder="50"
              />
            </div>
          </div>
          <div className="mt-2 grid gap-6 sm:grid-cols-2">
            <div>
              <h2 className="mb-2">Check in time</h2>
              <input
                type="text"
                value={checkIn}
                onChange={(ev) => setCheckIn(ev.target.value)}
                placeholder="13:00"
              />
            </div>
            <div>
              <h2 className="mb-2">Check out time</h2>
              <input
                type="text"
                value={checkOut}
                onChange={(ev) => setCheckOut(ev.target.value)}
                placeholder="11:30"
              />
            </div>
          </div>

          {inputHeader("Perks")}
          <p className="text-gray-600 test-sm">
            Select all the perks about your place
          </p>
          <div className="mt-2 grid gap-2 grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
            <Perks selected={perks} onChange={setPerks} />
          </div>

          {inputHeader("Description")}
          <textarea
            value={description}
            onChange={(ev) => setDescription(ev.target.value)}
            placeholder="Give a description about your place"
          />

          <div className="mt-2 grid gap-4 sm:grid-cols-3">
            <div>
              <h2 className="mb-2">Kind of house (not in database)</h2>
              <input type="text" placeholder="Mounten House" />
            </div>
            <div>
              <h2 className="mb-2">Price per night</h2>
              <input
                type="number"
                value={price}
                onChange={(ev) => setPrice(ev.target.value)}
                placeholder="99"
              />
            </div>
          </div>

          {inputHeader("Photos")}
          <PhotosUploader addedPhotos={addedPhotos} onChange={setAddedPhotos} />

          <div className="mt-2 grid ">
            <h2 className="text-gray-600  mt-2 test-sm">
              Anything else you need to add
            </h2>
            <textarea
              value={extraInfo}
              onChange={(ev) => setExtraInfo(ev.target.value)}
              placeholder="The house rules, ect"
            />
          </div>

          <div className="center-container">
            <button className="saveButton">Save</button>
          </div>
        </form>
      </div>
    </div>
  );
}
