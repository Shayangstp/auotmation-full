import React from "react";
import { Container, Row, Col } from "react-bootstrap";

const NotFound = ({}) => {
    return (
        <section className="min-vh-100 position-absolute top-0 backImage inputDesign">
            <Container fluid className='min-vh-100 d-grid align-items-center purpleOpacity'>
                <Row>
                    <Col md='12' className="px-0 mb-4 pt-3">
                        <div className="text-center text-white">
                            <img className="img-fluid mb-3" src='../../images/kaveh.png'/>
                            <h1 className="font30 fw-bold">سامانه اتوماسیون گروه صنعتی شیشه کاوه</h1>
                        </div>
                    </Col>
                    <Col md='12' lg='6' className="mx-auto p-4 rounded shadow lightOpacity text-white my-3">
                        <div className="d-flex justify-content-center py-5" id="notfound">
                            <div className="text-center">
                                <div className="notfound-404">
                                    <h1 className="font60 text-danger">404</h1>
                                </div>
                                <h2 className="font20 mb-4 text-warning">صفحه موردنظر یافت نشد!</h2>
                                <a className="btn btn-outline-light" href={localStorage.getItem('id') !== null ? "http://automation.kavehglass.com:9070/Home" : "http://automation.kavehglass.com:9070/"}>
                                    {localStorage.getItem('id') !== null ? "صفحه اصلی" : "ورود به سامانه"}
                                </a>
                            </div>
                        </div>
                    </Col>
                </Row>
            </Container>
        </section>
    );
};

export default NotFound;