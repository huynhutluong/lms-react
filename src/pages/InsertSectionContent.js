import {useNavigate, useParams} from "react-router-dom";
import {Dropdown, Form, TextArea, Button} from "semantic-ui-react";
import {useState} from "react";
import {useAuth} from "../hooks/useAuth";


const InsertSectionContent = () => {
    let navigate = useNavigate();
    let {id} = useParams();
    let {user} = useAuth();
    let [files, setFiles] = useState(null);
    let [content, setContent] = useState('');

    function handleChange(e, data) {
        setContent(data.value)
    }

    function fileChange(e) {
        setFiles(e.target.files[0])
    }

    async function handleFile(e) {
        let file = new FormData();
        file.append('file', files);

        await fetch(`http://localhost:8080/api/v1/file?owner=${user.account_username}&section_id=${id}`,
            {
                method: "POST",
                mode: "cors",
                body: file
            }).then(res => navigate(-1))
    }

    function handleTest(e) {
        e.preventDefault();
    }

    async function handlePosts(e) {
        e.preventDefault();
        let data = {
            "owner": user.account_username,
            "section_id": id,
            "post_title": e.target[0].value,
            "post_description": e.target[1].value
        };

        await fetch('http://localhost:8080/api/v1/posts', {
            method: "POST",
            mode: "cors",
            body: JSON.stringify(data),
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            }
        }).then(res => navigate(-1))
    }


    return <div>
        <Dropdown
            placeholder='Chọn nội dung'
            fluid
            selection
            onChange={handleChange}
            className='mb-5'
            options={[{
                key: 'Bài viết',
                text: 'Bài viết',
                value: 'Bài viết'
            }, {
                key: 'File',
                text: 'File',
                value: 'File'
            }, {
                key: 'Bài kiểm tra',
                text: 'Bài kiểm tra',
                value: 'Bài kiểm tra'
            }]}
        />
        {content === 'Bài viết'
            &&
            <Form onSubmit={handlePosts}>
                <TextArea placeholder='Nhập tiêu đề' className='mb-4' style={{ height: 50 }}/>
                <TextArea placeholder='Nhập nội dung' />
                <div className='d-flex justify-content-end align-items-center mt-3'>
                    <Button>Đăng bài</Button>
                </div>
            </Form>
        }

        {content === 'File'
            &&
            <Form onSubmit={handleFile}>
                <div>
                    <input type="file" name='file' id='file' onChange={fileChange}/>
                </div>
                <div className='d-flex justify-content-end align-items-center mt-3'>
                    <Button>Đăng file</Button>
                </div>
            </Form>
        }

        {
            files && <div>
            <b>Thông tin file:</b>
                <ul>
                    <li>Name: {files.name}</li>
                    <li>Type: {files.type}</li>
                    <li>Size: {files.size} bytes</li>
                </ul>
            </div>
        }

        {content === 'Bài kiểm tra'
            &&
            <Form onSubmit={handleTest}>
                <div>
                    Nhập bài kiểm tra
                </div>
            </Form>
        }
    </div>
}

export default InsertSectionContent;