import {Link, useParams} from "react-router-dom";
import SortableTable from "../components/SortableTable";
import {useAuth} from "../hooks/useAuth";
import {useEffect, useState} from "react";
import {Dimmer, Loader} from "semantic-ui-react";

const ManageTest = () => {
    let {id} = useParams();
    let {user} = useAuth();
    let date = new Date();
    let [isLoading, setIsLoading] = useState(true);
    const columns = [
        {
            Header: 'STT',
            accessor: 'stt', // accessor is the "key" in the data
        },
        {
            Header: 'MSSV',
            accessor: 'mssv',
        },
        {
            Header: 'Số câu trả lời đúng',
            accessor: 'ca',
        },
    ];

    const data = [
        {stt: '1', mssv: 'B1910073', ca: '10/10'},
        {stt: '2', mssv: 'B1910075', ca: '5/10'},
        {stt: '3', mssv: 'B1234567', ca: '9/10'},
    ];

    async function updateActivities() {
        await fetch(`http://localhost:8080/activities?account_id=${user.account_id}&activity_type=Xem+trang&activity_target=${window.location.pathname}`)
    }

    useEffect(() => {
        Promise.all([updateActivities()]).finally(() => setIsLoading(false))
    }, [])

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
                        <b>Hoạt động gần nhất: </b> B1910073, lúc: {date.toUTCString()}
                    </div>
                    <div>
                        <b>Tổng lượt truy cập: </b> 3
                    </div>
                    <div>
                        <div>
                            <b>
                                Câu hỏi được trả lời đúng nhiều nhất:
                            </b> "Which of the following is not a web browser?"
                        </div>
                        <div>
                            <b>Câu hỏi được trả lời sai nhiều nhất:</b> "In database normalization, what is the process
                            of organizing data to minimize redundancy?
                            "
                        </div>
                    </div>
                    <div className='d-flex justify-content-between'>
                        <div>
                            <b>Điểm cao nhất:</b> 10/10
                        </div>
                        <div className='mx-3'>
                            <b>Điểm thấp nhất:</b> 5/10
                        </div>
                    </div>
                    <div className='mt-2'><Link to='#'>Xuất danh sách</Link></div>
                    <SortableTable columns={columns} data={data}/>
                </div>
        }
    </div>
};

export default ManageTest;