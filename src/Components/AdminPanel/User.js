import React, { useContext, useState } from 'react'
import { apContext } from '../context/AdminPanel/apContext'


export default function User(props) {


    const adminContext = useContext(apContext);
    const {
        adminUser,
        setAdminUser,
        getUserID,
        handleUserPermissions,
        numOfUSers,
        setNumOfUsers,
    } = adminContext;



    return (
        <React.Fragment>
            <div className="d-flex justify-content-start py-3 px-2" id={props._id}>
                <input
                    className="cursorPointer"
                    type="checkbox"
                    id=""
                    name={`${props.first_name} ${props.last_name}`}
                    value={props._id}
                    onChange={getUserID}
                    onClick={handleUserPermissions} 
                />
                <i className="bi bi-person-fill ps-2"></i>
                <label className="ps-2 ">
                    {`${props.first_name} ${props.last_name}`}
                </label>
            </div>
        </React.Fragment>
    )
}
