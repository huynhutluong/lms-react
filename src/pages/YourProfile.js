const YourProfile = () => {
    let user = {
        username: "B1910073",
        fullname: "Lương Nhựt Huy",
        class: "DI19V7A2",
    };

    return <div className="UserProfile">
        <h1>Trang Cá nhân</h1>
        <hr/>
        <img src='/logo192.png' alt="user-avatar" width="150px" height="150px"/>
        <div>
            <b>MSSV: </b> {user.username}
        </div>
        <div>
            <b>Họ tên: </b> {user.fullname}
        </div>
        <div>
            <b>Lớp: </b> {user.class}
        </div>
    </div>;
};

export default YourProfile;