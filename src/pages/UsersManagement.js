import {useEffect, useState} from "react";
import {Button, Dimmer, Form, Loader} from "semantic-ui-react";
import {Link} from "react-router-dom";
import * as XLSX from "xlsx";

const UsersManagement = () => {

    let [accounts, setAccounts] = useState({});
    let [isLoading, setIsLoading] = useState(true);
    let [searchForm, setSearchForm] = useState('');

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
                            <Button className='text-success bg-transparent'>Thêm người dùng</Button>
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
                </div>
        }
    </div>;
};

export default UsersManagement;