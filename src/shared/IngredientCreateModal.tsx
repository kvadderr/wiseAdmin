import { Modal, Button, Space, Upload, Input } from "antd";
import { UploadOutlined } from '@ant-design/icons';
import type { UploadProps } from 'antd';
import { useState, useEffect } from "react";
import axios from 'axios';

type IngredientCreateModalType = {
    open: boolean;
    setOpen: (open: boolean) => void;
    openNotificationWarning: () => void;
    addIngredient: ({}) => void;
    currentIngredient?: {}; 
    updateIngredient: (id: number, {}) => void;
}

const IngredientCreateModal = (props: IngredientCreateModalType) => {

    const [imageName, setImageName] = useState('');
    const [ingredientName, setIngredientName] = useState('');

    useEffect(() => {
        console.log(props.currentIngredient)
        console.log(imageName)
        if (props.currentIngredient) {
            setImageName(props.currentIngredient.image);
            setIngredientName(props.currentIngredient.name);
        }
    }, [props.currentIngredient])

    const propsImage: UploadProps = {
        action: "http://34.70.197.4/api/ingredient/local",
        listType: "picture",
        headers: {
            authorization: 'authorization-text',
        },
        onChange(info) {
            if (info.file.status !== 'uploading') {
                console.log(info.file, info.fileList);
            }
            if (info.file.status === 'done') {
                setImageName(info.file.name)
            } else if (info.file.status === 'error') {
                setImageName('')
            }
        },
    };

    const handleOk = async () => {
        if (ingredientName !== null && imageName !== null) {
            const payload = {
                id: props.currentIngredient?.id,
                name: ingredientName,
                image: imageName
            }
            props.currentIngredient?.image !== null ? props.updateIngredient(props.currentIngredient?.id, payload) : props.addIngredient(payload);
            await axios.post("http://34.70.197.4/api/ingredient", payload);
            props.setOpen(false);
        } else {
            props.openNotificationWarning();
        }
    };

    const handleCancel = () => {
        props.setOpen(false);
    };

    return (
        <Modal
            title="Ingredient data"
            open={props.open}
            onOk={handleOk}
            onCancel={handleCancel}
            footer={[
                <Button key="back" type="link" onClick={handleCancel}>
                    Return
                </Button>,
                <Button key="Save" type="primary" onClick={handleOk}>
                    Save
                </Button>
            ]}
        >
            <Space direction="vertical" style={{ width: '100%' }}>
                <Upload {...propsImage}>
                    <Button icon={<UploadOutlined />}>Upload</Button>
                </Upload>
                <Input placeholder="Please input ingredient's name" value={ingredientName} onChange={(e) => setIngredientName(e.target.value)} style={{ width: '100%' }} />
            </Space>
        </Modal>
    )
}

export default IngredientCreateModal;