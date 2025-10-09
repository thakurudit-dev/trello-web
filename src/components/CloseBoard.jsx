import React, { useState } from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import { ChevronDown, ChevronLeft, ChevronRight, X } from "lucide-react";
import { Link } from "react-router-dom";
import apiHelper from "../helpers/api-helper";
import DEVELOPMENT_CONFIG from "../helpers/config";
import { useIndexContext } from "../context/IndexContext";
import { toast } from "react-toastify";

const style = {
  position: "absolute",
  top: "58%",
  left: "23%",
  transform: "translate(-50%, -50%)",
  width: 305,
  bgcolor: "background.paper",
  p: 2,
};

function ChildModal({ openChild, setOpenChild, setOpen, boardData }) {
  const { getBoards } = useIndexContext();
  const handleCloseChild = () => {
    setOpenChild(false);
  };

  const handleBack = () => {
    setOpenChild(false);
    setOpen(true);
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

  const handleCloseBoard = async (e, id) => {
    e.preventDefault();
    let data = JSON.stringify({});

    let result = await apiHelper.postRequest(
      `close-board?board_id=${id}`,
      data
    );
    if (result?.code === DEVELOPMENT_CONFIG.statusCode) {
      handleCloseChild();
      localStorage.removeItem("dashbordCID");
      getBoards();
      success(result.message)
    } else {
      handleCloseChild();
      error(result.message)
    }
  };

  return (
    <>
      <Modal
        open={openChild}
        onClose={handleCloseChild}
        aria-labelledby="child-modal-title"
        aria-describedby="child-modal-description"
      >
        <Box sx={style} className="rounded-xl">
          <div className="space-y-4 p-1">
            <div className="flex justify-between">
              <button className="cursor-pointer" onClick={handleBack}>
                <ChevronLeft size={18} />
              </button>
              <p className="text-base font-semibold text-gray-600 text-center">
                Close board?
              </p>
              <button className="cursor-pointer" onClick={handleCloseChild}>
                <X size={16} strokeWidth={2} />
              </button>
            </div>
            <p id="child-modal-descriptio" className="text-sm text-gray-600">
              You can find and reopen closed boards at the bottom of{" "}
              <Link className="text-blue-500">your boards page</Link>.
            </p>
            <button
              className="w-full bg-red-600 hover:bg-red-700 text-white text-sm font-semibold p-1 rounded"
              onClick={(e) => handleCloseBoard(e, boardData?.id)}
            >
              Close
            </button>
          </div>
        </Box>
      </Modal>
    </>
  );
}

export default function CloseBoard({ boardTitle, open, setOpen, removeBoard }) {
  const [visibility, setVisibility] = useState("Sort by most recent");
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  let sortOptions = ["Sort by most recent", "Sort alphabetically"];
  const handleClose = () => {
    setOpen(false);
  };

  const [openChild, setOpenChild] = useState(false);
  const handleOpenChild = (id) => {
    setOpen(false);
    setOpenChild(true);
  };

  return (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="parent-modal-title"
        aria-describedby="parent-modal-description"
      >
        <Box sx={style} className="rounded-xl space-y-4">
          <div className="flex justify-between">
            <p></p>
            <p className="text-sm font-semibold text-gray-500 text-center">
              {boardTitle.title}
            </p>
            <button className="cursor-pointer" onClick={handleClose}>
              <X size={16} strokeWidth={2} />
            </button>
          </div>
          <div>
            {!removeBoard ? (
              <div className="relative">
                <button
                  className="w-full text-sm text-gray-600 p-2 rounded flex justify-between items-center hover:border border-gray-700 cursor-pointer"
                  onClick={() => setDropdownOpen(!isDropdownOpen)}
                >
                  {visibility}
                  <ChevronDown size={18} />
                </button>
                {isDropdownOpen && (
                  <div className="absolute left-0 w-full mt-1 bg-white border border-gray-300 rounded shadow-lg">
                    {sortOptions.map((option) => (
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
            ) : (
              <div className="relative">
                <button
                  className="flex items-center w-full justify-between cursor-pointer p-2 hover:bg-gray-300 rounded"
                  onClick={() => handleOpenChild(boardTitle.id)}
                >
                  <span className="text-sm text-gray-600">Close Board</span>
                  <ChevronRight size={18} />
                </button>
              </div>
            )}
          </div>
        </Box>
      </Modal>
      <ChildModal
        openChild={openChild}
        setOpenChild={setOpenChild}
        setOpen={setOpen}
        boardData={boardTitle}
      />
    </div>
  );
}
