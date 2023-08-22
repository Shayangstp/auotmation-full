import React, {useContext} from "react";
import { reqContext } from '../../context/jobReqsContext/reqContext';
import { Modal, Button, Form, Col, Table } from "react-bootstrap";
import Select from 'react-select';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

const FirstMaterialsModal = () => {
    const requestContext = useContext(reqContext);
    const {
        firstMaterialsModal,
        setFirstMaterialsModal,
        firstMaterialSearch,
        setFirstMaterialSearch,
        firstMaterialGrpSearch,
        setFirstMaterialGrpSearch,
        firstMaterialCodeSearch,
        setFirstMaterialCodeSearch,

    } = requestContext;
    const list = [
        {code:401, name:'آچار'},
        {code:402, name:'2 آچار'},
        {code:403, name:'3 آچار'},
        {code:404, name:'4 آچار'},
    ]
    return(
        <Modal
            size="s"
            centered
            backdrop="static"
            show={firstMaterialsModal}
            onHide={()=>{
                setFirstMaterialsModal(false);
            }}
            className = 'modal bg-dark'
            scrollable= {true}
        >
            <Modal.Header className='justify-content-center border-0 pt-5 text-center'>
                <Modal.Title id="contained-modal-title-vcenter" className="modal-title font20 fw-bold">
                    افزودن مواد اولیه
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form.Group as={Col} md='12' className='mb-4'>
                    <Form.Label className='mb-1 me-3 required-field'>جستجو نام کالا :</Form.Label>
                    <Form.Control className="w-100" name='firstMaterialSearch' value={firstMaterialSearch} onChange={e => setFirstMaterialSearch(e.target.value)} />
                </Form.Group>
                <Form.Group as={Col} md='12' className='mb-4'>
                    <Form.Label className='mb-1 me-3 required-field'>گروه :</Form.Label>
                    <Form.Control className="w-100" name='firstMaterialGrpSearch' value={firstMaterialGrpSearch} onChange={e => setFirstMaterialGrpSearch(e.target.value)} />
                </Form.Group>
                <Form.Group as={Col} md='12' className='mb-4'>
                    <Form.Label className='mb-1 me-3 required-field'>کد کالا :</Form.Label>
                    <Form.Control className="w-100" name='firstMaterialCodeSearch' value={firstMaterialCodeSearch} onChange={e => setFirstMaterialCodeSearch(e.target.value)} />
                </Form.Group>
                <div className="d-flex justify-content-end">
                    <Button className="mb-4"
                        onClick={()=> {
                            
                        }}
                    >جستجو</Button>
                </div>
                <Form.Group as={Col} md='12' className='mb-4'>
                    <Form.Label className='mb-1 me-3 required-field'>انتخاب نام کالا :</Form.Label>
                    <Select className="w-100" name="" value='' onChange={(e) => { 
                        
                    }}
                    placeholder='انتخاب...' options={list} id=''/>
                </Form.Group>
                {list.length !== 0 ?
                    <Col md='12'>
                        <Table bordered hover responsive size="sm">
                            <thead>
                                <tr>
                                    <th className="col-2 bg-secondary text-white fw-normal">کد</th>
                                    <th className="col-2 bg-secondary text-white fw-normal">شرح</th>
                                    <th className="col-1 bg-secondary text-white fw-normal">عملیات</th>
                                </tr>
                            </thead>
                            <tbody>
                                {list.map((item, index)=>(
                                    <tr className="text-center" key={index}>
                                        <td>{item.code}</td>
                                        <td>{item.name}</td>
                                        <td><FontAwesomeIcon className="text-danger cursorPointer" icon={faTrash} onClick={()=>{
                                            //removeExecuterFromList(index);
                                        }}/></td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </Col>
                : null}
            </Modal.Body>
            <Modal.Footer className="justify-content-between border-0 pb-5">
                <Button variant="success"
                    onClick={()=> {
                        
                    }}
                >ثبت</Button>
                <Button
                    variant="danger"
                    onClick={()=> {
                        setFirstMaterialSearch('');
                        setFirstMaterialGrpSearch('');
                        setFirstMaterialCodeSearch('');
                        setFirstMaterialsModal(false);
                    }}
                >بستن</Button>
            </Modal.Footer>
        </Modal>
    )
}

export default FirstMaterialsModal;