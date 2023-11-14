import {useEffect, useLayoutEffect, useState} from "react";
import {Link} from "react-router-dom";
import {useAuth} from "../hooks/useAuth";

const Home = () => {

    let {user} = useAuth();

    let date = new Date();
    let days = ['Chủ+Nhật', 'Thứ+Hai', 'Thứ+Ba', 'Thứ+Tư', 'Thứ+Năm', 'Thứ+Sáu', 'Thứ+Bảy'];
    let today = days[date.getDay()];
    let [todayclasses, setTodayclasses] = useState([]);
    let [classes, setClasses] = useState([]);
    let [aclasses, setAclasses] = useState([]);
    let [account, setAccount] = useState([]);

    // useEffect(() => {
    //     document.body.style.backgroundColor = 'white'
    // }, []);

    async function getTodayclassesAPI() {
        await fetch("http://localhost:8080/api/v1/classes?student_id=" + user.account_username + "&today=" + today)
            .then(res => res.json())
            .then(todayclasses => setTodayclasses(todayclasses));
    }

    async function getClassesAPI() {
        await fetch("http://localhost:8080/api/v1/classes/" + user.account_username + "/3")
            .then(res => res.json())
            .then(classes => setClasses(classes));
    }

    async function getAccount() {
        await fetch("http://localhost:8080/login?account_username=" + user.account_username)
            .then(res => res.json())
            .then(account => setAccount(account));
    }

    async function getAClassesAPI() {
        await fetch("http://localhost:8080/api/v1/classes/v2/lecturers/" + user.account_username)
            .then(res => res.json())
            .then(classes => setAclasses(classes));
    }

    useEffect(() => {
        getTodayclassesAPI().then();
        getClassesAPI().then();
        getAccount().then();
        getAClassesAPI().then();
    }, []);

    return <div>
        <h1>Chào mừng bạn trở lại hệ thống.</h1>
        <hr/>
        <div>
            {
                account.account_role === 'student'
                &&
                <div>
                    <h3>Lịch học hôm nay</h3>
                    <div className='d-flex flex-column'>
                        {todayclasses.length > 0
                            ?
                            <>
                                {todayclasses.map(todayclass => (
                                    <div key={todayclass.class_id}>
                                        <Link to={'/class/' + todayclass.class_id} className='mb-1'>
                                            <b>{todayclass.course_name}</b>
                                            <p>Tiết: {todayclass.class_start} - {todayclass.class_end}</p>
                                        </Link>
                                    </div>
                                ))}
                            </>
                            :
                            <b className='text-secondary text-opacity-50 mb-2'>Không có tiết học. Tuyệt vời :)))</b>
                        }
                    </div>
                </div>
            }
            <hr/>
        </div>
        {account.account_role === 'student'
            &&
            <div>
                <h3>Các khóa học gần đây</h3>
                <div className='d-flex'>
                    {classes.map(klass => (
                        <Link to={'/class/' + klass.class_id} className='card m-2' key={klass.class_id}>
                            <div className="position-absolute bottom-0 start-0 m-1">
                                <div className=''>
                                    <b>{klass.course_name}</b>
                                </div>
                                <div className=''>
                                    <b>{klass.lecturer_fullname}</b>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        }

        {
            account.account_role === 'lecturer'
            &&
            <div>
                <h3>Các lớp của bạn</h3>
                {aclasses.map(aclass => {
                    return <Link key={aclass.class_id} to={'/aclass/' + aclass.class_id}>
                        <div className='border rounded p-3 mb-3'>
                            <h4>{aclass.course_name} - {aclass.class_id}</h4>
                            <p><i>Bắt đầu từ tiết {aclass.class_start} cho tới tiết {aclass.class_end} </i></p>
                            <b>{aclass.class_date}</b>
                        </div>
                    </Link>
                })}
            </div>
        }
    </div>;
};

export default Home;