import { useEffect, useState } from "react";
import axios from "axios";
import Perks from "../Perks";
import AccountNav from "../AccounNav";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import PhotosUploader from "../PhotoUploader";
import "leaflet/dist/leaflet.css";
import { parseISO, isValid } from "date-fns";
import format from "date-fns/format";
import { DateRangePicker } from "react-date-range"; // react-date-range documentation: https://github.com/Adphorus/react-date-range
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import Categories from "../Categories";
import CountrySelector from "../CountrySelector";

export default function PlacesFormPage() {
  const { id } = useParams();

  const navigate = useNavigate();

  const generateUniqueKey = () => {
    const randomNumber = Math.floor(Math.random() * 10000); // Generate a random number
    return `date${randomNumber}`;
  };

  const [title, setTitle] = useState(""); // Default position
  const [address, setAddress] = useState("");
  const [country, setCountry] = useState({
    value: String,
    label: String,
});
  const [pinPosition, setPinPosition] = useState([45, 37]);
  const [extraInfoAddress, setExtraInfoAddress] = useState("");
  const [addedPhotos, setAddedPhotos] = useState([]);
  const [description, setDescription] = useState("");
  const [perks, setPerks] = useState([]);
  const [category, setCategory] = useState("");
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
  const [extraPrice, setExtraPrice] = useState(0);
  const [selectedDays, setSelectedDays] = useState([
    {
      startDate: parseISO(new Date()),
      endDate: parseISO(new Date()),
      key: generateUniqueKey(),
    },
  ]);

  const [redirect, setRedirect] = useState(false);

  useEffect(() => {
    if (!id) {
      return;
    }
    // console.log("Fetching place with ID:", id);
    axios
      .get("/places/" + id)
      .then((response) => {
        const { data } = response;
        setTitle(data.title);
        setAddress(data.address);
        setCountry(data.country);
        setPinPosition(data.pinPosition);
        setExtraInfoAddress(data.extraInfoAddress);
        setDescription(data.description);
        setAddedPhotos(data.photos);
        setPerks(data.perks);
        setCategory(data.category);
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
        setExtraPrice(data.extraPrice);
        setSelectedDays(data.selectedDays);
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
        country,
        pinPosition,
        extraInfoAddress,
        addedPhotos,
        description,
        perks,
        category,
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
        extraPrice,
        selectedDays,
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

  // Get the map instance for adding the pin
  // const map = useMap();
  // handle address input change
  const handleAddressChange = (ev) => {
    const newAddress = ev.target.value;
    setAddress(newAddress);

    axios
      .get(`/mapCord/${newAddress}`)
      .then((response) => {
        const { data } = response;
        if (data.lat && data.lng) {
          console.log("Response data:", data);
          setPinPosition([data.lat, data.lng]);
          // Center the map on the new pin position
          // map.setView([data.lat, data.lng], 13);
        }
      })
      .catch((error) => {
        console.error("Error geocoding address:", error);
      });
  };

  const handleDateChange = (ranges) => {
    console.log("handleDateChange called with ranges:", ranges);
    try {
      const newRanges = Object.keys(ranges).map((rangeKey) => {
        const range = ranges[rangeKey];
        const startDate = parseISO(range.startDate);
        const endDate = parseISO(range.endDate);
        console.log("Parsed Dates:", startDate, endDate);
        return {
          ...range,
          startDate,
          endDate,
          key: generateUniqueKey(),
        };
      });
      setSelectedDays([...selectedDays, ...newRanges]);
    } catch (error) {
      console.error("Error handling date change:", error);
    }
  };

  const removeDateRange = (keyToRemove) => {
    const updatedSelectedDays = selectedDays.filter(
      (range) => range.key !== keyToRemove
    );
    setSelectedDays(updatedSelectedDays);
  };

  const setLastDate = () => {
    if (selectedDays.length === 0) {
      return new Date();
    }
    let maxEndDate = new Date(); // Initialize with todays date

    selectedDays.forEach((range) => {
      const endDate = parseISO(range.endDate);
      console.log("Parsing END date: ", endDate);

      if (!isNaN(endDate.getTime()) && endDate > maxEndDate) {
        maxEndDate = endDate;
      }
      console.log("Parsing date set: ", maxEndDate);
    });

    const nextDate = new Date(maxEndDate);
    nextDate.setDate(maxEndDate.getDate() + 1);

    return nextDate;
  };

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
          <div className="grid grid-cols-2 gap-2 mb-2">
            <div>
              <p className="text-xs text-gray-500">Country</p>
              <div className="my-3">
                <CountrySelector
                  value={country} placeholder={"Country"}
                  onChange={(selectedOption) => setCountry(selectedOption)}
                />
              </div>
            </div>
            <div>
              <p className="text-xs text-gray-500">Address</p>
              <input
                type="text"
                value={address}
                onChange={handleAddressChange}
                placeholder="address"
              />
            </div>
          </div>

          <div className="relative">
            <MapContainer
              center={pinPosition}
              zoom={3}
              style={{ height: "400px", width: "100%" }}
              className="z-0"
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <Marker position={pinPosition} />{" "}
              {/* Add a marker at the pin position */}
            </MapContainer>
          </div>
          <div className="mt-2">
            <h2 className="text-lg">Extra Information about the Address</h2>
            <textarea
              value={extraInfoAddress}
              onChange={(ev) => setExtraInfoAddress(ev.target.value)}
              placeholder="Please provide details about the neighborhood surrounding your property and its accessibility via public transportation"
            />
          </div>

          {inputHeader("Basic Informations")}
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
          <p className="text-gray-600">Select all the perks about your place</p>
          <div className="mt-2 grid gap-2 grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
            <Perks selected={perks} onChange={setPerks} />
          </div>
          <div className="mt-4">
            <h2 className="text-gray-700 text-lg">Category of house</h2>
            <div className="mt-1 grid gap-2 md:grid-cols-3 lg:grid-cols-5">
              <Categories selected={category} onChange={setCategory} />
            </div>
          </div>

          {inputHeader("Description")}
          <textarea
            value={description}
            onChange={(ev) => setDescription(ev.target.value)}
            placeholder="Give a description about your place"
          />

          <div className="mt-4 mb-2 grid gap-4 sm:grid-cols-3">
            <div>
              <h2 className="mb-2 font-serif text-xl">Price per night</h2>
              <input
                type="number"
                value={price}
                onChange={(ev) => setPrice(ev.target.value)}
                placeholder="€ 99"
              />
            </div>
            <div>
              <h2 className="mb-2 ">Extra charge for additional person</h2>
              <input
                type="number"
                value={extraPrice}
                onChange={(ev) => setExtraPrice(ev.target.value)}
                placeholder="€ 10"
              />
            </div>
          </div>

          {inputHeader("Photos")}
          <PhotosUploader addedPhotos={addedPhotos} onChange={setAddedPhotos} />

          {inputHeader("Availability Days")}
          <div className="mb-2 mt-2">
            {/* <DateRangePicker
              ranges={selectedDays}
              onChange={(ranges) => handleDateChange(ranges)}
              minDate={setLastDate()}
            /> */}

            <div>
              <h2 className="text-lg">Selected Dates:</h2>
              {selectedDays.map((range) => {
                console.log(
                  "Parsing: ",
                  parseISO(range.startDate),
                  range.endDate
                );
                // 2023-11-14T22:00:00.000Z
                if (
                  isValid(parseISO(range.startDate)) &&
                  isValid(parseISO(range.endDate))
                ) {
                  return (
                    <div className="flex gap-4" key={range.key}>
                      <div>
                        <p>
                          {format(parseISO(range.startDate), "dd-MM-yyyy")} -{" "}
                          {format(parseISO(range.endDate), "dd-MM-yyyy")}
                          <button
                            className="border rounded-2xl p-1 bg-orange-600"
                            onClick={() => removeDateRange(range.key)}
                          >
                            Remove
                          </button>
                        </p>
                      </div>
                    </div>
                  );
                } else {
                  // Handle the case where range.startDate or range.endDate is not a valid date
                  return (
                    <div className="flex gap-4" key={range.key}>
                      <div>
                        <p>Invalid Date Range</p>
                      </div>
                    </div>
                  );
                }
              })}
            </div>
          </div>
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
