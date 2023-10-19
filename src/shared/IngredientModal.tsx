import { Modal, Button, Image, Table, Space, Card } from "antd";
import type { ColumnsType } from 'antd/es/table';

type IngredientModalType = {
    open: boolean;
    setOpen: (open: boolean) => void;
    setCreateIngredientOpen: (open: boolean) => void;
    setCurrentIngredient: ({}) => void;
    ingredientsList: [];
}

interface DataType {
    name: string;
    image: string;
}


const IngredientModal = (props: IngredientModalType) => {

    const columns: ColumnsType<DataType> = [
        {
            title: 'Image',
            dataIndex: 'image',
            key: 'image',
            width: 100,
            render: (image) => <Image
                width={50}
                src={"http://194.58.90.70:3000/public/img/" + image}
            />
        },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    <Button type="primary" onClick={() => editIngredient(record)}>Edit</Button>
                </Space>
            ),
        },
    ]

    const handleOk = () => {
        props.setOpen(false);
    };

    const handleCancel = () => {
        props.setOpen(false);
    };

    const editIngredient = (record: {}) => {
        props.setCurrentIngredient(record);
        props.setCreateIngredientOpen(true);
    }

    return (
        <Modal
            title="Ingredients"
            open={props.open}
            onOk={handleOk}
            onCancel={handleCancel}
            width={1000}
            footer={[
                <Button key="back" type="link" onClick={handleCancel}>
                    Return
                </Button>,
                <Button key="ingredient" type="link" onClick={() => editIngredient({name: null, image: null})}>
                    Generate new ingredient
                </Button>,
                <Button key="Save" type="primary" onClick={handleOk}>
                    Save
                </Button>
            ]}
        >
            <Table columns={columns} dataSource={props.ingredientsList} />

        </Modal>
    )
}

export default IngredientModal;