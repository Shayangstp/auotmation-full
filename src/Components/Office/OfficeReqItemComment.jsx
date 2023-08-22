import React, { useContext } from "react";
import { officeReqContext } from "../context/officeContext/officeReqContext";
import OfficeReqItemNewComment from "./OfficeReqItemNewComment";
import { Button } from "react-bootstrap";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp, faThumbsDown } from '@fortawesome/free-solid-svg-icons';
import { faThumbsUp as farThumbsUp, faThumbsDown as farThumbsDown } from '@fortawesome/free-regular-svg-icons';
import { faEye, faComments } from '@fortawesome/free-regular-svg-icons';
import ReqItemViewsModal from "../Modals/OfficeReqsModals/ReqItemViewsModal";
import moment from "moment-jalaali";
import xssFilters from "xss-filters";

const OfficeReqItemComments = ({ item, showReply, setShowReply, expired }) => {
    const officeContext = useContext(officeReqContext);
    const {
        handleOfficeReqLikeAndDis,
        setOfficeReqComment,
        replyCommentId,
        setReplyCommentId
    } = officeContext;

    var liked = false;
    var disliked = false;
    var liked2 = false;
    var disliked2 = false;
    const handleUpdateLikeAndDis2 = () => {
        liked2 = false;
        disliked2 = false;
    }

    return (
        <section>
            <div className="dep1 mb-5 p-3 border">
                <div className='position-relative d-flex'>
                    <div>
                        <img width='100px' height='100px' alt='userAvatar' src={'data:' + xssFilters.inHTMLData(item.user_photo_type) + ';base64,' + xssFilters.inHTMLData(item.user_photo)} />
                        <div className="position-absolute comment_username_date d-flex flex-wrap">
                            <span className="lightRed-bg text-white px-2 me-4">
                                {xssFilters.inHTMLData(item.first_name) + ' ' + xssFilters.inHTMLData(item.last_name)}
                            </span>
                            <span>{moment.utc(item.date, 'YYYY/MM/DD').locale('fa').format('jYYYY/jMM/jDD')}</span>
                            <div className="d-flex ms-5">
                                <div className="d-flex align-items-center me-3">
                                    <span>{item.likes.length}</span>
                                    {item.likes.map((like) => (
                                        like.id === localStorage.getItem('id') ?
                                            liked = true
                                        :
                                            null
                                    ))}
                                    {liked ?
                                        <FontAwesomeIcon icon={faThumbsUp} className='font18 text-success cursorPointer ms-2' onClick={() => {
                                            handleOfficeReqLikeAndDis("c", 1, item._id);
                                        }} />
                                    :
                                        <FontAwesomeIcon icon={farThumbsUp} className='font18 text-success cursorPointer ms-2' onClick={() => {
                                            handleOfficeReqLikeAndDis("c", 1, item._id);
                                        }} />
                                    }
                                </div>
                                <div className="d-flex align-items-center ms-3">
                                    <span>{item.dislikes.length}</span>
                                    {item.dislikes.map((like) => (
                                        like.id === localStorage.getItem('id') ?
                                            disliked = true
                                        :
                                            null
                                    ))}
                                    {disliked ?
                                        <FontAwesomeIcon icon={faThumbsDown} className='font18 text-danger cursorPointer ms-2' onClick={() => {
                                            handleOfficeReqLikeAndDis("c", 2, item._id);
                                        }} />
                                        :
                                        <FontAwesomeIcon icon={farThumbsDown} className='font18 text-danger cursorPointer ms-2' onClick={() => {
                                            handleOfficeReqLikeAndDis("c", 2, item._id);
                                        }} />
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="w-100 mt-5 mx-3">
                        <p className="mt-5 mt-md-3">
                            {xssFilters.inHTMLData(item.comment)}
                        </p>
                        {expired ?
                            null
                        : 
                            <div className="d-flex justify-content-end">
                                <Button className="btn btn-light llightRed-bg lightRed-text" onClick={() => {
                                    setShowReply(!showReply);
                                    setReplyCommentId(item._id);
                                    if (item._id !== replyCommentId) {
                                        setOfficeReqComment('');
                                    }
                                }}>پاسخ</Button>
                            </div>
                        }
                        {replyCommentId === item._id ?
                            <OfficeReqItemNewComment repCommentId={item._id} key={item._id} />
                            : null}
                    </div>
                </div>
                {item.children.length !== 0 ?
                    item.children.map((item2, index) => (
                        <div key={index} className="dep2 llightRed-bg lightRed-borderTop mt-4 pt-3 ms-5">
                            {handleUpdateLikeAndDis2()}
                            <div className='position-relative d-flex'>
                                <div>
                                    <img width='100px' height='100px' alt='userAvatar' src={'data:' + item2.user_photo_type + ';base64,' + item2.user_photo} />
                                    <div className="position-absolute comment_username_date d-flex flex-wrap">
                                        <span className="lightRed-bg text-white px-2 me-4">
                                            {item2.first_name + ' ' + item2.last_name}
                                        </span>
                                        <span>{moment.utc(item2.date, 'YYYY/MM/DD').locale('fa').format('jYYYY/jMM/jDD')}</span>
                                        <div className="d-flex ms-5">
                                            <div className="d-flex align-items-center me-3">
                                                <span>{item2.likes.length}</span>
                                                {item2.likes.map((like2) => (
                                                    like2.id === localStorage.getItem('id') ?
                                                        liked2 = true
                                                    :
                                                        null
                                                ))}
                                                {liked2 ?
                                                    <FontAwesomeIcon icon={faThumbsUp} className='font18 text-success cursorPointer ms-2' onClick={() => {
                                                        handleOfficeReqLikeAndDis("c", 1, item2._id);
                                                    }} />
                                                :
                                                    <FontAwesomeIcon icon={farThumbsUp} className='font18 text-success cursorPointer ms-2' onClick={() => {
                                                        handleOfficeReqLikeAndDis("c", 1, item2._id);
                                                    }} />
                                                }
                                            </div>
                                            <div className="d-flex align-items-center ms-3">
                                                <span>{item2.dislikes.length}</span>
                                                {item2.dislikes.map((like2) => (
                                                    like2.id === localStorage.getItem('id') ?
                                                        disliked2 = true
                                                    :
                                                        null
                                                ))}
                                                {disliked2 ?
                                                    <FontAwesomeIcon icon={faThumbsDown} className='font18 text-danger cursorPointer ms-2' onClick={() => {
                                                        handleOfficeReqLikeAndDis("c", 2, item2._id);
                                                    }} />
                                                :
                                                    <FontAwesomeIcon icon={farThumbsDown} className='font18 text-danger cursorPointer ms-2' onClick={() => {
                                                        handleOfficeReqLikeAndDis("c", 2, item2._id);
                                                    }} />
                                                }
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="w-100 mt-5 mx-3">
                                    <p className="mt-5 mt-md-3">
                                        {item2.comment}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))
                    : null}
            </div>
        </section>
    );
};

export default OfficeReqItemComments;
