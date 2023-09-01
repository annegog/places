import { useState } from "react";

export default function BookingWindow({place}){
    const [checkIn,setCheckIn] = useState('');
    const [checkOut,setCheckOut] = useState('');
    const [numGuests,setNumGuests] = useState(1);
    
    return(
        <>
        <div className="bg-white shadow-2xl rounded-2xl p-2">
          <div className="text-lg font-semibold text-b text-left ml-6 mb-2 ">
          €{place.price} night
          </div>
          
          <div className="border rounded-2xl mt-2 mb-2">
            <div className="flex">
            <div className=" py-3 px-2 border-r">
              <label>Check in: </label>
              <input type="date" value={checkIn}
                   onChange={ev => setCheckIn(ev.target.value)}/>
            </div>
            <div className=" py-3 px-2">
              <label>Check out: </label>
              <input type="date" value={checkOut}
                   onChange={ev => setCheckOut(ev.target.value)}/>
            </div>
            </div>

            <div className=" py-3 px-2 border-t ">
              <label>Guests: </label>
              <input type="number" value={numGuests}
                 onChange={ev => setNumGuests(ev.target.value)}
                  />
            </div>
          </div>
          <button className="primary ">Reserve</button>
          <div className="mt-6 ml-4 grid grid-cols-2">
            <div className="text-left">
              <text className="underline"> € {place.price} x 5 days</text>
            </div>
            <div className="text-center">
              <text>€ {place.price * 5}</text>
            </div>
          </div>
          <hr className="mt-4 mb-2"/>
          <div className="ml-4 grid grid-cols-2">
            <div className="text-left">
              <text className="font-semibold text-lg text-center">Total</text>
            </div>
            <div className="text-center">
              <text className="font-medium text-lg text-center">€ €€</text>
            </div>
          </div>
        </div>
        </>
    )
}