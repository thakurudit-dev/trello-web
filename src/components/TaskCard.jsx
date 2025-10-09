import {
  Minimize2,
  Maximize2,
  Plus,
  BookCopy,
  Ellipsis,
  X,
} from "lucide-react";
import React, { useState, useRef, useEffect } from "react";
import ChildCard from "./ChildCard";
import apiHelper from "../helpers/api-helper";
import DEVELOPMENT_CONFIG from "../helpers/config";
import { useDroppable } from "@dnd-kit/core";
import { toast } from "react-toastify";
import { useIndexContext } from "../context/IndexContext";

export default function TaskCard({ id, values }) {
  const { setDashbordDataObj } = useIndexContext();
  const [isClose, setIsClose] = useState(false);

  const [addCard, setAddCard] = useState(false);

  const scrollRef = useRef(null);
  const { setNodeRef } = useDroppable({ id });
  const cardRef = useRef(null);

  // OPEN AND CLOSE ADD CARD MODAL
  const handleOpenAddCard = () => {
    setAddCard(true);
    setTimeout(() => {
      if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      }
      if (cardRef.current) {
        cardRef.current.focus();
      }
    }, 100);
  };
  const handleCloseAddCard = () => {
    setAddCard(false);
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

  const [newValue, setNewValue] = useState("");
  const [listCard, setListCard] = useState({});

  useEffect(() => {
    setListCard(values);
  }, [values]);

  const handleValidation = () => {
    let isValid = true;
    if (newValue.trim() === "") {
      isValid = false;
    }
    return isValid;
  };
  // CREATE CHILD CARD ( ADD CARD )
  async function handleCreateChildCard(e) {
    e.preventDefault();
    if (!handleValidation()) {
      handleCloseAddCard();
      return;
    }
    let data = JSON.stringify({
      title: newValue,
      description: "",
      is_checked: false,
      dashbord_c_id: id,
    });
    let result = await apiHelper.postRequest("create-child-card", data);
    if (result?.code === DEVELOPMENT_CONFIG.statusCode) {
      handleCloseAddCard();
      setNewValue("");
      setDashbordDataObj((prev) => ({
        ...prev,
        dashbord_cards: prev.dashbord_cards.map((list) => {
          if (list.id === result?.body?.dashbord_c_id) {
            return {
              ...list,
              child_cards: [...list?.child_cards, { ...result?.body, joined_card_users: [] }],
            };
          }
          return list;
        }),
      }));
      success(result.message)
    } else {
      error(result.message)
    }
  }

  const handleValidation2 = () => {
    let isValid = true;
    if (listCard.title.trim() === "") {
      isValid = false;
    }
    return isValid;
  };
  // UPDATE LIST CARD
  const handleUpdateDashbordCard = async (e, id) => {
    e.preventDefault()
    if (!handleValidation2()) {
      return;
    }
    let data = JSON.stringify({
      dashbord_c_id: id,
      newListTitle: listCard.title,
    });
    let result = await apiHelper.postRequest("update-dashbord-card", data);
    if (result?.code === DEVELOPMENT_CONFIG.statusCode) {
      setDashbordDataObj((prev) => ({
        ...prev,
        dashbord_cards: prev.dashbord_cards?.map((list) => {
          if (list.id === result?.body?.id) {
            return {
              ...list,
              title: result?.body?.title,
            };
          }
          return list;
        }),
      }));
    } else { }
  };

  // HANDLE MIN OR MAX
  async function handleUpdateMinMax(e) {
    e.preventDefault();
    const newStatus = !isClose;
    setIsClose(newStatus);
    // LOCAL STORAGE
  }

  // Dynamic max height for overflow
  const [maxHeight, setMaxHeight] = useState("384px");
  const updateMaxHeight = () => {
    const windowHeight = window.innerHeight;
    const newMaxHeight = windowHeight * 0.63;
    setMaxHeight(`${newMaxHeight}px`);
  };
  useEffect(() => {
    updateMaxHeight();
    window.addEventListener("resize", updateMaxHeight);
    return () => {
      window.removeEventListener("resize", updateMaxHeight);
    };
  }, []);

  const handleCloseAll = (e) => {
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setAddCard(false)
    }
  }

  return (
    <>
      {!isClose ? (
        <div
          key={id}
          ref={setNodeRef}
          className="bg-white h-fit text-gray-600 font-medium p-3 cursor-pointer min-w-72 rounded-xl shadow-md flex flex-col space-y-2"
        >
          <div className="flex items-start justify-between gap-2 pb-2 mb-1">
            <textarea
              value={listCard?.title}
              className="w-full h-8 px-2 py-1 text-base font-semibold resize-none outline-none overflow-hidden rounded focus:border-2 focus:border-blue-600"
              onChange={(e) => {
                setListCard((prev) => ({
                  ...prev,
                  title: e.target.value,
                }));
                e.target.style.height = "32";
                e.target.style.height = e.target.scrollHeight + "px";
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleUpdateDashbordCard(e, listCard.id);
                }
              }}
            />
            <div className="flex items-center p-1 gap-4">
              <button
                className="cursor-pointer"
                onClick={(e) => handleUpdateMinMax(e)}
              >
                <Minimize2 size={16} strokeWidth={2.5} className="rotate-45" />
              </button>
              {/* <button className="cursor-pointer">
                <Ellipsis size={18} strokeWidth={2.5} />
              </button> */}
            </div>
          </div>

          <div
            ref={scrollRef}
            className="pb-1 pr-1 mb-1 flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar"
            style={{
              maxHeight: maxHeight,
            }}
          >
            <div className="space-y-3 p-1">
              {listCard && listCard?.child_cards?.length > 0 && (
                <>
                  {listCard?.child_cards?.map((item) => (
                    <ChildCard
                      key={item.id}
                      id={item.id}
                      cardValues={item}
                    />
                  ))}
                </>
              )}

              {addCard && (
                <div className="flex flex-col gap-2" tabIndex={0} onBlur={handleCloseAll}>
                  <textarea
                    ref={cardRef}
                    value={newValue}
                    placeholder="Enter a title or pase a link"
                    className="w-full h-fit text-sm text-gray-700 font-normal border-2 border-blue-500 rounded resize-none outline-none px-2 py-2"
                    onChange={(e) => setNewValue(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleCreateChildCard(e);
                      }
                    }}
                  />
                  <div className="flex gap-1">
                    <button
                      className="text-sm text-white bg-blue-600 hover:bg-blue-700 px-3 rounded cursor-pointer"
                      onClick={handleCreateChildCard}
                    >
                      Add card
                    </button>
                    <button
                      className="text-gray-500 p-2 rounded hover:bg-gray-300 cursor-pointer"
                      onClick={handleCloseAddCard}
                    >
                      {" "}
                      <X size={22} strokeWidth={3} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div
            className={`${addCard ? "hidden" : "flex"
              } items-center justify-between gap-2 pt-1`}
          >
            <div className="w-full">
              <button
                className="flex items-center px-0.5 gap-1.5 cursor-pointer w-full hover:bg-[#d0d4db] py-2 rounded"
                onClick={handleOpenAddCard}
              >
                <Plus size={18} strokeWidth={3} />
                <span className="text-sm font-semibold">Add a Card</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div
          key={listCard.id}
          className="cursor-pointer flex flex-col items-center bg-white text-gray-600 rounded-xl px-3 py-2 w-10 h-fit space-y-2"
        >
          <button className="" onClick={(e) => handleUpdateMinMax(e)}>
            <Maximize2 size={16} strokeWidth={2.5} className="rotate-45" />
          </button>
          <div className="flex items-center gap-2 rotate-0 writing-vertical-lr">
            <h2 className="text-sm font-semibold">{listCard.title}</h2>
            {/* <span className="text-xs mt-1">5</span> */}
          </div>
        </div>
      )}
    </>
  );
}
