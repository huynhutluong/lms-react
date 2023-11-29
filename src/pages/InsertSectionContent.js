import {useNavigate, useParams} from "react-router-dom";
import {Dropdown, Form, TextArea, Button, Label, Dimmer, Loader, Input} from "semantic-ui-react";
import {useEffect, useState} from "react";
import {useAuth} from "../hooks/useAuth";


const InsertSectionContent = () => {
    let navigate = useNavigate();
    let {id} = useParams();
    let {user} = useAuth();
    let [files, setFiles] = useState(null);
    let [content, setContent] = useState('');
    let [isLoading, setIsLoading] = useState(true);
    let [testOption, setTestOption] = useState({});
    let [testForm, setTestForm] = useState({
        section_id: id,
        course_id: '',
        test_name: '',
        test_password: '',
        test_time: '',
        easy_questions: '',
        medium_questions: '',
        hard_questions: ''
    })

    function handleChange(e, data) {
        setContent(data.value)
    }

    function fileChange(e) {
        setFiles(e.target.files[0])
    }

    async function handleFile(e) {
        let file = new FormData();
        file.append('file', files);

        await fetch(`http://localhost:8080/api/v1/file?owner=${user.account_username}&section_id=${id}`,
            {
                method: "POST",
                mode: "cors",
                body: file
            }).then(res => navigate(-1))
    }

    const handleTest = async (e) => {
        e.preventDefault()
        const test = {
            section_id: testForm.section_id,
            course_id: testForm.course_id,
            test_name: testForm.test_name,
            test_password: testForm.test_password,
            test_time: testForm.test_time * 1000 * 60,
            easy_questions: parseInt(testForm.easy_questions),
            medium_questions: parseInt(testForm.medium_questions),
            hard_questions: parseInt(testForm.hard_questions),
        }

        await fetch('http://localhost:8080/api/v1/tests', {
            method: "POST",
            mode: "cors",
            body: JSON.stringify(test),
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            }
        })
            .finally(() => navigate(-1))
            .catch((e) => console.log(e))
    }

    async function handlePosts(e) {
        e.preventDefault();
        let data = {
            "owner": user.account_username,
            "section_id": id,
            "post_title": e.target[0].value,
            "post_description": e.target[1].value
        };

        await fetch('http://localhost:8080/api/v1/posts', {
            method: "POST",
            mode: "cors",
            body: JSON.stringify(data),
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            }
        }).then(res => navigate(-1))
    }

    const fetchCourse = async () => {
        await fetch('http://localhost:8080/api/v1/courses')
            .then(res => res.json())
            .then(data => setTestOption(data))
    }

    async function updateActivities() {
        await fetch(`http://localhost:8080/activities?account_id=${user.account_id}&activity_type=Xem+trang&activity_target=${window.location.pathname}`)
    }

    useEffect(() => {
        Promise.all([updateActivities(), fetchCourse()]).finally(() => setIsLoading(false))
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
                    <Dropdown
                        placeholder='Chọn nội dung'
                        fluid
                        selection
                        onChange={handleChange}
                        className='mb-5'
                        options={[{
                            key: 'Bài viết',
                            text: 'Bài viết',
                            value: 'Bài viết'
                        }, {
                            key: 'File',
                            text: 'File',
                            value: 'File'
                        }, {
                            key: 'Bài kiểm tra',
                            text: 'Bài kiểm tra',
                            value: 'Bài kiểm tra'
                        }]}
                    />
                    {content === 'Bài viết'
                        &&
                        <Form onSubmit={handlePosts}>
                            <TextArea placeholder='Nhập tiêu đề' className='mb-4' style={{height: 50}}/>
                            <TextArea placeholder='Nhập nội dung'/>
                            <div className='d-flex justify-content-end align-items-center mt-3'>
                                <Button>Đăng bài</Button>
                            </div>
                        </Form>
                    }

                    {content === 'File'
                        &&
                        <Form onSubmit={handleFile}>
                            <div>
                                <input type="file" name='file' id='file' onChange={fileChange}/>
                            </div>
                            <div className='d-flex justify-content-end align-items-center mt-3'>
                                <Button>Đăng file</Button>
                            </div>
                        </Form>
                    }

                    {
                        files && <div>
                            <b>Thông tin file:</b>
                            <ul>
                                <li>Name: {files.name}</li>
                                <li>Type: {files.type}</li>
                                <li>Size: {files.size} bytes</li>
                            </ul>
                        </div>
                    }

                    {content === 'Bài kiểm tra'
                        &&
                        <Form onSubmit={handleTest}>
                            <div>
                                <h1>Nhập bài kiểm tra</h1>
                                <hr/>
                                    <Form.Input
                                        label='Tên bài kiểm tra'
                                        placeholder='Nhập tên bài kiểm tra'
                                        value={testForm.test_name}
                                        onChange={(e, {value}) => setTestForm({...testForm, test_name: e.target.value})}
                                    />
                                <label><b>Chọn môn học</b></label>
                                    <Dropdown
                                        fluid
                                        selection
                                        label='Môn học'
                                        placeholder='Chọn môn học'
                                        options={testOption}
                                        className='my-2'
                                        value={testForm.course_id}
                                        onChange={(e, {value}) => setTestForm({...testForm, course_id: value})}
                                    />
                                <Form.Input
                                    label='Thời gian (/phút)'
                                    placeholder='Nhập thời gian theo phút'
                                    value={testForm.test_time}
                                    onChange={(e, {value}) => setTestForm({...testForm, test_time: e.target.value})}
                                />
                                <Form.Input
                                    label='Mật khẩu bài kiểm tra'
                                    placeholder='Nhập mật khẩu'
                                    value={testForm.test_password}
                                    onChange={(e, {value}) => setTestForm({...testForm, test_password: e.target.value})}
                                />
                                <Form.Input
                                    label='Số câu hỏi dễ'
                                    type='number'
                                    placeholder='Nhập số câu hỏi dễ'
                                    value={testForm.easy_questions}
                                    onChange={(e, {value}) => setTestForm({...testForm, easy_questions: e.target.value})}
                                />
                                <Form.Input
                                    label='Số câu hỏi khá'
                                    type='number'
                                    placeholder='Nhập số câu hỏi khá'
                                    value={testForm.medium_questions}
                                    onChange={(e, {value}) => setTestForm({...testForm, medium_questions: e.target.value})}
                                />
                                <Form.Input
                                    label='Số câu hỏi khó'
                                    type='number'
                                    placeholder='Nhập số câu hỏi khó'
                                    value={testForm.hard_questions}
                                    onChange={(e, {value}) => setTestForm({...testForm, hard_questions: e.target.value})}
                                />
                                <div className='d-flex justify-content-end align-items-center mt-3'>
                                    <Button>Đăng nội dung</Button>
                                </div>
                            </div>
                            <br/>
                            <br/>
                        </Form>
                    }
                </div>
        }
    </div>
}

export default InsertSectionContent;