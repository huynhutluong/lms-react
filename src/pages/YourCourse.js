import {useAuth} from "../hooks/useAuth";
import {useEffect, useState} from "react";
import {Dimmer, Loader} from "semantic-ui-react";
import {findAllByDisplayValue} from "@testing-library/react";
import {Link} from "react-router-dom";

const YourCourse = () => {
    let {user} = useAuth();
    let [isLoading, setIsLoading] = useState(true);
    let [courses, setCourses] = useState({})


    const fetchCourses = async () => {
        await fetch(`http://localhost:8080/api/v1/courses/student/${user.account_username}`)
            .then(res => res.json())
            .then(data => setCourses(data))
    }
    useEffect(() => {
        Promise.all([fetchCourses()]).finally(() => setIsLoading(false))
    }, [])

    console.log(courses)
    return <div>
        {
            isLoading ? <div>
                <Dimmer active>
                    <Loader/>
                </Dimmer>
            </div>
                : <div>
                <h1>Các lớp học của bạn</h1>
                <hr/>
                    {courses.map(course => {
                        return <Link to={'/class/' + course.class_id}>
                            <div>
                                <div className='rounded border p-4 d-flex flex-column justify-content-between '>
                                    <h2>
                                        {course.course_name} - {course.class_id}
                                    </h2>
                                    <div>
                                        <div>
                                            {course.class_date}
                                        </div>
                                        <div>
                                            Tiết: {course.class_start} - {course.class_end}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    })}
                </div>
        }
    </div>
};

export default YourCourse;