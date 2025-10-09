import { Archive, Menu } from "lucide-react";
import React, { useEffect, useState, useRef } from "react";
import apiHelper from "../helpers/api-helper";
import DEVELOPMENT_CONFIG from "../helpers/config";
import { useDraggable } from "@dnd-kit/core";
import { useIndexContext } from "../context/IndexContext";

export default function ChildCard({ id, cardValues }) {
  const { setDashbordDataObj, handleOpenDescriptionModal } = useIndexContext();

  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id,
    data: { ...cardValues },
  });

  const style = transform
    ? {
      transform: `translate(${transform.x}px, ${transform.y}px)`,
      backgroundColor: "#E5E7EB",
      // border: "1px solid blue",
      zIndex: 1000,
      // position: "relative",
    }
    : undefined;

  let [childCard, setChildCard] = useState({});

  // SET CHILD CARD DATA
  useEffect(() => {
    setChildCard(cardValues);
  }, [cardValues]);

  // CHECKED OR UNCHECKED CHILD CARD
  const handleComplete = async (e, id) => {
    e.preventDefault();
    const newStatus = !childCard?.is_checked;
    let data = JSON.stringify({
      c_id: id,
      is_checked: newStatus,
    });
    let result = await apiHelper.postRequest("update-child-card-status", data);
    if (result?.code === DEVELOPMENT_CONFIG.statusCode) {
      setChildCard((prev) => ({
        ...prev,
        is_checked: result?.body?.is_checked,
      }));
      setDashbordDataObj((prev) => ({
        ...prev,
        dashbord_cards: prev.dashbord_cards.map((list) => {
          if (list.id === result?.body?.dashbord_c_id) {
            return {
              ...list,
              child_cards: list.child_cards.map((card) =>
                card.id === result?.body?.id
                  ? { ...card, is_checked: result?.body?.is_checked }
                  : card
              ),
            };
          }
          return list;
        }),
      }));
    }
  };

  // HANDLE CHILD CARD ARCHIVED
  const handleChildCardArchive = async (e) => {
    e.preventDefault();
    const newStatus = true;
    let data = JSON.stringify({
      c_id: id,
      newStatus,
    });
    let result = await apiHelper.postRequest("child-card-archive", data);
    if (result?.code === DEVELOPMENT_CONFIG.statusCode) {
      setDashbordDataObj((prev) => ({
        ...prev,
        dashbord_cards: prev.dashbord_cards.map((list) => {
          if (list.id === result?.body?.dashbord_c_id) {
            return {
              ...list,
              child_cards: list.child_cards
                .filter(
                  (card) =>
                    card.id !== result?.body?.id || !result?.body?.is_archive
                )
                .map((card) =>
                  card.id === result?.body?.id
                    ? { ...card, is_archive: result?.body?.is_archive }
                    : card
                ),
            };
          }
          return list;
        }),
      }));
    }
  };

  let extractFirst = (name) => {
    const fName = name?.charAt(0);
    return fName
  }

  // NOT IN USE >>>>>>>>>>>>>>>>>>>>
  const textareaRef = useRef(null);
  const handleButtonClick = (e) => {
    e.stopPropagation();
    textareaRef.current?.focus();
  };

  const handleValidation = () => {
    let isValid = true;
    if (childCard.title.trim() === "") {
      isValid = false;
    }
    return isValid;
  };
  // UPDATE CHILD CARD TITLE
  const handleUpdateChildCardTitle = async (e, id, title) => {
    e.preventDefault();
    if (!handleValidation()) {
      return;
    }
    let data = JSON.stringify({
      c_id: id,
      title,
    });
    let result = await apiHelper.postRequest("update-child-card-title", data);
    if (result?.code === DEVELOPMENT_CONFIG.statusCode) {
      setChildCard((prev) => ({
        ...prev,
        title: title,
      }));
    }
  };

  return (
    <div
      key={id}
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={`flex flex-col items-start py-2 gap-2 border border-gray-300 rounded hover:ring-1 hover:ring-blue-500 group transition-colors duration-300`}
      style={style}
    >
      <div className="flex w-full items-start justify-between p-2">
        <div className="flex items-center justify-between gap-1 w-full">
          <input
            type="checkbox"
            checked={!!childCard?.is_checked}
            className="hidden group-hover:block w-5 h-4.5 appearance-none border-2 border-gray-500 cursor-pointer rounded-full checked:block checked:bg-green-600 checked:border-green-600 bg-center bg-no-repeat focus:outline-none"
            onPointerDown={(e) => e.stopPropagation()}
            onChange={(e) => handleComplete(e, id)}
          />
          <span className="w-full px-2 text-sm">{childCard?.title}</span>
          {/* <textarea
            ref={textareaRef}
            value={childCard?.title}
            className="w-full h-8 px-2 py-2 text-sm border-none resize-none outline-none overflow-hidden cursor-pointer"
            onChange={(e) => {
              setChildCard((prev) => ({
                ...prev,  
                title: e.target.value,
              }));
              e.target.style.height = "32";
              e.target.style.height = e.target.scrollHeight + "px";
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleUpdateChildCardTitle(e, childCard.id, childCard.title);
              }
            }}
          /> */}
        </div>
        <div className="flex items-center gap-1.5">
          {!!childCard?.is_checked && (
            <button
              className="hidden group-hover:block cursor-pointer "
              onPointerDown={(e) => e.stopPropagation()}
              onClick={(e) => handleChildCardArchive(e)}
            >
              <Archive size={15} />
            </button>
          )}
        </div>
      </div>
      <div className="w-full px-2 flex items-center justify-between">
        <button
          className="p-0.5 cursor-pointer"
          onPointerDown={(e) => e.stopPropagation()}
          onClick={() => handleOpenDescriptionModal(id)}
        >
          <Menu size={15} />
        </button>
        <ul className="flex">
          {!!childCard && childCard?.joined_card_users?.length > 0 && childCard?.joined_card_users?.map((value) => (
            <li key={value.id}>
              {!!value.is_join && (
                <div className="w-5 h-5 flex items-center justify-center bg-yellow-500 text-sm font-bold rounded-full">
                  {extractFirst(value.user_name)}
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
