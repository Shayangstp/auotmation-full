import React, { useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { rootContext } from "../context/rootContext";
import { officeReqContext } from "../context/officeContext/officeReqContext";
import OfficeReqItem from './OfficeReqItem';
import { Container, Row, Col, Button, Alert } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner, faHome, faWarning } from '@fortawesome/free-solid-svg-icons';


const RequestsList = ({setPageTitle, loading}) => {
    const mainContext = useContext(rootContext);
    const {
        handleCheckPermission,
        menuPermission,
    } = mainContext;
    useEffect(()=>{
        handleCheckPermission(localStorage.getItem('lastLocation'));
    },[])

    useEffect(()=>{
        setPageTitle('لیست نامه ها');
    }, [setPageTitle])
    

    const officeContext = useContext(officeReqContext);
    const {
        handleOfficeReqsList,
        officeReqsList
    } = officeContext;

    useEffect(()=>{
        handleOfficeReqsList();
    },[]);
    
    return(
        <Container className='pb-4'>
            {menuPermission ?
                <section>
                    {loading ?
                        <div className="d-flex justify-content-center"><FontAwesomeIcon icon={faSpinner} className='spinner font60'/></div>
                    : 
                        <Row>
                            {officeReqsList.length !== 0 ? officeReqsList.map( (item, index) =>(
                                <OfficeReqItem item={item} key={index}/>
                            )) : null}
                        </Row>
                    }
                </section>
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

export default RequestsList;