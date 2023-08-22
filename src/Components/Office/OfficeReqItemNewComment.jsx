import React, { useContext, useEffect } from "react";
import { officeReqContext } from "../context/officeContext/officeReqContext";
import { Form, Button } from "react-bootstrap";


const OfficeReqItemNewComment = ({repCommentId}) => {
    const officeContext = useContext(officeReqContext);
    const {
        officeReqComment,
        setOfficeReqComment,
        handleReqCommentAction
    } = officeContext;

    useEffect(()=>{
        
    },[])
    
    return (
        <section className="reqNewComment">
            <Form.Group className="mt-3">
                <Form.Control as="textarea" rows={5} maxLength={2000} value={officeReqComment} name="officeReqComment" onChange={(e) => { setOfficeReqComment(e.target.value) }} placeholder=''/>
            </Form.Group>
            <div className="mt-3 d-flex justify-content-end">
                <Button className="btn btn-light bg-lightBlue font12" onClick={()=>{
                    handleReqCommentAction(repCommentId);
                }}>ثبت نظر</Button>
            </div>
        </section>
    );
};

export default OfficeReqItemNewComment;
