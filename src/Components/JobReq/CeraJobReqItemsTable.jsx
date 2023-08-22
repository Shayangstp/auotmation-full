import React from 'react';
import { Table } from 'react-bootstrap';
import { selectCeramicReqItems } from '../Slices/ceramicSlices';
import { useSelector } from 'react-redux';
import moment from 'moment-jalaali';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperclip } from '@fortawesome/free-solid-svg-icons';

const CeraJobReqItemsTable = () => {
    const ceramicReqItems = useSelector(selectCeramicReqItems);
    return(
        <Table responsive hover striped bordered className='mt-5' variant='light' size='sm'>
            <thead>
                <tr>
                    <td className='bg-secondary text-white fw-normal'>ردیف</td>
                    <td className='bg-secondary text-white fw-normal'>موضوع درخواست</td>
                    <td className='bg-secondary text-white fw-normal'>تعداد</td>
                    <td className='bg-secondary text-white fw-normal'>واحد</td>
                    <td className='bg-secondary text-white fw-normal'>مشخصات فنی</td>
                    <td className='bg-secondary text-white fw-normal'>تاریخ مورد نیاز</td>
                    <td className='bg-secondary text-white fw-normal'>الگو</td>
                    <td className='bg-secondary text-white fw-normal'>فایل</td>
                    <td className='bg-secondary text-white fw-normal'>توضیحات</td>
                </tr>
            </thead>
            <tbody>
                {
                    ceramicReqItems.map((item, index)=>{
                        return(
                            <tr key={index}>
                                <td>{index+1}</td>
                                <td>{item.reqItemSubject}</td>
                                <td>{item.reqItemAmount}</td>
                                <td>{item.unit.label}</td>
                                <td>{item.reqItemTechSpecifications}</td>
                                <td>{new Date(item.reqItemDeadline).toLocaleString('fa-IR', {numberingSystem: 'latn', year:'numeric', month:'numeric', day:'numeric'})}</td>
                                <td>{item.reqPattern.label}</td>
                                <td>{item.reqFiles.length !== 0 ? <FontAwesomeIcon icon={faPaperclip}/> : ''}</td>
                                <td>{item.description}</td>
                            </tr>
                        )
                    })
                }
            </tbody>
        </Table>
    )
}

export default CeraJobReqItemsTable
