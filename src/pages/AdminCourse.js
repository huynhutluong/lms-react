import {useParams, useNavigate, Link} from "react-router-dom";
import {useAuth} from "../hooks/useAuth";
import {useEffect, useState} from "react";
import {Button} from "semantic-ui-react";

const Course = () => {
    let navigate = useNavigate();
    let {id} = useParams();
    let {user} = useAuth();
    let [klasse, setKlasse] = useState([]);
    let [section, setSection] = useState([]);
    let [account, setAccount] = useState([]);
    let [isReady, setIsReady] = useState(false);

    const fetchClass = async () => await fetch(
        'http://localhost:8080/api/v1/class?student_id=' + user.account_username + '&class_id=' + id,
        {
            mode: 'cors'
        }
    )
        .then(res => res.json())
        .then(data => {
            setKlasse(data);
        })
        .catch(e => {
        })

    const fetchSection = async () => {
        await fetch(
            'http://localhost:8080/api/v1/class/' + id,
            {
                mode: 'cors'
            }
        )
            .then(res => res.json())
            .then(data => {
                setSection(data);
            })
    }

    async function getAccount() {
        await fetch("http://localhost:8080/login?account_username=" + user.account_username)
            .then(res => res.json())
            .then(account => setAccount(account));
    }

    async function createSection() {
        await fetch(`http://localhost:8080/api/v1/sections/${id}`, {
            mode: "cors",
            method: "POST"
        }).then(() => navigate(0))
    }

    async function deleteFile(e) {
        e.preventDefault();
        let file_id = e.target[0].value
        await fetch(`http://localhost:8080/api/v1/file/delete/${file_id}`, {
            mode: "cors",
            method: "DELETE"
        }).then(() => navigate(0))
    }

    async function deletePost(e) {
        e.preventDefault();
        let post_id = e.target[0].value
        await fetch(`http://localhost:8080/api/v1/posts/${post_id}`, {
            mode: "cors",
            method: "DELETE"
        }).then(() => navigate(0))
    }

    useEffect(() => {
        getAccount().then()
        fetchClass().then()
        fetchSection().then().finally(() => setIsReady(true))
    }, []);

    return <div>
        {isReady
            ?
            <div>
                {klasse.course_name && <h1>{klasse.course_name + ' - ' + klasse.class_id}</h1>}
                {
                    section.map(
                        section => (
                            <div key={section.section_id}>
                                <h4>{section.section_name}</h4>
                                    <div className='d-flex align-items-center justify-content-center border rounded p-1 bg-success m-2'>
                                        <Link to={'/content/insert/' + section.section_id} className='text-white'>Thêm nội dung mới</Link>
                                    </div>

                                <div className='mb-2'>
                                    {section.posts.length > 0 && <b>Bài đăng: </b>}
                                    {section.posts.map(post => {
                                        return <div className='p-1 bg-body-secondary rounded'>
                                            <div>
                                                <b><p className='m-1'>{post.post_title}</p></b>
                                                <p className='d-flex justify-content-between mb-1 opacity-75'>
                                                    <i className='mt-2'>„ {post.post_description} “</i>
                                                    <i className='opacity-50 pe-5 mt-3'>Đã đăng
                                                        lúc: {Date(post.created_at).slice(0, 25)}</i>
                                                </p>
                                            </div>
                                            <div className='d-flex justify-content-end align-items-end'>
                                                <Button className='bg-warning text-white'>Chỉnh sửa</Button>
                                                <form onSubmit={deletePost}>
                                                    <input type="text" value={post.post_id} hidden/>
                                                    <Button className='bg-danger text-white'>Xóa</Button>
                                                </form>
                                            </div>
                                        </div>
                                    })}
                                </div>

                                <div>
                                    {(section.files || []).length > 0 ? <b className='mb-1'>Files đính kèm: </b> : <></>}
                                    {section.files.map(file => {
                                        return file
                                            ?
                                            <div className='d-flex justify-content-between align-items-center my-2'>
                                                <div>
                                                    <Link target='_blank' to={'http://localhost:8080/' + file.file_address}
                                                          key={file.file_id}>
                                                        {file.file_name}
                                                    </Link>
                                                </div>
                                                <div>
                                                    <form onSubmit={deleteFile}>
                                                        <input type="text" value={file.file_id} hidden/>
                                                        <button className='float-end text-danger me-5 border-0 bg-transparent'><h4>Xóa</h4></button>
                                                    </form>

                                                </div>
                                            </div>
                                            :
                                            <></>
                                    })}
                                </div>

                                <div>
                                    {(section.tests || []).length > 0 ? <b>Bài kiểm tra: </b> : <></>}
                                    {section.tests.map(test => {
                                        return test
                                            ?
                                            <div className='mb-1 bg-body-secondary rounded'>
                                                <Link to={'http://localhost:3000/testconfirm/' + test.test_id}
                                                      key={test.test_id}>
                                                    <div className='p-2'>
                                                        <p>{test.test_name}</p>
                                                        <div>
                                                            Bắt đầu lúc: {Date(test.test_start).slice(0, 25)}
                                                            -
                                                            Kết thúc vào: {Date(test.test_end).slice(0, 25)}
                                                        </div>
                                                    </div>
                                                </Link>
                                                <div className='d-flex justify-content-end align-items-end'>
                                                    <Button className='bg-warning text-white'>Chỉnh sửa</Button>
                                                    <Button className='bg-danger text-white'>Xóa</Button>
                                                </div>
                                            </div>
                                            :
                                            <></>
                                    })}
                                </div>

                                <hr/>
                            </div>
                        )
                    )
                }
                <div className='d-flex justify-content-center align-items-center border rounded'>
                    <button type='button' className='border-0 bg-transparent py-2' onClick={createSection}><h4>Thêm đề mục mới +</h4></button>
                </div>

            </div>
            :
            <div>Đang chờ</div>}
    </div>
};

export default Course;