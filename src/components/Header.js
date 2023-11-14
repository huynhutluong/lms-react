import {useNavigate} from "react-router-dom";

const Header = () => {
    let navigate = useNavigate();
    return <div>
        {
            window.location.pathname === '/' || window.location.pathname.includes('/test/')
                ?
                <div>
                    <div className="space-between margin-25">
                        <h4>HỆ THỐNG LMS - TRƯỜNG CNTT&TT - ĐẠI HỌC CẦN THƠ</h4>
                    </div>
                    <hr/>
                </div>
                : <div>
                <button className='btn' onClick={() => navigate(-1)}>Trở về</button>
                <hr/>
                </div>
        }
    </div>;
};

export default Header;