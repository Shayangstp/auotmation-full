import React, { useState, useRef } from "react";
import { addLinkCntxt } from "./addLinkCntxt";
import { warningMessage } from "../../../utils/message";

const AddLinkContext = ({ children }) => {
    const [reqItemLink, setReqItemLink] = useState('');
    const [reqItemLinks, setReqItemLinks] = useState([]);
    const reqItemLinkRef = useRef();
    const [reqNewItemLinksModal, setReqNewItemLinksModal] = useState(false);
    const handleAddItemLink = () => {
        var links = [];
        if (reqItemLink !== '') {
            var linkValidation = new RegExp('^(https?:\\/\\/)?' + // protocol
                '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
                '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
                '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
                '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
                '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator
            if (linkValidation.test(reqItemLink)) {
                links = [...reqItemLinks];
                const link = {id: Math.floor(Math.random()*100000), url:reqItemLink};
                links.push(link);
                setReqItemLinks(links);
                setReqItemLink('');
            } else {
                warningMessage('فرمت لینک وارد شده صحیح نمی باشد.');
            }
        } else {
            warningMessage('هیچ آدرسی وارد نشده است.');
        }
        reqItemLinkRef.current.focus();
    }
    return (
        <addLinkCntxt.Provider
            value={{
                reqItemLink,
                setReqItemLink,
                reqItemLinks,
                setReqItemLinks,
                reqItemLinkRef,
                handleAddItemLink,
                reqNewItemLinksModal,
                setReqNewItemLinksModal,
            }}
        >
            {children}
        </addLinkCntxt.Provider>
    )
}

export default AddLinkContext;