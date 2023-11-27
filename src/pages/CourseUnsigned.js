import { useParams, useNavigate } from "react-router-dom";
import {useAuth} from "../hooks/useAuth";
import {useEffect, useState} from "react";

const Course = () => {

    let navigate = useNavigate();
    let { id} = useParams();
    let { user } = useAuth();
    let [ content, setContent ] = useState([]);

    const fetchClass = async () => await fetch(
        'http://localhost:8080/api/v1/class?student_id=' + user.account_username + '&class_id=' + id,
        {
            mode: 'cors'
        }
    )
        .then(res => res.json())
        .then(data => {
            setContent(data);
            navigate('/class/' + id);
        })
        .catch(e => {
            navigate('/uclass/' + id);
        })

    async function handleClick(event) {
        event.preventDefault();
        await fetch(
            'http://localhost:8080/api/v1/class',
            {
                method: 'POST',
                mode: 'cors',
                body: JSON.stringify({
                    student_id: user.account_username,
                    class_id: id
                }),
                headers: {
                    'Content-type': 'application/json; charset=UTF-8',
                }
            }
        )
            .then(res => res.json())
            .then((data) => navigate('/class/' + id))
            .catch(e => {
                navigate('/');
            })

    }


    useEffect(() => {
        fetchClass();
        }, []);


    return (<div className='d-flex flex-column align-items-center justify-content-center'>
        <h1>Bạn chưa đăng ký vào lớp học này.</h1>
        <button className="btn btn-success" onClick={handleClick}>Đăng ký?</button>
    </div>);
};

export default Course;