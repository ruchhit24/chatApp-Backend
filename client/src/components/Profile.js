import React from "react";
import { GrAd } from "react-icons/gr";
import { FaRegUserCircle } from "react-icons/fa";
import { FaRegCalendarAlt } from "react-icons/fa";
import moment from "moment";
const Profile = () => {
  return (
    <div className="flex justify-center items-center mt-20">
      <div className="flex flex-col gap-2 items-center">
        <img
          src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fHVzZXIlMjBwcm9maWxlfGVufDB8fDB8fHww"
          alt="dh"
          className="h-40 w-40 rounded-full object-cover"
        />
        <div className="flex items-center gap-3 text-white">
          <GrAd className="w-5 h-5" />
          <p className="font-semibold text-lg">sjcjcjsj csjcbjscbs csbcbschs</p>
        </div>

        <span className="text-center text-gray-500 ">bio</span>
        <div className="flex items-center gap-3 text-white">
          <FaRegUserCircle className="w-5 h-5" />
          <p className="font-semibold text-lg">ruchit</p>
        </div>

        <span className="text-center text-gray-500 ">name</span>
        <div className="flex items-center gap-3 text-white">
          <FaRegCalendarAlt className="w-5 h-5" />
          <p className="font-semibold text-lg">
            {moment("2023-11-04").fromNow()}
          </p>
        </div>

        <span className="text-center text-gray-500 ">Joined</span>
      </div>
    </div>
  );
};

export default Profile;
