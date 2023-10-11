import React, { useEffect } from 'react';
import { Container, Row, Col} from 'react-bootstrap';
import PaySlipReportFilter from './PaySlipReportFilter';
import PaySlipReportTable from './PaySlipReportTable';
import { selectPaySlipReport } from './../../../Slices/financialSlices';
import { useSelector } from 'react-redux';

const PaySlipReport = ({ setPageTitle }) => {
    const paySlipReport = useSelector(selectPaySlipReport);
    
    useEffect(()=>{
        setPageTitle('گزارش حقوق')
    },[])

    return (
        <Container fluid className='py-4'>
            <Row>
                <Col md='12'>
                    <PaySlipReportFilter />
                </Col>
                {paySlipReport.length !== 0 ? <Col md='12'>
                    <PaySlipReportTable />
                </Col> : null}
            </Row>
        </Container>
    )
}

export default PaySlipReport;