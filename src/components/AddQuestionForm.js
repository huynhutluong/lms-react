import React, {useEffect, useState} from 'react';
import {Button, Dropdown, Form, Modal} from 'semantic-ui-react';

const AddQuestionForm = ({ open, onClose, course_id }) => {
    const [selectedOption, setSelectedOption] = useState('E');
    const [formData, setFormData] = useState({
        // Initialize your form fields here
        course_id: '',
        title: '',
        answers: [],
        correct_answer: '',
        phan_loai: 'E',
        score: 10
    });

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

    let addStyle = {
        top: 'auto',
        bottom: 'auto',
        right: 'auto',
        left: 'auto',
        position: 'relative',
        height: 'auto'
    }

    const handleChange = (e, { name, value }) => {
        setFormData({ ...formData, [name]: value });
    };

    const updateValueAtIndex = (e, {index, value}) => {
        // Create a new array with the updated value
        const newArray = [...formData.answers];
        newArray[index] = value;

        // Set the state with the new array
        setFormData({ ...formData, ['answers']: newArray });
    };

    const handleSubmit = async () => {
        if (formData.phan_loai === 'E') {
            setFormData({ ...formData, ['score']: 10 });
        }
        if (formData.phan_loai === 'E') {
            setFormData({ ...formData, ['score']: 20 });
        }
        if (formData.phan_loai === 'E') {
            setFormData({ ...formData, ['score']: 30 });
        }

        await fetch('http://localhost:8080/api/v1/questions', {
            mode: "cors",
            method: 'POST',
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            },
            body: JSON.stringify({
                course_id: formData.course_id,
                question_title: formData.title,
                question_score: formData.score,
                phan_loai: formData.phan_loai,
                answers: formData.answers,
                correct_answer: formData.correct_answer
            })
        }).then((message) => console.log(message))

        setFormData({
            course_id: course_id,
            title: '',
            answers: [],
            correct_answer: '',
            phan_loai: 'E',
            score: 10
        })
        onClose();
    };

    useEffect(() => {
        setFormData((prevCourse_id) => ({
            ...prevCourse_id,
            course_id: course_id || '',
        }));
    }, [course_id]);

    return (
        <Modal open={open} onClose={onClose} style={addStyle}>
            <Modal.Header>Thêm câu hỏi</Modal.Header>
            <Modal.Content>
                <Form>
                    <Form.Input
                        label="Mã môn"
                        type="text"
                        name="course_id"
                        value={formData.course_id}
                        onChange={handleChange}
                        disabled={true}
                    />
                    <Form.Input
                        label="Câu hỏi"
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                    />
                    <Form.Dropdown
                    label='Chọn độ khó'
                    placeholder='Độ khó'
                    fluid
                    name="phan_loai"
                    value={formData.phan_loai}
                    onChange={handleChange}
                    options={dropdownOptions}
                    style={{padding: '5px'}}
                    />
                    <Form.Input
                        label="Đáp án 1"
                        type="text"
                        name="answer0"
                        value={formData.answers[0]}
                        onChange={updateValueAtIndex}
                        index='0'
                    />
                    <Form.Input
                        label="Đáp án 2"
                        type="text"
                        name="answer1"
                        value={formData.answers[1]}
                        onChange={updateValueAtIndex}
                        index='1'
                    />
                    <Form.Input
                        label="Đáp án 3"
                        type="text"
                        name="answer2"
                        value={formData.answers[2]}
                        onChange={updateValueAtIndex}
                        index='2'
                    />
                    <Form.Input
                        label="Đáp án 4"
                        type="text"
                        name="answer3"
                        value={formData.answers[3]}
                        onChange={updateValueAtIndex}
                        index='3'
                    />
                    <Form.Input
                        label="Đáp án 5"
                        type="text"
                        name="answer4"
                        value={formData.answers[4]}
                        onChange={updateValueAtIndex}
                        index='4'
                    />
                    <Form.Input
                        label="Đáp án 6"
                        type="text"
                        name="answer5"
                        value={formData.answers[5]}
                        onChange={updateValueAtIndex}
                        index='5'
                    />
                    <Form.Input
                        label="Nhập lại đáp án đúng"
                        type="text"
                        name="correct_answer"
                        value={formData.correct_answer}
                        onChange={handleChange}
                    />
                </Form>
            </Modal.Content>
            <Modal.Actions>
                <Button color="black" onClick={onClose}>
                    Đóng
                </Button>
                <Button
                    positive
                    icon="checkmark"
                    labelPosition="right"
                    content="Xác nhận"
                    onClick={handleSubmit}
                />
            </Modal.Actions>
        </Modal>
    );
};

export default AddQuestionForm;