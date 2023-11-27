import {useEffect, useState} from "react";
import {Link} from "react-router-dom";
import {Button, Dimmer, Input, Loader} from "semantic-ui-react";
import {useAuth} from "../hooks/useAuth";

const CourseList = () => {
    let {user} = useAuth();
    let [classes, setClasses] = useState([]);
    let [isLoading, setIsLoading] = useState(true);

    async function searchCourse(e) {
        e.preventDefault();
        await fetch(`http://localhost:8080/api/v1/classes/q/${e.target[0].value}`)
            .then(data => setClasses(data))
    }

    async function getAPIClasses() {
        await fetch("http://localhost:8080/api/v1/classes")
            .then(res => res.json())
            .then(classes => setClasses(classes));
    }

    async function updateActivities() {
        await fetch(`http://localhost:8080/activities?account_id=${user.account_id}&activity_type=Xem+trang&activity_target=${window.location.pathname}`)
    }

    useEffect(() => {
        Promise.all([getAPIClasses(), updateActivities()]).finally(() => setIsLoading(false))
    }, []);

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
                    <div>
                        <form onSubmit={searchCourse} className='d-flex justify-content-center align-items-center mb-5'>
                            <Input type="text"/>
                            <Button className='ms-3'>Tìm</Button>
                        </form>
                    </div>
                    {classes.map(klasse => (
                        <div className="border rounded mb-3 p-3">
                            <Link to={'/class/' + klasse.class_id} key={klasse.class_id}>

                                <h3>Lớp {klasse.course_name} - Nhóm {klasse.class_id.slice(-1)} </h3>
                                <i>Bởi: {klasse.lecturer_fullname}</i>
                                <p>{klasse.class_description}</p>
                                <p>Bộ môn: {klasse.category_name}</p>

                            </Link>
                        </div>
                    ))}
                </div>
        }
    </div>;
};

export default CourseList;