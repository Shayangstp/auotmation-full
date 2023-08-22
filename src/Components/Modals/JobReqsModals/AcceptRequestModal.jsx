import React, { useContext, useEffect, useState } from "react";
import xssFilters from "xss-filters";
import { Modal, Button, Form, Row, Col, Table } from "react-bootstrap";
import momentJalaali from 'moment-jalaali';
import ReqItems from '../../JobReq/ReqItems';
import Select from 'react-select';
import { reqContext } from '../../context/jobReqsContext/reqContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner, faPlus, faP, faTrash } from '@fortawesome/free-solid-svg-icons';
import JobReqItemFile from "../../JobReq/JobReqItemFile";

import { rootContext } from "../../context/rootContext";
import { useDispatch, useSelector } from "react-redux";
import { selectUser, handleUserInformation, handleUserImage } from "../../Slices/mainSlices";
import { selectAcceptReqModal, RsetAcceptReqModal, selectAcceptReqComment, RsetAcceptReqComment } from '../../Slices/modalsSlice';

const AcceptRequestModal = ({ handleReqAccept }) => {
    const dispatch = useDispatch();
    const acceptReqModal = useSelector(selectAcceptReqModal);
    const acceptReqComment = useSelector(selectAcceptReqComment);

    const user = useSelector(selectUser)
    const mainContext = useContext(rootContext);
    const {
        currentReqInfo,
        currentReqComments,
    } = mainContext;

    const requestContext = useContext(reqContext);
    const {
        handleDepartmentUsers,
        reqWarehouseUser,
        setReqWarehouseUser,
        warehouseUsersSelect,
        projectNumber,
        setProjectNumber,
        executerGrp,
        setExecuterGrp,
        handleExecuterGrp,
        executerGrpSelect,
        addNewExecuterToList,
        // warehouseCodes,
        // setWarehouseCodes,
        // handleWarehouseCodes,
        // warehouseCodesSelect,
        executerGrpPrsn,
        setExecuterGrpPrsn,
        handleExecuterPrsns,
        executerGrpPrsns,
        setExecuterGrpPrsns,
        executerGrpPrsnsSelect,
        removeExecuterFromList,
        exeDepANDPrsn,
        setExeDepANDPrsn,
        setFirstMaterialsModal
    } = requestContext;
    useEffect(() => {
        if (currentReqInfo.lastActionCode === 0) {
            handleDepartmentUsers(currentReqInfo.lastActionCode, 1)
        }
        if (user.Roles.some(role => role === '2')) {
            handleExecuterGrp();
        } else if (user.Roles.some(role => role === '15')) {
            // handleWarehouseCodes();
        }
    }, [])

    const [items, setItems] = useState([]);
    useEffect(() => {
        if (currentReqInfo.reqItemSubject !== undefined) {
            const reqItems = []
            const item = {
                reqItemSubject: currentReqInfo.reqItemSubject,
                reqItemAmount: currentReqInfo.reqItemAmount,
                reqItemTechSpecifications: currentReqInfo.reqItemTechInfo,
                reqItemDeadline: currentReqInfo.reqItemDeadline,
                _id: currentReqInfo.reqItemId,
                pattern: currentReqInfo.reqItemPattern,
                description: currentReqInfo.reqItemDescription
            }
            reqItems.push(item)
            setItems(reqItems)
        }
    }, [currentReqInfo])
    return (
        <Modal
            aria-labelledby="contained-modal-title-vcenter"
            centered
            backdrop="static"
            show={acceptReqModal}
            onHide={() => {
                dispatch(RsetAcceptReqModal(false));
            }}
            dialogClassName="modal-96w overflow-visible-modal"
        >
            <Modal.Header className='d-block bg-success text-white'>
                <Modal.Title id="contained-modal-title-vcenter" className="d-flex justify-content-between">
                    <div>
                        <span className='me-2'>تایید درخواست شماره </span>
                        <span className="fw-bold">{xssFilters.inHTMLData(currentReqInfo.serial)}</span>
                    </div>
                    <div>
                        <span className='fw-bold me-2'>تاریخ درخواست:</span>
                        <span>{momentJalaali.utc(currentReqInfo.createdDate, 'YYYY/MM/DD').locale('fa').format('jYYYY/jMM/jDD')}</span>
                    </div>
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <ul className='list-unstyled'>
                    <li className='mb-3'>
                        <span className='fw-bold me-2'>شرح درخواست:</span>
                        <span>{currentReqInfo.description !== null ? xssFilters.inHTMLData(currentReqInfo.description) : ''}</span>
                    </li>
                    <li className='mb-3'>
                        <span className='fw-bold me-2'>نام و نام خانوادگی درخواست کننده:</span>
                        <span>{xssFilters.inHTMLData(currentReqInfo.fullName)}</span>
                    </li>
                    <li className='mb-3'>
                        <span className='fw-bold me-2'>محل ارسال درخواست:</span>
                        <span>{"شرکت " + xssFilters.inHTMLData(currentReqInfo.companyName) + " واحد " + xssFilters.inHTMLData(currentReqInfo.deptName)}</span>
                    </li>
                    {/* <li className='mb-3'>
                        <span className='fw-bold me-2'>محل دریافت درخواست:</span>
                        <span>{"شرکت "+xssFilters.inHTMLData(currentReqInfo.reqToCompanyName)}</span>
                    </li> */}
                    <li className='mb-3'>
                        <span>درخواست کار همراه با مواد اولیه {currentReqInfo.byInitialMaterial === true ? 'می باشد' : 'نمی باشد'} .</span>
                    </li>
                    {/* {user.Roles.some(role=> role === '2') ?
                        <div className="row">
                            <Form.Group as={Col} md='12' className='mb-4'>
                                <Form.Label className='mb-1 me-3 required-field'>شماره پرونده :</Form.Label>
                                <Form.Control className="w-100" name='projectNumber' value={projectNumber} onChange={e => setProjectNumber(e.target.value)} />
                            </Form.Group>
                            <Col md='8'>
                                <Row>
                                    <Form.Group as={Col} md='5' className='mb-4'>
                                        <Form.Label className='mb-1 me-3 required-field'>گروه مجری :</Form.Label>
                                        <Select className="w-100" name="executerGrp" value={executerGrp} onChange={(e) => { setExecuterGrp(e); handleExecuterPrsns(e.value) }}
                                            placeholder='انتخاب...' options={executerGrpSelect} id='executerGrp' />
                                    </Form.Group>
                                    <Form.Group as={Col} md='6' className='mb-4'>
                                        <Form.Label className='mb-1 me-3 required-field'>پرسنل :</Form.Label>
                                        <Select className="w-100" name="executerGrpPrsn" value={executerGrpPrsn} onChange={(e) => { setExecuterGrpPrsn(e) }}
                                            placeholder='انتخاب...' options={executerGrpPrsnsSelect} id='executerGrpPrsn' />
                                    </Form.Group>
                                    <Form.Group as={Col} md='1' className='mb-4 d-flex align-items-end'>
                                        <Button variant="primary" onClick={()=>{
                                            addNewExecuterToList();
                                        }}><FontAwesomeIcon icon={faPlus}/></Button>
                                    </Form.Group>
                                </Row>
                            </Col>
                            {exeDepANDPrsn.length !== 0 ?
                                <Col md='4'>
                                    <Table bordered hover responsive size="sm">
                                        <thead>
                                            <tr>
                                                <th className="col-2 bg-secondary text-white fw-normal">گروه مجری</th>
                                                <th className="col-2 bg-secondary text-white fw-normal">پرسنل</th>
                                                <th className="col-1 bg-secondary text-white fw-normal">عملیات</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {exeDepANDPrsn.map((item, index)=>(
                                                <tr className="text-center" key={index}>
                                                    <td>{item.dep.label}</td>
                                                    <td>{item.person.label}</td>
                                                    <td><FontAwesomeIcon className="text-danger cursorPointer" icon={faTrash} onClick={()=>{
                                                        removeExecuterFromList(index);
                                                    }}/></td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </Table>
                                </Col>
                            : null}
                        </div>
                    : null}
                    {user.Roles.some(role=> role === '15') ?
                        <div className="row">
                            <JobReqItemFile />
                            <Form.Group as={Col} md='8' className='d-flex align-items-end'>
                                <Button variant="info" onClick={()=>{
                                    setFirstMaterialsModal(true);
                                }}>افزودن مواد اولیه</Button>
                                //<Form.Label className='mb-1 me-3 required-field'>مواد اولیه :</Form.Label>
                                //<Select className="basic-multi-select" name="warehouseCodes" value={warehouseCodes} onChange={(e) => { setWarehouseCodes(state => { return e }); }}
                                //    placeholder='انتخاب...' options={warehouseCodesSelect} id='warehouseCodes' isMulti />
                            </Form.Group>
                        </div>
                    : null} */}
                </ul>
                <ReqItems reqItems={items} edit={false} reqItemsOperation={false} />
            </Modal.Body>
            <Modal.Footer className="d-block">
                {currentReqComments.map((action, index) => {
                    if (action.comment !== null && action.comment !== undefined && action.comment !== '') {
                        return (
                            <div className="d-block" key={index}>
                                <span className='fw-bold me-2 font12 cursorPointer' onClick={() => {
                                    dispatch(handleUserInformation(action.userId));
                                    dispatch(handleUserImage({ userId: action.userId, status: 1 }));
                                }}>{action.fullName}: </span>
                                <span className="font12">{xssFilters.inHTMLData(action.comment)}</span>
                            </div>
                        )
                    }
                })}
                <div className="d-flex justify-content-between">
                    <div className="w-75 d-flex align-items-center">
                        <input className="form-control me-3 w-75" placeholder="توضیحات تایید کننده درخواست" value={acceptReqComment} name="acceptReqComment" onChange={(e) => dispatch(RsetAcceptReqComment(e.target.value))} />
                        <Button
                            variant="success"
                            onClick={() => {
                                handleReqAccept();
                            }}
                        >تایید درخواست</Button>
                    </div>
                    <Button
                        onClick={() => {
                            dispatch(RsetAcceptReqComment(''));
                            dispatch(RsetAcceptReqModal(false));

                            setProjectNumber('');
                            setExecuterGrp('');
                            setExecuterGrpPrsn('');

                            setExecuterGrpPrsns([]);
                            setExeDepANDPrsn([]);
                        }}
                        variant="secondary"
                    >بستن</Button>
                </div>
            </Modal.Footer>
        </Modal>
    )
}

export default AcceptRequestModal;