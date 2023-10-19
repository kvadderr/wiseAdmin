import { ConfigProvider, Layout, Typography, Tag, Descriptions, Button, Input, List, Space, Statistic, Spin, Table, notification } from "antd"
import type { DescriptionsProps } from 'antd';
import type { ColumnsType } from 'antd/es/table';

import { useEffect, useState } from "react";
import GenerateReceipModal from "./shared/GenerateReceipModal";
import IngredientModal from "./shared/IngredientModal";
import IngredientCreateModal from "./shared/IngredientCreateModal";
import axios from 'axios';

const { Content, Sider } = Layout;
const { Title } = Typography;

interface DataType {
  key: React.Key;
  name: string;
  kkal: number;
  fats: string;
  protein: string;
  time: string;
  steps: [],
  activity: [],
  categories: [],
  goals: []
}

const columns: ColumnsType<DataType> = [
  { title: 'Name', dataIndex: 'name', key: 'name' },
  Table.SELECTION_COLUMN,
  { title: 'Kkal', dataIndex: 'kkla', key: 'kkal' },
  { title: 'Fats', dataIndex: 'fats', key: 'fats' },
  { title: 'Protein', dataIndex: 'protein', key: 'protein' },
  { title: 'Time', dataIndex: 'time', key: 'time' },
  Table.EXPAND_COLUMN,
];

function App() {

  const [api, contextHolder] = notification.useNotification();
  const [open, setOpen] = useState(false);
  const [foodName, setFoodName] = useState('');
  const [ingredientOpen, setIngredientOpen] = useState(false);
  const [createIngredientOpen, setCreateIngredientOpen] = useState(false);
  const [receip, setReceip] = useState({});
  const [isGenerateReceip, setIsGenerateReceip] = useState(false);

  const [currentIngredient, setCurrentIngredient] = useState({});
  const [currentReceipIngredient, setCurrentReceipIngredient] = useState();

  const [ingredientsList, setIngrediensList] = useState([]);
  const [recipeList, setRecipeList] = useState([]);


  const generateNewReceip = async () => {
    setIsGenerateReceip(true);
    openNotificationWithIcon();
    const payload = {
      text: foodName
    }
    const response = await axios.get("http://194.58.90.70:3000/receip/generate/"+foodName);
    setReceip(response.data);
    setOpen(true);
    setIsGenerateReceip(false);
  }

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get("http://194.58.90.70:3000/ingredient");
      setIngrediensList(response.data);
    }
    const fetchReceip = async () => {
      const response = await axios.get("http://194.58.90.70:3000/receip");
      setRecipeList(response.data);
    }
    fetchData();
    fetchReceip();
  }, [])

  useEffect(() => {
    if (isGenerateReceip === false) api.destroy();
  }, [isGenerateReceip])

  const openNotificationWithIcon = () => {
    api.open({
      message: <Spin />,
      description:
        'Please wait, a new recipe is being generated. The wait will take approximately 40 seconds.',
      duration: 0
    });
  };

  const addIngredient = (newIngredient: {}) => {
    setIngrediensList(prevIngredients => [newIngredient, ...prevIngredients]);
  };

  const addReceip = (newIngredient: {}) => {
    setRecipeList(prevIngredients => [newIngredient, ...prevIngredients]);
  };

  const updateIngredient = (id: number, updatedIngredient: {}) => {
    setIngrediensList(prevIngredients => {
      return prevIngredients.map(ingredient => {
        if (ingredient.id === id) {
          return updatedIngredient;
        }
        return ingredient;
      });
    });
  };

  const removeIngredient = (index: number) => {
    setIngrediensList(prevIngredients => {
      const updatedList = prevIngredients.filter((_, i) => i !== index);
      return updatedList;
    });
  };

  const openNotificationWarning = () => {
    api['warning']({
      message: "Alert",
      description:
        'Please make data.',
      duration: 3
    });
  };

  const ItemsButton = () => {
    return (
      <Space wrap>
        <Button type="primary">Delete</Button>
      </Space>
    )
  };

  const items: DescriptionsProps['items'] = [
    {
      key: '1',
      label: 'UserName',
      children: 'Zhou Maomao',
    },
    {
      key: '4',
      label: 'Address',
      span: 2,
      children: 'No. 18, Wantang Road, Xihu District, Hangzhou, Zhejiang, China',
    },
    {
      key: '5',
      label: 'Action',
      children: <ItemsButton />,
    },
  ];

  const ProductItem = (props: any, index: number) => {
    return (
      <Space>
        <Descriptions title={props.title} layout="vertical" items={items} />
      </Space>
    )
  }

  return (
    <ConfigProvider theme={{
      token: {
        borderRadius: 10
      }
    }}>
      {contextHolder}
      <Layout>
        <Sider width={500} style={{ padding: '60px 0 0px 60px', background: '#f6f7fb' }}>
          <Space style={{ width: '400px' }} direction="vertical" size={30}>
            <Title level={2} style={{ color: "#383874" }}>BiteWise</Title>
            <Space wrap>
              <Input placeholder="input the food name" value={foodName} onChange={(e) => setFoodName(e.target.value)} />
              <Button onClick={generateNewReceip} type="primary" shape="round">Generate new recipe</Button>
              <Button onClick={() => setIngredientOpen(true)} style={{ background: '#f6f7fb' }}>Ingredients</Button>
            </Space>
            <Space wrap size={40}>
              <Statistic title="Receip" value={recipeList.length} />
              <Statistic title="Ingredients" value={ingredientsList.length} />
            </Space>
          </Space>
        </Sider>
        <Content style={{ padding: '60px 60px 60px 60px', background: '#f6f7fb' }}>
          <Content style={{ boxShadow: '0px 21px 63px -4px rgba(108, 73, 172, 0.2)', padding: '40px', background: '#fff', minHeight: '100vh', borderRadius: '10px' }}>
            <Table
              columns={columns}
              rowSelection={{}}
              expandable={{
                expandedRowRender: (record) => (
                  <Space direction="vertical" size={20}>
                    <Space size={[0, 8]} wrap>
                      {
                        record.activity.map((item, index) => (
                          <Tag color="#87d068" key={index}>{item}</Tag>
                        ))
                      }
                      {
                        record.categories.map((item, index) => (
                          <Tag color="#2db7f5" key={index}>{item}</Tag>
                        ))
                      }
                      {
                        record.goals.map((item, index) => (
                          <Tag color="#108ee9" key={index}>{item}</Tag>
                        ))
                      }
                    </Space>
                    <List
                      size="small"
                      bordered
                      dataSource={record.steps}
                      renderItem={(item) => <List.Item>{item}</List.Item>}
                    />
                  </Space>
                ),
              }}
              dataSource={recipeList}
            />
          </Content>
        </Content>
      </Layout>
      <GenerateReceipModal addReceip={addReceip} ingredientsList={ingredientsList} open={open} setOpen={setOpen} receip={receip} />
      <IngredientModal setCurrentIngredient={setCurrentIngredient} ingredientsList={ingredientsList} open={ingredientOpen} setOpen={setIngredientOpen} setCreateIngredientOpen={setCreateIngredientOpen} />
      <IngredientCreateModal currentIngredient={currentIngredient} updateIngredient={updateIngredient} addIngredient={addIngredient} open={createIngredientOpen} openNotificationWarning={openNotificationWarning} setOpen={setCreateIngredientOpen} />
    </ConfigProvider>
  )
}

export default App
