import React, { useState, useEffect, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import ImageProfile from "../ImageProfile";
import AccountNav from "../AccounNav";
import { UserContext } from "../UserContext";

export default function MessagesPage() {
  const { id } = useParams();
  const { user } = useContext(UserContext);
  const [messages, setMessages] = useState([]);
  const [participants, setParticipants] = useState([]);
  const [selectedParticipant, setSelectedParticipant] = useState(null);
  const [messageInput, setMessageInput] = useState("");

  useEffect(() => {
    axios
      .get("/messages")
      .then(({ data }) => {
        // Sort messages
        data.sort((a, b) => new Date(a.messageDate) - new Date(b.messageDate));
        setMessages(data);

        // unique participant IDs
        const participantIds = [
          ...new Set([
            ...data.map((message) => message.sender),
            ...data.map((message) => message.resiver),
          ]),
        ];

        // Fetch participant info
        Promise.all(participantIds.map(fetchParticipantInfo))
          .then((participantData) => {
            setParticipants(participantData.filter(Boolean));
          })
          .catch((error) => {
            console.error("Error fetching participant information:", error);
          });
      })
      .catch((error) => {
        console.error("Error fetching messages:", error);
      });
  }, []);

  const fetchParticipantInfo = (participantId) => {
    return axios
      .get(`/users/${participantId}`)
      .then((response) => response.data)
      .catch((error) => {
        console.error(
          `Error fetching information for participant ID ${participantId}:`,
          error
        );
        return null;
      });
  };

  const handleParticipantClick = (participantId) => {
    setSelectedParticipant(participantId);
  };
  
  let today = new Date();
  const sendMessage = async () => {
    if (!messageInput || !selectedParticipant) return;
    
    try {
      await axios.post('/message', {
        resiver: selectedParticipant,
        message: messageInput,
        messageDate: today,
      });

      const newMessage = {
        sender: user,
        resiver: selectedParticipant,
        message: messageInput,
        messageDate: new Date().toISOString(), // Current timestamp
      };

      setMessages([...messages, newMessage]);
      setMessageInput("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <div>
      <AccountNav />
      <div className="flex h-screen text-gray-800 mt-8">
        <div className="flex h-full overflow-auto border rounded-2xl flex-col w-1/4">
          {participants.length > 0 &&
            participants.map((participant, index) => (
              <div key={index} className="mb-2">
                <button
                  className="flex mt-0.5 items-center bg-transparent border rounded-2xl"
                  onClick={() => handleParticipantClick(participant._id)}
                >
                  {participant.profilephoto ? (
                    <ImageProfile
                      className="rounded-full object-cover"
                      src={participant.profilephoto}
                      alt=""
                      style={{ width: "45px", height: "45px" }}
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
                  <div className="ml-2 mr-2">{participant.username}</div>
                </button>
              </div>
            ))}
        </div>
        <div className="flex flex-col w-3/4">
          <div className="flex-grow overflow-auto bg-slate-100 border rounded-2xl">
            {selectedParticipant && (
              <div className="bg-indigo-400 p-2 border-b-2">
                {
                  participants.find(
                    (participant) => participant._id === selectedParticipant
                  )?.username
                }
              </div>
            )}
            {messages.map((message) => {
              const isFromSelectedParticipant =
                message.sender === selectedParticipant;
              const isToSelectedParticipant =
                message.resiver === selectedParticipant;
              return (
                (isFromSelectedParticipant || isToSelectedParticipant) && (
                  <div
                    key={message._id}
                    className={`${
                      isFromSelectedParticipant
                        ? "self-end bg-indigo-200"
                        : "self-start bg-gray-200"
                    } p-2 my-1 mx-2 max-w-xs rounded-lg`}
                  >
                    {message.message}
                  </div>
                )
              );
            })}
          </div>
          <div className="flex items-center">
            <input
              type="text"
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              placeholder="Type a message..."
              className="border rounded-2xl p-2 w-full"
            />
            <button
              onClick={sendMessage}
              className="ml-2 p-3 rounded-2xl bg-indigo-400 text-white"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}