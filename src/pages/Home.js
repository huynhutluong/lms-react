import {useEffect, useState} from "react";
import {Link} from "react-router-dom";
import {useAuth} from "../hooks/useAuth";
import {Dimmer, Loader} from "semantic-ui-react";

const Home = () => {

    let {user} = useAuth();

    let date = new Date();
    let days = ['Chủ+Nhật', 'Thứ+Hai', 'Thứ+Ba', 'Thứ+Tư', 'Thứ+Năm', 'Thứ+Sáu', 'Thứ+Bảy'];
    let today = days[date.getDay()];
    let [todayclasses, setTodayclasses] = useState([]);
    let [classes, setClasses] = useState([]);
    let [aclasses, setAclasses] = useState([]);
    let [account, setAccount] = useState([]);
    let [isLoading, setIsLoading] = useState(true);

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

    async function updateActivities(){
        await fetch(`http://localhost:8080/activities?account_id=${user.account_id}&activity_type=Xem+trang&activity_target=${window.location.pathname}`)
    }

    useEffect(() => {
        if (isLoading) {
            console.log('start fetching')
            Promise.all([getTodayclassesAPI(),
                getClassesAPI(),
                getAccount(),
                updateActivities()]).finally(() => {
                console.log('Fetching completed')
                setIsLoading(false)
            })
        }
    }, [])


    return <div>
        {isLoading
            ?
            <div>
                <Dimmer active>
                <Loader />
            </Dimmer>
            </div>
            :
            <div>
                <h1 className='h1'>Chào mừng bạn trở lại hệ thống.</h1>
                <hr/>
                <div>
                    {
                        account.account_role === 'student'
                        &&
                        <div>
                            <h3 className='h3'>Lịch học hôm nay</h3>
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
                        <h3 className='h3'>Các khóa học gần đây</h3>
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
                        <div className='d-flex flex-column justify-content-center align-items-center'>
                            <h4>Bắt đầu bằng cách chọn các chức năng trên thanh điền hướng</h4>
                        </div>
                    </div>
                }
            </div>
        }
    </div>
};

export default Home;