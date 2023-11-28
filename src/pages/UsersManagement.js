import React, {useEffect, useState} from "react";
import {Button, Dimmer, Form, Loader, Modal} from "semantic-ui-react";
import {Link} from "react-router-dom";
import * as XLSX from "xlsx";

const UsersManagement = () => {

    let [accounts, setAccounts] = useState({});
    let [isLoading, setIsLoading] = useState(true);
    let [searchForm, setSearchForm] = useState('');
    let [studentModal, setStudentModal] = useState(false);
    let [lecturerModal, setLecturerModal] = useState(false);
    let [studentForm, setStudentForm] = useState({
        account_username: '',
        account_password: '',
        confirm_password: '',
        student_fullname: '',
        student_email: '',
        student_gt: ''
    });

    let [lecturerForm, setLecturerForm] = useState({
        account_username: '',
        account_password: '',
        confirm_password: '',
        lecturer_fullname: '',
        lecturer_email: '',
        lecturer_gt: ''
    });

    const styleModal = {
        top: 'auto',
        bottom: 'auto',
        right: 'auto',
        left: 'auto',
        position: 'relative',
        height: '43rem',
    }

    const openStudent = (e) => setStudentModal(true)
    const openLecturer = (e) => setLecturerModal(true)
    const closeStudent = (e) => setStudentModal(false)
    const closeLecturer = (e) => setLecturerModal(false)

    const submitStudent = async () => {
        if (studentForm.account_password !== studentForm.confirm_password) {alert('Mật khẩu không trùng khớp')}
        else {
            await fetch('http://localhost:8080/api/v1/users/student', {
                method: "POST",
                mode: "cors",
                headers: {
                    'Content-type': 'application/json; charset=UTF-8',
                },
                body: JSON.stringify(studentForm)
            }).then(() => {
                setStudentModal(false)
                fetchUsers();
            })
                .catch(e => console.log(e))
        }

    }

    const submitLecturer = async () => {
        if (lecturerForm.account_password !== lecturerForm.confirm_password) {alert('Mật khẩu không trùng khớp')}
        else {
            await fetch('http://localhost:8080/api/v1/users/lecturer', {
                method: "POST",
                mode: "cors",
                headers: {
                    'Content-type': 'application/json; charset=UTF-8',
                },
                body: JSON.stringify(lecturerForm)
            }).then(() => {
                setLecturerModal(false)
                fetchUsers();
            })
                .catch(e => console.log(e))
        }

    }

    const fetchUsers = async () => {
        await fetch('http://localhost:8080/api/v1/users')
            .then(res => res.json())
            .then(data => setAccounts(data))
    }

    useEffect(() => {
        Promise.all([fetchUsers()]).finally(() => setIsLoading(false))
    }, [])

    const handleSearch = (e, {value}) => {
        setSearchForm(value);
    }

    const submitSearch = async () => {
        if (searchForm !== '') {
            await fetch(`http://localhost:8080/api/v1/users?account_username=${searchForm}`)
                .then(res => res.json())
                .then(newData => {
                    setAccounts(newData)
                })
        } else {
            await fetch('http://localhost:8080/api/v1/users')
                .then(res => res.json())
                .then(newData => setAccounts(newData))
        }
    }

    const exportToExcel = () => {

        const ws = XLSX.utils.json_to_sheet(accounts);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Danh sách gười dùng');

        // Save the file
        XLSX.writeFile(wb, 'Users_' + new Date() + '.xlsx');
    };


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
                    <h2 className='h2'>Danh sách người dùng:</h2>
                    <Form onSubmit={submitSearch}>
                        <div className='d-flex justify-content-center'>
                            <Form.Input
                                style={{width: '100%'}}
                                placeholder='Nhập Username'
                                onChange={handleSearch}
                                value={searchForm}
                            />
                            <Form.Button className='mx-2'>Tìm</Form.Button>
                        </div>
                    </Form>
                    <hr/>
                    <div className='d-flex align-items-center mb-2'>
                        <div>
                            <Button className='text-success bg-transparent' onClick={openStudent}>Thêm tài khoản sinh viên</Button>
                        </div>
                        <div>
                            <Button className='text-success bg-transparent' onClick={openLecturer}>Thêm tài khoản giảng viên</Button>
                        </div>
                        <div className=''>
                            <Button className='text-success bg-transparent' onClick={exportToExcel}>Xuất danh sách</Button>
                        </div>
                    </div>
                    <div>
                        <table className="ui celled table" style={{width: '100%'}}>
                            <thead>
                            <tr>
                                <th>ID</th>
                                <th>Username</th>
                                <th>Vai trò</th>
                                <th>Lần đăng nhập cuối</th>
                                <th className='d-flex justify-content-center'>Chi tiết tài khoản</th>
                            </tr>
                            </thead>
                            <tbody>
                            {
                                accounts.map(account => {
                                    return (<tr key={account.account_id}>
                                        <td>
                                            {account.account_id}
                                        </td>
                                        <td>
                                            {account.account_username}
                                        </td>
                                        <td>
                                            {account.account_role}
                                        </td>
                                        <td>
                                            {account.last_logged_in}
                                        </td>
                                        {
                                            account.account_role === 'student' && <td className=''>
                                                <div className='d-flex justify-content-center align-items-center'>
                                                    <Link to={`/admin/user/student/${account.account_username}`}><b>Xem chi tiết</b></Link>
                                                </div>
                                            </td>
                                        }
                                        {
                                            account.account_role === 'lecturer' && <td className=''>
                                                <div className='d-flex justify-content-center align-items-center'>
                                                    <Link to={`/admin/user/lecturer/${account.account_username}`}><b>Xem chi tiết</b></Link>
                                                </div>
                                            </td>
                                        }
                                        {
                                            account.account_role === 'admin' && <td className=''></td>
                                        }
                                    </tr>)
                                })
                            }
                            </tbody>
                        </table>
                    </div>
                    <br/>
                    <Modal open={studentModal} onClose={closeStudent} style={styleModal}>
                        <Modal.Header>Thêm sinh viên</Modal.Header>
                        <Modal.Content>
                            <Form>
                                <Form.Input
                                    label="Tài khoản"
                                    type="text"
                                    name="account_username"
                                    value={studentForm.account_username}
                                    onChange={(e, {value}) => setStudentForm({...studentForm, account_username: e.target.value})}
                                />
                                <Form.Input
                                    label="Mật khẩu"
                                    type="password"
                                    name="account_password"
                                    value={studentForm.account_password}
                                    onChange={(e, {value}) => setStudentForm({...studentForm, account_password: e.target.value})}
                                />
                                <Form.Input
                                    label="Nhập lại mật khẩu"
                                    type="password"
                                    name="confirm_password"
                                    value={studentForm.confirm_password}
                                    onChange={(e, {value}) => setStudentForm({...studentForm, confirm_password: e.target.value})}
                                />
                                <Form.Input
                                    label="Email"
                                    type="email"
                                    name="student_email"
                                    value={studentForm.student_email}
                                    onChange={(e, {value}) => setStudentForm({...studentForm, student_email: e.target.value})}
                                />
                                <Form.Input
                                    label="Họ tên"
                                    type="text"
                                    name="student_fullname"
                                    value={studentForm.student_fullname}
                                    onChange={(e, {value}) => setStudentForm({...studentForm, student_fullname: e.target.value})}
                                />
                                <Form.Dropdown
                                    label='Giới tính'
                                    placeholder='Chọn giới tính'
                                    fluid
                                    selection
                                    name="student_gt"
                                    value={studentForm.student_gt}
                                    onChange={(e, {value}) => setStudentForm({...studentForm, student_gt: value})}
                                    options={[
                                        {
                                            text: 'nam',
                                            value: 'nam',
                                        },
                                        {
                                            text: 'nữ',
                                            value: 'nữ',
                                        },
                                    ]}
                                />
                            </Form>
                        </Modal.Content>
                        <Modal.Actions>
                            <Button color="black" onClick={closeStudent}>
                                Đóng
                            </Button>
                            <Button
                                positive
                                icon="checkmark"
                                labelPosition="right"
                                content="Xác nhận"
                                onClick={submitStudent}
                            />
                        </Modal.Actions>
                    </Modal>

                    <Modal open={lecturerModal} onClose={closeLecturer} style={styleModal}>
                        <Modal.Header>Thêm giảng viên</Modal.Header>
                        <Modal.Content>
                            <Form>
                                <Form.Input
                                    label="Tài khoản"
                                    type="text"
                                    name="account_username"
                                    value={lecturerForm.account_username}
                                    onChange={(e, {value}) => setLecturerForm({...lecturerForm, account_username: e.target.value})}
                                />
                                <Form.Input
                                    label="Mật khẩu"
                                    type="password"
                                    name="account_password"
                                    value={lecturerForm.account_password}
                                    onChange={(e, {value}) => setLecturerForm({...lecturerForm, account_password: e.target.value})}
                                />
                                <Form.Input
                                    label="Nhập lại mật khẩu"
                                    type="password"
                                    name="confirm_password"
                                    value={lecturerForm.confirm_password}
                                    onChange={(e, {value}) => setLecturerForm({...lecturerForm, confirm_password: e.target.value})}
                                />
                                <Form.Input
                                    label="Email"
                                    type="email"
                                    name="lecturer_email"
                                    value={lecturerForm.lecturer_email}
                                    onChange={(e, {value}) => setLecturerForm({...lecturerForm, lecturer_email: e.target.value})}
                                />
                                <Form.Input
                                    label="Họ tên"
                                    type="text"
                                    name="student_fullname"
                                    value={lecturerForm.lecturer_fullname}
                                    onChange={(e, {value}) => setLecturerForm({...lecturerForm, lecturer_fullname: e.target.value})}
                                />
                                <Form.Dropdown
                                    label='Giới tính'
                                    placeholder='Chọn giới tính'
                                    selection
                                    fluid
                                    name="student_gt"
                                    value={lecturerForm.lecturer_gt}
                                    onChange={(e, {value}) => setLecturerForm({...lecturerForm, lecturer_gt: value})}
                                    options={[
                                        {
                                            text: 'nam',
                                            value: 'nam',
                                        },
                                        {
                                            text: 'nữ',
                                            value: 'nữ',
                                        },
                                    ]}
                                />
                            </Form>
                        </Modal.Content>
                        <Modal.Actions>
                            <Button color="black" onClick={closeLecturer}>
                                Đóng
                            </Button>
                            <Button
                                positive
                                icon="checkmark"
                                labelPosition="right"
                                content="Xác nhận"
                                onClick={submitLecturer}
                            />
                        </Modal.Actions>
                    </Modal>
                </div>
        }
    </div>;
};

export default UsersManagement;