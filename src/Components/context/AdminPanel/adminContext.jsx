import React, { useState } from "react";
import { apContext } from "./apContext";
import {
    getAllUsernames,
    getAllAccess,
    postUserPermissions,
    getUserPermissions,
    deleteUserPermissions,
} from "../../../Services/AdminPanel/adminServices";

import { faArrowAltCircleDown } from "@fortawesome/free-solid-svg-icons";
import { successMessage, errorMessage, warningMessage } from "../../../utils/message";


const AdminContext = ({ children, loading, setLoading }) => {


    const [adminUsers, setAdminUsers] = useState([]);
    const [adminAccess, setAdminAccess] = useState([]);
    const [adminUser, setAdminUser] = useState("");
    const [perms, setPerms] = useState([]);
    const [userIDs, setUserIDs] = useState([]);
    const [usersPermissions, setUsersPermissions] = useState([]);
    const [accessMenu, setAccessMenu] = useState([]);
    const [searchInput, setSearchInput] = useState('');
    const [filteredResults, setFilteredResults] = useState([]);
    const [levelAccess, setLevelAccess] = useState([]);
    const [level1, setLevel1] = useState(true);
    const [prevAccess, setPrevAccess] = useState([]);
    const [numOfUsers, setNumOfUsers] = useState(0);
    // const [selectedAccessInputs, setSelectedAccessInputs] = useState([]);
    // const [deletedUserperms, setDeletedUserPerms] = useState([]);
    const [selectedUserId, setSelectedUserId] = useState('')
    const [allAccessDetails, setAllAccessDetails] = useState([])
    const [deleteObj, setDeleteObj] = useState([])





    const handleAllAccess = async () => {
        try {
            const { data } = await getAllAccess();
            data.shift();
            const cloneData = structuredClone(data);
            setLevelAccess(data);
            const newData = getNestedChildren(cloneData, "631dcc3239ddb87a079a3a33")
            setAccessMenu(newData)
            setAdminAccess(newData)
        } catch (ex) {
            console.log(ex);
        }
    }



    const handleAllUsernames = async () => {
        try {
            const { data } = await getAllUsernames();
            setAdminUsers(data);
        } catch (ex) {
            console.log(ex);
        }
    }


    const handleInputs = (e) => {
        if (e.target.checked === true) {
            const allPerms = [...perms]
            const result = e.target.value;
            allPerms.push(result)
            setPerms(allPerms)
        } else {
            const allPerms = [...perms]
            const result = e.target.value;
            const index = allPerms.indexOf(result)
            if (index > -1) {
                allPerms.splice(index, 1)
            }
            setPerms(allPerms)
            // const deleted = selectedAccessInputs.filter(input => input.checked == false)
            //     .map(each => each.value)
            // // setDeletedUserPerms(deleted)
        }
    }


    const getUserID = e => {
        if (e.target.checked === true) {
            const allUserIDs = [...userIDs]
            const result = e.target.value;
            allUserIDs.push(result)
            setUserIDs(allUserIDs)
        } else {
            const allUserIDs = [...userIDs]
            const result = e.target.value;
            const index = allUserIDs.indexOf(result)
            if (index > -1) {
                allUserIDs.splice(index, 1)
            }
            setUserIDs(allUserIDs)
        }
    }


    const handleFormSubmit = async () => {
        try {
            // if (deletedUserperms.length !== 0) {
            //     // const { data } = await deleteUserPermissions(deletedUserperms)
            // }
            if (perms.length !== 0) {
                const allUserPerms = []
                userIDs.map((userID) => {
                    const userPerms =
                    {
                        id: userID,
                        permissions: [...perms]
                    }
                    allUserPerms.push(userPerms)
                    setUsersPermissions(allUserPerms)
                })
                if (allUserPerms.length !== 0) {
                    const { data } = await postUserPermissions(allUserPerms)
                    if (data.code == 414) {
                        errorMessage('خطا!')
                    } else if (data.code == 415) {
                        successMessage('ثبت با موفقیت انجام شد')
                        handleCancleButton()
                    } else {
                        successMessage('ثبت با موفقیت انجام شد')
                        handleCancleButton()
                    }
                } else {
                    if (perms.length === 0) {
                        errorMessage('دسترسی جدید داده نشده است')
                    } else if (userIDs.length === 0) {
                        errorMessage('کاربری انتخاب نشده است')
                    }
                }
            }
        }
        catch (ex) {
            console.log(ex)
        }

    }


    const makeJsonFile = (data) => {
        const jsonData = JSON.stringify(data);
        localStorage.setItem('json-data', jsonData)
    }


    const handleCancleButton = () => {
        const allInputs = document.getElementsByTagName('input')
        var arr = Array.from(allInputs)
        arr.map(input => input.checked = false)
        const serachInputs = Array.from(document.getElementsByClassName('search-users'))
        serachInputs.map(each => each.value = "");
        setAccessMenu(adminAccess)
        setFilteredResults(adminUsers)
        setUsersPermissions([]);
        setUserIDs([]);
        setPerms([]);
        setNumOfUsers(0)
    }


    function getNestedChildren(models, parentId) {
        const nestedTreeStructure = [];
        const length = models.length;
        for (let i = 0; i < length; i++) {
            const model = models[i];
            if (model.parentId == parentId) {
                const children = getNestedChildren(models, model._id);
                if (children.length > 0) {
                    model.children = children;
                }
                nestedTreeStructure.push(model);
            }
        }
        return nestedTreeStructure;
    }


    const searchItems = (searchValue) => {
        setSearchInput(searchValue)
        if (searchValue !== '') {
            const filteredData = adminUsers.filter((item) => {
                return Object.values(item).join('').includes(searchValue)
            })
            setFilteredResults(filteredData)
        }
        else {
            setFilteredResults(adminUsers)
        }
    }


    function searchTree(element, matchingTitle) {
        var baseAccess = [...accessMenu];
        if (matchingTitle !== '') {
            if (element.name.includes(matchingTitle)) {
                setAccessMenu([element])
                return element;
            } else if (element.children != null) {
                var i;
                var result = null;
                for (i = 0; result == null && i < element.children.length; i++) {
                    result = searchTree(element.children[i], matchingTitle);
                }
                setAccessMenu([result])
                return result;
            }
            return null;
        } else {
            setAccessMenu([baseAccess])
        }
    }


    function filteringAccess(arr, e) {
        const value = e.target.value;
        value.replace("ك", "ک");
        value.replace("ي", "ی");
        const data = arr.filter(item => item.name.includes(value))
        const parentId = data[0].parentId;
        const cloneData = structuredClone(data);
        const newData = getNestedChildren(cloneData, parentId)
        setAccessMenu(newData)
    }


    const handleArrowClick = (e) => {
        const accessId = e.target.id;
        accessMenu.map((access) => {
            access._id === accessId && setLevel1(prev => !prev)
        })
    }


    const handleUserPermissions = async (e) => {
        const userId = e.target.value;
        setSelectedUserId(userId)

        // if (e.target.checked) {
        //     const username = document.getElementById(userId);
        //     username.classList.add('username')
        // } else {
        //     const username = document.getElementById(userId);
        //     username.classList.remove('username')
        // }

        if (e.target.checked) {
            setNumOfUsers(prev => prev + 1)
            try {
                const { data } = await getUserPermissions(userId);
                setAllAccessDetails(data)
                const perIdData = []
                data.map(item => perIdData.push(item.perId))
                setPrevAccess(perIdData)
                // const _idData = []
                // data.map(item => _idData.push(item._id))
                // setPerms(data)
                const allInputs = document.getElementsByName('accessInput')
                let arr = Array.from(allInputs)
                if (numOfUsers == 0) {
                    // let selectedInputs = []
                    arr.map((input) => {
                        if (perIdData.includes(input.value)) {
                            input.checked = true;
                            // selectedInputs.push(input)
                            // setSelectedAccessInputs(selectedInputs)
                        }
                    })
                    // // arr.map((input) => {
                    //     if(_idData){

                    //     }
                    // })
                    // const deletedUserperms = selectedInputs.filter(input => input.checked == false)

                } else if (numOfUsers >= 1) {
                    arr.map(input => input.checked = false)
                }

            } catch (ex) {
                console.log(ex);
            }

        } else {
            setNumOfUsers(prev => prev - 1)
            const allInputs = document.getElementsByName('accessInput')
            var arr = Array.from(allInputs)
            arr.map(input => input.checked = false)
            setPrevAccess([])
        }
    }


    const checkUserPerms = () => {
        const allInputs = document.getElementsByName('accessInput')
        var arr = Array.from(allInputs)
        arr.map((input) => {
            if (prevAccess.includes(input.value)) {
                input.checked = true;
            }
        })
    }

    const [updatedPermissions, setUpdatedPermissions] = useState([]);
    const handleDeleteOrAddAccess = (e) => {
        // if (e.target.checked == false) {
        //     allAccessDetails.map((item => {
        //         if (e.target.value === item.perId) {
        //             const deleteOrAdd = {
        //                 userId: selectedUserId,
        //                 perId: item.perId,
        //                 _id: item._id,
        //                 actionType: '0',
        //             }
        //             if(prevAccess.includes(item.perId)){
        //                 setDeleteObj(oldArr => [...oldArr, deleteOrAdd])
        //             } else {
        //                 deleteOrAdd.actionType ="1"
        //             }

        //         }
        //     }))
        // } else {

        //     const deleteOrAdd = {
        //         userId: selectedUserId,
        //         perId: e.target.value,
        //         actionType: "1"
        //     }
        //     setDeleteObj(oldArr => [...oldArr, deleteOrAdd])
        // }

            const deletePermission = allAccessDetails.filter(item=>item.perId === e.target.value);
            const updated = [...updatedPermissions];
            const setItem = () => {
                const per = {
                    userId: selectedUserId,
                    perId: e.target.value,
                    _id: deletePermission.length !== 0 ? deletePermission[0]._id : '',
                    actionType: e.target.checked === true ? '1' : '0'
                }
                updated.push(per);
                setUpdatedPermissions(updated)
            }
            if(updated.length !== 0){
                const perIndex = updated.findIndex(item => item.perId === e.target.value);
                if(perIndex !== -1){
                    if(deletePermission.length === 0){
                        updatedPermissions.splice(perIndex, 1);
                    }else if(e.target.checked === true && deletePermission.length !== 0){
                        updatedPermissions.splice(perIndex, 1);
                    }else{
                        updatedPermissions[perIndex] = {
                            userId: selectedUserId,
                            perId: e.target.value,
                            _id: deletePermission.length !== 0 ? deletePermission[0]._id : '',
                            actionType: e.target.checked === true ? '1' : '0'
                        }
                    }
                }else{
                    setItem();
                }
            }else{
                setItem()
            }

        // if (prevAccess.includes(e.target.value)) {
        //         const data = allAccessDetails.filter((item) => item.perId === e.target.value)
        //             .map((each) => {
        //                 const deletedOrAdd = {
        //                     userId: selectedUserId,
        //                     perId: each.perId,
        //                     _id: each._id,
        //                     actionType: e.target.checked == false ? '0' : '1'
        //                 }
        //                 // setDeleteObj(oldArr => [...oldArr, deletedOrAdd])
        //                 setDeleteObj([deletedOrAdd])
        //             })
        //         }
    }




    return (
        <apContext.Provider
            value={{
                handleAllAccess,
                handleAllUsernames,
                setAdminUser,
                adminUser,
                handleInputs,
                handleFormSubmit,
                getUserID,
                makeJsonFile,
                handleCancleButton,
                getNestedChildren,
                accessMenu,
                setAccessMenu,
                searchItems,
                searchInput,
                setSearchInput,
                filteredResults,
                setFilteredResults,
                adminUsers,
                setAdminUsers,
                adminAccess,
                setAdminAccess,
                searchTree,
                filteringAccess,
                levelAccess,
                setLevelAccess,
                handleArrowClick,
                level1,
                setLevel1,
                handleUserPermissions,
                checkUserPerms,
                numOfUsers,
                setNumOfUsers,
                handleDeleteOrAddAccess,
                prevAccess,
                deleteObj,
            }}
        >
            {children}
        </apContext.Provider>
    )
}

export default AdminContext;