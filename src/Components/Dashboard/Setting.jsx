import React, {useEffect} from "react";
import { useDispatch, useSelector } from "react-redux";
import { Container, Button } from "react-bootstrap";
import NumberFormat from "react-number-format";
import { selectChangeUserPass, RsetChangeUserPass, handleChangeUserPass, selectUserFullName } from "../Slices/changePassSlice";

const Setting = ({setPageTitle}) => {

    useEffect(() => {
        setPageTitle('تنظیمات');
    }, [setPageTitle])

    const dispatch = useDispatch();
    const changeUserPass = useSelector(selectChangeUserPass);
    const userFullName = useSelector(selectUserFullName);

    return(
        <Container fluid>
            <div className="mb-4">
                <span>فعالسازی دریافت نوتیفیکیشن:</span>
                <Button variant="outline-primary" className="font12 ms-4 notification-button" disabled>برای فعالسازی کلیک کنید</Button>
            </div>
            <span>افزودن برنامه به صفحه اصلی:</span>
            <Button variant="outline-primary" className="font12 ms-4 install-button" id='art' disabled>برای افزودن کلیک کنید</Button>
            {localStorage.getItem('id') === '6360ecd53ba4d4828c9cd1f5' || localStorage.getItem('id') === '6360ecd63ba4d4828c9cd71f' || localStorage.getItem('id') === '6360ecd33ba4d4828c9cb40b'
             ? <div className="d-flex align-items-center my-5">
                <NumberFormat type='text' maxLength={10} dir='ltr' className="form-control me-3 w-25" value={changeUserPass} onChange={(e)=>{dispatch(RsetChangeUserPass(e.target.value))}}/>
                <Button variant="primary" size="sm" className="me-3" id='getNameToChangePassBTN' onClick={(e)=>{
                    e.preventDefault();
                    dispatch(handleChangeUserPass(1))
                }}>تایید</Button>
                <span className="w-25">{userFullName}</span>
                <Button variant="success" size="sm" className="disabled" id='changePassBTN' onClick={(e)=>{
                    e.preventDefault();
                    dispatch(handleChangeUserPass(0))
                }}>تایید نهایی</Button>
            </div> : null}
        </Container>
    )
}

export default Setting;