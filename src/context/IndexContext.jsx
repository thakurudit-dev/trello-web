import React, { createContext, useContext, useEffect, useState } from 'react'
import DEVELOPMENT_CONFIG from '../helpers/config';
import apiHelper from '../helpers/api-helper';

const IndexContext = createContext();

export default function ContextProvider({ children }) {
    const [dashbordDataObj, setDashbordDataObj] = useState({})

    const [boardData, setBoardData] = useState([]);

    const [boardUsers, setBoardUsers] = useState([])

    const [allJoinedUsers, setAllJoinedUsers] = useState([])

    const [openDescription, setOpenDescription] = useState(false)
    const [childCardDetails, setChildCardDetails] = useState({})

    // DISPLAY BOARD DATA ( TASK CARD WITH CHILD CARD )
    const handleOnDashbord = (async (id) => {
        console.log("Enter in handle===========OnDashbord context")
        localStorage.setItem("dashbordCID", id)
        let result = await apiHelper.getRequest(`display-board?board_id=${id}`)
        if (result?.code === DEVELOPMENT_CONFIG.statusCode) {
            setDashbordDataObj(result?.body)
        } else {
            setDashbordDataObj({})
        }
    })

    // GET BOARDS WHEN USER IS LOGED IN
    async function getBoards() {
        console.log("getBoards function run ======>>> context");
        let result = await apiHelper.getRequest("get-boards");
        if (result?.code === DEVELOPMENT_CONFIG.statusCode) {
            setBoardData(result?.body);
            let dashbordCID = parseInt(localStorage.getItem("dashbordCID"), 10);
            if (result.body?.length > 0) {
                if (dashbordCID) {
                    handleOnDashbord(dashbordCID);
                } else {
                    handleOnDashbord(result?.body[0]?.id);
                }
            }
        } else {
            setBoardData([]);
        }
    }

    // GET BOARD USERS
    async function getBoardUsers(id) {
        let result = await apiHelper.getRequest(`get-board-users?board_id=${id}`)
        if (result?.code === DEVELOPMENT_CONFIG.statusCode) {
            setBoardUsers(result?.body)
        } else {
            setBoardUsers([])
        }
    }

    // GET ALL USERS JOINED CARD
    async function getAllUsersJoinedCard(c_id) {
        let result = await apiHelper.getRequest(`get-all-users-joined-card?c_id=${c_id}`)
        if (result?.code === DEVELOPMENT_CONFIG.statusCode) {
            setAllJoinedUsers(result?.body)
        } else {
            setAllJoinedUsers([])
        }
    }

    // GET CARD DETAILS
    async function getChildCardDetails(c_id) {
        let result = await apiHelper.getRequest(`get-child-card?c_id=${c_id}`)
        if (result?.code === DEVELOPMENT_CONFIG.statusCode) {
            setChildCardDetails(result?.body)
        } else {
            setChildCardDetails({})
        }
    }

    // OPEN DESCRIPTION MODAL
    const handleOpenDescriptionModal = (async (id) => {
        await getChildCardDetails(id)
        setOpenDescription(true)
    })

    // CHECKED OR UNCHECKED CHILD CARD
    const handleComplete = async (e, id) => {
        e.preventDefault();
        const newStatus = !childCardDetails?.history?.is_checked;
        let data = JSON.stringify({
            c_id: id,
            is_checked: newStatus,
        });
        let result = await apiHelper.postRequest("update-child-card-status", data);
        if (result?.code === DEVELOPMENT_CONFIG.statusCode) {
            setChildCardDetails((prev) => ({
                ...prev,
                history: {
                    ...prev.history,
                    is_checked: result?.body?.is_checked,
                },
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
        } else { }
    };

    const handleValidation = () => {
        let isValid = true;
        if (childCardDetails?.history.title.trim() === "") {
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
            setChildCardDetails((prev) => ({
                ...prev,
                history: {
                    ...prev.history,
                    title: title,
                },
            }));
            setDashbordDataObj((prev) => ({
                ...prev,
                dashbord_cards: prev.dashbord_cards.map((list) => {
                    if (list.id === result?.body?.dashbord_c_id) {
                        return {
                            ...list,
                            child_cards: list.child_cards.map((card) =>
                                card.id === result?.body?.id
                                    ? { ...card, title: result?.body?.title }
                                    : card
                            ),
                        };
                    }
                    return list;
                }),
            }));
        } else { }
    };

    return (
        <IndexContext.Provider
            value={{
                dashbordDataObj, setDashbordDataObj, handleOnDashbord,
                boardData, setBoardData, getBoards,
                boardUsers, setBoardUsers, getBoardUsers,
                allJoinedUsers, setAllJoinedUsers, getAllUsersJoinedCard,
                openDescription, setOpenDescription, handleOpenDescriptionModal,
                childCardDetails, setChildCardDetails,
                handleComplete,
                handleUpdateChildCardTitle,
            }}
        >
            {children}
        </IndexContext.Provider>
    )
}

export const useIndexContext = () => useContext(IndexContext)