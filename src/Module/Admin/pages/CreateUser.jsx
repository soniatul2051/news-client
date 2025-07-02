import { useContext, useEffect } from "react";
import { Button, Card, Checkbox, Col, Input, Row, Select, message } from "antd";
import { useState } from "react";
import axios from "axios";
import { API_URL } from "../../../../API";
import { OnEdit as onEditContext } from "../../../Context";

const CreateUser = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [role, setRole] = useState("staff");
  const [cateGet, setCateGet] = useState([]);
  const [selectedKeywords, setSelectedKeywords] = useState([]);
  const [acsses, setAcsses] = useState([]);
  const { onEdit, setOnEdit, id, setId } = useContext(onEditContext);
  const onSumbit = (e) => {
    e.preventDefault();

    if (email != "" || password != "" || phoneNumber != "") {
      axios
        .post(`${API_URL}/registerd`, {
          email,
          password,
          phone: phoneNumber,
          byAdmin: true,
          role,
          acsses,
          selectedKeywords,
        })
        .then(async (data) => {
          message.success("New User Was Created");
          setEmail("");
          setPassword("");
          setPhoneNumber("");
        })
        .catch((err) => {
          console.log("error in creating user : ", err);
          message.error(err.response.data.err);
        });
    } else {
      message.error("Input Fields Can't be empty");
    }
  };

  const options = [
    {
      label: "Top Stories",
      value: "topstories",
    },
    {
      label: "Article",
      value: "articles",
    },
    {
      label: "Dashboard",
      value: "dashboard",
    },
    {
      label: "Breaking News",
      value: "breakingnews",
    },
    {
      label: "Upload",
      value: "upload",
    },
    {
      label: "Create Users",
      value: "creatuser",
    },
    {
      label: "Advertisement",
      value: "ads",
    },
    {
      label: "Live",
      value: "live",
    },
    {
      label: "Poll",
      value: "poll",
    },
    {
      label: "Users",
      value: "users",
    },
    {
      label: "Flash News",
      value: "flashnews",
    },
    {
      label: "Tags & Category",
      value: "content",
    },
    {
      label: "Comments",
      value: "comment",
    },
    {
      label: "Visual Stories",
      value: "stories",
    },
    {
      label: "Videos",
      value: "videos",
    },
    {
      label: "Photos",
      value: "photos",
    },
    {
      label: "Newsletter",
      value: "newsletter",
    },
  ];
  const onChange = (checkedValues) => {
    // console.log("checked = ", checkedValues);
    setAcsses(checkedValues);
  };

  const handleTagChange = (value) => {
    // Allow only two tags to be selected
    // const newTags = value.slice(-2);
    // setSelectedKeywords(newTags);
    setSelectedKeywords(value);
  };

  const selectedOptions = cateGet.map((item) => ({
    value: item.label,
    label: item.label,
  }));

  useEffect(() => {
    axios
      .get(`${API_URL}/content?type=category`)
      .then((content) => {
        let arr = [];
        for (let i = 0; i < content.data.length; i++) {
          const element = content.data[i];
          arr.push({
            key: element._id,
            value: element.text,
            label: element.text,
          });
        }
        setCateGet(arr);
        // console.log(users);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  return (
    <>
      <h1
        style={{
          color: "rgba(0,0,0,0.8)",
          marginBottom: 10,
          textAlign: "left",
          fontFamily: "Poppins",
        }}
      >
        Create New User
      </h1>
      <Row>
        <Col span={24}>
          <Card style={{ minHeight: "80vh", height: "100%" }}>
            <Row gutter={34}>
              <Col span={12}>
                <Input
                  value={email}
                  style={{ width: "100%" }}
                  placeholder="Email"
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Col>
              <Col span={12}>
                <Input
                  value={phoneNumber}
                  style={{ width: "100%" }}
                  placeholder="Phone Number"
                  onChange={(e) => setPhoneNumber(e.target.value)}
                />
              </Col>
              <Col span={12}>
                <Input
                  value={password}
                  style={{ width: "100%", marginTop: "10px" }}
                  type="password"
                  placeholder="Password"
                  onChange={(e) => setPassword(e.target.value)}
                />
              </Col>
              <Col span={12}>
                <Select
                  style={{ width: "100%", marginTop: "10px" }}
                  onChange={(e) => setRole(e)}
                  placeholder="Select Role"
                  options={[
                    {
                      value: "staff",
                      label: "Staff",
                    },
                    {
                      value: "admin",
                      label: "Admin",
                    },
                    {
                      value: "author",
                      label: "Author",
                    },
                    {
                      value: "journalist",
                      label: "Journalist",
                    },
                  ]}
                />
              </Col>
              <Col span={12} style={{ marginTop: "10px" }}>
                <Select
                  mode="multiple"
                  placeholder="Select Categery"
                  value={selectedKeywords}
                  onChange={handleTagChange}
                  style={{ width: "100%" }}
                  options={selectedOptions}
                />
                <div style={{ marginBottom: "20px" }}></div>
              </Col>

              <Col span={18} style={{ marginTop: "20px" }}>
                <Checkbox.Group
                  style={{ margin: "20px 0px" }}
                  options={options}
                  onChange={onChange}
                />
              </Col>
              <Col span={6}>
                <Button
                  type="primary"
                  style={{ marginTop: "20px", width: "100%" }}
                  onClick={onSumbit}
                >
                  Create User
                </Button>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default CreateUser;
