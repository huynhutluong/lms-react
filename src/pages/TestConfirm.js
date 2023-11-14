import {useParams, useNavigate, Link} from "react-router-dom";
import {useAuth} from "../hooks/useAuth";
import {useEffect, useState} from "react";
import {Button, Form, Input, Label} from "semantic-ui-react";

const TestConfirm = () => {
    let { user } = useAuth();
    let navigate = useNavigate();
    let { id } = useParams();
    let [details, setDetails] = useState({});
    let [isLoading, setIsLoading] = useState(true);
    let [password, setPassword] = useState('');

    async function fetchTest() {
        await fetch('http://localhost:8080/api/v1/tests/' + id, {
            mode: "cors"
        })
            .then(res => res.json())
            .then(data => {
                setDetails(data)
            })
    }

    function handleChange(e) {
        setPassword(e.target.value)
    }

    async function generateTest() {
        await fetch(`http://localhost:8080/api/v1/tests/generate`, {
            mode: "cors",
            method: 'POST',
            headers: {'Content-type': 'application/json; charset=UTF-8'},
            body: JSON.stringify({
                test_id: id,
                student_id: user.account_username,
                total_time: details.test_time,
                easy_questions: details.easy_questions,
                medium_questions: details.medium_questions,
                hard_questions: details.hard_questions
            })
        })
    }

    function formSubmit(e) {
        e.preventDefault();
        if (password === details.test_password) {
            generateTest().then(() => navigate('/test/' + user.account_username + id))
        }
        else alert('Sai mật khẩu')
    }

    useEffect(() => {
        fetchTest().finally(() => setIsLoading(false))
    }, [])


    return <div>
        {!isLoading ?
        <div>
            <div className='d-flex flex-column align-items-center justify-content-center mb-5'>
                <h2>
                    {details.test_name}
                </h2>
                <p>
                    Số lượng câu hỏi: {details.test_questions}
                </p>
                <p>
                    Thời gian làm bài: {details.test_time / (1000*60)} phút
                </p>
            </div>

            <Form onSubmit={formSubmit} className='d-flex flex-column justify-content-center align-items-center'>
                <Form.Field>
                    <label htmlFor="password">Nhập mật khẩu</label>
                    <Input type='password' className='password' onChange={handleChange}></Input>
                </Form.Field>
                <Button>Xác nhận</Button>
            </Form>

        </div>
        :
        <div>Đang chờ</div>}
    </div>
}


export default TestConfirm;