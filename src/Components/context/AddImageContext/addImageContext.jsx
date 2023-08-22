import React, { useState, useRef } from "react";
import { addImageCntxt } from "./addImageCntxt";
import { warningMessage } from "../../../utils/message";

const AddImageContext = ({ children }) => {
    const [reqItemImage, setReqItemImage] = useState('');
    const [reqItemImageType, setReqItemImageType] = useState('');
    const [reqItemImageFile, setReqItemImageFile] = useState('');
    const [reqItemImagesFile, setReqItemImagesFile] = useState([]);
    const [reqItemImagePreviewUrl, setReqItemImagePreviewUrl] = useState('');
    const reqItemImageRef = useRef();
    const [reqItemImages, setReqItemImages] = useState([]);
    const [reqNewItemImagesModal, setReqNewItemImagesModal] = useState(false);
    const handleUploadItemImage = e => {
        e.persist();
        (async () => {
            await console.log(e);
            const reader = new FileReader();
            const fileByteArray = [];
            reader.readAsArrayBuffer(e.target.files[0]);
            reader.onload = (evt) => {
                if (evt.target.readyState === FileReader.DONE) {
                    const arrBuffer = evt.target.result,
                        array = new Uint8Array(arrBuffer);
                    for (const a of array) {
                        fileByteArray.push(a);
                    }
                    setReqItemImage(fileByteArray)
                    setReqItemImageType(e.target.files[0].type)
                }
            }
            const reader1 = new FileReader();
            const file = e.target.files[0];
            reader1.onloadend = () => {
                setReqItemImageFile(file);
                setReqItemImagePreviewUrl(reader1.result);
            }
            reader1.readAsDataURL(file);
        })();
    }
    const handleAddItemImage = () => {
        var images = [];
        var imagesFile = [];
        if (reqItemImage !== '') {
            images = [...reqItemImages];
            imagesFile = [...reqItemImagesFile]
            const image = { image: reqItemImage, type: reqItemImageType };
            const imageFile = { image: reqItemImageFile, src: reqItemImagePreviewUrl };
            images.push(image);
            imagesFile.push(imageFile)
            setReqItemImages(images);
            setReqItemImage('');
            setReqItemImagesFile(imagesFile);
            setReqItemImageType('');
            document.getElementById('reqItemImage').value = '';
        } else {
            warningMessage('هیچ عکسی انتخاب نشده است.');
        }
        reqItemImageRef.current.focus();
    }
    return (
        <addImageCntxt.Provider
            value={{
                reqItemImageRef,
                reqItemImage,
                setReqItemImage,
                reqItemImagesFile,
                setReqItemImagesFile,
                reqItemImages,
                setReqItemImages,
                handleUploadItemImage,
                handleAddItemImage,
                reqNewItemImagesModal,
                setReqNewItemImagesModal
            }}
        >
            {children}
        </addImageCntxt.Provider>
    )
}

export default AddImageContext;