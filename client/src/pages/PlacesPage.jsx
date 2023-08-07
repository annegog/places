import { Link, useParams } from "react-router-dom";

export default function PlacesPage() {
  const { action } = useParams();
  return (
    <div>
      {action !== "new" && (
        <div className="text-center">
          <Link
            className="inline-flex gap-1 bg-primary text-white py-2 px-6 rounded-full"
            to={"/account/places/new"}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-6 h-6"
            >
              <path
                fillRule="evenodd"
                d="M12 3.75a.75.75 0 01.75.75v6.75h6.75a.75.75 0 010 1.5h-6.75v6.75a.75.75 0 01-1.5 0v-6.75H4.5a.75.75 0 010-1.5h6.75V4.5a.75.75 0 01.75-.75z"
                clipRule="evenodd"
              />
            </svg>
            Add a new place
          </Link>
        </div>
      )}
      {action == "new" && (
        <div className="mt-4 grow items-center flex justify-around">
          <form>
            <h2 className="text-xl mt-4">Title</h2>
            <p className="text-gray-600 test-sm">Title for your place</p>
            <input
              type="text"
              placeholder="title, for example: My exotic house"
            />
            <h2 className="text-xl mt-4">Address</h2>
            <input type="text" placeholder="address" />
            <h2 className="text-xl mt-4">Photos</h2>
            <div className="flex gap-2">
              <input type="text" placeholder={"Add using a link ... jpg"} />
              <button className="add text-center ">
                Add Photo
              </button>
            </div>
            <div className="mt-2 grid grid-cols-3 lg:grid-cols-6 md:grid-cols-4">
              <button className="flex justify-around border bg-transparent rounded-xl p-8 text-2xl text-gray-450 ">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-8 h-8">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 8.25H7.5a2.25 2.25 0 00-2.25 2.25v9a2.25 2.25 0 002.25 2.25h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25H15m0-3l-3-3m0 0l-3 3m3-3V15" />
              </svg>
               Upload
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
