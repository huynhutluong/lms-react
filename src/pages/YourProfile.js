import {useAuth} from "../hooks/useAuth";
import React, {useEffect, useState} from "react";
import {Button, Dimmer, Form, Loader, Modal} from "semantic-ui-react";

const YourProfile = () => {
    let {user} = useAuth();
    let [account, setAccount] = useState({})
    let [passwordForm, setPasswordForm] = useState({
        old_password: '',
        new_password: '',
        confirm_password: ''
    });
    let [isLoading, setIsLoading] = useState(true)
    let [updateModal, setUpdateModal] = useState(false)
    let [updatePasswordModal, setUpdatePasswordModal] = useState(false)

    const styleModal = {
        top: 'auto',
        bottom: 'auto',
        right: 'auto',
        left: 'auto',
        position: 'relative',
        height: '30rem',
    }

    const fetchUser = async () => {
        await fetch(`http://localhost:8080/api/v1/user?account_id=${user.account_id}`)
            .then(res => res.json())
            .then(data => setAccount(data))
    }
    async function updateActivities(){
        await fetch(`http://localhost:8080/activities?account_id=${user.account_id}&activity_type=Xem+trang&activity_target=${window.location.pathname}`)
    }

    useEffect(() => {
        Promise.all([fetchUser(), updateActivities()]).finally(() => setIsLoading(false))
    }, [])

    const openUpdate = (e) => setUpdateModal(true)
    const closeUpdate = (e) => setUpdateModal(false)
    const openUpdatePassword = (e) => setUpdatePasswordModal(true)
    const closeUpdatePassword = (e) => setUpdatePasswordModal(false)

    const submitUpdate = async () => {
        await fetch('http://localhost:8080/api/v1/user/student', {
            method: "PUT",
            mode: "cors",
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            },
            body: JSON.stringify(account)
        }).then(() => {
            setUpdateModal(false)
            fetchUser().then(() => alert('Đổi thông tin thành công'));
        })
            .catch(e => console.log(e))
    }

    const submitUpdatePassword = async () => {

        if (passwordForm.old_password === passwordForm.new_password) {
            alert('Mật khẩu mới không được trùng với mật khẩu cũ')
        } else {
            if (passwordForm.new_password !== passwordForm.confirm_password) {
                alert('Mật khẩu không trùng khớp')
            } else {
                if (passwordForm.new_password.length < 5) {
                    alert('Mật khẩu yếu')
                } else {
                    await fetch('http://localhost:8080/api/v1/user/password', {
                        method: "PUT",
                        mode: "cors",
                        headers: {
                            'Content-type': 'application/json; charset=UTF-8',
                        },
                        body: JSON.stringify({
                            account_id: user.account_id,
                            old_password: passwordForm.old_password,
                            new_password: passwordForm.new_password
                        })
                    }).then(() => {
                        setUpdatePasswordModal(false)
                        fetchUser().then(() => alert('Đổi mật khẩu thành công'));
                    })
                        .catch(e => console.log(e))
                }
            }
        }
    }

    return <div>
        {
            isLoading
                ? <div>
                    <Dimmer active>
                        <Loader/>
                    </Dimmer>
                </div>
                :
                <div className="UserProfile">
                    <h1 className='h1'>Trang Cá nhân</h1>
                    <hr/>
                    <div>
                        <h4 className='h4'>ID tài khoản: {account.account_id}</h4>
                    </div>
                    <div>
                        <h4 className='h4'>Tên tài khoản: {account.account_username}</h4>
                    </div>
                    <div>
                        <h4 className='h4'>Tên người dùng: {account.student_fullname}</h4>
                    </div>
                    <div>
                        <h4 className='h4'>Email: {account.student_email}</h4>
                    </div>
                    <div>
                        <h4 className='h4'>Giới tính: {account.student_gt}</h4>
                    </div>
                    <hr/>
                    <div>
                        <Button className='bg-transparent text-warning' onClick={openUpdate}>Chỉnh sửa thông
                            tin</Button>
                        <Button className='bg-transparent text-warning-emphasis' onClick={openUpdatePassword}>Đổi mật
                            khẩu</Button>
                    </div>

                    <Modal open={updateModal} onClose={closeUpdate} style={styleModal}>
                        <Modal.Header>Chỉnh sửa thông tin cá nhân</Modal.Header>
                        <Modal.Content>
                            <Form>
                                <Form.Input
                                    label="Email"
                                    type="email"
                                    name="student_email"
                                    value={account.student_email}
                                    onChange={(e, {value}) => setAccount({...account, student_email: e.target.value})}
                                />
                                <Form.Input
                                    label="Tên người dùng"
                                    type="text"
                                    name="student_fullname"
                                    value={account.student_fullname}
                                    onChange={(e, {value}) => setAccount({
                                        ...account,
                                        student_fullname: e.target.value
                                    })}
                                />
                                <Form.Dropdown
                                    label='Giới tính'
                                    placeholder='Chọn giới tính'
                                    fluid
                                    selection
                                    name="student_gt"
                                    value={account.student_gt}
                                    onChange={(e, {value}) => setAccount({...account, student_gt: value})}
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
                            <Button color="black" onClick={closeUpdate}>
                                Đóng
                            </Button>
                            <Button
                                positive
                                icon="checkmark"
                                labelPosition="right"
                                content="Xác nhận"
                                onClick={submitUpdate}
                            />
                        </Modal.Actions>
                    </Modal>
                    <Modal open={updatePasswordModal} onClose={closeUpdatePassword} style={styleModal}>
                        <Modal.Header>Đổi mật khẩu</Modal.Header>
                        <Modal.Content>
                            <Form>
                                <Form.Input
                                    label="Nhập mật khẩu cũ"
                                    type="password"
                                    name="old_password"
                                    value={passwordForm.old_password}
                                    onChange={(e, {value}) => setPasswordForm({
                                        ...passwordForm,
                                        old_password: e.target.value
                                    })}
                                />
                                <Form.Input
                                    label="Nhập mật khẩu mới"
                                    type="password"
                                    name="new_password"
                                    value={passwordForm.new_password}
                                    onChange={(e, {value}) => setPasswordForm({
                                        ...passwordForm,
                                        new_password: e.target.value
                                    })}
                                />
                                <Form.Input
                                    label="Nhập lại mật khẩu mới"
                                    type="password"
                                    name="confirm_password"
                                    value={passwordForm.confirm_password}
                                    onChange={(e, {value}) => setPasswordForm({
                                        ...passwordForm,
                                        confirm_password: e.target.value
                                    })}
                                />
                            </Form>
                        </Modal.Content>
                        <Modal.Actions>
                            <Button color="black" onClick={closeUpdatePassword}>
                                Đóng
                            </Button>
                            <Button
                                positive
                                icon="checkmark"
                                labelPosition="right"
                                content="Xác nhận"
                                onClick={submitUpdatePassword}
                            />
                        </Modal.Actions>
                    </Modal>
                </div>
        }
    </div>
};

export default YourProfile;