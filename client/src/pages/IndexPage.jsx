import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Image from "../Image";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import CountrySelector from "../CountrySelector";
import Select from 'react-select'

export default function IndexPage() {
  const [places, setPlaces] = useState([]);
  useEffect(() => {
    axios.get("/places").then((response) => {
      setPlaces(response.data);
    });
  }, []);

  const currentDate = new Date();
  const [country, setCountry] = useState("");
  const [arrive, setArrive] = useState(null);
  const [leave, setLeave] = useState(null);
  const [guests, setGuests] = useState(1);
  const [minPrice, setMinPrice] = useState(null);
  const [maxPrice, setMaxPrice] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [category, setCategory] = useState("");
  const [selectedPerks, setSelectedPerks] = useState([]);
  const [perks, setPerks] = useState([]);

  const customStyles = {
    control: (provided) => ({
      ...provided,
      fontSize: '16px', // Adjust the font size as needed
      minWidth: '200px', // Adjust the width as needed  
    }),
  };

  const categoriesList = [
    { label: "House", value: "house" },
    { label: "Apartment", value: "apartment" },
    { label: "Private room", value: "privateRoom" },
    { label: "Loft", value: "loft" },
    { label: "Villa", value: "villa" },
  ];

  const handleCategoryChange = (selectedOption) => {
    setSelectedCategory(selectedOption);
    setCategory(selectedOption.value);
  };

  const perksList = [
    { label: "Wifi", value: "wifi" },
    { label: "Parking spot", value: "parking" },
    { label: "Pets Allowed", value: "pets" },
    { label: "Air Condition", value: "ac" },
    { label: "Private entrance", value: "enterns" },
    { label: "TV", value: "tv" },
    { label: "Living Room", value: "livingRoom" },
    { label: "Smoking Area", value: "smoking" },
    { label: "Parties Allowed", value: "party" },
  ];

  // const handlePerksChange = (ev) => {
  //   // setSelectedPerks([...selectedPerks, selectedOption]);
  //   // setPerks([...perks, selectedOption.value]);

  //   const { selected, value } = ev.target;
  //   if (selected) {
  //     setSelectedPerks([...selectedPerks, perks]);
  //     setPerks([...perks, selectedOption.value]);    
  //   } else {
  //     // setSelectedPerks([...selectedPerks, selectedOption]);
  //     // setPerks([...perks, selectedOption.value]);
  //     setSelectedPerks([...selectedPerks.filter((selectedValue) => selectedValue !== value)]);
  //     setPerks([...perks.filter((selectedValue) => selectedValue !== value)]);
  //   }
  //   console.log(perks)
  //   console.log(selectedPerks)
  // };
  const handlePerksChange = (selectedOptions) => {
    const selectedPerkValue = selectedOptions.map(option => option.value);
    setSelectedPerks(selectedOptions);
    setPerks(selectedPerkValue);
    console.log(perks)
  };

  const handlePerkDeselect = (deselectedOption) => {
    const deselectPerk = selectedPerks.filter(option => option.value !== deselectedOption.value);
    setSelectedPerks(deselectPerk);

    const deselectPerkValue = perks.filter(value => value !== deselectedOption.value);
    setPerks(deselectPerkValue);
    console.log(perks)
  };

  const handleSearch = (ev) => {
    axios
      .get("/filter-places", {
        params: {
          country,
          arrive,
          leave,
          guests,
          minPrice,
          maxPrice,
          category,
          perks
        },
      })
      .then((response) => {
        setPlaces(response.data);
      });
  };

  return (
    <div>
      <div className="flex justify-center mt-10">
        <div className="flex gap-2 items-center border border-gray-300 rounded-full py-2 px-4 shadow-md shadow-gray-250  invisible sm:visible w-4/6 md:w-4/6 lg:w-3/6 xl:w-3/6">
          <div>
            <p className="text-xs text-gray-500">Location</p>
            <CountrySelector
              value={country}
              onChange={(selectedCountry) => setCountry(selectedCountry)}
            />
          </div>
          <div>
            <p className="text-xs text-gray-500">Chek-in</p>
            <DatePicker
              minDate={currentDate}
              selected={arrive}
              onChange={(date) => setArrive(date)}
              className="w-full p-2 border rounded"
              placeholderText="Add date" dateFormat="dd/MM/yyyy"
            />
          </div>
          <div>
            <p className="text-xs text-gray-500">Chek-out</p>
            <DatePicker
              minDate={arrive}
              selected={leave}
              onChange={(date) => setLeave(date)}
              className="w-full p-2 border rounded"
              placeholderText="Add date" dateFormat="dd/MM/yyyy"
            />
          </div>
          <div>
            <p className="text-xs text-gray-500">Guests</p>
            <input
              type="number"
              min="1"
              placeholder="Guests"
              value={guests}
              onChange={(ev) => setGuests(ev.target.value)}
              className="text-gray-800 cursor-pointer w-10 "
            />
          </div>

          <button
            className="bg-primary text-white p-2 rounded-full"
            onClick={handleSearch}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
              />
            </svg>
          </button>
        </div>
      </div>

      <div className="flex gap-10">
        <p className="mt-10 ml-2 text-lg text-gray-700 font-bold">Extra filters:</p>
        <div className="flex justify-start ml-2 mb-20 mt-2 gap-2 w-60">
          <div>
            <p className="text-xs text-gray-500 flex items-center ml-2">
              Minimum price
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M14.25 7.756a4.5 4.5 0 100 8.488M7.5 10.5h5.25m-5.25 3h5.25M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </p>
            <input
              type="number"
              min="10"
              placeholder="Add price"
              value={minPrice}
              onChange={(ev) => setMinPrice(ev.target.value)}
              className="text-gray-800 cursor-pointer "
            />
          </div>
          <div>
            <p className="text-xs text-gray-500 flex items-center ml-2">
              Maximum price
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M14.25 7.756a4.5 4.5 0 100 8.488M7.5 10.5h5.25m-5.25 3h5.25M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </p>
            <input
              type="number"
              min="10"
              placeholder="Add price"
              value={maxPrice}
              onChange={(ev) => setMaxPrice(ev.target.value)}
              className="text-gray-800 cursor-pointer" />
          </div>

        </div>

        <div className="mt-5">
          <p className="text-xs text-gray-500 flex items-center">Category</p>
          <Select
            options={categoriesList}
            value={selectedCategory}
            onChange={handleCategoryChange}
            styles={customStyles} // Apply custom styles to the control
            placeholder="Select..."
          />
        </div>
        <div className="mt-5">
          <p className="text-xs text-gray-500 flex items-center">Perks</p>
          <Select
            options={perksList}
            value={selectedPerks}
            onChange={handlePerksChange}
            onBlur={(ev) => {
              // Check if any options were removed
              if (ev.removedValue) {
                handlePerkDeselect(e.removedValue);
              }
            }}
            styles={customStyles} // Apply custom styles to the control
            placeholder="Select..."
            isMulti
          />
        </div>
          
        <div className="flex justify-start ml-2 mb-20 mt-3 gap-10 w-96 ">
          <div>
            <p className="text-xs text-gray-500 flex items-center ml-2">
              Bedrooms
              
            </p>
            <input
              type="number"
              min="1"
              placeholder=""
              value={minPrice}
              onChange={(ev) => setMinPrice(ev.target.value)}
              className="text-gray-800 cursor-pointer "
            />
          </div>
          <div>
            <p className="text-xs text-gray-500 flex items-center ml-2">
              Beds
              
            </p>
            <input
              type="number"
              min="1"
              placeholder=""
              value={maxPrice}
              onChange={(ev) => setMaxPrice(ev.target.value)}
              className="text-gray-800 cursor-pointer" />
          </div>
          <div>
            <p className="text-xs text-gray-500 flex items-center ml-2"> Bathrooms</p>
            <input
              type="number"
              min="1"
              placeholder=""
              value={maxPrice}
              onChange={(ev) => setMaxPrice(ev.target.value)}
              className="text-gray-800 cursor-pointer" />
          </div>
        </div>
      
      </div>


      <div className="text-center text-gray-700">
        {places.length === 0 && (
          <>
            <p className="text-3xl mb-2">
              🙁 Oops! No places were found for your search criteria.
            </p>
            <p className="mb-4 text-lg">
              Try adjusting your search or explore other options.
            </p>
          </>
        )}
      </div>
      <div className="mt-10 grid gap-x-6 gap-y-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-5">
        {places &&
          places.length > 0 &&
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
                <p className="text-sm font-serif ">no reviews yet</p>
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
