import {useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {Button, Confirm, Dimmer, Form, Loader, Modal} from "semantic-ui-react";
import SortableTable from "../components/SortableTable";

const StudentDetail = () => {
    const {id} = useParams();
    let navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const [student, setStudent] = useState({});
    const [updateModal, setUpdateModal] = useState(false);
    const [deleteModal, setDeleteModal] = useState(false);

    const openUpdate = (e) => setUpdateModal(true)
    const openDelete = (e) => setDeleteModal(true)

    const closeUpdate = (e) => setUpdateModal(false);
    const closeDelete = (e) => setDeleteModal(false);

    const fetchStudent = async () => {
        await fetch(`http://localhost:8080/api/v1/users/student/${id.toLowerCase()}`)
            .then(res => res.json())
            .then(data => setStudent(data))
    }

    const styleUpdate = {
        top: 'auto',
        bottom: 'auto',
        right: 'auto',
        left: 'auto',
        position: 'relative',
        height: '38rem',
    }

    const styleDelete = {
        top: 'auto',
        bottom: 'auto',
        right: 'auto',
        left: 'auto',
        position: 'relative',
        height: '17rem',
    }

    let column = [
        {
            accessor: 'activity_type',
            Header: 'Hành động',
        },
        {
            accessor: 'activity_target',
            Header: 'Nội dung',
        },
        {
            accessor: 'activity_date',
            Header: 'Ngày',
        },
    ]

    const submitUpdate = async () => {
        await fetch('http://localhost:8080/api/v1/users/student', {
            mode: "cors",
            method: 'PUT',
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            },
            body: JSON.stringify({
                student_id: student.student_id,
                student_fullname: student.student_fullname,
                student_email: student.student_email,
                student_gt: student.student_gt
            })
        }).then(() => {
            fetchStudent()
        })
        closeUpdate()
    }

    const submitDelete = async () => {
        await fetch('http://localhost:8080/api/v1/users/student', {
            mode: "cors",
            method: 'DELETE',
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            },
            body: JSON.stringify({
                account_id: student.account_id
            })
        }).then(() => {
            navigate('/admin/users')
        })
        closeUpdate()
    }

    useEffect(() => {
        Promise.all([fetchStudent()]).finally(() => {
            setIsLoading(false);
        })
    }, [])


    if (!isLoading) console.log(student.activities)
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
                    <h1 className='h1'>ID sinh viên: {student.student_id}</h1>
                    <hr/>
                    <h4 className='h4'>ID tài khoản: {student.account_id}</h4>
                    <h4 className='h4'>Username: {student.account_username}</h4>
                    <h4 className='h4'>Tên người dùng: {student.student_fullname}</h4>
                    <h4 className='h4'>Email: {student.student_email}</h4>
                    <h4 className='h4'>Giới tính: {student.student_gt}</h4>
                    <h4 className='h4'>Ngày sinh: {new Date(student.student_birthday).toUTCString()}</h4>
                    <h4 className='h4'>Vai trò: {student.account_role}</h4>
                    <h4 className='h4'>Lần đăng nhập cuối: {student.last_logged_in}</h4>
                    <div className='d-flex mb-2'>
                        <div className='me-3'>
                            <Button className='text-warning bg-transparent' onClick={openUpdate}>Chỉnh sửa thông
                                tin</Button>
                        </div>
                        <div>
                            <Button className='text-danger bg-transparent'
                                    onClick={(e) => setDeleteModal(true)}>Xóa</Button>
                        </div>

                    </div>
                    {
                        student.activities.length > 0
                            ? <div>
                                <h2 className='h2'>
                                    Các hoạt động của người dùng
                                </h2>
                                <div>
                                    <SortableTable data={student.activities} columns={column}/>
                                </div>
                            </div>
                            :
                            <div className='border rounded container d-flex justify-content-center align-items-center'>
                                <h4 className='p-2 py-4 h3 opacity-25'>
                                    Người dùng chưa hoạt động lần nào
                                </h4>
                            </div>
                    }
                    <br/>
                    <Modal open={updateModal} onClose={closeUpdate} style={styleUpdate}>
                        <Modal.Header>Cập nhật người dùng</Modal.Header>
                        <Modal.Content>
                            <Form>
                                <Form.Input
                                    label='ID tài khoản'
                                    value={student.account_id}
                                    disabled={true}
                                    onChange={(e) => setStudent({...student, account_id: e.target.value})}
                                />
                                <Form.Input
                                    label='ID sinh viên'
                                    value={student.student_id}
                                    disabled={true}
                                    onChange={(e) => setStudent({...student, student_id: e.target.value})}
                                />
                                <Form.Input
                                    label='Tên người dùng'
                                    value={student.student_fullname}
                                    onChange={(e) => setStudent({...student, student_fullname: e.target.value})}
                                />
                                <Form.Input
                                    label='Email'
                                    value={student.student_email}
                                    onChange={(e) => setStudent({...student, student_email: e.target.value})}
                                />
                                <Form.Dropdown
                                    label='Giới tính'
                                    value={student.student_gt}
                                    options={[
                                        {
                                            key: 'nam',
                                            text: 'nam',
                                            value: 'nam'
                                        },
                                        {
                                            key: 'nữ',
                                            text: 'nữ',
                                            value: 'nữ'
                                        },
                                    ]}
                                    fluid
                                    selection
                                    onChange={(e) => setStudent({...student, student_gt: e.target.value})}
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
                    <Confirm
                        header={<h2 className='p-3'>Xóa nội dung</h2>}
                        content={<div>
                            <h4 className='px-3'>Lưu ý: Để tránh mất dữ liệu, xóa nội dung sẽ chỉ chuyển trạng thái của
                                nội dung sang không hoạt động, chứ không thực sự xóa nội dung khỏi cơ sở dữ liệu</h4>
                            <h5 className='px-3'>Xác nhận xóa nội dung?</h5>
                        </div>}
                        open={deleteModal}
                        onCancel={closeDelete}
                        onConfirm={submitDelete}
                        cancelButton='Hủy'
                        confirmButton='Xác nhận'
                        style={styleDelete}
                    />
                    <br/>
                </div>
        }
    </div>
};

export default StudentDetail;