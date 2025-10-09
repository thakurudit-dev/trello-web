import React, { useState, useEffect, useRef } from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import { X, Link } from "lucide-react";
import apiHelper from "../helpers/api-helper";
import DEVELOPMENT_CONFIG from "../helpers/config";
import { toast } from "react-toastify";
import { socket } from "../pages/Dashbord";

const style = {
    position: "absolute",
    top: "40%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 600,
    bgcolor: "background.paper",
    p: 2,
};

export default function InviteMembers({ openInvite, setOpenInvite }) {
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");

    const [isUserList, setIsUserList] = useState(false);
    const [usersList, setUsersList] = useState([]);
    const [allUserEmails, setAllUserEmails] = useState([]);
    const userListRef = useRef(null);

    let dashbordCID = parseInt(localStorage.getItem("dashbordCID"), 10);

    const handleClose = () => {
        setOpenInvite(false);
        setEmail("");
        setError("")
    };

    const success = (msg) => {
        toast.success(msg,
            {
                autoClose: 5000,
            });
    }

    // HANDLE INVITE MEMBER
    async function handleInviteMember(e) {
        e.preventDefault();
        if (!email || !dashbordCID) {
            setError("Field is required");
            return;
        }
        setError("");

        let data = JSON.stringify({
            collaborator_email: email
        })
        let result = await apiHelper.postRequest(`invite-collaborator?board_id=${dashbordCID}`, data)
        if (result?.code === DEVELOPMENT_CONFIG.statusCode) {
            await socket.emit("send_notification", result?.body);
            handleClose()
            setEmail("")
            setError("")
            success(result?.message)
        } else {
            setError(result?.message)
        }
    }

    // GET ALL USERS
    useEffect(() => {
        async function handleGetAllUsers() {
            let result = await apiHelper.getRequest("get-all-users")
            if (result?.code === DEVELOPMENT_CONFIG.statusCode) {
                setAllUserEmails(result?.body)
            } else {
                setAllUserEmails([])
            }
        }
        handleGetAllUsers();
    }, []);

    useEffect(() => {
        if (email) {
            const filtered = allUserEmails
                .filter((val) => val.email.toLowerCase().includes(email.toLowerCase()))
                .slice(0, 5);
            setUsersList(filtered);
            if (!filtered.some((user) => user.email === email)) {
                setIsUserList(filtered.length > 0);
            }
        } else {
            setIsUserList(false);
        }
    }, [email, allUserEmails]);

    const handleSelect = (selectedEmail) => {
        setEmail(selectedEmail);
        setIsUserList(false);
    };

    useEffect(() => {
        function handleClickOutside(event) {
            if (userListRef.current && !userListRef.current.contains(event.target)) {
                setIsUserList(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div>
            <Modal
                open={openInvite}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style} className="rounded-xl">
                    <div>
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg text-gray-700 font-normal">Invite to Workspace</h2>
                            <button
                                className="text-gray-400 hover:bg-gray-300 rounded p-1 w-7"
                                onClick={handleClose}
                            >
                                <X size={20} />
                            </button>
                        </div>
                        <div className="relative">
                            <input
                                type="email"
                                placeholder="Enter email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full p-2 bg-white text-sm text-gray-600 font-normal border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        e.preventDefault();
                                        handleInviteMember(e);
                                    }
                                }}
                            />
                            {isUserList && (
                                <ul ref={userListRef} className="absolute w-full border border-gray-300 bg-white shadow-md rounded mt-1 p-1 z-10 max-h-56 overflow-auto">
                                    {usersList.map((user) => (
                                        <li
                                            key={user.id}
                                            onClick={() => handleSelect(user.email)}
                                            className="p-2 hover:bg-gray-200 rounded cursor-pointer"
                                        >
                                            {user.email}
                                        </li>
                                    ))}
                                </ul>
                            )}

                            {error && <p className="text-red-500 mt-1 text-sm">{error}</p>}
                        </div>
                        <div className="flex items-center justify-between mt-8 gap-3">
                            <p className=" text-sm text-gray-900">
                                Invite someone to this Workspace with a link:
                            </p>
                            <button
                                className="flex items-center justify-center gap-2 bg-gray-300 hover:bg-gray-400 text-sm text-gray-900 font-medium py-2 px-4 rounded-md"
                                onClick={(e) => handleInviteMember(e)}
                            >
                                <Link size={16} /> Invite
                            </button>
                        </div>
                    </div>
                </Box>
            </Modal>
        </div>
    );
}
