import {
  Button,
  Card,
  Col,
  DatePicker,
  Input,
  Modal,
  Row,
  Select,
  Space,
  Table,
  Tag,
  message,
  Image,
  AutoComplete,
} from "antd";
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { OnEdit as onEditContext } from "../../../Context";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../../../../API";
import moment from "moment/moment";
import { FileImageOutlined } from "@ant-design/icons";

const { TextArea } = Input;
const { RangePicker } = DatePicker;
const { Option } = Select;

const defaultFilterObject = {
  date: "",
  newsType: "all",
  type: "all",
  search: "",
  category: "",
  keyword: "",
  id: "",
  reportedBy: "",
  publishBy: "",
  subCategory: "",
};

const Dashboard = () => {
  const [articleData, setArticleData] = useState([]);
  const [filterItemResponse, setfilterItemResponse] = useState(defaultFilterObject);
  const [qusetion, setQuestion] = useState("");
  const [isModalDeleteOpen, setIsModalDeleteOpen] = useState(false);
  const [isModalReportedOpen, setIsModalReportedOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState({});
  const { onEdit, setOnEdit, id, setId } = useContext(onEditContext);
  const [visible, setVisible] = useState("");
  const [sortedArticleData, setSortedArticleData] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigation = useNavigate();
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [subCategoryOptions, setSubCategoryOptions] = useState([]);
  const [allPublishedBy, setAllPublishedBy] = useState([]);

  // Slider fix Babloo 
const handleSetFixedPosition = async (articleId, position) => {
  try {
    const response = await axios.put(`${API_URL}/article/fixed/set`, {
      articleId,
      position
    });
    
    message.success(`Article set to position ${position}`);
    getAllArticles(); // Refresh the article list
  } catch (error) {
    console.error("Error setting fixed position:", error);
    message.error(error.response?.data?.message || "Failed to set fixed position");
  }
};

const handleClearFixedPosition = async (position) => {
  try {
    const response = await axios.put(`${API_URL}/article/fixed/clear`, {
      position
    });
    
    message.success(`Position ${position} cleared successfully`);
    getAllArticles(); // Refresh the article list
  } catch (error) {
    console.error("Error clearing fixed position:", error);
    message.error(error.response?.data?.message || "Failed to clear fixed position");
  }
};

  // Fetch user role on component mount
  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const response = await axios.get(`${API_URL}/user?id=${localStorage.getItem("id")}`);
        setIsAdmin(response.data[0].role === "admin");
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchUserRole();
  }, []);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${API_URL}/content?type=category`);
        const categories = response.data.map(item => ({
          key: item._id,
          value: item.text,
          label: item.text,
        }));
        setCategoryOptions(categories);
      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    };
    fetchCategories();
  }, []);

  // Fetch subcategories when category changes
  useEffect(() => {
    const fetchSubCategories = async () => {
      if (filterItemResponse.category) {
        try {
          const response = await axios.get(
            `${API_URL}/subcategory?category=${filterItemResponse.category}`
          );
          const subCategories = response.data.map(item => ({
            key: item._id,
            value: item.text,
            label: item.text,
          }));
          setSubCategoryOptions(subCategories);
        } catch (err) {
          console.error("Error fetching subcategories:", err);
        }
      }
    };
    fetchSubCategories();
  }, [filterItemResponse.category]);

  // Fetch all articles
  const getAllArticles = async () => {
    try {
      const response = await axios.get(`${API_URL}/article`);
      const processedArticles = processArticles(response.data);
      setArticleData(processedArticles);
      updatePublishedByList(processedArticles);
    } catch (error) {
      console.error("Error fetching articles:", error);
      message.error("Failed to load articles");
    }
  };

  // Process articles for display
  const processArticles = (articles) => {
    // First sort by sequence
    const sortedBySequence = articles.sort((a, b) => {
      const aSeq = a.sequence || 999;
      const bSeq = b.sequence || 999;
      return aSeq - bSeq;
    });

    // Update status if scheduled time has passed
    const processedArticles = sortedBySequence.map(article => {
      if (article.publishAt && new Date(article.publishAt) <= new Date() && article.status !== 'online') {
        return { ...article, status: 'online' };
      }
      return article;
    });

    // Sort with scheduled articles first, then by date
    return processedArticles.sort((a, b) => {
      const aIsScheduled = a.publishAt && new Date(a.publishAt) > new Date();
      const bIsScheduled = b.publishAt && new Date(b.publishAt) > new Date();

      if (aIsScheduled && !bIsScheduled) return -1;
      if (!aIsScheduled && bIsScheduled) return 1;
      return new Date(b.createdAt) - new Date(a.createdAt);
    });
  };

  // Update published by list
  const updatePublishedByList = (articles) => {
    const publishedByArray = articles.map(item => item.publishBy);
    const uniquePublishedBy = [...new Set(publishedByArray)];
    setAllPublishedBy(uniquePublishedBy);
  };

  // Update the modal handlers to properly set currentUser
  const handleDeleteCancel = () => {
    setIsModalDeleteOpen(false);
    setCurrentUser({});
  };
  const ShowDeleteModal = (user) => {
    setCurrentUser(user);
    setIsModalDeleteOpen(true);
  };
  const handleReportedCancel = () => {
    setIsModalReportedOpen(false);
    setCurrentUser({});
  };
  const ShowReportedModal = (user) => {
    setCurrentUser(user);
    setIsModalReportedOpen(true);
  };

  // Initialize data on component mount
  useEffect(() => {
    getAllArticles();
  }, []);

  // Initialize serial numbers when data changes
  useEffect(() => {
    const initialSerialNumbers = articleData.map((_, index) => index + 1);
    setSortedArticleData(initialSerialNumbers);
  }, [articleData]);

  // Strip HTML tags from content
  const stripHtmlTags = (html) => {
    if (!html) return "";
    const doc = new DOMParser().parseFromString(html, "text/html");
    return doc.body.textContent || "";
  };

  // Toggle article status
  const handleToggleStatus = async (articleId, currentStatus) => {
    const newStatus = currentStatus === "online" ? "offline" : "online";
    try {
      await axios.put(`${API_URL}/article/${articleId}`, { 
        status: newStatus,
        publishAt: null // Clear scheduled time when manually changing status
      });
      message.success(`Article Status Changed to ${newStatus.toUpperCase()}`);
      getAllArticles();
    } catch (error) {
      console.error("Error updating article status", error);
      message.error("Failed to update article status");
    }
  };

  // Filter articles based on filter criteria
  const onFilter = async () => {
    if (!filterItemResponse) return;

    const filterParams = new URLSearchParams();
    for (const [key, value] of Object.entries(filterItemResponse)) {
      if (value && value !== "all") {
        if (key === "date" && Array.isArray(value)) {
          filterParams.append(key, value.join(","));
        } else {
          filterParams.append(key, value);
        }
      }
    }

    try {
      const response = await axios.get(`${API_URL}/article?${filterParams}`);
      setArticleData(response.data);
    } catch (err) {
      console.error("Error filtering articles:", err);
      message.error("Failed to filter articles");
    }
  };

  // Reset filters
  const onResetFilter = () => {
    setfilterItemResponse(defaultFilterObject);
    getAllArticles();
  };

  const OnDelete = () => {
      axios
        .delete(`${API_URL}/article?id=${currentUser._id}`)
        .then(() => {
          message.success("Article Has Successfully Deleted");
          setCurrentUser("");
          setIsModalDeleteOpen(false);
          getAllArticles();
        })
        .catch((err) => {
          console.log(err);
          message.error("Article Has Not Deleted");
          setCurrentUser("");
          setIsModalDeleteOpen(false);
        });
    };
  // Report article
  const OnReported = async () => {
    try {
      await axios.post(`${API_URL}/report`, {
        adminId: localStorage.getItem("id"),
        userId: currentUser.UserID,
        articleId: currentUser._id,
        question: qusetion,
      });
      message.success("Article Was Successfully Reported");
      setIsModalReportedOpen(false);
      setQuestion("");
    } catch (err) {
      console.error("Error reporting article:", err);
      message.error("Article Was Not Successfully Reported");
      setIsModalReportedOpen(false);
    }
  };

  // Table columns configuration
  const columns = [
    {
      title: "Serial No.",
      dataIndex: "serialNumber",
      key: "serialNumber",
      render: (_, record) => <div style={{ width: "70px" }}>{record.serialNumber}</div>,
      sorter: (a, b) => a.serialNumber - b.serialNumber,
    },
    {
      title: "News Id",
      dataIndex: "_id",
      key: "_id",
      render: (value) => (
        <div className="truncate-text" style={{ width: "140px" }}>
          {value}
        </div>
      ),
      sorter: (a, b) => a._id.localeCompare(b._id),
    },
    {
      title: "Date",
      key: "createdAt",
      dataIndex: "createdAt",
      render: (date) => (
        <div style={{ width: "150px" }}>
          {moment(date).format("DD-MM-YYYY hh:mm A")}
        </div>
      ),
      sorter: (a, b) => moment(a.createdAt) - moment(b.createdAt),
    },
    {
      title: "Image",
      dataIndex: "image",
      key: "image",
      render: (_, { type, image, _id }) => (
        type === "img" ? (
          <Image
            width={100}
            height={100}
            src={image || ""}
            preview={{
              visible: _id === visible,
              src: image || "",
              onVisibleChange: (value) => setVisible(value ? _id : ""),
            }}
          />
        ) : (
          <video width={100} height={100} src={image || ""} />
        )
      ),
    },

    // Slider fix Babloo 
    {
      title: 'Fixed Position',
      key: 'fixedPosition',
      render: (_, article) => (
        <Space>
          <Button
            size="small"
            onClick={() => handleSetFixedPosition(article._id, 1)}
            type={article.fixedPosition === 1 ? 'primary' : 'default'}
          >
            Set 1st
          </Button>
          <Button
            size="small"
            onClick={() => handleSetFixedPosition(article._id, 2)}
            type={article.fixedPosition === 2 ? 'primary' : 'default'}
          >
            Set 2nd
          </Button>
          {[1, 2].includes(article.fixedPosition) && (
            <Button
              size="small"
              danger
              onClick={() => handleClearFixedPosition(article.fixedPosition)}
            >
              Clear
            </Button>
          )}
        </Space>
      )
    },
    {
      title: "Headline",
      dataIndex: "title",
      key: "title",
      render: (text) => <a>{text ? `${text.substring(0, 15)}...` : ""}</a>,
    },
    {
      title: "Actions",
      key: "action",
      render: (user) => (
        <Space size="middle">
          <a onClick={() => {
            setOnEdit(true);
            setId(user._id);
            navigation("/dashboard/upload?edit=true");
          }}>
            Edit
          </a>
          <a onClick={() => {
                ShowDeleteModal(user);
              }}>Delete</a>
          {isAdmin && (
            <a onClick={() => ShowReportedModal(user)}>Report Article</a>
          )}
        </Space>
      ),
    },
    {
      title: "Category",
      key: "topic",
      render: ({ topic }) => <a>{topic}</a>,
    },

    {
      title: "News Type",
      key: "newsType",
      dataIndex: "publish",
      render: (_, { newsType }) => <a>{newsType || "breakingNews"}</a>,
    },
    {
      title: "News",
      dataIndex: "discription",
      key: "discription",
      render: (text) => <a>{stripHtmlTags(text).substring(0, 50)}...</a>,
    },
    {
      title: "Content Type",
      key: "type",
      dataIndex: "type",
      render: (type) => (
        <Tag color="gold">
          {type === "img" ? "Image" : type === "vid" ? "Video" : "Image"}
        </Tag>
      ),
    },
    {
      title: "Status",
      key: "status",
      dataIndex: "status",
      render: (_, article) => {
        const isScheduled = article.publishAt && new Date(article.publishAt) > new Date();
        // const isPublished = article.status === 'published';
        const isOnline = article.status === 'online';

        if (isScheduled) {
          return (
            <Tag color="orange">
              SCHEDULED ({moment(article.publishAt).format('DD-MM-YYYY hh:mm A')})
            </Tag>
          );
        } else if (isOnline) {
          return <Tag color="green">LIVE</Tag>;
        }
        return <Tag color="red">OFFLINE</Tag>;
      },
    },
    {
      title: "Online / Offline",
      key: "statusToggle",
      render: (_, article) => {
        const now = new Date();
        const publishTime = article.publishAt ? new Date(article.publishAt) : null;
        const isScheduled = publishTime && publishTime > now;
        const shouldBeOnline = publishTime && publishTime <= now;
        const isOnline = article.status === 'online';

        if (isScheduled) {
          return (
            <>
              <Tag color="orange">SCHEDULED</Tag>
              <div>Will go live at {moment(publishTime).format('DD-MM-YYYY hh:mm A')}</div>
            </>
          );
        } else if (shouldBeOnline && !isOnline) {
          return (
            <>
              <Tag color="volcano">PENDING</Tag>
              <Button
                type="link"
                onClick={getAllArticles}
                style={{ padding: "auto 0px", margin: "10px 0px" }}
              >
                Check Status
              </Button>
            </>
          );
        }
        return (
          <>
            <Tag color={isOnline ? "cyan" : "red"}>
              {isOnline ? "ONLINE" : "OFFLINE"}
            </Tag>
            <Button
              type="link"
              onClick={() => handleToggleStatus(article._id, article.status)}
              style={{ padding: "auto 0px", margin: "10px 0px" }}
            >
              Change Status
            </Button>
          </>
        );
      },
    },
    {
      title: "Tags",
      key: "keyWord",
      dataIndex: "keyWord",
      render: (keyWord) => (
        <>
          {Array.isArray(keyWord) && keyWord.map((e, index) => (
            <Tag color="blue" key={index}>{e}</Tag>
          ))}
        </>
      ),
    },
    {
      title: "Reported By",
      key: "reportedBy",
      render: ({ reportedBy }) => <a>{reportedBy || "Agencies"}</a>,
    },
    {
      title: "Published By",
      key: "publishBy",
      render: ({ publishBy }) => <a>{publishBy || "admin@gmail.com"}</a>,
    },
    {
      title: "Language",
      key: "language",
      render: ({ language }) => <Tag>{language || "English"}</Tag>,
    },
  ];

  const dataWithSerialNumbers = sortedArticleData.map((serialNumber) => ({
    ...articleData[serialNumber - 1],
    serialNumber,
  }));

   const publishAndReportedByArray = articleData?.map((article) => ({
    publishBy: article.publishBy,
    reportedBy: article.reportedBy,
  }));

  // Extract unique reportedBy values
  const uniqueReportedBy = [
    ...new Set(publishAndReportedByArray.map((item) => item.reportedBy)),
  ];
  // Extract unique publishBy values
  const uniquePublishBy = [
    ...new Set(publishAndReportedByArray.map((item) => item.publishBy)),
  ];

  return (
    <>
      <h1 className="page-title">Articles</h1>
      <Card>
        <Row gutter={12}>
          <Col span={6}>
            <RangePicker
              style={{ width: "100%" }}
              value={
                filterItemResponse.date
                  ? [
                      moment(filterItemResponse.date[0]),
                      moment(filterItemResponse.date[1]),
                    ]
                  : null
              }
              onChange={(_, dateString) => {
                setfilterItemResponse({
                  ...filterItemResponse,
                  date: dateString,
                });
              }}
            />
          </Col>
          
          {/* Other filter controls... */}
          
          <Col span={6}>
            <Select
              style={{ width: "100%" }}
              value={filterItemResponse.newsType}
              onChange={(e) => setfilterItemResponse({ ...filterItemResponse, newsType: e })}
              options={[
                { value: "all", label: "All" },
                { value: "breakingNews", label: "Breaking News" },
                { value: "topStories", label: "Top Stories" },
                { value: "upload", label: "Upload" },
              ]}
            />
          </Col>

          <Col span={6}>
            <Select
              style={{ width: "100%" }}
              value={filterItemResponse.type}
              onChange={(e) =>
                setfilterItemResponse({ ...filterItemResponse, type: e })
              }
              options={[
                {
                  value: "all",
                  label: "All",
                },
                {
                  value: "img",
                  label: "Images / Text",
                },
                {
                  value: "vid",
                  label: "Videos",
                },
              ]}
            />
          </Col>

          <Col span={6} style={{marginTop: '10px'}}>
            <Input
              onChange={(e) =>
                setfilterItemResponse({
                  ...filterItemResponse,
                  search: e.target.value,
                })
              }
              value={filterItemResponse.search}
              placeholder="Headline"
              style={{ width: "100%" }}
            />
          </Col>
          <Col span={6} style={{ marginTop: 10 }}>
            {/* <Input
            value={filterItemResponse.category}
              onChange={(e) =>
                setfilterItemResponse({...filterItemResponse,category:e.target.value})
                
                
              }
              placeholder="Category"
              style={{ width: "100%" }}
            /> */}
            <AutoComplete
              style={{ width: "100%" }}
              options={categoryOptions?.map((option) => ({
                value: option.value,
              }))}
              filterOption={categoryOptions}
              placeholder="Category"
              value={filterItemResponse.category}
              onChange={(value) =>
                setfilterItemResponse({
                  ...filterItemResponse,
                  category: value,
                })
              }
              onSelect={(value) => {
                setfilterItemResponse({
                  ...filterItemResponse,
                  category: value,
                });
              }}
            />
          </Col>

          <Col span={6} style={{ marginTop: 10 }}>
            <AutoComplete
              placeholder="Sub Category"
              style={{ width: "100%" }}
              options={subCategoryOptions?.map((option) => ({
                value: option.value,
              }))}
              filterOption={subCategoryOptions}
              value={filterItemResponse.subCategory}
              onChange={(value) =>
                setfilterItemResponse({
                  ...filterItemResponse,
                  subCategory: value,
                })
              }
              onSelect={(value) => {
                setfilterItemResponse({
                  ...filterItemResponse,
                  subCategory: value,
                });
              }}
            />
          </Col>
          <Col style={{ marginTop: 10 }} span={6}>
            <Input
              value={filterItemResponse.keyword}
              onChange={(e) =>
                setfilterItemResponse({
                  ...filterItemResponse,
                  keyword: e.target.value,
                })
              }
              placeholder="Tags"
              style={{ width: "100%" }}
            />
          </Col>
          <Col style={{ marginTop: 10 }} span={6}>
            <Input
              value={filterItemResponse.id}
              onChange={(e) =>
                setfilterItemResponse({
                  ...filterItemResponse,
                  id: e.target.value.trim(),
                })
              }
              placeholder="Id"
              style={{ width: "100%" }}
            />
          </Col>

          <Col style={{ marginTop: 10 }} span={6}>
            <label>Reported By</label>
            <Select
              value={filterItemResponse.reportedBy}
              onChange={(value) =>
                setfilterItemResponse({
                  ...filterItemResponse,
                  reportedBy: value,
                })
              }
              placeholder="Reported By"
              style={{ width: "100%" }}
            >
              {uniqueReportedBy.map((option, index) => (
                <Option key={index} value={option}>
                  {option}
                </Option>
              ))}
            </Select>
          </Col>

          <Col style={{ marginTop: 10 }} span={6}>
            <label>Published By</label>
            <Select
              value={filterItemResponse.publishBy}
              onChange={(value) =>
                setfilterItemResponse({
                  ...filterItemResponse,
                  publishBy: value,
                })
              }
              placeholder="Published By"
              style={{ width: "100%" }}
            >
              {uniquePublishBy.map((option, index) => (
                <Option key={index} value={option}>
                  {option}
                </Option>
              ))}
            </Select>
          </Col>
          
          {/* Action buttons */}
          <Col style={{ marginTop: 30 }} span={4}>
            <Button style={{ width: "100%" }} type="primary" onClick={onFilter}>
              Filter
            </Button>
          </Col>
          <Col style={{ marginTop: 30 }} span={4}>
            <Button
              style={{ width: "100%", backgroundColor: "red" }}
              type="primary"
              onClick={onResetFilter}
            >
              Reset
            </Button>
          </Col>
          <Col style={{ marginTop: 30 }} span={4}>
            <Button
              style={{ width: "100%", backgroundColor: "#52c41a" }}
              type="primary"
              onClick={getAllArticles}
            >
              Refresh
            </Button>
          </Col>


          <Col span={24} style={{ marginTop: "20px" }}>
            <Table
              scroll={{ x: 1300 }}
              columns={columns}
              dataSource={dataWithSerialNumbers}
            />
          </Col>
        </Row>
      </Card>

      {/* Modals */}
      <Modal
        title="Delete Article"
        open={isModalDeleteOpen}
        onOk={OnDelete}
        onCancel={handleDeleteCancel}
        okText="Yes"
      >
        <div className="confirmation-message">
          Are You Sure You Want To Delete This Article?
        </div>
      </Modal>

      <Modal
        title="Report Article"
        open={isModalReportedOpen}
        onOk={OnReported}
        onCancel={handleReportedCancel}
        okText="Report"
      >
        <TextArea
          style={{ width: "100%", height: "100px", margin: "10px 0" }}
          showCount
          maxLength={200}
          value={qusetion}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Enter reason for reporting..."
        />
      </Modal>
    </>
  );
};

export default Dashboard;

/* <Col span={6}>
            <Select
              style={{ width: "100%" }}
              defaultValue="keyword"
              onChange={(e) => setfilterItem(e)}
              options={[
                {
                  value: "keyword",
                  label: "By Tags",
                },
                {
                  value: "category",
                  label: "By Category",
                },
                {
                  value: "search",
                  label: "By Headline",
                },
                {
                  value: "id",
                  label: "By ID",
                },
                {
                  value: "date",
                  label: "By Date",
                },
                {
                  value: "newsType",
                  label: "News Type",
                },
                {
                  value: "type",
                  label: "Content Type",
                },
              ]}
            />
          </Col> */
// <Col span={6}>
//             <RangePicker
//               style={{ width: "100%" }}
//               // placeholder="By Date"
//               onChange={(_, dateString) => {
//                 console.log(dateString);
//                 setfilterItemResponse([
//                   ...filterItemResponse,
//                   { value: dateString, main: "date" },
//                 ]);
//               }}
//             />
//           </Col>
//           <Col span={6}>
//             <Select
//               style={{ width: "100%" }}
//               defaultValue="all"
//               onChange={(e) =>
//                 setfilterItemResponse([
//                   ...filterItemResponse,
//                   { value: e, main: "newsType" },
//                 ])
//               }
//               options={[
//                 {
//                   value: "all",
//                   label: "All",
//                 },
//                 {
//                   value: "breakingNews",
//                   label: "Breaking News",
//                 },
//                 {
//                   value: "topStories",
//                   label: "Top Stories",
//                 },
//               ]}
//             />
//           </Col>
//           <Col span={6}>
//             <Select
//               style={{ width: "100%" }}
//               defaultValue="img"
//               onChange={(e) =>
//                 setfilterItemResponse([
//                   ...filterItemResponse,
//                   { value: e, main: "type" },
//                 ])
//               }
//               options={[
//                 {
//                   value: "img",
//                   label: "Images / Text",
//                 },
//                 {
//                   value: "vid",
//                   label: "Videos",
//                 },
//               ]}
//             />
//           </Col>

//           <Col span={6}>
//             <Input
//               onChange={(e) =>
//                 setfilterItemResponse([
//                   ...filterItemResponse,
//                   { value: e.target.value, main: "search" },
//                 ])
//               }
//               placeholder="headline"
//               style={{ width: "100%" }}
//             />
//           </Col>
//           <Col span={6} style={{ marginTop: 10 }}>
//             <Input
//               onChange={(e) =>
//                 setfilterItemResponse([
//                   ...filterItemResponse,
//                   {
//                     value: e.target.value,
//                     main: "category",
//                   },
//                 ])
//               }
//               placeholder="category"
//               style={{ width: "100%" }}
//             />
//           </Col>
//           <Col style={{ marginTop: 10 }} span={6}>
//             <Input
//               onChange={(e) =>
//                 setfilterItemResponse([
//                   ...filterItemResponse,
//                   {
//                     value: e.target.value,
//                     main: "keyword",
//                   },
//                 ])
//               }
//               placeholder="tags"
//               style={{ width: "100%" }}
//             />
//           </Col>
//           <Col style={{ marginTop: 10 }} span={6}>
//             <Input
//               onChange={(e) =>
//                 setfilterItemResponse([
//                   ...filterItemResponse,
//                   { value: e.target.value, main: "id" },
//                 ])
//               }
//               placeholder="id"
//               style={{ width: "100%" }}
//             />
//           </Col>
//           <Col style={{ marginTop: 10 }} span={4}>
//             <Button style={{ width: "100%" }} type="primary" onClick={onFilter}>
//               Filter
//             </Button>
//           </Col>
//           <Col span={24}>
//             <Table
//               scroll={{ x: 1300 }}
//               columns={columns}
//               dataSource={dataWithSerialNumbers}
//               onChange={handleSort}
//             />
//           </Col>

// onFilter
// for (let i = 0; i < filterItemResponse.length; i++) {
//   const element = filterItemResponse[i];
//   console.log("***************element",element)
//   if (element.main === "date" && element.value) {
//     filter = `${element.main}=${element.value.join(",")}&`;
//   } else if (element.main === "newsType" && element.value === "all") {
//     // Skip filtering for "All" option in newsType
//   } else {
//     filter += `${element.main}=${element.value}&`;
//   }
// }
// console.log(filter);
