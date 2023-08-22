import React, { Fragment, useEffect, useContext, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Container, Row, Col, Form, Button, Alert } from "react-bootstrap";
import Select from 'react-select';
import DatePicker from "react-datepicker2";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faWarning, faCheck, faCheckSquare, faChevronLeft, faChevronDown, faPlusSquare, faMinusSquare, faSquare, faFolder, faFolderOpen } from "@fortawesome/free-solid-svg-icons";
import moment from "moment-jalaali";
import xssFilters from "xss-filters";
import { rootContext } from "../../../context/rootContext";
import { RsetActionToPersonsModal, selectUser, selectFormErrors, RsetFormErrors } from "../../../Slices/mainSlices";
import {
    selectDailyLeave, selectLeaveFromDate, selectLeaveToDate, selectLeaveDescription, selectLeaveUsers,
    RsetDailyLeave, RsetLeaveFromDate, RsetLeaveToDate, RsetLeaveDescription, RsetLeaveUsers, handleUsersByCo,
    selectSearchInput, RsetSearchInput, handleResetGroupLeaveForm
} from "../../../Slices/leaveSlice";
import CheckboxTree from "react-checkbox-tree";


const GroupLeaveRegistration = ({ setPageTitle }) => {
    const [checked, setChecked] = useState([]);
    const [expanded, setExpanded] = useState(["sol"]);
    // const mainContext = useContext(rootContext);
    // const {
    //     handleCheckPermission,
    //     menuPermission,
    // } = mainContext;
    // useEffect(()=>{
    //     handleCheckPermission(localStorage.getItem('lastLocation'));
    // },[])
    useEffect(() => {
        setPageTitle('ثبت مرخصی گروهی');
    }, [setPageTitle])

    const dispatch = useDispatch();
    const dailyLeave = useSelector(selectDailyLeave);
    const leaveFromDate = useSelector(selectLeaveFromDate);
    const leaveToDate = useSelector(selectLeaveToDate);
    const leaveDescription = useSelector(selectLeaveDescription);
    const leaveUsers = useSelector(selectLeaveUsers);
    const user = useSelector(selectUser);
    const searchInput = useSelector(selectSearchInput);

    useEffect(() => {
        if (user.FirstName !== undefined) {
            dispatch(handleUsersByCo());
        }
    }, [user])


    const node = [
        { label: "عباس هداوندی", value: "111", deptName: "فنی", deptCode: "11" },
        { label: "ریحانه مظلومی", value: "112", deptName: "فنی", deptCode: "11" },
        { label: "گودرز زیستانی", value: "113", deptName: "فنی", deptCode: "11" },
        { label: "صالحه میرزایی", value: "114", deptName: "فنی", deptCode: "11" },
        { label: "صدف رجبی", value: "115", deptName: "فنی", deptCode: "11" },
        { label: "علیرضا مغانلو", value: "116", deptName: "فنی", deptCode: "11" },
        { label: "بهنام رحیمی", value: "117", deptName: "فنی", deptCode: "11" },
        { label: "عسل یزدی", value: "118", deptName: "فنی", deptCode: "11" },
        { label: "الهام خلیلی", value: "221", deptName: "اداری", deptCode: "22" },
        { label: "مرضیه خسروی", value: "222", deptName: "اداری", deptCode: "22" },
        { label: "شهره محمدعلی", value: "223", deptName: "اداری", deptCode: "22" },
        { label: "مینا زارعی", value: "224", deptName: "اداری", deptCode: "22" },
        { label: "محمدحسین محمدخانی", value: "331", deptName: "مالی", deptCode: "33" },
        { label: "حمیدرضا زمانی", value: "332", deptName: "مالی", deptCode: "33" },
        { label: "مهتاب یوسفی", value: "333", deptName: "مالی", deptCode: "33" },
        { label: "محیا رجبی", value: "334", deptName: "مالی", deptCode: "33" },
        { label: "آرش لطفی", value: "335", deptName: "مالی", deptCode: "33" },
        { label: "نیلوفر کیانی", value: "336", deptName: "مالی", deptCode: "33" },
        { label: "زهرا خسروی", value: "337", deptName: "مالی", deptCode: "33" },
        { label: "میلاد بختیاری", value: "338", deptName: "مالی", deptCode: "33" },
        { label: "شهاب بهرامی", value: "339", deptName: "مالی", deptCode: "33" },
        { label: "حسین محبوبی", value: "330", deptName: "مالی", deptCode: "33" },
    ]
    const [nodes, setNods] = useState([
        {
            "label": "کلیه کاربران",
            "value": "1",
            "children": []
        }
    ])
    const makeTree = () => {
        var temp = [];
        var noooodes = [...nodes];
        for (var i = 0; i < node.length; i++) {
            if (temp.length !== 0 && temp.some((dep) => dep === node[i].deptCode)) {
                var index = temp.findIndex(dep => dep === node[i].deptCode);
                if (index !== -1) {
                    noooodes[0].children[index].children.push({ "label": node[i].label, "value": node[i].value })
                }
            } else {
                temp.push(node[i].deptCode)
                noooodes[0].children.push({ "label": node[i].deptName, "value": node[i].deptCode, "children": [] })
                var index = temp.findIndex(dep => dep === node[i].deptCode);
                noooodes[0].children[index].children.push({ "label": node[i].label, "value": node[i].value })
            }
        }
        setNods(noooodes);
    }

    useEffect(() => {
        makeTree()
    }, [])

    const s = [
        {
            "label": "کلیه کاربران",
            "value": "1",
            "children": [
                {
                    "label": "فنی", "value": "11", "children": [
                        { "label": "عباس هداوندی", "value": "111" },
                        { "label": "ریحانه مظلومی", "value": "112" },
                        { "label": "گودرز زیستانی", "value": "113" },
                        { "label": "صالحه میرزایی", "value": "114" },
                        { "label": "صدف رجبی", "value": "115" },
                        { "label": "علیرضا مغانلو", "value": "116" },
                        { "label": "بهنام رحیمی", "value": "117" },
                        { "label": "عسل یزدی", "value": "118" }
                    ]
                },
                {
                    "label": "اداری", "value": "22", "children": [
                        { "label": "الهام خلیلی", "value": "221" },
                        { "label": "مرضیه خسروی", "value": "222" },
                        { "label": "شهره محمدعلی", "value": "223" },
                        { "label": "مینا زارعی", "value": "224" }
                    ]
                },
                {
                    "label": "مالی", "value": "33", "children": [
                        { "label": "محمدحسین محمدخانی", "value": "331" },
                        { "label": "حمیدرضا زمانی", "value": "332" },
                        { "label": "مهتاب یوسفی", "value": "333" },
                        { "label": "محیا رجبی", "value": "334" },
                        { "label": "آرش لطفی", "value": "335" },
                        { "label": "نیلوفر کیانی", "value": "336" },
                        { "label": "زهرا خسروی", "value": "337" },
                        { "label": "میلاد بختیاری", "value": "338" },
                        { "label": "شهاب بهرامی", "value": "339" },
                        { "label": "حسین محبوبی", "value": "330" }
                    ]
                }
            ]
        },
    ];

    useEffect(() => {
        if (searchInput !== '') {
            const filteredData = node.filter((item) => {
                return Object.values(item).join('').includes(searchInput)
            })
            //setFilteredResults(filteredData)
        }
        else {
            //setFilteredResults(nodes)
        }
    }, [searchInput])

    const formErrors = useSelector(selectFormErrors);
    const validation = () => {
        var errors = {};
        if (!leaveFromDate) {
            errors.leaveFromDate = "واردکردن تاریخ شروع مرخصی اجباری است!";
        }
        if (!leaveToDate) {
            errors.leaveToDate = "واردکردن تاریخ پایان مرخصی اجباری است!";
        }
        return errors;
    }
    const submitFormBtn = (e) => {
        e.preventDefault();
        if (leaveFromDate !== null && leaveToDate !== null) {
            console.log('')
        } else {
            dispatch(RsetFormErrors(
                validation({
                    leaveFromDate: leaveFromDate,
                    leaveToDate: leaveToDate,
                })
            ));
        }
    }

    return (
        <Container>
            {/* {menuPermission ? */}
            <Fragment>
                <Form>
                    <Row>
                        <Col md='6' className="checkboxTree maxH500Scroll">
                            <div className="bg-white border minH100P">
                                <div className="px-4 pt-4 pb-2 bg-white position-sticky top-0">
                                    <div>
                                        <div className="input-group sticky-top mb-3">
                                            <span className="input-group-text">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-search" viewBox="0 0 16 16">
                                                    <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" />
                                                </svg>
                                            </span>
                                            <input className="search-users form-control p-2 " name='searchInput' type="text" placeholder="سرچ کنید ..." value={searchInput}
                                                onChange={(e) => dispatch(RsetSearchInput(e.target.value))}
                                            ></input>
                                        </div>
                                    </div>
                                </div>
                                {nodes[0].children.length !== 0 ? <CheckboxTree
                                    nodes={nodes}
                                    checkModel="all"
                                    checked={checked}
                                    expanded={expanded}
                                    onCheck={setChecked}
                                    onExpand={setExpanded}
                                    icons={{
                                        expandClose: <FontAwesomeIcon icon={faChevronLeft} />,
                                        expandOpen: <FontAwesomeIcon icon={faChevronDown} />,
                                    }}
                                /> : null}
                            </div>
                            {/* <ul className="list-unstyled">
                                {leaveUsers.map(dep => {
                                    return (
                                        <li key={dep.depCode} className='mb-3'>
                                            <div className="d-flex align-items-center">
                                                <input className="cursorPointer" type='checkbox' value={dep.depCode}
                                                    onChange={(e) => {
                                                        handleCheckedAll(e, 'p1');
                                                    }}
                                                />
                                                <label className="m-0 ps-2 pe-2">{dep.depName}</label>
                                            </div>
                                            {dep.children.length !== 0
                                                ? <ul className="list-unstyled ps-3">
                                                    {dep.children.map(user => {
                                                        return (
                                                            <li key={user._id} className='d-flex align-items-center'>
                                                                <input className="cursorPointer" type='checkbox' value={dep.depCode}
                                                                // onClick={handleInputs}
                                                                    onChange={(e)=>{
                                                                        handleCheckedAll(e, user._id);
                                                                    }}
                                                                />
                                                                <label className="m-0 ps-2 pe-2" >{user.FirstName + ' ' + user.LastName}</label>
                                                            </li>
                                                        )
                                                    })}
                                                </ul>
                                                : null
                                            }
                                        </li>
                                    )
                                })}
                            </ul> */}
                        </Col>
                        <Col md='6'>
                            <Row>
                                <Col md='12'>
                                    <Row className='mb-5'>
                                        <Col className='text-center text-md-start d-block d-md-flex align-items-center'>
                                            <h1 className='font16 mb-0'>مرخصی </h1>
                                            <div className="d-flex justify-content-center">
                                                <div className='ms-md-4'>
                                                    <label className="me-2">ساعتی</label>
                                                    <Form.Check
                                                        className='d-inline-block'
                                                        type="switch"
                                                        id="custom-switch"
                                                        label="روزانه"
                                                        checked={dailyLeave}
                                                        onChange={() => { dispatch(RsetDailyLeave(!dailyLeave)) }}
                                                    />
                                                </div>
                                            </div>
                                        </Col>
                                    </Row>
                                </Col>
                                <Form.Group as={Col} md='12' className='mb-4'>
                                    <Form.Label className='mb-1 required-field'>تاریخ شروع: </Form.Label>
                                    <DatePicker
                                        timePicker={false}
                                        setTodayOnBlur={true}
                                        inputReadOnly
                                        name="leaveFromDate"
                                        isGregorian={false}
                                        inputFormat="YYYY-MM-DD"
                                        inputJalaaliFormat="jYYYY/jMM/jDD"
                                        value={leaveFromDate}
                                        className="form-control"
                                        onChange={e => { dispatch(RsetLeaveFromDate(e)) }}
                                    />
                                    {!leaveFromDate && (
                                        <p className="font12 text-danger mb-0 mt-1">
                                            {formErrors.leaveFromDate}
                                        </p>
                                    )}
                                </Form.Group>
                                <Form.Group as={Col} md='12' className='mb-4'>
                                    <Form.Label className='mb-1 required-field'>تاریخ اتمام: </Form.Label>
                                    <DatePicker
                                        timePicker={false}
                                        setTodayOnBlur={true}
                                        inputReadOnly
                                        name="leaveToDate"
                                        isGregorian={false}
                                        inputFormat="YYYY-MM-DD"
                                        inputJalaaliFormat="jYYYY/jMM/jDD"
                                        value={leaveToDate}
                                        className="form-control"
                                        onChange={e => { dispatch(RsetLeaveToDate(e)) }}
                                    />
                                    {!leaveToDate && (
                                        <p className="font12 text-danger mb-0 mt-1">
                                            {formErrors.leaveToDate}
                                        </p>
                                    )}
                                </Form.Group>
                                <Form.Group as={Col} md='12'>
                                    <Form.Label className='mb-1'>توضیحات: </Form.Label>
                                    <Form.Control as="textarea" rows={10} maxLength={2000} name='leaveDescription' value={leaveDescription} onChange={e => dispatch(RsetLeaveDescription(e.target.value))} />
                                </Form.Group>
                            </Row>
                        </Col>
                    </Row>
                    <Row>
                        <Col md='5' xl='4' className='mx-auto d-flex justify-content-between mt-4'>
                            <Button variant='success' id='confirmReq' onClick={(e) => {
                                submitFormBtn(e)
                            }}>
                                ثبت درخواست
                            </Button>
                            <Button variant='primary' id='sendToPersons' className='mx-3 disabled' onClick={(e) => {
                                //dispatch(RsetActionToPersonsModal(true))
                            }}>
                                ارسال
                            </Button>
                            <Button variant='secondary' type='reset' onClick={() => {
                                dispatch(handleResetGroupLeaveForm());
                                //dispatch(handleResetNewLeaveReq());
                            }}>
                                انصراف
                            </Button>
                        </Col>
                    </Row>
                </Form>
            </Fragment>
            {/* :
                <Row>
                    <Col>
                        <Alert variant="warning">
                            <Alert.Heading>
                                <FontAwesomeIcon icon={faWarning} className='me-2 font24'/>
                                <span className="font24">عدم دسترسی!</span>
                            </Alert.Heading>
                            <p>
                            کاربر گرامی شما به این بخش دسترسی ندارید. 
                            </p>
                            <hr />
                            <div className="d-flex justify-content-end">   
                                <Link to='/Home'>
                                    <Button variant="outline-success">
                                        <FontAwesomeIcon icon={faHome} className='me-2'/>
                                        صفحه اصلی
                                    </Button>
                                </Link>
                            </div>
                        </Alert>
                    </Col>
                </Row>
            } */}
        </Container>
    )
}
export default GroupLeaveRegistration;