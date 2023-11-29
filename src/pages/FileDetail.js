import {Link, useNavigate, useParams} from "react-router-dom";
import SortableTable from "../components/SortableTable";
import {useAuth} from "../hooks/useAuth";
import {useEffect, useState} from "react";
import {Button, Confirm, Dimmer, Loader} from "semantic-ui-react";
import * as XLSX from "xlsx";

const FileDetail = () => {
    let {user} = useAuth();
    let navigate = useNavigate();
    let {id} = useParams();
    let [file, setFile] = useState({});
    let [isLoading, setIsLoading] = useState(true);
    let [deleteModal, setDeleteModal] = useState(false);
    let date = new Date('2023-11-20')
    const columns = [
        {
            Header: 'Mã hoạt động',
            accessor: 'activity_id', // accessor is the "key" in the data
        },
        {
            Header: 'Mã tài khoản',
            accessor: 'account_id',
        },
        {
            Header: 'Ngày',
            accessor: 'activity_date',
        },
    ];

    const styleDelete = {
        top: 'auto',
        bottom: 'auto',
        right: 'auto',
        left: 'auto',
        position: 'relative',
        height: '13rem',
    }

    const openDelete = (e) => setDeleteModal(true);
    const closeDelete = (e) => setDeleteModal(false);

    const fetchFile = async () => {
        await fetch(`http://localhost:8080/api/v1/file/detail/${id}`)
            .then(res => res.json())
            .then(data => setFile(data))
    }

    async function updateActivities() {
        await fetch(`http://localhost:8080/activities?account_id=${user.account_id}&activity_type=Xem+trang&activity_target=${window.location.pathname}`)
    }

    useEffect(() => {
        Promise.all([updateActivities(), fetchFile()]).finally(() => setIsLoading(false))
    }, [])

    const exportToExcel = () => {

        const ws = XLSX.utils.json_to_sheet(file.activities);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Hoạt động tập tin');

        // Save the file
        XLSX.writeFile(wb, 'Activities_' + file.file_id + "_" + new Date() + '.xlsx');
    };

    console.log(file)

    const submitDelete = async () => {
        await fetch(`http://localhost:8080/api/v1/file/delete/${id}`, {
            mode: "cors",
            method: "DELETE"
        }).then(() => {
            closeDelete()
            alert('Xóa thành công')
            navigate(-1)
        })
    }

    return <div>
        {
            isLoading
            ?
                <div>
                    <Dimmer active>
                        <Loader/>
                    </Dimmer>
                </div>
                :
                <div>
                    <div className='mb-3'>
                        <h1>Các hoạt động gần đây:</h1>
                    </div>
                    <div>
                        <h2>Nội dung: <Link target='_blank' to={'http://localhost:8080/' + file.file_address}>{file.file_name}</Link></h2>
                    </div>
                    <div>
                        <b>Tổng lượt truy cập: </b> {file.activities.length}
                    </div>
                    <div className='mt-2'><Button className='bg-transparent text-success' onClick={exportToExcel}>Xuất danh sách</Button></div>
                    <SortableTable columns={columns} data={file.activities}/>
                    <div className='mt-2'><Button className='bg-transparent text-danger' onClick={openDelete}>Xóa file</Button></div>
                    <Confirm
                        header={<h2 className='p-3'>Xóa nội dung</h2>}
                        content={<div>
                            <h4 className='px-3'>Lưu ý: Nội dung đã xóa không thể khôi phục.</h4>
                        </div>}
                        open={deleteModal}
                        onCancel={closeDelete}
                        onConfirm={submitDelete}
                        cancelButton='Hủy'
                        confirmButton='Xác nhận'
                        style={styleDelete}
                    />
                </div>
        }
    </div>
};

export default FileDetail;