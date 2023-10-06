import { Modal, Button, Space, Tag, Table, List, Upload, Select, Form } from "antd";
import { UploadOutlined } from '@ant-design/icons';
import type { UploadProps } from 'antd';
import { useState, useEffect } from "react";
import axios from 'axios';
import { useForm } from "antd/es/form/Form";
import { Descriptions } from 'antd';
import type { DescriptionsProps } from 'antd';
import type { ColumnsType } from 'antd/es/table';

const { CheckableTag } = Tag;
const tagsData = ['Vegetarian', 'Vegan', 'Gluten-free', 'Keto', 'Paleo'];
const tagsGoal = ['Lose weight', 'Maintain weight', 'Gain muscle', 'Improve general health'];
const tagsActivity = ['Sedentary', 'Lightly active', 'Moderately active', 'Very active'];

interface DataType {
    name: string;
    value: string;
}

type Ingredient = {
    name: string;
    value: string;
    id: number;
};

type Receip = {
    name: string;
    kkal: string;
    protein: string;
    fats: string;
    carb: string;
    time: string;
    ingredients: Ingredient[];
    steps: string[];
};

type GenerateReceipModalType = {
    open: boolean;
    addReceip: ({}) => void;
    setOpen: (open: boolean) => void;
    receip: Receip;
    ingredientsList: [];
}

interface TransformedObject {
    value: string;
    label: string;
}


const GenerateReceipModal = (props: GenerateReceipModalType) => {
    const [imageName, setImageName] = useState('');
    const [transformedData, setTransformedData] = useState<TransformedObject[]>([]);
    const [selectedIngredient, setSelectedIngredient] = useState([]);
    const [form] = useForm();

    useEffect(() => {
        setSelectedIngredient(props.receip.ingredients);
    }, [])

    const onChange = (value: number, index: number) => {
        console.log(`selected ${value} with id ${index}`);
        props.receip.ingredients[index].id = value;
        console.log(props.receip.ingredients)
    };

    const onSearch = (value: string) => {

    };


    useEffect(() => {
        const transformedArray: TransformedObject[] = props.ingredientsList.map((item) => ({
            value: item?.id,
            label: item?.name
        }));
        setTransformedData(transformedArray);
    }, [props.ingredientsList])

    const filterOption = (input: string, option?: { label: string; value: string }) =>
        (option?.label ?? '').toLowerCase().includes(input.toLowerCase());

    const columns: ColumnsType<DataType> = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Value',
            dataIndex: 'value',
            key: 'value',
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record, index) => {

                const foundIngredient = transformedData.find(ingredient => ingredient.label === record.name);
                if (foundIngredient) {
                    props.receip.ingredients[index].id = foundIngredient?.value;
                }
                const changeSelect = (value) => {
                    onChange(value, index)
                }
                return (
                    <Space size="middle">
                        <Form.Item rules={[{ required: true }]}>
                            <Select
                                style={{ width: 250 }}
                                showSearch
                                placeholder="Select a person"
                                optionFilterProp="children"
                                defaultValue={foundIngredient || null}
                                onChange={changeSelect}
                                onSearch={onSearch}
                                filterOption={filterOption}
                                options={transformedData}
                            />
                        </Form.Item>
                    </Space>
                )
            },
        },
    ];

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

    const receipItems: DescriptionsProps['items'] = [
        {
            key: '1',
            label: 'Kkal',
            children: props.receip.kkal,
        },
        {
            key: '2',
            label: 'Protein',
            children: props.receip.protein,
        },
        {
            key: '3',
            label: 'Fats',
            children: props.receip.fats,
        },
        {
            key: '4',
            label: 'Carb',
            children: props.receip.carb,
        },
        {
            key: '5',
            label: 'Time',
            children: props.receip.time,
        },
    ];

    const [confirmLoading, setConfirmLoading] = useState(false);
    const [categoryTags, setCategoryTags] = useState<string[]>([]);
    const [goalsTags, setGoalsTags] = useState<string[]>([]);
    const [activityTags, setActivityTags] = useState<string[]>([]);

    const handleChange = (tag: string, checked: boolean) => {
        const nextSelectedTags = checked
            ? [...categoryTags, tag]
            : categoryTags.filter((t) => t !== tag);
        setCategoryTags(nextSelectedTags);
    };

    const goalsChange = (tag: string, checked: boolean) => {
        const nextSelectedTags = checked
            ? [...goalsTags, tag]
            : goalsTags.filter((t) => t !== tag);
        setGoalsTags(nextSelectedTags);
    };

    const activityChange = (tag: string, checked: boolean) => {
        const nextSelectedTags = checked
            ? [...activityTags, tag]
            : categoryTags.filter((t) => t !== tag);
        setActivityTags(nextSelectedTags);
    };

    const handleOk = async () => {
        const data = props.receip;
        const someData = {
            categories: categoryTags,
            activity: activityTags,
            goals: goalsTags,
            image: imageName
        }
        const finalData = Object.assign(data, someData)
        console.log(finalData);
        props.addReceip(data)
        await axios.post("http://34.70.197.4/api/receip", data);
    };

    const handleCancel = () => {
        form.resetFields();
        console.log('Clicked cancel button');
        props.setOpen(false);
    };

    return (
        <Modal
            title={props.receip?.name}
            open={props.open}
            onOk={handleOk}
            onCancel={handleCancel}
            confirmLoading={confirmLoading}
            width={1000}
            footer={[
                <Button key="back" type="link" onClick={handleCancel}>
                    Return
                </Button>,
                <Button key="Save" type="primary" onClick={handleOk}>
                    Save
                </Button>
            ]}
        >
            <Form form={form}>
                <Space direction="vertical" size={20}>
                    <Upload {...propsImage}>
                        <Button icon={<UploadOutlined />}>Upload photo</Button>
                    </Upload>
                    <List
                        size="small"
                        bordered
                        dataSource={props.receip.steps}
                        renderItem={(item) => <List.Item>{item}</List.Item>}
                    />
                    <Descriptions title="Rceip Info" items={receipItems} />
                    <Table columns={columns} dataSource={props.receip.ingredients} />
                    <Space size={[0, 8]} wrap>
                        <span style={{ marginRight: 18 }}>Categories:</span>
                        {tagsData.map((tag, index) => (
                            <CheckableTag
                                key={index}
                                checked={categoryTags.includes(tag)}
                                onChange={(checked) => handleChange(tag, checked)}
                            >
                                {tag}
                            </CheckableTag>
                        ))}
                    </Space>
                    <Space size={[0, 8]} wrap>
                        <span style={{ marginRight: 18 }}>Goals:</span>
                        {tagsGoal.map((tag, index) => (
                            <CheckableTag
                                key={index}
                                checked={goalsTags.includes(tag)}
                                onChange={(checked) => goalsChange(tag, checked)}
                            >
                                {tag}
                            </CheckableTag>
                        ))}
                    </Space>
                    <Space size={[0, 8]} wrap>
                        <span style={{ marginRight: 18 }}>Activity:</span>
                        {tagsActivity.map((tag, index) => (
                            <CheckableTag
                                key={index}
                                checked={activityTags.includes(tag)}
                                onChange={(checked) => activityChange(tag, checked)}
                            >
                                {tag}
                            </CheckableTag>
                        ))}
                    </Space>
                </Space>
            </Form>
        </Modal>
    );
}

export default GenerateReceipModal;
