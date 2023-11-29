import {useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {useAuth} from "../hooks/useAuth";
import {Button, Confirm, Dimmer, Form, Loader} from "semantic-ui-react";

const ManagePost = () => {
    let {user} = useAuth();
    const navigate = useNavigate();
    let {id} = useParams();
    let [post, setPost] = useState({})
    let [isLoading, setIsLoading] = useState(true)
    let [deleteModal, setDeleteModal] = useState(false);

    const openDelete = (e) => setDeleteModal(true);
    const closeDelete = (e) => setDeleteModal(false);

    const fetchPost = async () => {
        await fetch(`http://localhost:8080/api/v1/posts/detail/${id}`)
            .then(res => res.json())
            .then(data => setPost(data))
    }
    async function updateActivities() {
        await fetch(`http://localhost:8080/activities?account_id=${user.account_id}&activity_type=Xem+trang&activity_target=${window.location.pathname}`)
    }

    useEffect(() => {
        Promise.all([updateActivities(), fetchPost()]).finally(() => setIsLoading(false))
    }, [])

    console.log(post)

    const styleDelete = {
        top: 'auto',
        bottom: 'auto',
        right: 'auto',
        left: 'auto',
        position: 'relative',
        height: '13rem',
    }

    const submitUpdate = async () => {
        await fetch(`http://localhost:8080/api/v1/posts`, {
            method: "PUT",
            mode: "cors",
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            },
            body: JSON.stringify(post)
        }).then(() => {
            alert('Chỉnh sửa thành công')
            fetchPost()
        })
    }

    const submitDelete = async () => {
        await fetch(`http://localhost:8080/api/v1/posts/${id}`, {
            mode: "cors",
            method: "DELETE"
        }).then(() => {
            closeDelete()
            alert('Xóa thành công')
            navigate(-1)
        })
    }

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
                    <h1>Bài đăng của bạn</h1>
                    <hr/>
                    <Form className='mb-2'>
                        <Form.Input
                            label='Tiêu đề'
                            value={post.post_title}
                            onChange={(e, {value}) => setPost({...post, post_title: e.target.value})}
                        />
                        <Form.Input
                            label='Nội dung'
                            value={post.post_description}
                            onChange={(e, {value}) => setPost({...post, post_description: e.target.value})}
                        />
                    </Form>
                    <div className='d-flex'>
                        <Button className='bg-transparent text-success' onClick={submitUpdate}>Cập nhật</Button>
                        <Button className='bg-transparent text-danger' onClick={openDelete}>Xóa</Button>
                    </div>

                    <Confirm
                        header={<h2 className='p-3'>Xóa nội dung</h2>}
                        content={<div>
                            <h4 className='px-3'>Lưu ý: Nội dung đã xóa không thể khôi phục.</h4>
                        </div>}
                        open={deleteModal}
                        onCancel={closeDelete}
                        onConfirm={submitDelete}
                        cancelButton='Hủy'
                        confirmButton='Xác nhận'
                        style={styleDelete}
                    />
                </div>
        }
    </div>;
};

export default ManagePost;