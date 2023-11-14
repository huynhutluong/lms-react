import {useParams, useNavigate, Link} from "react-router-dom";
import {useAuth} from "../hooks/useAuth";
import {useEffect, useState} from "react";
import Countdown from "../components/Countdown";
import {Button, Confirm, Form} from "semantic-ui-react";

const Test = () => {
    let {user} = useAuth();
    let navigate = useNavigate();
    let {id} = useParams();
    let [test, setTest] = useState([]);
    let [isReady, setIsReady] = useState(false);
    let [confirmButton, setConfirmButton] = useState(false);
    let [formData, setFormData] = useState({});
    let [selectedValues, setSelectedValues] = useState({});
    let [time, setTime] = useState(null);

    let textOption = ['A. ', 'B. ', 'C. ', 'D. ', 'E. ', 'F. ', 'G. ', 'H', 'J', 'K. ']

    async function fetchTest() {
        await fetch(`http://localhost:8080/api/v1/tests/${id.slice(0, 5)}/${id}`, {
            mode: "cors"
        })
            .then(res => res.json())
            .then(data => {
                setTest(data)
            })
    }

    const handleChange = (e, { name, value }) => {
        setSelectedValues({ ...selectedValues, [name]: value });
    };

    async function handleSubmit(e) {
        e.preventDefault();
        setConfirmButton(false)

        // let question_id = Object.keys(selectedValues)
        // let student_answers = Object.values(selectedValues)

        await fetch(`http://localhost:8080/api/v1/tests/submit`, {
            method: 'POST',
            mode: 'cors',
            body: JSON.stringify({
                st_id: id,
                student_id: user.account_username,
                answers: selectedValues
            }),
            headers: {'Content-type': 'application/json; charset=UTF-8'}
        }).then(res => res.json()).then(dt => console.log(dt)).then(() => navigate(`/testresult/${id}`))
    }

    useEffect(() => {
        fetchTest().finally(() => setIsReady(true));
    }, []);

    if (isReady) {
        let time = test.ended_at;
        let date1 = new Date();
        let date2 = new Date(time);
    }

    return (<div>
            {
                isReady ? <div>
                        <div>
                            <Form>
                                {test.questions.map((question, index) => (
                                    <Form.Field key={index}>
                                        <label id={question.question_id}>{`Câu ${index + 1}: ` + question.question_title}</label>
                                        {question.answers.map((option, optionIndex) => (
                                            <span>
                                                <Form.Radio
                                                    key={optionIndex}
                                                    label={textOption[optionIndex] + option}
                                                    name={`${question.question_id}`}
                                                    value={option}
                                                    checked={selectedValues[`${question.question_id}`] === option}
                                                    onChange={handleChange}
                                                />
                                            </span>
                                        ))}
                                    </Form.Field>
                                ))}


                                <div className='d-flex flex-column test-timer justify-content-between'>
                                    <div className='d-flex align-items-center justify-content-center'>
                                        <div className='d-flex flex-wrap'>
                                            {test.questions.map((question,index) => {
                                                return <div className='p-1 m-1 rounded border timer-content text-center'>
                                                    <a href={'#' + question.question_id}>{index + 1}</a>
                                                </div>
                                            })}
                                        </div>
                                    </div>
                                    <div className='d-flex '>
                                        <div className='text-center'>
                                            {test.ended_at.slice(0,19)}
                                        </div>
                                        <Button className='ui button' onClick={() => setConfirmButton(true)}>
                                            Nộp bài
                                        </Button>
                                    </div>
                                </div>

                                <div style={{height: '20px !important'}}>
                                    <Confirm
                                        open={confirmButton}
                                        content="Xác nhận nộp bài?"
                                        confirmButton="Nộp"
                                        cancelButton="Hủy"
                                        size='mini'
                                        onConfirm={handleSubmit}
                                        onCancel={() => setConfirmButton(false)}
                                        className='my-modal'
                                    />
                                </div>
                            </Form>
                            <br/>
                            <br/>
                        </div>
                    </div>


                    : <div>Đang chờ</div>
            }
        </div>
    )
};

export default Test;