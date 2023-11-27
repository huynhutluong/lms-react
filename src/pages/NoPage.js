import {Link} from "react-router-dom";

const NoPage = () => {
    return <div className='d-flex justify-content-center align-items-center'>
        <div className='d-flex flex-column justify-content-center align-items-center'>
            <h1 className='h1'>Trang bạn truy cập không tồn tại</h1>
            <b>404</b>
            <br/>
            <Link to='/'>Trở về trang chủ</Link>
        </div>
    </div>;
};

export default NoPage;