import React, { useEffect, useContext, useState, Fragment } from "react";
import { useSelector } from "react-redux";
import { officeReqContext } from "../../context/officeContext/officeReqContext";
import { Row, Col, Table } from "react-bootstrap";
import xssFilters from "xss-filters";
import { selectUser } from '../../Slices/mainSlices';


const PaySlipTable = () => {
    const user = useSelector(selectUser);

    const officeContext = useContext(officeReqContext);
    const {
        paySlipData,
        setGetPasswordModalShow,
        paySlipMonth,
        paySlipYear
    } = officeContext;

    const [grossReceipts, setGrossReceipts] = useState(0);
    const [deficits, setDeficits] = useState(0);
    useEffect(() => {
        if (paySlipData !== null) {
            setGrossReceipts(paySlipData.HomeRight + paySlipData.mamouriat2 + paySlipData.ChildRight + paySlipData.bon + paySlipData.padash + paySlipData.nobatkari +
                paySlipData.vampay + paySlipData.ezafehkar2 + paySlipData.eidi + paySlipData.poshtlist + paySlipData.tasvieh1 + paySlipData.afztolid2 +
                paySlipData.morkhasi1 + paySlipData.Etc + paySlipData.MonthlySalary + paySlipData.FridayWork + paySlipData.responsibilityRight);
            setDeficits(paySlipData.maliat + paySlipData.bimeh + paySlipData.HelpPay + paySlipData.LoanPart + paySlipData.AdditionalInsuranceRight + paySlipData.Kasrkar +
                paySlipData.morkhasi_bed + paySlipData.Etc_Kasr);
            setTimeout(() => {
                setGetPasswordModalShow(true);
            }, 5000 * 60);
        }
    }, [paySlipData])

    function numberWithCommas(x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    return (
        <Col xs='12'>
            <Row className="text-center">
                <Col xs='12' className="bg-secondary text-white border border-secondary p-2">
                    {paySlipData !== null ? <span className="font12">{`فیش حقوقی پایان ماه ${paySlipData.monthName} سال ${paySlipYear.label} ${user.CompanyName}`}</span> : null}
                </Col>
            </Row>
            <Row className="text-center border-bottom border-secondary">
                <Col xs='3' className="border-start border-secondary p-2">
                    {/* <img className="img-fluid" src="../../images/moshakhasat.png" crossOrigin="anonymous"/> */}
                    <span className="font12">مشخصات</span>
                </Col>
                <Col xs='6' className="border-start border-end border-secondary p-2">
                    {/* <img className="img-fluid" src="../../images/daramad.png" crossOrigin="anonymous"/> */}
                    <span className="font12 rtl">دریافت/درآمد(ریال)</span>
                </Col>
                <Col xs='3' className="border-end border-secondary p-2">
                    {/* <img className="img-fluid" src="../../images/kasrha.png" crossOrigin="anonymous"/> */}
                    <span className="font12">کسورات(ریال)</span>
                </Col>
            </Row>
            <Row className="border-bottom border-secondary">
                <Col xs='3' className="border-start border-secondary p-2">
                    {paySlipData !== null ? <span className="font12">
                        {xssFilters.inHTMLData(paySlipData.FullName) !== undefined ? `${xssFilters.inHTMLData(paySlipData.FullName)}` : 'نام و نام خانوادگی: '}
                    </span> : null}
                </Col>
                <Col xs='3' className="border-start border-secondary p-2">
                    {paySlipData !== null ?
                        <Fragment>
                            <span className="font12 me-2">
                                مسکن خواربار:
                                {/* <img className="img-fluid" src="../../images/maskan.png" crossOrigin="anonymous"/> */}
                            </span>
                            <span className="font12">
                                {paySlipData.HomeRight !== undefined ? `${numberWithCommas(xssFilters.inHTMLData(paySlipData.HomeRight))}` : ' '}
                            </span>
                        </Fragment>
                        : null}
                </Col>
                <Col xs='3' className="border-start border-end border-secondary p-2">
                    {paySlipData !== null ?
                        <Fragment>
                            <span className="font12 me-2">
                                فوق العاده ماموریت:
                                {/* <img className="img-fluid" src="../../images/mamouriat1.png" crossOrigin="anonymous"/> */}
                            </span>
                            <span className="font12">
                                {paySlipData.mamouriat2 !== undefined ? `${numberWithCommas(xssFilters.inHTMLData(paySlipData.mamouriat2))}` : ''}
                            </span>
                        </Fragment>
                        : null}
                </Col>
                <Col xs='3' className="border-end border-secondary p-2">
                    {paySlipData !== null ?
                        <Fragment>
                            <span className="font12 me-2">
                                مالیات:
                                {/* <img className="img-fluid" src="../../images/maliat.png" crossOrigin="anonymous"/> */}
                            </span>
                            <span className="font12">
                                {paySlipData.maliat !== undefined ? `${numberWithCommas(xssFilters.inHTMLData(paySlipData.maliat))}` : ''}
                            </span>
                        </Fragment>
                        : null}
                </Col>
            </Row>
            <Row className="border-bottom border-secondary">
                <Col xs='3' className="border-start border-secondary p-2">
                    {paySlipData !== null ?
                        <Fragment>
                            <span className="font12 me-2">
                                کدپرسنلی:
                                {/* <img className="img-fluid" src="../../images/Personelid.png" crossOrigin="anonymous"/> */}
                            </span>
                            <span className="font12">
                                {paySlipData.Personelid !== undefined ? `${xssFilters.inHTMLData(paySlipData.Personelid)}` : ''}
                            </span>
                        </Fragment>
                        : null}
                </Col>
                <Col xs='3' className="border-start border-secondary p-2">
                    {paySlipData !== null ?
                        <Fragment>
                            <span className="font12 me-2">
                                حق اولاد:
                                {/* <img className="img-fluid" src="../../images/ChildRight.png" crossOrigin="anonymous"/> */}
                            </span>
                            <span className="font12">
                                {paySlipData.ChildRight !== undefined ? `${numberWithCommas(xssFilters.inHTMLData(paySlipData.ChildRight))}` : ''}
                            </span>
                        </Fragment>
                        : null}
                </Col>
                <Col xs='3' className="border-start border-end border-secondary p-2">
                    {paySlipData !== null ?
                        <Fragment>
                            <span className="font12 me-2">
                                جمعه کاری:
                                {/* <img className="img-fluid" src="../../images/fridayWork.png" crossOrigin="anonymous"/> */}
                            </span>
                            <span className="font12">
                                {paySlipData.FridayWork !== undefined ? `${numberWithCommas(xssFilters.inHTMLData(paySlipData.FridayWork))}` : ''}
                            </span>
                        </Fragment>
                        : null}
                </Col>
                <Col xs='3' className="border-end border-secondary p-2">
                    {paySlipData !== null ?
                        <Fragment>
                            <span className="font12 me-2">
                                حق بیمه:
                                {/* <img className="img-fluid" src="../../images/bimeh.png" crossOrigin="anonymous"/> */}
                            </span>
                            <span className="font12">
                                {paySlipData.bimeh !== undefined ? `${numberWithCommas(xssFilters.inHTMLData(paySlipData.bimeh))}` : ''}
                            </span>
                        </Fragment>
                        : null}
                </Col>
            </Row>
            <Row className="border-bottom border-secondary">
                <Col xs='3' className="border-start border-secondary p-2">
                    {paySlipData !== null ?
                        <Fragment>
                            <span className="font12 me-2">
                                شماره بیمه:
                                {/* <img className="img-fluid" src="../../images/bimno.png" crossOrigin="anonymous"/> */}
                            </span>
                            <span className="font12">
                                {paySlipData.bimno !== undefined ? `${xssFilters.inHTMLData(paySlipData.bimno)}` : ''}
                            </span>
                        </Fragment>
                        : null}
                </Col>
                <Col xs='3' className="border-start border-secondary p-2">
                    {paySlipData !== null ?
                        <Fragment>
                            <span className="font12 me-2">
                                بن کارگری:
                                {/* <img className="img-fluid" src="../../images/overhour.png" crossOrigin="anonymous"/> */}
                            </span>
                            <span className="font12">
                                {paySlipData.bon !== undefined ? `${numberWithCommas(xssFilters.inHTMLData(paySlipData.bon))}` : ''}
                            </span>
                        </Fragment>
                        : null}
                </Col>
                <Col xs='3' className="border-start border-end border-secondary p-2">
                    {paySlipData !== null ?
                        <Fragment>
                            <span className="font12 me-2">
                                پاداش:
                                {/* <img className="img-fluid" src="../../images/padash.png" crossOrigin="anonymous"/> */}
                            </span>
                            <span className="font12">
                                {paySlipData.padash !== undefined ? `${numberWithCommas(xssFilters.inHTMLData(paySlipData.padash))}` : ''}
                            </span>
                        </Fragment>
                        : null}
                </Col>
                <Col xs='3' className="border-end border-secondary p-2">
                    {paySlipData !== null ?
                        <Fragment>

                        </Fragment>
                        : null}
                </Col>
            </Row>
            <Row className="border-bottom border-secondary">
                <Col xs='3' className="border-start border-secondary p-2">
                    {paySlipData !== null ?
                        <Fragment>
                            <span className="font12 me-2">
                                واحد سازمانی:
                                {/* <img className="img-fluid" src="../../images/dept.png" crossOrigin="anonymous"/> */}
                            </span>
                            <span className="font12">
                                {paySlipData.dept !== undefined ? `${xssFilters.inHTMLData(paySlipData.dept)}` : ''}
                            </span>
                        </Fragment>
                        : null}
                </Col>
                <Col xs='3' className="border-start border-secondary p-2">
                    {paySlipData !== null ?
                        <Fragment>
                            <span className='font12 me-2'>
                                نوبت کاری:
                                {/* <img className="img-fluid" src="../../images/nobatkari.png" crossOrigin="anonymous"/> */}
                            </span>
                            <span className="font12">
                                {paySlipData.nobatkari !== undefined ? `${numberWithCommas(xssFilters.inHTMLData(paySlipData.nobatkari))}` : ''}
                            </span>
                        </Fragment>
                        : null}
                </Col>
                <Col xs='3' className="border-start border-end border-secondary p-2">
                    {paySlipData !== null ?
                        <Fragment>
                            <span className='font12 me-2'>
                                وام دریافتی:
                                {/* <img className="img-fluid" src="../../images/vampay.png" crossOrigin="anonymous"/> */}
                            </span>
                            <span className="font12">
                                {paySlipData.vampay !== undefined ? `${numberWithCommas(xssFilters.inHTMLData(paySlipData.vampay))}` : ''}
                            </span>
                        </Fragment>
                        : null}
                </Col>
                <Col xs='3' className="border-end border-secondary p-2">
                    {paySlipData !== null ?
                        <Fragment>
                            <span className='font12 me-2'>
                                قسط وام:
                                {/* <img className="img-fluid" src="../../images/LoanPart.png" crossOrigin="anonymous"/> */}
                            </span>
                            <span className="font12">
                                {paySlipData.LoanPart !== undefined ? `${numberWithCommas(xssFilters.inHTMLData(paySlipData.LoanPart))}` : ''}
                            </span>
                        </Fragment>
                        : null}
                </Col>
            </Row>
            <Row className="border-bottom border-secondary">
                <Col xs='3' className="border-start border-secondary p-2">
                    {paySlipData !== null ?
                        <Fragment>
                            <span className='font12 me-2'>
                                کارکرد:
                                {/* <img className="img-fluid" src="../../images/DaysOfWork.png" crossOrigin="anonymous"/> */}
                            </span>
                            <span className="font12">
                                {paySlipData.DaysOfWork !== undefined ? `${xssFilters.inHTMLData(paySlipData.DaysOfWork)} روز ` : ''}
                            </span>
                        </Fragment>
                        : null}
                </Col>
                <Col xs='3' className="border-start border-secondary p-2">
                    {paySlipData !== null ?
                        <Fragment>
                            <span className='font12 me-2'>
                                اضافه کار و تعطیلات:
                                {/* <img className="img-fluid" src="../../images/ezafehkar1.png" crossOrigin="anonymous"/> */}
                            </span>
                            <span className="font12">
                                {paySlipData.ezafehkar2 !== undefined ? `${numberWithCommas(xssFilters.inHTMLData(paySlipData.ezafehkar2))}` : ''}
                            </span>
                        </Fragment>
                        : null}
                </Col>
                <Col xs='3' className="border-start border-end border-secondary p-2">
                    {paySlipData !== null ?
                        <Fragment>
                            <span className="font12 me-2">
                                عیدی و پاداش:
                                {/* <img className="img-fluid" src="../../images/eidi.png" crossOrigin="anonymous"/> */}
                            </span>
                            <span className="font12">
                                {paySlipData.eidi !== undefined ? `${numberWithCommas(xssFilters.inHTMLData(paySlipData.eidi))}` : ''}
                            </span>
                        </Fragment>
                        : null}
                </Col>
                <Col xs='3' className="border-end border-secondary p-2">
                    {paySlipData !== null ?
                        <Fragment>
                            <span className="font12 me-2">
                                بیمه تکمیلی:
                                {/* <img className="img-fluid" src="../../images/AdditionalInsuranceRight.png" crossOrigin="anonymous"/> */}
                            </span>
                            <span className="font12">
                                {paySlipData.AdditionalInsuranceRight !== undefined ? `${numberWithCommas(xssFilters.inHTMLData(paySlipData.AdditionalInsuranceRight))}` : ''}
                            </span>
                        </Fragment>
                        : null}
                </Col>
            </Row>
            <Row className="border-bottom border-secondary">
                <Col xs='3' className="border-start border-secondary p-2">
                    {paySlipData !== null ?
                        <Fragment>
                            <span className="font12 me-2">
                                مزد روزانه:
                                {/* <img className="img-fluid" src="../../images/dailySalary.png" crossOrigin="anonymous"/> */}
                            </span>
                            <span className="font12">
                                {paySlipData.MonthlySalary !== undefined ? `${numberWithCommas(Math.floor(xssFilters.inHTMLData(paySlipData.MonthlySalary) / xssFilters.inHTMLData(paySlipData.DaysOfWork)))}` : ''}
                            </span>
                        </Fragment>
                        : null}
                </Col>
                <Col xs='3' className="border-start border-secondary p-2">
                    {paySlipData !== null ?
                        <Fragment>
                            <span className="font12 me-2">
                                مزایا:
                                {/* <img className="img-fluid" src="../../images/poshtlist.png" crossOrigin="anonymous"/> */}
                            </span>
                            <span className="font12">
                                {paySlipData.poshtlist !== undefined ? `${numberWithCommas(xssFilters.inHTMLData(paySlipData.poshtlist))}` : ''}
                            </span>
                        </Fragment>
                        : null}
                </Col>
                <Col xs='3' className="border-start border-end border-secondary p-2">
                    {paySlipData !== null ?
                        <Fragment>
                            <span className="font12 me-2">
                                سنوات:
                                {/* <img className="img-fluid" src="../../images/tasvieh1.png" crossOrigin="anonymous"/> */}
                            </span>
                            <span className="font12">
                                {paySlipData.tasvieh1 !== undefined ? `${numberWithCommas(xssFilters.inHTMLData(paySlipData.tasvieh1))}` : ''}
                            </span>
                        </Fragment>
                        : null}
                </Col>
                <Col xs='3' className="border-end border-secondary p-2">
                    {paySlipData !== null ?
                        <Fragment>
                            <span className="font12 me-2">
                                کسر کار:
                                {/* <img className="img-fluid" src="../../images/Kasrkar.png" crossOrigin="anonymous"/> */}
                            </span>
                            <span className="font12">
                                {paySlipData.Kasrkar !== undefined ? `${numberWithCommas(xssFilters.inHTMLData(paySlipData.Kasrkar))}` : ''}
                            </span>
                        </Fragment>
                        : null}
                </Col>
            </Row>
            <Row className="border-bottom border-secondary">
                <Col xs='3' className="border-start border-secondary p-2">
                    {paySlipData !== null ?
                        <Fragment>
                            <span className='font12 me-2'>
                                مزد ماهانه:
                                {/* <img className="img-fluid" src="../../images/MonthlySalary.png" crossOrigin="anonymous"/> */}
                            </span>
                            <span className="font12">
                                {paySlipData.MonthlySalary !== undefined ? `${numberWithCommas(xssFilters.inHTMLData(paySlipData.MonthlySalary))}` : ''}
                            </span>
                        </Fragment>
                        : null}
                </Col>
                <Col xs='3' className="border-start border-secondary p-2">
                    {paySlipData !== null ?
                        <Fragment>
                            <span className='font12 me-2'>
                                حق مسئولیت:
                                {/* <img className="img-fluid" src="../../images/MonthlySalary.png" crossOrigin="anonymous"/> */}
                            </span>
                            <span className="font12">
                                {paySlipData.responsibilityRight !== undefined ? `${numberWithCommas(xssFilters.inHTMLData(paySlipData.responsibilityRight))}` : ''}
                            </span>
                        </Fragment>
                        : null}
                </Col>
                <Col xs='3' className="border-start border-end border-secondary p-2">
                    {paySlipData !== null ?
                        <Fragment>
                            <span className='font12 me-2'>
                                کارانه:
                                {/* <img className="img-fluid" src="../../images/afztolid1.png" crossOrigin="anonymous"/> */}
                            </span>
                            <span className="font12">
                                {paySlipData.afztolid1 !== undefined ? `${numberWithCommas(xssFilters.inHTMLData(paySlipData.afztolid2))}` : ''}
                            </span>
                        </Fragment>
                        : null}
                </Col>
                <Col xs='3' className="border-end border-secondary p-2">
                    {paySlipData !== null ?
                        <Fragment>
                            <span className='font12 me-2'>
                                غیبت:
                                {/* <img className="img-fluid" src="../../images/morkhasi_bed.png" crossOrigin="anonymous"/> */}
                            </span>
                            <span className="font12">
                                {paySlipData.morkhasi_bed !== undefined ? `${numberWithCommas(xssFilters.inHTMLData(paySlipData.morkhasi_bed))}` : ''}
                            </span>
                        </Fragment>
                        : null}
                </Col>
            </Row>
            <Row>
                <Col xs='3' className="border-start border-secondary">
                    {paySlipData !== null ?
                        <Fragment>
                            <Row className="border-bottom border-secondary">
                                <Col xs='6' className="p-2">
                                    <span className='font12 me-2'>
                                        واریز به بانک:
                                        {/* <img className="img-fluid" src="../../images/variz.png" crossOrigin="anonymous"/> */}
                                    </span>
                                </Col>
                                <Col xs='6' className="border-start border-secondary p-2">
                                    <span className="font12 fw-bold">
                                        {numberWithCommas(xssFilters.inHTMLData(grossReceipts) - xssFilters.inHTMLData(deficits))}
                                    </span>
                                </Col>
                            </Row>
                        </Fragment>
                        : null}
                </Col>
                <Col xs='3' className="border-start border-bottom border-secondary p-2">
                    {paySlipData !== null ?
                        <Fragment>
                            <span className='font12 me-2'>
                                خرید مرخصی:
                                {/* <img className="img-fluid" src="../../images/morkhasi1.png" crossOrigin="anonymous"/> */}
                            </span>
                            <span className="font12">
                                {paySlipData.morkhasi1 !== undefined ? `${numberWithCommas(xssFilters.inHTMLData(paySlipData.morkhasi1))}` : ''}
                            </span>
                        </Fragment>
                        : null}
                </Col>
                <Col xs='3' className="border-start border-end border-bottom border-secondary p-2">
                    {paySlipData !== null ?
                        <Fragment>
                            <span className='font12 me-2'>
                                سایر دریافتی ها:
                                {/* <img className="img-fluid" src="../../images/Etc.png" crossOrigin="anonymous"/> */}
                            </span>
                            <span className="font12">
                                {paySlipData.Etc !== undefined ? `${numberWithCommas(xssFilters.inHTMLData(paySlipData.Etc))}` : ''}
                            </span>
                        </Fragment>
                        : null}
                </Col>
                <Col xs='3' className="border-end border-bottom border-secondary p-2">
                    {paySlipData !== null ?
                        <Fragment>
                            <span className='font12 me-2'>
                                سایر کسور:
                                {/* <img className="img-fluid" src="../../images/Etc_Kasr.png" crossOrigin="anonymous"/> */}
                            </span>
                            <span className="font12">
                                {paySlipData.Etc_Kasr !== undefined ? `${numberWithCommas(xssFilters.inHTMLData(paySlipData.Etc_Kasr))}` : ''}
                            </span>
                        </Fragment>
                        : null}
                </Col>
            </Row>
            <Row className="border-bottom border-secondary">
                <Col xs='3' className="border-start border-secondary">
                    {paySlipData !== null ?
                        <Row>
                            <Col xs='6' className="p-2">
                                <span className='font12 me-2'>
                                    پیش پرداخت حقوق:
                                    {/* <img className="img-fluid" src="../../images/variz.png" crossOrigin="anonymous"/> */}
                                </span>
                            </Col>
                            <Col xs='6' className="border-start border-secondary p-2">
                                <span className="font12">
                                    {paySlipData.HelpPay !== undefined ? `${numberWithCommas(xssFilters.inHTMLData(paySlipData.HelpPay))}` : ''}
                                </span>
                            </Col>
                        </Row>
                        : null}
                </Col>
                <Col xs='6' className="border-start border-end border-secondary p-2">
                    {paySlipData !== null ?
                        <Fragment>
                            <span className='font12 me-2'>
                                جمع دریافتی ناخالص:
                                {/* <img className="img-fluid" src="../../images/grossReceipts.png" crossOrigin="anonymous"/> */}
                            </span>
                            <span className="font12 text-success fw-bold">
                                {numberWithCommas(xssFilters.inHTMLData(grossReceipts))}
                            </span>
                        </Fragment>
                        : null}
                </Col>
                <Col xs='3' className="border-end border-secondary p-2">
                    {paySlipData !== null ?
                        <Fragment>
                            <span className='font12 me-2'>
                                جمع کسور:
                                {/* <img className="img-fluid" src="../../images/deficits.png" crossOrigin="anonymous"/> */}
                            </span>
                            <span className="font12 text-danger fw-bold">
                                {numberWithCommas(xssFilters.inHTMLData(deficits))}
                            </span>
                        </Fragment>
                        : null}
                </Col>
            </Row>
            <Row>
                <Col xs='3' className="border-start border-bottom border-secondary">
                    {paySlipData !== null ?
                        <Row>
                            <Col xs='6' className="p-2">
                                <span className='font12 me-2'>
                                    جمع کل دریافتی این ماه:
                                    {/* <img className="img-fluid" src="../../images/variz.png" crossOrigin="anonymous"/> */}
                                </span>
                            </Col>
                            <Col xs='6' className="border-start border-secondary p-2">
                                <span className="font12">
                                    {paySlipData.HelpPay !== undefined ? `${numberWithCommas(xssFilters.inHTMLData(paySlipData.HelpPay + grossReceipts - deficits))}` : ''}
                                </span>
                            </Col>
                        </Row>
                        : null}
                </Col>
                <Col xs='3' className={`border-start border-end border-secondary p-2 ${paySlipData !== null && paySlipData.LoanBalance !== 0 ? 'border-bottom' : ''}`}>
                    {paySlipData !== null ?
                        <Fragment>
                            <span className='font12 me-2'>
                                مانده وام:
                                {/* <img className="img-fluid" src="../../images/variz.png" crossOrigin="anonymous"/> */}
                            </span>
                            {/* <span className="font12">
                                {paySlipData.mandehvam !== undefined ? `${numberWithCommas(xssFilters.inHTMLData(paySlipData.mandehvam))}` : ''}
                            </span> */}
                        </Fragment>
                        : null}
                </Col>
                <Col xs='6' className="border-end border-bottom border-secondary p-2">
                    {paySlipData !== null ?
                        <Fragment>
                            <span className='font12 me-2'>
                                حق بیمه پرداختی از طرف کارفرما به بیمه:
                                {/* <img className="img-fluid" src="../../images/deficits.png" crossOrigin="anonymous"/> */}
                            </span>
                            <span className="font12">
                                {numberWithCommas(xssFilters.inHTMLData(paySlipData.bossins))}
                            </span>
                        </Fragment>
                        : null}
                </Col>
            </Row>
            <Row className="mt-3">
                <Col xs='4' className="border-secondary border-top border-start border-bottom">
                    <div className="py-1">
                        <span className="font12">اضافه کار: </span>
                        {paySlipData !== null
                            ? <span className="d-inline-flex">{paySlipData.OverTime}</span>
                            : null
                        }
                    </div>
                </Col>
                <Col xs='4' className="border-secondary border-top border-start border-bottom">
                    <div className="py-1">
                        <span className="font12">ماموریت: </span>
                        {paySlipData !== null
                            ? <span className="d-inline-flex">{paySlipData.missiondays} روز</span>
                            : null
                        }
                    </div>
                </Col>
                <Col xs='4' className="border-secondary border-top border-end border-start border-bottom">
                    <div className="py-1">
                        <span className="font12">کسر کار: </span>
                        {paySlipData !== null
                            ? <span className="d-inline-flex">{paySlipData.LessTime}</span>
                            : null
                        }
                    </div>
                </Col>
            </Row>



            {/* <Table>
                <tr>
                    <td>
                        <Row className="text-center">
                            <Col xs='12' className="bg-secondary text-white border border-secondary p-2">
                                {paySlipData !== null ? <span className="font12">{`فیش حقوقی پایان ماه ${setSelectedMonth()} سال ${year} شرکت دفتر مرکزی`}</span> : null}
                            </Col>
                        </Row>
                    </td>
                </tr>
            </Table> */}
        </Col>
    )
}
export default PaySlipTable;