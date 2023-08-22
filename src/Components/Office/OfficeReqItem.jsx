import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { officeReqContext } from "../context/officeContext/officeReqContext";
import { Col, Card } from "react-bootstrap";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp, faThumbsDown } from '@fortawesome/free-solid-svg-icons';
import { faThumbsUp as farThumbsUp, faThumbsDown as farThumbsDown } from '@fortawesome/free-regular-svg-icons';
import { faEye, faComments } from '@fortawesome/free-regular-svg-icons';
import moment from "moment-jalaali";

const OfficeReqItem = ({item}) => {
    const officeContext = useContext(officeReqContext);
    const {
        handleOfficeReqLikeAndDis,
        handleOfficeReqDetails,
        handleOfficeReqSeen
    } = officeContext;

    var liked = false;
    var disliked = false;

    
    return (
        <Col lg='12' className="mb-5">
            <Card className="h-100">
                <Card.Header className="bg-lightBlue text-light">
                    <Link to={`/OfficeRequest/${item._id}`} className="text-dark" onClick={()=>{
                        handleOfficeReqDetails(item._id);
                        handleOfficeReqSeen(item._id)
                    }}>{item.title}</Link>
                </Card.Header>
                <Card.Body>
                    <div className="d-flex justify-content-between align-items-end flex-wrap">
                        <Card.Text>
                            {item.body.length > 90 ? item.body.substring(0,90) + ' ' : item.body}
                            {item.body.length > 90 ? <a href=''>(....)</a> : null}
                        </Card.Text>
                        <div>
                            <p className="font10 mb-1">ارسال کننده: {item.user_name+' '+item.user_lname}</p>
                            <p className="font10 mb-0">تاریخ ثبت: {moment.utc(item.date, 'YYYY/MM/DD').locale('fa').format('jYYYY/jMM/jDD')}</p>
                        </div>
                    </div>
                </Card.Body>
                <Card.Footer className="text-muted bg-white border-top">
                    <div className="d-flex justify-content-around align-items-center">
                        <div>
                            <span>{item.views}</span>
                            <FontAwesomeIcon icon={faEye} className='font18 text-warning ms-2'/>
                        </div>
                        <div className="d-flex">
                            <div className="d-flex align-items-center me-3">
                                <span>{item.likes.length}</span>
                                {item.likes.map(like => (
                                    like.id === localStorage.getItem('id') ?
                                        liked = true
                                    :
                                        null
                                ))}
                                {liked ?
                                    <FontAwesomeIcon icon={faThumbsUp} className='font18 text-success cursorPointer ms-2' onClick={()=>{
                                        handleOfficeReqLikeAndDis("r", 1, item._id);
                                    }}/>
                                :
                                    <FontAwesomeIcon icon={farThumbsUp} className='font18 text-success cursorPointer ms-2' onClick={()=>{
                                        handleOfficeReqLikeAndDis("r", 1, item._id);
                                    }}/>
                                }
                            </div>
                            <div className="d-flex align-items-center me-3">
                                <span>{item.dislikes.length}</span>
                                {item.dislikes.map(like => (
                                    like.id === localStorage.getItem('id') ?
                                        disliked = true
                                    :
                                        null
                                ))}
                                {disliked ?
                                    <FontAwesomeIcon icon={faThumbsDown} className='font18 text-danger cursorPointer ms-2' onClick={()=>{
                                        handleOfficeReqLikeAndDis("r", 2, item._id);
                                    }}/>
                                :
                                    <FontAwesomeIcon icon={farThumbsDown} className='font18 text-danger cursorPointer ms-2' onClick={()=>{
                                        handleOfficeReqLikeAndDis("r", 2, item._id);
                                    }}/>
                                }
                            </div>
                        </div>
                        <div>
                            <span>{item.comments.length}</span>
                            <FontAwesomeIcon icon={faComments} className='font18 text-info ms-2'/>
                        </div>
                    </div>
                </Card.Footer>
            </Card>
        </Col>
    );
};

export default OfficeReqItem;
