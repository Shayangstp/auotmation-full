import React, { useEffect, useContext, useState, Fragment }  from "react";
import { Link } from "react-router-dom";
import { rootContext } from "../../context/rootContext";
import { officeReqContext } from "../../context/officeContext/officeReqContext";
import PatchDayFoodM from "../../Modals/OfficeReqsModals/PatchDayFoodModal";
import { Container, Row, Col, Form, Button, Alert, Table } from "react-bootstrap";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faWarning, faPlus } from "@fortawesome/free-solid-svg-icons";
import DatePicker from "react-datepicker2";
import moment from "moment-jalaali";

const ChangeFoodMenu = ({setPageTitle}) => {

    const mainContext = useContext(rootContext);
    const {
        handleCheckPermission,
        menuPermission,
        handleTodayDate,
    } = mainContext;
    useEffect(()=>{
        handleCheckPermission(localStorage.getItem('lastLocation'));
    },[])

    const officeContext = useContext(officeReqContext);
    const {
        menuFoodDate,
        setMenuFoodDate,
        menuFood,
        setMenuFood,
        handleAddDayFood,
        menuDaysFood,
        setMenuDaysFood,
        handleChangedDaysFood,
        patchDayFoodModal
    } = officeContext;

    useEffect(()=>{
        setPageTitle('تغییر منو غذایی');
    }, [setPageTitle])

    const [today, setToday] = useState('');
    const [disabledRanges, setDisabledRanges] = useState([]);
    const datee = async () => {
        const todayDate = await handleTodayDate();
        setToday(todayDate)
    }

    useEffect(()=>{
        if(today.day !== undefined){
            var mTodayDate = new Date(today.today)
            if(today.day.includes("جمعه")){
                setDisabledRanges([
                    { 
                      disabled: true, 
                      start: moment(mTodayDate).add(-200,'year'),
                      end: moment(mTodayDate).add(1,'days') 
                    },
                    { 
                      disabled: true, 
                      start:moment(mTodayDate).add(6,'days'), 
                      end:moment(mTodayDate).add(200,'year') 
                    }
                ])
            }else if(today.day.includes("پنجشنبه")){
                setDisabledRanges([
                    { 
                      disabled: true, 
                      start: moment(mTodayDate).add(-200,'year'),
                      end: moment(mTodayDate).add(1,'days') 
                    },
                    { 
                      disabled: true, 
                      start:moment(mTodayDate).add(7,'days'), 
                      end:moment(mTodayDate).add(200,'year') 
                    }
                ])
            }else if(today.day.includes("چهارشنبه")){
                setDisabledRanges([
                    { 
                      disabled: true, 
                      start: moment(mTodayDate).add(-200,'year'),
                      end: moment(mTodayDate).add(-1,'days') 
                    },
                    { 
                      disabled: true, 
                      start:moment(mTodayDate).add(1,'days'), 
                      end:moment(mTodayDate).add(200,'year') 
                    }
                ])
            }else if(today.day.includes("سه‌شنبه")){
                setDisabledRanges([
                    { 
                      disabled: true, 
                      start:moment(mTodayDate).add(-200,'year'),
                      end:moment(mTodayDate).add(-1,'days') 
                    },
                    { 
                      disabled: true, 
                      start:moment(mTodayDate).add(2,'days'), 
                      end:moment(mTodayDate).add(200,'year') 
                    }
                ])
            }else if(today.day.includes("دوشنبه")){
                setDisabledRanges([
                    { 
                      disabled: true, 
                      start:moment(mTodayDate).add(-200,'year'),
                      end:moment(mTodayDate).add(-1,'days') 
                    },
                    { 
                      disabled: true, 
                      start:moment(mTodayDate).add(3,'days'), 
                      end:moment(mTodayDate).add(200,'year') 
                    }
                ])
            }else if(today.day.includes("یکشنبه")){
                setDisabledRanges([
                    { 
                      disabled: true, 
                      start: moment(mTodayDate).add(-200,'year'),
                      end: moment(mTodayDate).add(-1,'days') 
                    },
                    { 
                      disabled: true, 
                      start:moment(mTodayDate).add(4,'days'), 
                      end:moment(mTodayDate).add(200,'year') 
                    }
                ])
            }else if(today.day.includes("شنبه")){
                setDisabledRanges([
                    { 
                      disabled: true, 
                      start:moment(mTodayDate).add(-200,'year'),
                      end:moment(mTodayDate).add(-1,'days') 
                    },
                    { 
                      disabled: true, 
                      start:moment(mTodayDate).add(5,'days'), 
                      end:moment(mTodayDate).add(200,'year') 
                    }
                ])
            }
        }
    },[today])

    useEffect(()=>{
        datee();
    },[])

    return(
        <Container>
            {menuPermission ?
                <Fragment>
                    <Form>
                        <Row>
                            <Form.Group as={Col} md='4' xl='3' className='mb-4'>
                                <Form.Label className='mb-1 required-field'>روز: </Form.Label>
                                <DatePicker
                                    className="form-control"
                                    name='day'
                                    isGregorian={false}
                                    timePicker={false}
                                    showTodayButton={false}
                                    inputFormat="YYYY-MM-DD"
                                    inputJalaaliFormat="jYYYY/jMM/jDD"
                                    value={menuFoodDate}
                                    onChange={(e)=>{setMenuFoodDate(e)}}
                                    disabled={menuDaysFood.length < 5 ? false : true}
                                    ranges={disabledRanges}
                                />
                            </Form.Group>
                            <Form.Group as={Col} md='4' xl='3' className='mb-4'>
                                <Form.Label className='mb-1 required-field'>غذا: </Form.Label>
                                <Form.Control value={menuFood} name='menuFood' onChange={(e)=>{setMenuFood(e.target.value)}}
                                disabled={menuDaysFood.length < 5 ? false : true} id='foodName'/>
                            </Form.Group>
                            {menuDaysFood.length < 5 ?
                                <Form.Group as={Col} md='4' xl='3' className="mb-4 d-flex align-items-end">
                                    <Button onClick={()=>{
                                        handleAddDayFood();
                                    }}>
                                        <FontAwesomeIcon icon={faPlus} />
                                    </Button>
                                </Form.Group>
                            : null}
                        </Row>
                        {menuDaysFood.length !== 0 ?
                            <Row>
                                <Col md='12'>
                                    <Table bordered hover responsive size="sm">
                                        <thead>
                                            <tr>
                                                <th className="col-2 bg-secondary text-white fw-normal text-center">تاریخ</th>
                                                <th className="col-2 bg-secondary text-white fw-normal text-center">غذا</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {menuDaysFood.map((item, index)=>(
                                                <tr className="text-center" key={index}>
                                                    <td>{item.date.format('jYYYY/jMM/jDD')}</td>
                                                    <td>{item.food}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </Table>
                                </Col>                   
                            </Row>
                        : null}
                        <Row>
                            <Col md='5' xl='4' className='mx-auto d-flex justify-content-between mt-4'>
                                <Button variant='success' className='w-45' onClick={(e) => {
                                    handleChangedDaysFood()
                                }}>
                                    ثبت
                                </Button>
                                <Button variant='secondary' type='reset' className='w-45' onClick={()=>{
                                    setMenuFoodDate(null);
                                    setMenuFood('');
                                    setMenuDaysFood([]);
                                }}>
                                    انصراف
                                </Button>
                            </Col>
                        </Row>
                    </Form>
                    {patchDayFoodModal ? <PatchDayFoodM /> : null}
                </Fragment>
            :
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
            }
        </Container>
    )
}

export default ChangeFoodMenu;