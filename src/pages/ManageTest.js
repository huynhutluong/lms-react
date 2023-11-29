import {Link, useParams} from "react-router-dom";
import SortableTable from "../components/SortableTable";
import {useAuth} from "../hooks/useAuth";
import {useEffect, useState} from "react";
import {Button, Dimmer, Loader} from "semantic-ui-react";
import * as XLSX from "xlsx";

const ManageTest = () => {
    let {id} = useParams();
    let {user} = useAuth();
    let date = new Date();
    let [isLoading, setIsLoading] = useState(true);
    let [tests, setTests] = useState({});
    const columns = [
        {
            Header: 'MSSV',
            accessor: 'student_id',
        },
        {
            Header: 'Mã bài kiểm tra',
            accessor: 'st_id',
        },
        {
            Header: 'Số câu trả lời đúng',
            accessor: 'score',
        },
        {
            Header: 'Tổng số câu hỏi',
            accessor: 'max_score',
        },
    ];

    const fetchTests = async () => {
        await fetch(`http://localhost:8080/api/v1/scores/${id}`)
            .then(res => res.json())
            .then(data => setTests(data))
    }

    async function updateActivities() {
        await fetch(`http://localhost:8080/activities?account_id=${user.account_id}&activity_type=Xem+trang&activity_target=${window.location.pathname}`)
    }

    useEffect(() => {
        Promise.all([updateActivities(), fetchTests()]).finally(() => setIsLoading(false))
    }, [])

    console.log(tests)

    const exportToExcel = () => {

        const ws = XLSX.utils.json_to_sheet(tests);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Hoạt động bài kiểm tra');

        // Save the file
        XLSX.writeFile(wb, 'Ket_qua_kiem_tra_' + new Date() + '.xlsx');
    };

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
                        <b>Tổng lượt truy cập: </b> {tests.length}
                    </div>

                    <div className='mt-2'><Button className='bg-transparent text-success' onClick={exportToExcel}>Xuất danh sách</Button></div>
                    <SortableTable columns={columns} data={tests}/>
                    <hr/>
                    <h2>Bảng chi tiết</h2>
                    <hr/>
                    {tests.length > 0 && <div>
                        <table className="ui celled table" style={{width: '100%'}}>
                            <thead>
                            <tr>
                                <th>MSSV</th>
                                <th>Mã bài kiểm tra</th>
                                <th className='d-flex justify-content-center'>Chi tiết</th>
                            </tr>
                            </thead>
                            <tbody>
                            {
                                tests.map(test => {
                                    return <tr>
                                        <td>
                                            {test.student_id}
                                        </td>
                                        <td>
                                            {test.st_id}
                                        </td>
                                        <td className=''>
                                            <div className='d-flex justify-content-center align-items-center'>
                                                <Link to={`/testresult/${test.st_id}`}><b>Xem chi tiết</b></Link>
                                            </div>
                                        </td>
                                    </tr>
                                })
                            }
                            </tbody>
                        </table>
                    </div>
                    }
                </div>
        }
    </div>
};

export default ManageTest;