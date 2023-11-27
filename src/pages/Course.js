import {useParams, useNavigate, Link} from "react-router-dom";
import {useAuth} from "../hooks/useAuth";
import {useEffect, useState} from "react";
import {Button, Dimmer, Loader} from "semantic-ui-react";

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
            navigate('/uclass/' + id);
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

    async function updateActivities(){
        await fetch(`http://localhost:8080/activities?account_id=${user.account_id}&activity_type=Xem+trang&activity_target=${window.location.pathname}`)
    }

    useEffect(() => {
        Promise.all([getAccount(),
        fetchClass(),
        fetchSection(),
        updateActivities()]).finally(() => setIsReady(true))
    }, []);

    return <div>
        {isReady
            ?
            <div>
                <div>
                    {klasse.course_name && <h1>{klasse.course_name + ' - ' + klasse.class_id}</h1>}
                    {account.account_role === 'lecturer' &&
                        <button className='btn float-end'>Chuyển sang trang quản trị</button>}
                </div>
                <hr/>
                {
                    section.map(
                        section => (
                            <div key={section.section_id}>
                                <h4>{section.section_name}</h4>

                                <div className='mb-2'>
                                    {section.posts.length > 0 && <b>Bài đăng: </b>}
                                    {section.posts.map(post => {
                                        return <div className='p-1 bg-body-secondary rounded'>
                                            <b><p className='m-1'>{post.post_title}</p></b>
                                            <p className='d-flex justify-content-between mb-1 opacity-75'>
                                                <i className='mt-2'>„ {post.post_description} “</i>
                                                <i className='opacity-50 pe-5 mt-3'>Đã đăng
                                                    lúc: {Date(post.created_at).slice(0, 25)}</i>
                                            </p>
                                        </div>
                                    })}
                                </div>

                                <div>
                                    {(section.files || []).length > 0 ? <b>Files đính kèm: </b> : <></>}
                                    {section.files.map(file => {
                                        return file
                                            ?
                                            <div className='mb-1'>
                                                <Link target='_blank' to={'http://localhost:8080/' + file.file_address}
                                                      key={file.file_id}>
                                                    {file.file_name}
                                                </Link>
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
                                                            Đã đăng lúc: {Date(test.created_at)}
                                                        </div>
                                                    </div>
                                                </Link>
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
            </div>
            :
            <div>
                <Dimmer active>
                    <Loader/>
                </Dimmer>
            </div>}
    </div>
};

export default Course;