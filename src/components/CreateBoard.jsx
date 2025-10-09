import React, { useState } from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import { ChevronDown, X } from "lucide-react";
import { Link } from "react-router-dom";
import apiHelper from "../helpers/api-helper";
import DEVELOPMENT_CONFIG from "../helpers/config";
import { useIndexContext } from "../context/IndexContext";
import { toast } from "react-toastify";

const style = {
  position: "absolute",
  top: "50%",
  left: "29%",
  transform: "translate(-50%, -50%)",
  width: 305,
  bgcolor: "background.paper",
  p: 2,
};

export default function CreateBoard({ open, setOpen }) {
  const { getBoards } = useIndexContext();
  const [boardTitle, setBoardTitle] = useState("");
  const [background, setBackground] = useState("#d946ef");
  const [visibility, setVisibility] = useState("Workspace");
  const [isDropdownOpen, setDropdownOpen] = useState(false);

  const backgrounds = ["#d946ef", "#2563eb", "#3b82f6", "#9333ea"];
  const visibilityOptions = ["Workspace", "Public", "Private"];

  // CLOSE CREATE BOARD MODAL
  const handleClose = () => {
    setOpen(false);
  };

  const success = (msg) => {
    toast.success(msg,
      {
        autoClose: 5000,
      });
  }
  const error = (msg) => {
    toast.error(msg,
      {
        autoClose: 5000,
      });
  }

  const handleReset = () => {
    setBoardTitle("");
    setBackground("#d946ef");
    setVisibility("Workspace");
  };

  const handleValidation = () => {
    let isValid = true;
    if (boardTitle.trim() === "") {
      isValid = false;
    }
    return isValid;
  };
  // CREATE BORED
  async function createBoard(e) {
    e.preventDefault();
    if (!handleValidation()) {
      return;
    }
    let data = JSON.stringify({
      bg_color: background,
      title: boardTitle,
      visibility,
    });
    let result = await apiHelper.postRequest("create-board", data);
    if (result?.code === DEVELOPMENT_CONFIG.statusCode) {
      localStorage.setItem("dashbordCID", result?.body?.id);
      handleClose();
      handleReset();
      getBoards(); // UPDATE CONTENT OR UPDATE setBoardData([])
      success(result.message)
    } else {
      error(result.message)
    }
  }

  return (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style} className="rounded-xl space-y-4">
          <div className="flex justify-between">
            <p></p>
            <p className="text-base font-semibold text-gray-600 text-center">
              Create Board
            </p>
            <button className="cursor-pointer" onClick={handleClose}>
              <X size={16} strokeWidth={2} />
            </button>
          </div>

          <div className="">
            <label className="text-sm font-semibold text-gray-600">
              Background
            </label>
            <div className="flex gap-2 mt-2">
              {backgrounds.map((bg, index) => (
                <button
                  key={index}
                  className={`w-10 h-10 rounded border-2 ${background === bg ? "border-transparent" : "border-white"
                    }`}
                  style={{
                    backgroundColor: bg.startsWith("#") ? bg : "transparent",
                    backgroundSize: "cover",
                  }}
                  onClick={() => setBackground(bg)}
                />
              ))}
            </div>
          </div>

          <div className="">
            <label className="text-sm font-semibold text-gray-600">
              Board title <span className="text-red-500">*</span>
            </label>
            <input
              className="w-full mt-2 border text-sm text-gray-600 border-red-400 rounded p-2 focus:outline-blue-600"
              placeholder="Enter board title"
              value={boardTitle}
              onChange={(e) => setBoardTitle(e.target.value)}
            />
            {boardTitle === "" && (
              <p className="text-gray-500 text-sm mt-1">
                👋 Board title is required
              </p>
            )}
          </div>

          <div className="">
            <label className="x-sm font-semibold text-gray-600">
              Visibility
            </label>
            <div className="relative mt-2">
              <button
                className="w-full text-sm text-gray-600 p-2 rounded flex justify-between items-center border border-gray-700 cursor-pointer"
                onClick={() => setDropdownOpen(!isDropdownOpen)}
              >
                {visibility}
                <ChevronDown size={18} />
              </button>
              {isDropdownOpen && (
                <div className="absolute left-0 w-full mt-1 bg-white border border-gray-300 rounded shadow-lg">
                  {visibilityOptions.map((option) => (
                    <button
                      key={option}
                      className={`w-full text-left p-2 text-sm text-gray-600 hover:bg-gray-100 cursor-pointer ${visibility === option ? "bg-gray-200" : ""
                        }`}
                      onClick={() => {
                        setVisibility(option);
                        setDropdownOpen(false);
                      }}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <button
              className={`w-full text-sm py-2 rounded ${boardTitle
                ? "cursor-pointer text-white bg-blue-500 hover:bg-blue-600"
                : "cursor-not-allowed bg-gray-100 text-gray-400"
                }`}
              disabled={!boardTitle}
              onClick={createBoard}
            >
              Create
            </button>
            <button
              variant="outline"
              className="w-full bg-gray-200 hover:bg-gray-300 text-sm text-black py-2 rounded cursor-pointer"
            >
              Start with a template
            </button>
          </div>

          <div className="text-sm text-gray-400 p-2 bg-purple-50 rounded space-y-1">
            <p className="text-purple-400 w-fit px-1 font-bold text-xs border border-blue-400 rounded">
              PREMIUM
            </p>
            <p className="font-semibold text-black">
              Create unlimited boards in Premium
            </p>
            <p className="text-xs">
              Free Workspaces can only have up to 10 boards.
            </p>
          </div>

          <div className="">
            <p className="text-xs text-gray-500">
              {" "}
              By using images from Unsplash, you agree to their{" "}
              <Link> license</Link> and<Link> Terms of Service</Link>
            </p>
          </div>
        </Box>
      </Modal>
    </div>
  );
}
