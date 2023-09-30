import AccountNav from "../AccounNav";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../UserContext";

export default function MesaagesPage() {
  const { user } = useContext(UserContext);


  return (
    <div>
      <AccountNav />
      <p>{user.first_name}'s messages</p>
      <div className="mt-2 grid grid-cols-[1fr_2fr]">
        <div className="border rounded-2xl">
            <p>host</p>
        </div>
        <div className="boreder rounded-2xl">
          <textarea></textarea>
        </div>
      </div>
    </div>
  );
}
