import {Link, useParams} from "react-router-dom";
import {useAuth} from "../hooks/useAuth";
import {useEffect, useState} from "react";
import {Button, Dimmer, Loader} from "semantic-ui-react";
import LineChart from "../components/LineChart";
import * as XLSX from 'xlsx';
import SortableTable from "../components/SortableTable";

const Activities = () => {
    let {user} = useAuth();
    let {id} = useParams();
    let [activities, setActivities] = useState({})
    let [chartData, setChartData] = useState({})
    let [isLoading, setIsLoading] = useState(true)

    let column = [
        {
            accessor: 'account_id',
            Header: 'Người dùng',
        },
        {
            accessor: 'activity_type',
            Header: 'Hành động',
        },
        {
            accessor: 'activity_target',
            Header: 'Nội dung',
        },
        {
            accessor: 'activity_date',
            Header: 'Ngày',
        },
    ]

    const fetchActivities = async () => {
        await fetch('http://localhost:8080/activities/admin')
            .then(res => res.json())
            .then(data => setActivities(data))
    }

    const fetchChart = async () => {
        await fetch('http://localhost:8080/activities/chart')
            .then(res => res.json())
            .then(newData => setChartData(newData))
    }

    const exportToExcel = () => {

        const ws = XLSX.utils.json_to_sheet(activities);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Hoạt động người dùng');

        // Save the file
        XLSX.writeFile(wb, 'Activities' + new Date() + '.xlsx');
    };

    useEffect(() => {
        Promise.all([fetchActivities(), fetchChart()]).finally(() => setIsLoading(false))
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
                    <h2>Biểu đồ</h2>
                    <LineChart data={chartData}/>
                    <hr/>
                    <h2>Bảng hoạt động</h2>
                    <div className='mt-2'>
                        <Button className='text-success bg-transparent' onClick={exportToExcel}>Xuất danh sách</Button>
                    </div>
                    <SortableTable data={activities} columns={column}/>
                </div>
        }
    </div>
};

export default Activities;