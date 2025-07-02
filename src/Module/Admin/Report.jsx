import { Card, Col, Row, Table } from "antd";
import axios from "axios";
import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { API_URL } from "../../../API";

const Report = ({ isAdmin }) => {
  const [data, setData] = useState([]);
  useEffect(() => {
    axios
      .get(`${API_URL}/report`)
      .then((res) => {
        // console.log("report data res : ", res);
        setData(res.data);
      })
      .catch((err) => {
        console.log("error in getting report : ", err);
      });
  }, []);

  const columns = [
    {
      title: "Id",
      dataIndex: "_id",
      key: "_id",
      render: (value) => {
        return (
          <div
            style={{
              width: "70px",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {value}
          </div>
        );
      },
    },
    {
      title: "User Id",
      dataIndex: "userId",
      key: "userId",
      render: (value) => {
        return (
          <div
            style={{
              width: "70px",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {value}
          </div>
        );
      },
    },
    {
      title: "Article Id",
      dataIndex: "articleId",
      key: "articleId",
      render: (value) => {
        return (
          <div
            style={{
              width: "70px",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {value}
          </div>
        );
      },
    },
    {
      title: "Question",
      dataIndex: "question",
      key: "question",
    },
  ];
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
        Report
      </h1>
      <Card style={{ width: "100%", height: "100%", minHeight: "80vh" }}>
        <Row gutter={6}>
          <Col span={24} style={{ marginTop: 20 }}>
            <Table columns={columns} dataSource={data} />
          </Col>
          {/* {data &&
          data.length > 0 &&
          data.map((item) => {
            return (
              <Col span={6}>
                <Card>
                  <div>
                    <span style={{ fontWeight: "700" }}>Qusetion</span>:
                    {item.question}
                  </div>
                  {/* <div>
                    <span style={{ fontWeight: "700" }}>Answer</span>:
                    {item?.answer}
                  </div> 
                </Card>
              </Col>
            );
          })} */}
        </Row>
      </Card>
    </>
  );
};

export default Report;
