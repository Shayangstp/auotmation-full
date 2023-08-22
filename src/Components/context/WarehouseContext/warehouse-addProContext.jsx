import React, { useState, useRef, useContext } from "react";
import { warehouseAddProCntxt } from "./warehouse-addProCntxt";
import { useDispatch, useSelector } from 'react-redux';
import xssFilters from "xss-filters";
import { successMessage, warningMessage, errorMessage } from "../../../utils/message";
import { getProByCodeOrName } from '../../../Services/warehouseAddProService';
import WarehouseAddProModal from "../../Modals/Warehouse/GoodSearchModal";
import { rootContext } from "../rootContext";

const WarehouseAddProContext = ({children}) => {

    const mainContext = useContext(rootContext);
    const {
        setLoading
    } = mainContext;

    const [addProCode, setAddProCode] = useState('');
    const [addProPrevCode, setAddProPrevCode] = useState('');
    const addProCodeRef = useRef();
    const [addProName, setAddProName] = useState('');
    const [addProPrevName, setAddProPrevName] = useState('');
    const addProNameRef = useRef();
    const [addProList, setAddProList] = useState([]);
    const [addProModal, setAddProModal] = useState(false);
    const [selectedPro, setSelectedPro] = useState({});

    const handleAddProCode = async () => {
        const addProCodeLength = addProCodeRef.current.value.replaceAll("-","").length;
        const addProCode = addProCodeRef.current.value.replaceAll("-","");
        if(addProCodeLength !== 0){
            if(addProCodeLength >= 5){
                const inputLength = 10 - addProCodeLength ;
                var zero = '';
                const autoZero = () => {
                    for(var i = 0 ; i < inputLength ; i++){
                        zero = zero + '0';
                    }
                    return zero;
                }
                const completedCode = addProCode.substring(0, 4) + autoZero() + addProCode.substring(4,addProCodeLength);
                setAddProCode(completedCode);
                setAddProPrevCode(completedCode);
                if(addProPrevCode !== completedCode){
                    setLoading(true);
                    try{
                        const getProByCodeRes = await getProByCodeOrName(completedCode, []);
                        if(getProByCodeRes.data.length !== 0){
                            setLoading(false);
                            setAddProName(getProByCodeRes.data[0].ItemName);
                            setAddProModal(false);
                            if(document.getElementById('purchaseProTechSpecifications') !== null){
                                document.getElementById('purchaseProTechSpecifications').focus();
                            }
                        }else{
                            setLoading(false);
                            errorMessage('کد موردنظر یافت نشد!');
                        }
                    }catch(ex){
                        setLoading(false);
                        console.log(ex);
                    }
                }
            }else{
                addProCodeRef.current.focus();
                addProCodeRef.current.select();
                setAddProName('');
                setAddProPrevCode('');
                setAddProPrevName('');
                errorMessage('کد انبار نمیتواند کمتر از 5 رقم باشد!');
            }
        }else{
            setAddProName('');
            setAddProPrevCode('');
            setAddProPrevName('');
        }
    }

    const handleAddProName = async () => {
        if(addProName !== ''){
            setAddProCode('');
            if(addProModal !== true){
                setAddProModal(true);
            }
            const searchedArray = addProName.split('+')
            setAddProPrevName(addProName)
            if(addProPrevName !== addProName){
                setLoading(true);
                try{
                    const getProByNameRes = await getProByCodeOrName('', searchedArray);
                    if(getProByNameRes.data.length !== 0){
                        setLoading(false);
                        setAddProList(getProByNameRes.data)
                    }else{
                        setLoading(false);
                        errorMessage('کالا موردنظر یافت نشد!');
                        setAddProList([]);
                    }
                }catch(ex){
                    setLoading(false);
                    console.log(ex);
                }
            }
        }
    }

    const handleResetAddPro = () => {
        // setAddProCode('');
        // setAddProName('');
        setAddProList([]);
        setSelectedPro({});
        setAddProPrevCode('');
        setAddProPrevName('');
    }

    return (
        <warehouseAddProCntxt.Provider
            value={{
                addProCode,
                setAddProCode,
                addProCodeRef,
                addProName,
                setAddProName,
                addProNameRef,
                handleAddProCode,
                handleAddProName,
                addProList,
                setAddProList,
                addProModal,
                setAddProModal,
                selectedPro,
                setSelectedPro,
                handleResetAddPro
            }}
        >
            {addProModal ? <WarehouseAddProModal/> : null}
            {children}
        </warehouseAddProCntxt.Provider>
    )
}

export default WarehouseAddProContext;