import {useEffect, useState} from "react";
import SortableTable from "../components/SortableTable";
import {Button, Confirm, Dropdown, Form, Modal} from "semantic-ui-react";
import {Link} from "react-router-dom";
import AddQuestionForm from "../components/AddQuestionForm";
import SortableTableWithLink from "../components/SortableTableWithLink";
import {useAuth} from "../hooks/useAuth";

const QuestionsManagement = () => {
    let {user} = useAuth();
    let [questions, setQuestions] = useState({});
    let [courses, setCourses] = useState({});
    let [isLoading, setIsLoading] = useState(true);
    let [selectedValue, setSelectedValue] = useState(null);
    let [addForm, setAddForm] = useState(false);
    let [deleteForm, setDeleteForm] = useState(false);

    const openModal = () => setAddForm(true);
    const closeModal = () => {
        setAddForm(false);

        if (!selectedValue) {
            fetchCourse().then()
        } else {
            fetchThisCourse().then();
        }
    }

    const columns = [
        {
            Header: 'ID',
            accessor: 'question_id',
        },
        {
            Header: 'Câu hỏi',
            accessor: 'question_title',
        },
        {
            Header: 'Câu trả lời đúng',
            accessor: 'correct_answer',
        },
        {
            Header: 'Chi tiết',
            accessor: 'detail',
        },
    ];

    const successButton = {
        background: 'transparent',
        color: 'green',
    };

    const datas = [
        {
            question_id: "ct467q1",
            question_title: "Which protocol is used for secure data transmission over the web?",
            correct_answer: "HTTPS"
        },
        {
            question_id: "ct467q2",
            question_title: "What is the purpose of a primary key in a database table?",
            correct_answer: "Ensure data uniqueness"
        }
    ]
    const fetchQuestions = async () => {
        await fetch(`http://localhost:8080/api/v1/questions`, {
            mode: "cors"
        })
            .then(res => res.json())
            .then(data => setQuestions(data))
    }

    function handleChange(e, {value}) {
        setSelectedValue(value)
    }


    const fetchThisCourse = async () => {
        await fetch(`http://localhost:8080/api/v1/questions?course_id=${selectedValue}`)
            .then(res => res.json())
            .then(newData => setQuestions(newData))
    }

    const fetchCourse = async () => {
        await fetch(`http://localhost:8080/api/v1/courses`, {
            mode: "cors"
        })
            .then(res => res.json())
            .then(data => setCourses(data))
    }

    async function updateActivities() {
        await fetch(`http://localhost:8080/activities?account_id=${user.account_id}&activity_type=Xem+trang&activity_target=${window.location.pathname}`)
    }

    useEffect(() => {
        Promise.all([fetchCourse(), fetchQuestions(), updateActivities()]).finally(() => setIsLoading(false))
    }, []);

    useEffect(() => {
        if (selectedValue != null) {
            fetchThisCourse().then()
        }
    }, [selectedValue])

    return <div>
        {isLoading ? <div>Đang chờ</div>
            :
            <div>
                <Dropdown placeholder="Chọn môn học ..." fluid selection options={courses} className='my-2'
                          onChange={handleChange} value={selectedValue}/>
                <Button style={successButton} onClick={openModal}>Thêm câu hỏi mới</Button>
                {/*<SortableTableWithLink columns={columns} data={questions}/>*/}
                {questions.length > 0 && <div>
                    <table className="ui celled table" style={{width: '100%'}}>
                        <thead>
                        <tr>
                            <th>ID</th>
                            <th>Câu hỏi</th>
                            <th className='d-flex justify-content-center'>Chi tiết</th>
                        </tr>
                        </thead>
                        <tbody>
                        {
                            questions.map(question => {
                                return <tr>
                                    <td>
                                        {question.question_id}
                                    </td>
                                    <td>
                                        {question.question_title}
                                    </td>
                                    <td className=''>
                                        <div className='d-flex justify-content-center align-items-center'>
                                            <Link to={`/lecturer/question/${question.question_id}`}><b>Xem chi tiết</b></Link>
                                        </div>
                                    </td>
                                </tr>
                            })
                        }
                        </tbody>
                    </table>
                </div>
                }
                <AddQuestionForm open={addForm} onClose={closeModal} course_id={selectedValue}/>
            </div>
        }
    </div>;
};

export default QuestionsManagement;