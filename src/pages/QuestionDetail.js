import {useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {findAllByDisplayValue} from "@testing-library/react";
import {Button, Confirm, Dimmer, Form, Loader, Modal} from "semantic-ui-react";
import {useAuth} from "../hooks/useAuth";

const Blogs = () => {
    let {id} = useParams();
    let {user} = useAuth();
    let navigate = useNavigate();
    let [question, setQuestion] = useState({});
    let [isLoading, setIsLoading] = useState(true);
    let options = ['A. ', 'B. ', 'C. ', 'D. ', 'E. ', 'F. '];
    let [selectedValue, setSelectedValue] = useState(null)
    let [updateForm, setUpdateForm] = useState(false);
    let [deleteForm, setDeleteForm] = useState(false);

    const dropdownOptions = [
        {
            key: 'E',
            text: "Dễ",
            value: 'E',
        },
        {
            key: 'M',
            text: "Trung Bình",
            value: 'M',
        },
        {
            key: 'H',
            text: "Khó",
            value: 'H',
        },
    ]

    const styleUpdate = {
        top: 'auto',
        bottom: 'auto',
        right: 'auto',
        left: 'auto',
        position: 'relative',
        height: '40rem',
    }

    const styleDelete = {
        top: 'auto',
        bottom: 'auto',
        right: 'auto',
        left: 'auto',
        position: 'relative',
        height: '16rem',
    }

    const fetchQuestion = async () => {
        await fetch(`http://localhost:8080/api/v1/questions/${id}`)
            .then(res => res.json())
            .then(data => setQuestion(data))
    }

    async function updateActivities() {
        await fetch(`http://localhost:8080/activities?account_id=${user.account_id}&activity_type=Xem+trang&activity_target=${window.location.pathname}`)
    }

    useEffect(() => {
        Promise.all([fetchQuestion(), updateActivities()]).finally(() => setIsLoading(false))
    }, []);

    const openUpdate = () => {
        setUpdateForm(true);
    }

    const closeUpdate = () => {
        fetchQuestion().then();
        setUpdateForm(false);
    }

    const openDelete = () => {
        setDeleteForm(true);
    }


    const closeDelete = () => {
        setDeleteForm(false);
    }

    const submitDelete = async () => {
        await fetch('http://localhost:8080/api/v1/questions', {
            method: "DELETE",
            mode: "cors",
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            },
            body: JSON.stringify({
                question_id: question.question_id
            })
        }).then(() => {
            setUpdateForm(false);
            navigate('/lecturer/questions')
        })
            .catch(e => console.log(e))
    }

    const submitUpdate = async () => {
        await fetch('http://localhost:8080/api/v1/questions', {
            method: "PUT",
            mode: "cors",
            headers: {
            'Content-type': 'application/json; charset=UTF-8',
            },
            body: JSON.stringify(question)
        }).then(() => {
            setUpdateForm(false);
            fetchQuestion()
        })
            .catch(e => console.log(e))
    }

    return <div>
        {isLoading
            ?
            <div>
                <Dimmer active>
                    <Loader/>
                </Dimmer>
            </div>
            :
            <div>
                <h1>
                    Câu hỏi: {question.question_id}
                </h1>
                <hr/>
                <h3>Nội dung: {question.question_title}</h3>
                <h3>Câu trả lời:</h3>
                {question.answers.map((answer, index) => {
                    return <div>
                        {options[index]} {answer}
                    </div>
                })}
                <h3>Độ khó: </h3>
                {question.phan_loai === 'E' && <div>Dễ</div>}
                {question.phan_loai === 'M' && <div>Khá</div>}
                {question.phan_loai === 'H' && <div>Khó</div>}
                <h3>Điểm:</h3>
                {question.question_score}
                <hr/>
                <div className='d-flex'>
                    <Button className='text-warning bg-transparent' onClick={openUpdate}>Chỉnh sửa nội dung</Button>
                    <div>
                        <Button className='bg-transparent text-danger' onClick={openDelete}>Xóa câu hỏi</Button>
                        <Confirm
                            header={<h2 className='p-3'>Xóa nội dung</h2>}
                            content={<div>
                                <h4 className='px-3'>Lưu ý: Để tránh mất dữ liệu, xóa nội dung sẽ chỉ chuyển trạng thái của nội dung sang không hoạt động, chứ không thực sự xóa nội dung khỏi cơ sở dữ liệu</h4>
                                <h5 className='px-3'>Xác nhận xóa nội dung?</h5>
                            </div>}
                            open={deleteForm}
                            onCancel={closeDelete}
                            onConfirm={submitDelete}
                            cancelButton='Hủy'
                            confirmButton='Xác nhận'
                            style={styleDelete}
                        />
                    </div>
                </div>
                <div>
                    <Modal open={updateForm} onClose={closeUpdate} style={styleUpdate}>
                        <Modal.Header>Cập nhật câu hỏi</Modal.Header>
                        <Modal.Content>
                            <Form>
                                <Form.Input
                                    label='Mã câu hỏi'
                                    value={question.question_id}
                                    disabled={true}
                                    onChange={(e) => setQuestion({ ...question, question_id: e.target.value })}
                                />
                                <Form.Input
                                    label='Nội dung'
                                    value={question.question_title}
                                    onChange={(e) => setQuestion({ ...question, question_title: e.target.value })}
                                />
                                <Form.Dropdown
                                    label='Phân loại'
                                    placeholder='Độ khó'
                                    name='phan_loai'
                                    fluid
                                    value={question.phan_loai}
                                    options={dropdownOptions}
                                    onChange={(e, {value}) => setQuestion({ ...question, phan_loai: value })}
                                    style={{padding: '5px'}}
                                />
                                <Form.Input
                                    label='Đáp án 1'
                                    value={question.answers[0]}
                                    onChange={(e) => setQuestion({ ...question, answers: [e.target.value, ...question.answers.slice(1),] })}
                                />
                                <Form.Input
                                    label='Đáp án 2'
                                    value={question.answers[1]}
                                    onChange={(e) => setQuestion({ ...question, answers: [question.answers[0], e.target.value, ...question.answers.slice(2),] })}
                                />
                                <Form.Input
                                    label='Đáp án 3'
                                    value={question.answers[2]}
                                    onChange={(e) => setQuestion({ ...question, answers: [question.answers[0], question.answers[1], e.target.value, ...question.answers.slice(3),] })}
                                />
                                <Form.Input
                                    label='Đáp án 4'
                                    value={question.answers[3]}
                                    onChange={(e) => setQuestion({ ...question, answers: [question.answers[0], question.answers[1], question.answers[2], e.target.value, ...question.answers.slice(4),] })}
                                />
                                <Form.Input
                                    label='Đáp án 5'
                                    value={question.answers[4]}
                                    onChange={(e) => setQuestion({ ...question, answers: [question.answers[0], question.answers[1], question.answers[2], question.answers[3], e.target.value, ...question.answers.slice(5),] })}
                                />
                                <Form.Input
                                    label='Đáp án 6'
                                    value={question.answers[5]}
                                    onChange={(e) => setQuestion({ ...question, answers: [question.answers[0], question.answers[1], question.answers[2], question.answers[3], question.answers[4], e.target.value, ...question.answers.slice(6),] })}
                                />
                                <Form.Input
                                    label='Nhập lại đáp án đúng'
                                    value={question.correct_answer}
                                    onChange={(e) => setQuestion({ ...question, correct_answer: e.target.value })}
                                />
                            </Form>
                        </Modal.Content>
                        <Modal.Actions>
                            <Button negative onClick={closeUpdate}>
                                Đóng
                            </Button>
                            <Button positive onClick={submitUpdate}>
                                Đồng ý
                            </Button>
                        </Modal.Actions>
                    </Modal>
                </div>
            </div>
        }
    </div>;
};

export default Blogs;