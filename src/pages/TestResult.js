import {useParams, useNavigate, Link} from "react-router-dom";
import {useAuth} from "../hooks/useAuth";
import {useEffect, useState} from "react";
import Countdown from "react-countdown";

const TestResult = () => {
    let {user} = useAuth();
    let {id} = useParams();
    let navigate = useNavigate();
    let [isLoading, setIsLoading] = useState(true);
    let [account, setAccount] = useState({});
    let [results, setResults] = useState([]);
    let [test, setTest] = useState([]);
    let textOption = ['A. ', 'B. ', 'C. ', 'D. ', 'E. ', 'F. ', 'G. ', 'H', 'J', 'K. ']


    async function getAccount() {
        await fetch("http://localhost:8080/login?account_username=" + user.account_username)
            .then(res => res.json())
            .then(account => setAccount(account));
    }

    async function fetchNumber() {
        await fetch(`http://localhost:8080/api/v1/test_result/test/${id}`, {
            mode: "cors"
        })
            .then(res => res.json())
            .then(data => {
                setTest(data)
            })
    }

    async function getResult() {
        await fetch(`http://localhost:8080/api/v1/test_result/${id}`)
            .then(res => res.json())
            .then(rs => setResults(rs));
    }

    useEffect(() => {
        Promise.all([getResult(),
        getAccount(), fetchNumber()]).finally(() => setIsLoading(false))
    }, []);

    let [score, setScore] = useState(0);

    useEffect(() => {
        setScore(0);

        if (!isLoading) {
            results.forEach(result => {
                if (result.student_answers === result.correct_answers) {
                    setScore(prevScore => prevScore + result.score);
                }
            });
        }
    }, [results])

    const comparisons = results.map(result => ({
        question_id: result.question_id,
        isCorrect: result.student_answers === result.correct_answers
    }));

    return (<div>
        {isLoading
            ?
            <div>Đang chờ</div>
            :
            <div>
                <h2>Câu trả lời của bạn</h2>
                <b>Điểm: {score} / {test.question_score} </b>
                <div>
                    {results.map(result => {
                        return <div className='rounded border mb-4 px-2 py-4'>
                            <b>
                                Câu hỏi: {result.question_title}
                            </b>
                            <p>
                                <div>
                                    {result.answers.map((answer, index) => {
                                        return <div>
                                            {textOption[index] + answer}
                                        </div>
                                    })}
                                </div>
                            </p>
                            <p>
                                <b>Bạn trả lời:</b> <i>{result.student_answers}</i>
                            </p>
                            <p>
                                <b>Đáp án:</b> <i>{result.correct_answers}</i>
                            </p>
                        </div>
                    })}
                </div>
                <br/>
                <br/>
            </div>
        }
    </div>);
}

export default TestResult;