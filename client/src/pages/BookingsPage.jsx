import AccountNav from "../AccounNav";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../UserContext";

import BookingsForTetants from "../BookingsForTetans";
import BookingsForHosts from "../BookingsForHosts";

export default function BookingsPage() {
  const { user } = useContext(UserContext);

  const isHost = () => {
    return user && user.host;
  };

  const isTenant = () => {
    return user && user.tenant && !user.host;
  };

  return (
    <div>
      <AccountNav />
      {user && user.host && <BookingsForHosts />}
      {user && user.host && user.tenant && (
        <div>
          <hr className="w-60 mt-6 mb-6" />
          <h2 className="text-center text-2xl">
            Check Your Reservations at Other Destinations
          </h2>
          <BookingsForTetants />
        </div>
      )}
      {user && user.tenant && !user.host && <BookingsForTetants />}
    </div>
  );
}
