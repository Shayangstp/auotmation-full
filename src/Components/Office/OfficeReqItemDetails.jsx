import React, { useContext, useEffect, useState } from "react";
import { rootContext } from "../context/rootContext";
import { officeReqContext } from "../context/officeContext/officeReqContext";
import ReqItemViewsModal from "../Modals/OfficeReqsModals/ReqItemViewsModal";
import ReqItemLikesModal from "../Modals/OfficeReqsModals/ReqItemLikesModal";
import ReqItemDisLikesModal from "../Modals/OfficeReqsModals/ReqItemDisLikesModal";
import OfficeReqItemComments from "./OfficeReqItemComment";
import { Container, Row, Col, Card, Form, Button } from "react-bootstrap";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { faComments, faEye } from '@fortawesome/free-regular-svg-icons';
import { faThumbsUp, faThumbsDown } from '@fortawesome/free-solid-svg-icons';
import { faThumbsUp as farThumbsUp, faThumbsDown as farThumbsDown } from '@fortawesome/free-regular-svg-icons';
import moment from "moment-jalaali";

const OfficeReqItem = ({ setPageTitle }) => {
    const [showReply, setShowReply] = useState(false);
    const mainContext = useContext(rootContext);
    const {
        currentReqInfo,
        handleGetCurrentReqInfo,
    } = mainContext;
    const officeContext = useContext(officeReqContext);
    const {
        setReqItemViewsList,
        reqItemViewsModalShow,
        setReqItemViewsModalShow,
        setReqItemLikesList,
        reqItemLikesModalShow,
        setReqItemLikesModalShow,
        setReqItemDisLikesList,
        reqItemDisLikesModalShow,
        setReqItemDisLikesModalShow,
        officeReqNewComment,
        setOfficeReqNewComment,
        handleReqCommentAction,
        handleOfficeReqExpired
    } = officeContext;

    var liked = false;
    var disliked = false;

    useEffect(() => {
        setPageTitle(`جزئیات درخواست`);
        handleGetCurrentReqInfo('',localStorage.getItem('currentReqId'), localStorage.getItem('currentReqType'));
    }, [])

    var commentsCount = 0;
    const test = () =>{
        if (currentReqInfo.comments !== undefined) {
            commentsCount = currentReqInfo.comments.length;
            currentReqInfo.comments.map((comment) => {
                commentsCount = commentsCount + comment.children.length;
            })
        }
        return commentsCount;
    }
    useEffect(() => {
        test();
    }, [currentReqInfo.comments])


    return (
        <Container fluid>
            <Row>
                {currentReqInfo._id !== undefined ?
                    <Col lg='12' className="mb-5">
                        <Card className="h-100">
                            <Card.Header className="bg-lightBlue text-light d-flex flex-wrap justify-content-between align-items-center">
                                {currentReqInfo.title}
                                { currentReqInfo.userId === localStorage.getItem('id') &&  currentReqInfo.expireDate === "2000-01-01T00:00:00.000Z" ?
                                    <div>
                                        <Button variant="outline-dark" size="sm" onClick={()=>{
                                            handleOfficeReqExpired(currentReqInfo._id)
                                        }}>مختومه کردن</Button>
                                    </div>
                                :
                                    null
                                }
                                {currentReqInfo.expireDate !== "2000-01-01T00:00:00.000Z" ?
                                    <div className="text-dark">
                                        <span>مختومه شد: </span>
                                       {moment.utc(currentReqInfo.expireDate, 'YYYY/MM/DD').locale('fa').format('jYYYY/jMM/jDD')} 
                                    </div>
                                :
                                    null
                                }
                            </Card.Header>
                            <Card.Body>
                                <div>
                                    <Card.Text>
                                        <div className="d-flex justify-content-end align-items-center">
                                            <div className="me-3 d-flex align-items-center">
                                                <span className="ms-2">{test()}</span>
                                                <FontAwesomeIcon icon={faComments} className='font18 text-info mx-2' />
                                            </div>
                                            <div className="cursorPointer d-flex align-items-center" onClick={()=>{
                                                setReqItemViewsList(currentReqInfo.views);
                                                setReqItemViewsModalShow(true);
                                            }}>
                                                <span>{currentReqInfo.views.length}</span>
                                                <FontAwesomeIcon icon={faEye} className='font18 text-warning ms-2'/>
                                            </div>
                                            <div className="d-flex align-items-center ms-3">
                                                <div className="d-flex align-items-center me-3">
                                                    <span>{currentReqInfo.likes.length}</span>
                                                    {currentReqInfo.likes.map(like => (
                                                        like.id === localStorage.getItem('id') ?
                                                            liked = true
                                                        :
                                                            null
                                                    ))}
                                                    {liked ?
                                                        <FontAwesomeIcon icon={faThumbsUp} className='font18 text-success cursorPointer ms-2' onClick={()=>{
                                                            setReqItemLikesList(currentReqInfo.likes);
                                                            setReqItemLikesModalShow(true);
                                                            // handleOfficeReqLikeAndDis("r", 1, currentReqInfo._id);
                                                        }}/>
                                                    :
                                                        <FontAwesomeIcon icon={farThumbsUp} className='font18 text-success cursorPointer ms-2' onClick={()=>{
                                                            setReqItemLikesList(currentReqInfo.likes);
                                                            setReqItemLikesModalShow(true);
                                                            // handleOfficeReqLikeAndDis("r", 1, currentReqInfo._id);
                                                        }}/>
                                                    }
                                                </div>
                                                <div className="d-flex align-items-center me-3">
                                                    <span>{currentReqInfo.dislikes.length}</span>
                                                    {currentReqInfo.dislikes.map(like => (
                                                        like.id === localStorage.getItem('id') ?
                                                            disliked = true
                                                        :
                                                            null
                                                    ))}
                                                    {disliked ?
                                                        <FontAwesomeIcon icon={faThumbsDown} className='font18 text-danger cursorPointer ms-2' onClick={()=>{
                                                            setReqItemDisLikesList(currentReqInfo.dislikes);
                                                            setReqItemDisLikesModalShow(true);
                                                            // handleOfficeReqLikeAndDis("r", 2, currentReqInfo._id);
                                                        }}/>
                                                    :
                                                        <FontAwesomeIcon icon={farThumbsDown} className='font18 text-danger cursorPointer ms-2' onClick={()=>{
                                                            setReqItemDisLikesList(currentReqInfo.dislikes);
                                                            setReqItemDisLikesModalShow(true);
                                                            // handleOfficeReqLikeAndDis("r", 2, currentReqInfo._id);
                                                        }}/>
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                        <div className="d-flex align-items-center mb-4">
                                            <img width='100px' height='100px' className='rounded-circle' alt='userAvatar' src={'data:' + currentReqInfo.user_photo_type + ';base64,' + currentReqInfo.user_photo} />
                                            <div className="d-grid justify-content-end ms-4">
                                                <p className="font12 mb-2">سریال درخواست: {currentReqInfo.serial_number}</p>
                                                <p className="font12 mb-2">ارسال کننده: {currentReqInfo.user_name + ' ' + currentReqInfo.user_lname}</p>
                                                <p className="font12 mb-0">تاریخ ثبت: {moment.utc(currentReqInfo.date, 'YYYY/MM/DD').locale('fa').format('jYYYY/jMM/jDD')}</p>
                                            </div>
                                        </div>
                                        {'ارسال شده از شرکت ' + currentReqInfo.fromCompany + ' واحد ' + currentReqInfo.fromDep}
                                        {' به شرکت ' + currentReqInfo.toCompany + ' واحد ' + currentReqInfo.toDep}
                                        <div className="mt-4">
                                            {currentReqInfo.body}
                                        </div>
                                    </Card.Text>
                                </div>
                            </Card.Body>
                            <Card.Footer className="text-muted bg-white border-0 mb-3">
                                { currentReqInfo.enableComment === true ?
                                    <section>
                                        {currentReqInfo.expireDate === "2000-01-01T00:00:00.000Z" ?
                                            <div className="mt-5">
                                                <section className="reqNewComment">
                                                    <Form.Group className="mt-3">
                                                        <Form.Control as="textarea" rows={5} maxLength={2000} value={officeReqNewComment} name="officeReqNewComment" onChange={(e) => { setOfficeReqNewComment(e.target.value) }} placeholder='' />
                                                    </Form.Group>
                                                    <div className="mt-3 d-flex justify-content-end">
                                                        <Button className="btn btn-light bg-lightBlue font12" onClick={() => {
                                                            handleReqCommentAction();
                                                        }}>ثبت نظر</Button>
                                                    </div>
                                                </section>
                                            </div>
                                        : null}
                                        {/* {currentReqInfo.comments.length !== 0 ?
                                            <div className="request_comments mt-5">
                                                <h2 className="text-center font24 fw-bold mb-5">... نظرات ...</h2>
                                                {currentReqInfo.comments.map((item, index) => (
                                                    <OfficeReqItemComments item={item} showReply={showReply} setShowReply={setShowReply} key={index} expired={currentReqInfo.expireDate === "2000-01-01T00:00:00.000Z" ? false : true}/>
                                                ))}
                                            </div>
                                        : null} */}
                                    </section>
                                : null}
                            </Card.Footer>
                        </Card>
                    </Col>
                    : <div className="d-flex justify-content-center"><FontAwesomeIcon icon={faSpinner} className='spinner font60' /></div>}
            </Row>
            {reqItemViewsModalShow ? <ReqItemViewsModal /> : null}
            {reqItemLikesModalShow ? <ReqItemLikesModal /> : null}
            {reqItemDisLikesModalShow ? <ReqItemDisLikesModal /> : null}
        </Container>
    );
};

export default OfficeReqItem;
