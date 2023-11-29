import {useAuth} from "../hooks/useAuth";
import {useEffect, useState} from "react";
import {Button, Dimmer, Form, Loader, Modal} from "semantic-ui-react";
import {Link} from "react-router-dom";

const CourseManagement = () => {
    let {user} = useAuth();
    let [course, setCourse] = useState({});
    let [testOption, setTestOption] = useState({});
    let [isLoading, setIsLoading] = useState(true);
    let [modal, setModal] = useState(false);
    let [form, setForm] = useState({
        course_id: '',
        lecturer_id: user.account_username,
        class_description: '',
        class_semester: '',
        class_year: '',
        class_date: '',
        class_start: '',
        class_end: ''
    });

    const openModal = (e) => setModal(true);
    const closeModal = (e) => setModal(false);

    const submitModal = async () => {
        await fetch('http://localhost:8080/api/v1/classes', {
            method: "POST",
            mode: "cors",
            body: JSON.stringify(form),
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            }
        }).finally(() => {
            fetchClasses()
            setModal(false)
        })
    }

    const styleModal = {
        top: 'auto',
        bottom: 'auto',
        right: 'auto',
        left: 'auto',
        position: 'relative',
        height: '45rem',
    }
    const fetchClasses = async () => {
        await fetch("http://localhost:8080/api/v1/classes/v2/lecturers/" + user.account_username)
            .then(res => res.json())
            .then(classes => setCourse(classes));
    }

    const fetchCourse = async () => {
        await fetch('http://localhost:8080/api/v1/courses')
            .then(res => res.json())
            .then(data => setTestOption(data))
    }

    useEffect(() => {
        Promise.all([fetchClasses(), fetchCourse()]).finally(() => setIsLoading(false))
    }, [])

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
                        <h1 className='h1'>Danh sách khóa học</h1>
                    </div>
                    <hr/>
                    <Button className='text-success bg-transparent' onClick={openModal}>Thêm lớp học</Button>
                    <br/>
                    {course.map(klasse => (
                        <div className="border rounded mb-3 p-3">
                            <Link to={'/aclass/' + klasse.class_id} key={klasse.class_id}>
                                <h3>Lớp {klasse.course_name}</h3>
                                <h4>Nhóm {klasse.class_id}</h4>
                            </Link>
                        </div>
                    ))}

                    <Modal open={modal} onClose={closeModal} style={styleModal}>
                        <Modal.Header>Thêm lớp học</Modal.Header>
                        <Modal.Content>
                            <Form>
                                <Form.Input
                                    label='Tên giảng viên'
                                    disabled
                                    value={form.lecture_id}
                                    fluid
                                />
                                <Form.Dropdown
                                    label='Mã môn'
                                    placeholder='Chọn môn học'
                                    selection
                                    fluid
                                    value={form.course_id}
                                    options={testOption}
                                    onChange={(e, {value}) => setForm({...form, course_id: value})}
                                />
                                <Form.Input
                                    label='Tóm tắt nội dung'
                                    placeholder='Lớp học về nội dung gì, ...'
                                    value={form.class_description}
                                    fluid
                                    onChange={(e, {value}) => setForm({...form, class_description: e.target.value})}
                                />
                                <Form.Dropdown
                                    label='Niên khóa'
                                    placeholder='Chọn niên khóa'
                                    selection
                                    fluid
                                    value={form.class_year}
                                    options={[
                                        {
                                            text: '2023-2024',
                                            value: '2023-2024',
                                        }
                                    ]}
                                    onChange={(e, {value}) => setForm({...form, class_year: value})}
                                />
                                <Form.Dropdown
                                    label='Học kỳ'
                                    placeholder='Chọn học kỳ'
                                    selection
                                    fluid
                                    value={form.class_semester}
                                    options={[
                                        {
                                            text: '1',
                                            value: '1',
                                        },
                                        {
                                            text: '2',
                                            value: '2',
                                        },
                                        {
                                            text: '3',
                                            value: '3',
                                        }
                                    ]}
                                    onChange={(e, {value}) => setForm({...form, class_semester: value})}
                                />
                                <Form.Dropdown
                                    label='Ngày thứ'
                                    placeholder='Chọn thứ'
                                    selection
                                    fluid
                                    value={form.class_date}
                                    options={[
                                        {
                                            text: 'Thứ Hai',
                                            value: 'Thứ Hai',
                                        },
                                        {
                                            text: 'Thứ Ba',
                                            value: 'Thứ Ba',
                                        },
                                        {
                                            text: 'Thứ Tư',
                                            value: 'Thứ Tư',
                                        },
                                        {
                                            text: 'Thứ Năm',
                                            value: 'Thứ Năm',
                                        },
                                        {
                                            text: 'Thứ Sáu',
                                            value: 'Thứ Sáu',
                                        },
                                        {
                                            text: 'Thứ Bảy',
                                            value: 'Thứ Bảy',
                                        },
                                    ]}
                                    onChange={(e, {value}) => setForm({...form, class_date: value})}
                                />
                                <Form.Dropdown
                                    label='Tiết bắt đầu'
                                    placeholder='Chọn tiết'
                                    selection
                                    fluid
                                    value={form.class_start}
                                    options={[
                                        {
                                            text: '1',
                                            value: '1',
                                        },
                                        {
                                            text: '2',
                                            value: '2',
                                        },
                                        {
                                            text: '3',
                                            value: '3',
                                        },
                                        {
                                            text: '4',
                                            value: '4',
                                        },
                                        {
                                            text: '5',
                                            value: '5',
                                        },
                                        {
                                            text: '6',
                                            value: '6',
                                        },
                                        {
                                            text: '7',
                                            value: '7',
                                        },
                                        {
                                            text: '8',
                                            value: '8',
                                        },
                                        {
                                            text: '9',
                                            value: '9',
                                        },
                                    ]}
                                    onChange={(e, {value}) => setForm({...form, class_start: value})}
                                />
                                <Form.Dropdown
                                    label='Tiết kết thúc'
                                    placeholder='Chọn tiết'
                                    selection
                                    fluid
                                    value={form.class_end}
                                    options={[
                                        {
                                            text: '1',
                                            value: '1',
                                        },
                                        {
                                            text: '2',
                                            value: '2',
                                        },
                                        {
                                            text: '3',
                                            value: '3',
                                        },
                                        {
                                            text: '4',
                                            value: '4',
                                        },
                                        {
                                            text: '5',
                                            value: '5',
                                        },
                                        {
                                            text: '6',
                                            value: '6',
                                        },
                                        {
                                            text: '7',
                                            value: '7',
                                        },
                                        {
                                            text: '8',
                                            value: '8',
                                        },
                                        {
                                            text: '9',
                                            value: '9',
                                        },
                                    ]}
                                    onChange={(e, {value}) => setForm({...form, class_end: value})}
                                />
                            </Form>
                        </Modal.Content>
                        <Modal.Actions>
                            <Button negative onClick={closeModal}>
                                Đóng
                            </Button>
                            <Button positive onClick={submitModal}>
                                Đồng ý
                            </Button>
                        </Modal.Actions>
                    </Modal>
                </div>
        }
    </div>
};

export default CourseManagement;