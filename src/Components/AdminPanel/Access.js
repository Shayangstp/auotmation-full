import React, { useEffect, useState, useContext } from 'react'
import { apContext } from '../context/AdminPanel/apContext'
import AccessList from './AccessList'



export default function Access({ dataEntry }) {



    const adminContext = useContext(apContext)
    const {
        handleInputs,
        handleFormSubmit,
        makeJsonFile,
        getNestedChildren,
        adminAccess,
        handleArrowClick,
        level1,
        setLevel1,
        handleDeleteOrAddAccess,
    } = adminContext;



    return (
        <React.Fragment>
            {dataEntry.map((access) => {
                return (
                    <div className="m-3 px-3" key={access._id}>
                        <input
                            className="cursorPointer"
                            type='checkbox'
                            value={access._id}
                            onClick={handleInputs}
                            name='accessInput'
                            onChange={handleDeleteOrAddAccess}
                        />
                        <label className="m-0 ps-2 pe-2" >{access.name}</label>
                        {access.children && <i className="bi bi-caret-down cursorPointer" id={access._id} onClick={handleArrowClick}></i>}
                        {level1 && access.children && <Access dataEntry={access.children} />}
                    </div>
                )
            })}
        </ React.Fragment>
    )
}


