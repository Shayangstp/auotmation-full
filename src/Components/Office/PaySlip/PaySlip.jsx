import React, { useEffect, useContext, useRef } from "react";
import { Link } from "react-router-dom";
import { rootContext } from "../../context/rootContext";
import { officeReqContext } from "../../context/officeContext/officeReqContext";
import GetPasswordModal from "../../Modals/OfficeReqsModals/GetPasswordModal";
import { Container, Row, Col, Button, Alert, Form } from "react-bootstrap";
import PaySlipTable from "./PaySlipTable";
import Select from "react-select";
// import { PDFExport, savePDF } from "@progress/kendo-react-pdf";
import Loading from "../../Common/Loading";

const PaySlip = ({ setPageTitle }) => {

    const mainContext = useContext(rootContext);
    const {
        // handleCheckPermission,
        // menuPermission,
        loading
    } = mainContext;
    useEffect(() => {
        // handleCheckPermission(localStorage.getItem('lastLocation'));
    }, [])

    const officeContext = useContext(officeReqContext);
    const {
        paySlipData,
        getPasswordModalShow,
        setGetPasswordModalShow,
        paySlipYear,
        setPaySlipYear,
        paySlipMonth,
        setPaySlipMonth,
        handleUserPaySlip
    } = officeContext;
    useEffect(() => {
        setPageTitle('فیش حقوقی');
    }, [setPageTitle]);
    useEffect(() => {
        setGetPasswordModalShow(true);
    }, [])

    const bodyRef = useRef(null);

    const createPdf = () => {
        bodyRef.current.save();
        // savePDF(bodyRef.current, {
        //     paperSize: 'Letter',
        //     fileName: "file" + new Date().getTime() + ".pdf",
        //     margin: 3
        // })
    }
    const year = [
        {value: 1401, label: '1401'},
        {value: 1402, label: '1402'},
    ]

    const month = [
        {value: '01', label: 'فروردین'},
        {value: '02', label: 'اردیبهشت'},
        {value: '03', label: 'خرداد'},
        {value: '04', label: 'تیر'},
        {value: '05', label: 'مرداد'},
        {value: '06', label: 'شهریور'},
        {value: '07', label: 'مهر'},
        {value: '08', label: 'آبان'},
        {value: '09', label: 'آذر'},
        {value: '10', label: 'دی'},
        {value: '11', label: 'بهمن'},
        {value: '12', label: 'اسفند'},
    ]

    return (
        <Container fluid>
            <Row className='mb-5' id='d-none-print'>
                <Form.Group as={Col} xs='6'>
                    <span className='fw-bold'>سال مالی</span>
                    <Select
                        className="mt-3"
                        name='year'
                        value={paySlipYear}
                        placeholder='انتخاب سال'
                        options={year}
                        onChange={(e)=>{
                            setPaySlipYear(e);
                            const year = String(e.value);
                            handleUserPaySlip(year.substr(year.length - 2)+paySlipMonth.value, 'monthPaySlip');
                        }}
                    />
                </Form.Group>
                <Form.Group as={Col} xs='6'>
                    <span className='fw-bold'>ماه</span>
                    <Select
                        className="mt-3"
                        name='month'
                        value={paySlipMonth}
                        placeholder='انتخاب ماه'
                        options={month}
                        onChange={(e)=>{
                            setPaySlipMonth(e);
                            const year = String(paySlipYear.value);
                            handleUserPaySlip(year.substr(year.length - 2)+e.value, 'monthPaySlip');
                        }}
                    />
                </Form.Group>
            </Row>
            <section className="overFlow-x-scroll tableScroll position-relative">
                {loading ? <Loading /> : null}
                <Row className="minw-999 mb-4 px-3">
                    <PaySlipTable/>
                </Row>
                {getPasswordModalShow ? <GetPasswordModal /> : null}
                {getPasswordModalShow ? document.getElementById('blur').classList.add('blur-5') : document.getElementById('blur').classList.remove('blur-5')}
            </section>
        </Container>
        // <section className="overFlow-x-scroll tableScroll">
        //     {/* {menuPermission ? */}
        //         <Container className="minw-999">
        //             <Row>
        //                 {/* <PDFExport ref={bodyRef} paperSize="a4"
        //                     landscape={true}
        //                     margin={10}
        //                     fileName={`Report for ${new Date().getFullYear()}`}
        //                     author="kaveh software Team"> */}
        //                     <PaySlipTable/>
        //                 {/* </PDFExport> */}
        //             </Row>
        //             <Row className="mt-4">
        //                 <Col xs='12' className="d-flex justify-content-end">
        //                     {/* <Button variant='danger' onClick={createPdf}>دانلود PDF</Button> */}
        //                     {/* <PDFDownloadLink
        //                         document={PaySlipTable}
        //                         fileName={"Quote" + new Date().getTime() + ".pdf"}
        //                     >
        //                         <Button variant='danger'>دانلود PDF</Button>
        //                     </PDFDownloadLink> */}
        //                 </Col>
        //             </Row>
        //             {getPasswordModalShow ? <GetPasswordModal /> : null}
        //             {getPasswordModalShow ? document.getElementById('blur').classList.add('blur-5') : document.getElementById('blur').classList.remove('blur-5')}
        //         </Container>
        //         {
            /* :
               <Container>
                    <Row>
                        <Col>
                            <Alert variant="warning">
                                <Alert.Heading>
                                    <FontAwesomeIcon icon={faWarning} className='me-2 font24' />
                                    <span className="font24">عدم دسترسی!</span>
                                </Alert.Heading>
                                <p>
                                    کاربر گرامی شما به این بخش دسترسی ندارید.
                                </p>
                                <hr />
                                <div className="d-flex justify-content-end">
                                    <Link to='/Home'>
                                        <Button variant="outline-success">
                                            <FontAwesomeIcon icon={faHome} className='me-2' />
                                            صفحه اصلی
                                        </Button>
                                    </Link>
                                </div>
                            </Alert>
                        </Col>
                    </Row>
                </Container>
            } */
        // }
        // </section>
    )
}

export default PaySlip;