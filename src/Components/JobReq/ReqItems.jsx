import React, { useContext } from "react";
import { reqContext } from '../context/jobReqsContext/reqContext';
import { Table } from "react-bootstrap";
import ReqItemDeleteM from '../Modals/JobReqsModals/ReqItemDeleteModal';
import NumberFormat from "react-number-format";
import DatePicker from "react-datepicker2";
import momentJalaali from 'moment-jalaali';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperclip, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import xssFilters from "xss-filters";


const ReqItems = ({ reqItems, reqItemsOperation, edit, warehouseUser, newReq}) => {
    const context = useContext(reqContext);
    const {
        handleEditReqItemSubject,
        handleEditReqItemAmount,
        handleEditReqItemTechSpecifications,
        handleEditReqItemDeadline,
        handleEditdescription,
        
        setReqItemDeleteModal,
        setReqItemId,
        reqItemDeleteModal,
        handleReqItemDelete,
        reqItemId
    } = context;

    return (
        <Table striped bordered hover responsive size="sm" variant="light">
            <thead>
                <tr>
                    <th className="bg-secondary text-white fw-normal">ردیف</th>
                    <th className="bg-secondary text-white fw-normal">موضوع درخواست</th>
                    <th className="bg-secondary text-white fw-normal">تعداد</th>
                    <th className="bg-secondary text-white fw-normal">مشخصات فنی</th>
                    <th className="bg-secondary text-white fw-normal">تاریخ موردنیاز</th>
                    <th className="bg-secondary text-white fw-normal">الگو</th>
                    <th className="bg-secondary text-white fw-normal">فایل پیوست</th>
                    <th className="bg-secondary text-white fw-normal">توضیحات تکمیلی</th>
                    {reqItemsOperation === false || warehouseUser === true ? null :
                        <th className="bg-secondary text-white fw-normal">عملیات</th>
                    }
                </tr>
            </thead>
            <tbody>
                {reqItems.map((item, index) => {
                    if(item.reqItemFiles !== undefined && item.reqItemFiles.length !== 0){
                        var arr = item.reqItemFiles[0].file;
                        var byteArray;
                        if(typeof arr === 'string'){
                            var binary_string = window.atob(arr);
                            var len = binary_string.length;
                            var bytes = new Uint8Array(len);
                            for (var i = 0; i < len; i++) {
                                bytes[i] = binary_string.charCodeAt(i);
                            }
                            byteArray = bytes.buffer;
                        }else{
                            byteArray = new Uint8Array(arr);
                        }
                        var url = window.URL.createObjectURL(new Blob([byteArray], { type: item.reqItemFiles[0].type }));
                    }

                    return (
                        <tr key={item.id ? item.id : item._id}>
                            <td>{index+1}</td>
                            <td>{edit === false ? <span>{xssFilters.inHTMLData(item.reqItemSubject)}</span> : <input type='text' defaultValue={xssFilters.inHTMLData(item.reqItemSubject)} className='form-control' onChange={item.id ? e=>handleEditReqItemSubject(e,item.id) : e=>handleEditReqItemSubject(e,item._id)}/>}</td>
                            <td>{edit === false ? <span>{xssFilters.inHTMLData(item.reqItemAmount)}</span> : <NumberFormat type="text" defaultValue={xssFilters.inHTMLData(item.reqItemAmount)} name="reqItemAmount" dir='ltr' className='form-control' onChange={item.id ? e=>handleEditReqItemAmount(e,item.id) : e=>handleEditReqItemAmount(e,item._id)}/>}</td>
                            <td>{edit === false ? <span>{xssFilters.inHTMLData(item.reqItemTechSpecifications)}</span> : <input type='text' defaultValue={xssFilters.inHTMLData(item.reqItemTechSpecifications)} className='form-control' onChange={item.id ? e=>handleEditReqItemTechSpecifications(e,item.id) : e=>handleEditReqItemTechSpecifications(e,item._id)}/>}</td>
                            <td>{edit === false ? <span>{item.reqItemDeadline === null ? '' : momentJalaali.utc(xssFilters.inHTMLData(item.reqItemDeadline), 'YYYY/MM/DD').locale('fa').format('jYYYY/jMM/jDD')}</span> : 
                                <DatePicker
                                    setTodayOnBlur={true}
                                    inputReadOnly
                                    name="reqItemDeadline"
                                    isGregorian={false}
                                    timePicker={false}
                                    showTodayButton={false}
                                    inputFormat="YYYY-MM-DD"
                                    inputJalaaliFormat="jYYYY/jMM/jDD"
                                    value={typeof(item.reqItemDeadline) === 'string' ? momentJalaali.utc(item.reqItemDeadline) : item.reqItemDeadline}
                                    className="form-control"
                                    id="reqItemDeadline"
                                    onChange={(e)=>{
                                        if(item.id){
                                            handleEditReqItemDeadline(e,item.id)
                                        }else{
                                            handleEditReqItemDeadline(e,item._id)
                                        }
                                    }}
                                />
                            }</td>
                            <td>{xssFilters.inHTMLData(item.pattern)}</td>
                            <td>{item.reqItemFiles !== undefined && item.reqItemFiles.length !== 0 ? <a className='text-decoration-none text-dark' href={url} target="_blank" download='file'><FontAwesomeIcon icon={faPaperclip} className='font20 d-flex justify-content-center mt-2' /></a> : null}</td>
                            <td>{edit === false ? <span>{item.description !== null ? xssFilters.inHTMLData(item.description) : ''}</span> : <input type='text' defaultValue={xssFilters.inHTMLData(item.description)} className='form-control' onChange={item.id ? e=>handleEditdescription(e,item.id) : e=>handleEditdescription(e,item._id)}/>}</td>
                            {reqItemsOperation === false || warehouseUser === true ? null
                            :   <td className="text-center">
                                    <FontAwesomeIcon icon={faTrashAlt} id="trash" className="text-danger cursorPointer" onClick={()=>{setReqItemDeleteModal(true);setReqItemId(item.id ? item.id : item._id)}}/>
                                    <ReqItemDeleteM reqItemDeleteModal={reqItemDeleteModal} setReqItemDeleteModal={setReqItemDeleteModal} handleReqItemDelete={handleReqItemDelete} reqItemId={reqItemId} newReq={newReq}/>
                                </td>
                            }
                        </tr>
                    )
                })}
            </tbody>
        </Table>
    )
}

export default ReqItems;