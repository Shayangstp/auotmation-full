import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";

const Loading = () => {
    return (
        <div className="d-flex justify-content-center align-items-center w-100 h-100 position-absolute cursorDefault" style={{'background': '#21252926'}}>
            <FontAwesomeIcon icon={faSpinner} className='spinner font60'/>
        </div>
    );
};

export default Loading;