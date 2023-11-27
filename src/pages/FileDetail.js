import {Link, useParams} from "react-router-dom";
import SortableTable from "../components/SortableTable";
import {useAuth} from "../hooks/useAuth";
import {useEffect, useState} from "react";
import {Dimmer, Loader} from "semantic-ui-react";

const FileDetail = () => {
    let {user} = useAuth();
    let {id} = useParams();
    let [isLoading, setIsLoading] = useState(true);
    let date = new Date('2023-11-20')
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
            Header: 'Lượt truy cập',
            accessor: 'date',
        },
    ];

    const data = [
        { stt: '1', mssv: 'B1910073', date: '20-11-2023' },
        { stt: '2', mssv: 'B1910075', date: '19-11-2023' },
        { stt: '3', mssv: 'B1234567', date: '19-11-2023' },
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
                        <h2>Nội dung: <Link to='#'>lms.mdj</Link></h2>
                    </div>
                    <div>
                        <b>Hoạt động gần nhất: </b> B1910073, lúc: {date.toUTCString()}
                    </div>
                    <div>
                        <b>Tổng lượt truy cập: </b> 3
                    </div>
                    <div className='mt-2'><Link to='#'>Xuất danh sách</Link></div>
                    <SortableTable columns={columns} data={data}/>
                </div>
        }
    </div>
};

export default FileDetail;