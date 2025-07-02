import { Chart, registerables } from "chart.js";
Chart.register(...registerables);

import React, { useEffect, useState } from "react";
import { Modal, Button, DatePicker } from "antd";
import { Bar, Line } from "react-chartjs-2";
import "../styles/index.css";
import {
  FileImageOutlined,
  FilePdfOutlined,
  FileTextOutlined,
  HistoryOutlined,
  MessageOutlined,
  PlayCircleOutlined,
  UserOutlined,
  VideoCameraOutlined,
} from "@ant-design/icons";
import axios from "axios";
import { API_URL } from "../../../../API";
import moment from "moment/moment";

// import { Line,Bar } from 'react-chartjs-2';

const MainDashBoard = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedChart, setSelectedChart] = useState(null);

  const [filterItemDate, setfilterItemDate] = useState();
  const [isFilter, setIsFilter] = useState(false);
  const [Loading, setLoading] = useState(false);

  const [userChartData, setUserChartData] = useState();
  const [BreakingNewsChartData, setBreakingNewsChartData] = useState();
  const [TopStoriesChartData, setTopStoriesChartData] = useState();
  const [UploadChartData, setUploadChartData] = useState();
  const [ADSChartData, setADSChartData] = useState();
  const [FlashNewsChartData, setFlashNewsChartData] = useState();
  const [StoriesChartData, setStoriesChartData] = useState();
  const [VideosChartData, setVideosChartData] = useState();
  const [PhotosChartData, setPhotosChartData] = useState();
  const [CommentChartData, setCommentChartData] = useState();
  const [LiveChartData, setLiveChartData] = useState();
  const [PollChartData, setPollChartData] = useState();
  const [ReportChartData, setReportChartData] = useState();
  const [CategoryChartData, setCategoryChartData] = useState();
  const [SubCatChartData, setSubCatChartData] = useState();
  // it array of list of standard object used here
  const [CatArticlesChartData, setCatArticlesChartData] = useState();

  const onFilter = async () => {
    setLoading(true);

    const filter = `?date=${filterItemDate.join(",")}&`;
    await fetchFilterUserData(filter);
    await fetchFilterBreakingNewsData(filter);
    await fetchFilterTopStoriesData(filter);
    await fetchFilterUploadsData(filter);
    await fetchFilterADSData(filter);
    await fetchFilterFlashNewsData(filter);
    await fetchFilterStoriesData(filter);
    await fetchFilterVideosData(filter);
    await fetchFilterPhotosData(filter);
    await fetchFilterCommentData(filter);
    await fetchFilterLiveData(filter);
    await fetchFilterPollData(filter);
    await fetchFilterReportData(filter);
    await fetchFilterCategoryData(filter);
    await fetchFilterSubCatData(filter);
    await fetchFilterCatArticlesData(filter);
    setLoading(false);
  };

  const onDefaultFetcher = async () => {
    setLoading(true);
    await fetchUsersData();
    await fetchBreakingNewsData();
    await fetchTopStoriesData();
    await fetchUploadsData();
    await fetchADSData();
    await fetchFlashNewsData();
    await fetchStoriesData();
    await fetchVideosData();
    await fetchPhotosData();
    await fetchCommentData();
    await fetchLiveData();
    await fetchPollData();
    await fetchReportData();
    await fetchCatergoryData();
    await fetchSubCatData();
    await fetchCatArticlesData();
    setLoading(false);
  };

  // useEffect(()=>{
  //   if(isFilter){
  //     onFilter()
  //   }else{
  //     onDefaultFetcher()
  //   }

  // },[filterItemDate,isFilter])

  async function fetchFilterUserData(filter) {
    const response = await axios.get(`${API_URL}/dashboard/users${filter}`);
    const data = response.data;

    const chartData = {
      labels: ["Users"],
      datasets: [
        {
          label: "Active users",
          backgroundColor: ["#36A2EB"],
          data: [data.activeCount],
        },
        {
          label: "InActive users",
          backgroundColor: ["#FF6384"],
          data: [data.inactiveCount],
        },
      ],
    };

    setUserChartData((prevState) => ({
      ...prevState,
      chartData,
      TotalCount: data.activeCount + data.inactiveCount,
    }));
  }
  async function fetchFilterBreakingNewsData(filter) {
    const response = await axios.get(
      `${API_URL}/dashboard/breakingNews${filter}`
    );
    const data = response.data;
    const chartData = {
      labels: ["Breaking News"],
      datasets: [
        {
          label: "Active Breaking News",
          backgroundColor: ["#36A2EB"],
          data: [data.activeCount],
        },
        {
          label: "InActive Breaking News",
          backgroundColor: ["#FF6384"],
          data: [data.inactiveCount],
        },
      ],
    };
    setBreakingNewsChartData((prevState) => ({
      ...prevState,
      chartData: chartData,
      TotalCount: data.activeCount + data.inactiveCount,
    }));
  }
  async function fetchFilterTopStoriesData(filter) {
    try {
      const response = await axios.get(
        `${API_URL}/dashboard/topStories${filter}`
      );
      const data = response.data;

      const chartData = {
        labels: ["Top Stories"],
        datasets: [
          {
            label: "Active Top Stories",
            backgroundColor: ["#36A2EB"],
            data: [data.activeCount],
          },
          {
            label: "InActive Top Stories",
            backgroundColor: ["#FF6384"],
            data: [data.inactiveCount],
          },
        ],
      };
      setTopStoriesChartData((prevState) => ({
        ...prevState,
        chartData,
        TotalCount: data.activeCount + data.inactiveCount,
      }));
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  }
  async function fetchFilterUploadsData(filter) {
    try {
      const response = await axios.get(`${API_URL}/dashboard/uploads${filter}`);
      const data = response.data;

      const chartData = {
        labels: ["Uploads"],
        datasets: [
          {
            label: "Active Uploads",
            backgroundColor: ["#36A2EB"],
            data: [data.activeCount],
          },
          {
            label: "InActive Uploads",
            backgroundColor: ["#FF6384"],
            data: [data.inactiveCount],
          },
        ],
      };
      setUploadChartData((prevState) => ({
        ...prevState,
        chartData,
        TotalCount: data.activeCount + data.inactiveCount,
      }));
    } catch (error) {
      console.error("Error fetching upload data:", error);
    }
  }

  async function fetchFilterADSData(filter) {
    try {
      const response = await axios.get(`${API_URL}/dashboard/ads${filter}`);
      const data = response.data;

      const chartData = {
        labels: ["Ads"],
        datasets: [
          {
            label: "Active Ads",
            backgroundColor: ["#36A2EB"],
            data: [data.activeCount],
          },
          {
            label: "InActive Ads",
            backgroundColor: ["#FF6384"],
            data: [data.inactiveCount],
          },
        ],
      };
      setADSChartData((prevState) => ({
        ...prevState,
        chartData,
        TotalCount: data.activeCount + data.inactiveCount,
      }));
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  }

  async function fetchFilterFlashNewsData(filter) {
    try {
      const response = await axios.get(
        `${API_URL}/dashboard/flashNews${filter}`
      );
      const data = response.data;

      const chartData = {
        labels: ["Flash News"],
        datasets: [
          {
            label: "Active Flash News",
            backgroundColor: ["#36A2EB"],
            data: [data.activeCount],
          },
          {
            label: "InActive Flash News",
            backgroundColor: ["#FF6384"],
            data: [data.inactiveCount],
          },
        ],
      };
      setFlashNewsChartData((prevState) => ({
        ...prevState,
        chartData,
        TotalCount: data.activeCount + data.inactiveCount,
      }));
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  }
  async function fetchFilterStoriesData(filter) {
    try {
      const response = await axios.get(`${API_URL}/dashboard/stories${filter}`);
      const data = response.data;

      const chartData = {
        labels: ["Visual Stories"],
        datasets: [
          {
            label: "Active Visual Stories",
            backgroundColor: ["#36A2EB"],
            data: [data.activeCount],
          },
          {
            label: "InActive Visual Stories",
            backgroundColor: ["#FF6384"],
            data: [data.inactiveCount],
          },
        ],
      };
      setStoriesChartData((prevState) => ({
        ...prevState,
        chartData,
        TotalCount: data.activeCount + data.inactiveCount,
      }));
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  }
  async function fetchFilterVideosData(filter) {
    try {
      const response = await axios.get(`${API_URL}/dashboard/videos${filter}`);
      const data = response.data;

      const chartData = {
        labels: ["Videos"],
        datasets: [
          {
            label: "Active Videos",
            backgroundColor: ["#36A2EB"],
            data: [data.activeCount],
          },
          {
            label: "InActive Videos",
            backgroundColor: ["#FF6384"],
            data: [data.inactiveCount],
          },
        ],
      };
      setVideosChartData((prevState) => ({
        ...prevState,
        chartData,
        TotalCount: data.activeCount + data.inactiveCount,
      }));
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  }

  async function fetchFilterPhotosData(filter) {
    try {
      const response = await axios.get(`${API_URL}/dashboard/photos${filter}`);
      const data = response.data;

      const chartData = {
        labels: ["Photos"],
        datasets: [
          {
            label: "Active Photos",
            backgroundColor: ["#36A2EB"],
            data: [data.activeCount],
          },
          {
            label: "InActive Photos",
            backgroundColor: ["#FF6384"],
            data: [data.inactiveCount],
          },
        ],
      };
      setPhotosChartData((prevState) => ({
        ...prevState,
        chartData,
        TotalCount: data.activeCount + data.inactiveCount,
      }));
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  }
  async function fetchFilterCommentData(filter) {
    try {
      const response = await axios.get(
        `${API_URL}/dashboard/comments${filter}`
      );
      const data = response.data;

      const chartData = {
        labels: ["Comments"],
        datasets: [
          {
            label: "Active Comments",
            backgroundColor: ["#36A2EB"],
            data: [data.activeCount],
          },
          {
            label: "InActive Comments",
            backgroundColor: ["#FF6384"],
            data: [data.inactiveCount],
          },
        ],
      };
      setCommentChartData((prevState) => ({
        ...prevState,
        chartData,
        TotalCount: data.activeCount + data.inactiveCount,
      }));
    } catch (error) {
      console.error("Error fetching comment data:", error);
    }
  }
  async function fetchFilterLiveData(filter) {
    try {
      const response = await axios.get(`${API_URL}/dashboard/live${filter}`);
      const data = response.data;

      const chartData = {
        labels: ["Live"],
        datasets: [
          {
            label: "Active Live",
            backgroundColor: ["#36A2EB"],
            data: [data.activeCount],
          },
          {
            label: "InActive Live",
            backgroundColor: ["#FF6384"],
            data: [data.inactiveCount],
          },
        ],
      };
      setLiveChartData((prevState) => ({
        ...prevState,
        chartData,
        TotalCount: data.activeCount + data.inactiveCount,
      }));
    } catch (error) {
      console.error("Error fetching live data:", error);
    }
  }

  async function fetchFilterPollData(filter) {
    try {
      const response = await axios.get(`${API_URL}/dashboard/poll${filter}`);
      const data = response.data;

      const chartData = {
        labels: ["Poll"],
        datasets: [
          {
            label: "Active Poll",
            backgroundColor: ["#36A2EB"],
            data: [data.activeCount],
          },
          {
            label: "InActive Poll",
            backgroundColor: ["#FF6384"],
            data: [data.inactiveCount],
          },
        ],
      };
      setPollChartData((prevState) => ({
        ...prevState,
        chartData,
        TotalCount: data.activeCount + data.inactiveCount,
      }));
    } catch (error) {
      console.error("Error fetching poll data:", error);
    }
  }
  async function fetchFilterReportData(filter) {
    try {
      const response = await axios.get(`${API_URL}/dashboard/report${filter}`);
      const data = response.data;

      const chartData = {
        labels: ["Report"],
        datasets: [
          {
            label: "Active Report",
            backgroundColor: ["#36A2EB"],
            data: [data.activeCount],
          },
          {
            label: "InActive Report",
            backgroundColor: ["#FF6384"],
            data: [data.inactiveCount],
          },
        ],
      };
      setReportChartData((prevState) => ({
        ...prevState,
        chartData,
        TotalCount: data.activeCount + data.inactiveCount,
      }));
    } catch (error) {
      console.error("Error fetching poll data:", error);
    }
  }
  async function fetchFilterCategoryData(filter) {
    try {
      const response = await axios.get(`${API_URL}/dashboard/content${filter}`);
      const data = response.data;

      const chartData = {
        labels: ["Category"],
        datasets: [
          {
            label: "Active Category",
            backgroundColor: ["#36A2EB"],
            data: [data.activeCount],
          },
          {
            label: "InActive Category",
            backgroundColor: ["#FF6384"],
            data: [data.inactiveCount],
          },
        ],
      };
      setCategoryChartData((prevState) => ({
        ...prevState,
        chartData,
        TotalCount: data.activeCount + data.inactiveCount,
      }));
    } catch (error) {
      console.error("Error fetching Category data:", error);
    }
  }
  async function fetchFilterSubCatData(filter) {
    try {
      const response = await axios.get(
        `${API_URL}/dashboard/subCategory${filter}`
      );
      const data = response.data;

      const chartData = {
        labels: ["Sub Category"],
        datasets: [
          {
            label: "Active Sub Category",
            backgroundColor: ["#36A2EB"],
            data: [data.activeCount],
          },
          {
            label: "InActive Sub Category",
            backgroundColor: ["#FF6384"],
            data: [data.inactiveCount],
          },
        ],
      };
      setSubCatChartData((prevState) => ({
        ...prevState,
        chartData,
        TotalCount: data.activeCount + data.inactiveCount,
      }));
    } catch (error) {
      console.error("Error fetching subCategory data:", error);
    }
  }
  async function fetchFilterCatArticlesData(filter) {
    try {
      const response = await axios.get(
        `${API_URL}/dashboard/categroyAritcles${filter}`
      );
      const data = response.data;
      const mainArr = [];
      for (const [category, counts] of Object.entries(data)) {
        const obj = {};

        const chartData = {
          labels: [`Category ${category}`],
          datasets: [
            {
              label: `Active Category`,
              backgroundColor: ["#36A2EB"],
              data: [counts.activeCount],
            },
            {
              label: `InActive Category`,
              backgroundColor: ["#FF6384"],
              data: [counts.inactiveCount],
            },
          ],
        };

        const todayData = counts.todayData;
        const TotalCount = counts.activeCount + counts.inactiveCount;
        obj.chartData = chartData;
        obj.todayData = todayData;
        obj.TotalCount = TotalCount;
        obj.category = category;
        mainArr.push(obj);
      }

      setCatArticlesChartData(mainArr);
    } catch (error) {
      console.error("Error fetching subCategory data:", error);
    }
  }

  async function fetchUsersData() {
    try {
      const response = await axios.get(`${API_URL}/dashboard/users`);
      const data = response.data;

      const chartData = {
        labels: ["Users"],
        datasets: [
          {
            label: "Active users",
            backgroundColor: ["#36A2EB"],
            data: [data.activeCount],
          },
          {
            label: "InActive users",
            backgroundColor: ["#FF6384"],
            data: [data.inactiveCount],
          },
        ],
      };

      setUserChartData((prevState) => ({
        ...prevState,
        todayData: data.todayData,
        chartData,
        TotalCount: data.activeCount + data.inactiveCount,
      }));
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  }
  async function fetchBreakingNewsData() {
    try {
      const response = await axios.get(`${API_URL}/dashboard/breakingNews`);
      const data = response.data;

      const chartData = {
        labels: ["Breaking News"],
        datasets: [
          {
            label: "Active Breaking News",
            backgroundColor: ["#36A2EB"],
            data: [data.activeCount],
          },
          {
            label: "InActive Breaking News",
            backgroundColor: ["#FF6384"],
            data: [data.inactiveCount],
          },
        ],
      };
      setBreakingNewsChartData((prevState) => ({
        ...prevState,
        chartData,
        todayData: data.todayData,
        TotalCount: data.activeCount + data.inactiveCount,
      }));
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  }
  async function fetchTopStoriesData() {
    try {
      const response = await axios.get(`${API_URL}/dashboard/topStories`);
      const data = response.data;

      const chartData = {
        labels: ["Top Stories"],
        datasets: [
          {
            label: "Active Top Stories",
            backgroundColor: ["#36A2EB"],
            data: [data.activeCount],
          },
          {
            label: "InActive Top Stories",
            backgroundColor: ["#FF6384"],
            data: [data.inactiveCount],
          },
        ],
      };
      setTopStoriesChartData((prevState) => ({
        ...prevState,
        chartData,
        todayData: data.todayData,
        TotalCount: data.activeCount + data.inactiveCount,
      }));
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  }
  async function fetchUploadsData() {
    try {
      const response = await axios.get(`${API_URL}/dashboard/uploads`);
      const data = response.data;

      const chartData = {
        labels: ["Uploads"],
        datasets: [
          {
            label: "Active Uploads",
            backgroundColor: ["#36A2EB"],
            data: [data.activeCount],
          },
          {
            label: "InActive Uploads",
            backgroundColor: ["#FF6384"],
            data: [data.inactiveCount],
          },
        ],
      };
      setUploadChartData((prevState) => ({
        ...prevState,
        chartData,
        todayData: data.todayData,
        TotalCount: data.activeCount + data.inactiveCount,
      }));
    } catch (error) {
      console.error("Error fetching upload data:", error);
    }
  }
  async function fetchADSData() {
    try {
      const response = await axios.get(`${API_URL}/dashboard/ads`);
      const data = response.data;

      const chartData = {
        labels: ["Ads"],
        datasets: [
          {
            label: "Active Ads",
            backgroundColor: ["#36A2EB"],
            data: [data.activeCount],
          },
          {
            label: "InActive Ads",
            backgroundColor: ["#FF6384"],
            data: [data.inactiveCount],
          },
        ],
      };
      setADSChartData((prevState) => ({
        ...prevState,
        chartData,
        todayData: data.todayData,
        TotalCount: data.activeCount + data.inactiveCount,
      }));
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  }
  async function fetchFlashNewsData() {
    try {
      const response = await axios.get(`${API_URL}/dashboard/flashNews`);
      const data = response.data;

      const chartData = {
        labels: ["Flash News"],
        datasets: [
          {
            label: "Active Flash News",
            backgroundColor: ["#36A2EB"],
            data: [data.activeCount],
          },
          {
            label: "InActive Flash News",
            backgroundColor: ["#FF6384"],
            data: [data.inactiveCount],
          },
        ],
      };
      setFlashNewsChartData((prevState) => ({
        ...prevState,
        chartData,
        todayData: data.todayData,
        TotalCount: data.activeCount + data.inactiveCount,
      }));
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  }
  async function fetchStoriesData() {
    try {
      const response = await axios.get(`${API_URL}/dashboard/stories`);
      const data = response.data;

      const chartData = {
        labels: ["Visual Stories"],
        datasets: [
          {
            label: "Active Visual Stories",
            backgroundColor: ["#36A2EB"],
            data: [data.activeCount],
          },
          {
            label: "InActive Visual Stories",
            backgroundColor: ["#FF6384"],
            data: [data.inactiveCount],
          },
        ],
      };
      setStoriesChartData((prevState) => ({
        ...prevState,
        chartData,
        todayData: data.todayData,
        TotalCount: data.activeCount + data.inactiveCount,
      }));
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  }
  async function fetchVideosData() {
    try {
      const response = await axios.get(`${API_URL}/dashboard/videos`);
      const data = response.data;

      const chartData = {
        labels: ["Videos"],
        datasets: [
          {
            label: "Active Videos",
            backgroundColor: ["#36A2EB"],
            data: [data.activeCount],
          },
          {
            label: "InActive Videos",
            backgroundColor: ["#FF6384"],
            data: [data.inactiveCount],
          },
        ],
      };
      setVideosChartData((prevState) => ({
        ...prevState,
        chartData,
        todayData: data.todayData,
        TotalCount: data.activeCount + data.inactiveCount,
      }));
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  }
  async function fetchPhotosData() {
    try {
      const response = await axios.get(`${API_URL}/dashboard/photos`);
      const data = response.data;

      const chartData = {
        labels: ["Photos"],
        datasets: [
          {
            label: "Active Photos",
            backgroundColor: ["#36A2EB"],
            data: [data.activeCount],
          },
          {
            label: "InActive Photos",
            backgroundColor: ["#FF6384"],
            data: [data.inactiveCount],
          },
        ],
      };
      setPhotosChartData((prevState) => ({
        ...prevState,
        chartData,
        todayData: data.todayData,
        TotalCount: data.activeCount + data.inactiveCount,
      }));
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  }
  async function fetchCommentData() {
    try {
      const response = await axios.get(`${API_URL}/dashboard/comments`);
      const data = response.data;

      const chartData = {
        labels: ["Comments"],
        datasets: [
          {
            label: "Active Comments",
            backgroundColor: ["#36A2EB"],
            data: [data.activeCount],
          },
          {
            label: "InActive Comments",
            backgroundColor: ["#FF6384"],
            data: [data.inactiveCount],
          },
        ],
      };
      setCommentChartData((prevState) => ({
        ...prevState,
        chartData,
        todayData: data.todayData,
        TotalCount: data.activeCount + data.inactiveCount,
      }));
    } catch (error) {
      console.error("Error fetching comment data:", error);
    }
  }
  async function fetchLiveData() {
    try {
      const response = await axios.get(`${API_URL}/dashboard/live`);
      const data = response.data;

      const chartData = {
        labels: ["Lives"],
        datasets: [
          {
            label: "Active Lives",
            backgroundColor: ["#36A2EB"],
            data: [data.activeCount],
          },
          {
            label: "InActive Lives",
            backgroundColor: ["#FF6384"],
            data: [data.inactiveCount],
          },
        ],
      };
      setLiveChartData((prevState) => ({
        ...prevState,
        chartData,
        todayData: data.todayData,
        TotalCount: data.activeCount + data.inactiveCount,
      }));
    } catch (error) {
      console.error("Error fetching comment data:", error);
    }
  }
  async function fetchPollData() {
    try {
      const response = await axios.get(`${API_URL}/dashboard/poll`);
      const data = response.data;

      const chartData = {
        labels: ["Poll"],
        datasets: [
          {
            label: "Active Poll",
            backgroundColor: ["#36A2EB"],
            data: [data.activeCount],
          },
          {
            label: "InActive Poll",
            backgroundColor: ["#FF6384"],
            data: [data.inactiveCount],
          },
        ],
      };
      setPollChartData((prevState) => ({
        ...prevState,
        chartData,
        todayData: data.todayData,
        TotalCount: data.activeCount + data.inactiveCount,
      }));
    } catch (error) {
      console.error("Error fetching poll data:", error);
    }
  }

  async function fetchReportData() {
    try {
      const response = await axios.get(`${API_URL}/dashboard/report`);
      const data = response.data;

      const chartData = {
        labels: ["Report"],
        datasets: [
          {
            label: "Active Report",
            backgroundColor: ["#36A2EB"],
            data: [data.activeCount],
          },
          {
            label: "InActive Report",
            backgroundColor: ["#FF6384"],
            data: [data.inactiveCount],
          },
        ],
      };
      setReportChartData((prevState) => ({
        ...prevState,
        chartData,
        todayData: data.todayData,
        TotalCount: data.activeCount + data.inactiveCount,
      }));
    } catch (error) {
      console.error("Error fetching report data:", error);
    }
  }
  async function fetchCatergoryData() {
    try {
      const response = await axios.get(`${API_URL}/dashboard/content`);
      const data = response.data;

      const chartData = {
        labels: ["Category"],
        datasets: [
          {
            label: "Active Category",
            backgroundColor: ["#36A2EB"],
            data: [data.activeCount],
          },
          {
            label: "InActive Category",
            backgroundColor: ["#FF6384"],
            data: [data.inactiveCount],
          },
        ],
      };
      setCategoryChartData((prevState) => ({
        ...prevState,
        chartData,
        todayData: data.todayData,
        TotalCount: data.activeCount + data.inactiveCount,
      }));
    } catch (error) {
      console.error("Error fetching Category data:", error);
    }
  }
  async function fetchSubCatData() {
    try {
      const response = await axios.get(`${API_URL}/dashboard/subCategory`);
      const data = response.data;

      const chartData = {
        labels: ["Sub Category"],
        datasets: [
          {
            label: "Active Sub Category",
            backgroundColor: ["#36A2EB"],
            data: [data.activeCount],
          },
          {
            label: "InActive Sub Category",
            backgroundColor: ["#FF6384"],
            data: [data.inactiveCount],
          },
        ],
      };
      setSubCatChartData((prevState) => ({
        ...prevState,
        chartData,
        todayData: data.todayData,
        TotalCount: data.activeCount + data.inactiveCount,
      }));
    } catch (error) {
      console.error("Error fetching subCategory data:", error);
    }
  }
  async function fetchCatArticlesData() {
    try {
      const response = await axios.get(`${API_URL}/dashboard/categroyAritcles`);
      const data = response.data;
      console.log('article full', data)
      const mainArr = [];
      for (const [category, counts] of Object.entries(data)) {
        const obj = {};

        const chartData = {
          labels: [`Category ${category}`],
          datasets: [
            {
              label: `Active Category`,
              backgroundColor: ["#36A2EB"],
              data: [counts.activeCount],
            },
            {
              label: `InActive Category`,
              backgroundColor: ["#FF6384"],
              data: [counts.inactiveCount],
            },
          ],
        };

        const todayData = counts.todayData;
        const TotalCount = counts.activeCount + counts.inactiveCount;
        obj.chartData = chartData;
        obj.todayData = todayData;
        obj.TotalCount = TotalCount;
        obj.category = category;
        mainArr.push(obj);
      }

      setCatArticlesChartData(mainArr);
    } catch (error) {
      console.error("Error fetching category wise articles data:", error);
    }
  }

  useEffect(() => {
    onDefaultFetcher();
  }, []);

  const handleButtonClick = (chartType) => {
    setSelectedChart(chartType);
    setModalVisible(true);
  };

  const { RangePicker } = DatePicker;

  return (
    <>
      {Loading ? (
        <p style={{ color: "white", backgroundColor: "red" }}>Loading ...</p>
      ) : null}
      <h1 className="dashMainHeading">Dashboard</h1>
      <div className="dashToplineElements">
        <RangePicker
          style={{ width: "70%" }}
          // placeholder="By Date"
          value={
            filterItemDate
              ? [moment(filterItemDate[0]), moment(filterItemDate[1])]
              : ""
          }
          onChange={(_, dateString) => {
            // console.log(dateString);
            setfilterItemDate(dateString);
          }}
        />
        <Button
          style={{ backgroundColor: "blue", color: "white" }}
          onClick={onFilter}
        >
          Filter
        </Button>
        <Button
          style={{ backgroundColor: "red", color: "white" }}
          onClick={() => {
            setfilterItemDate();
            onDefaultFetcher();
          }}
        >
          Reset
        </Button>
      </div>
      <div className="mainDashBoardContainer">
        <div
          className="mainDashBoardContainerChild mainDashBoardContainerChild1"
          onClick={() => handleButtonClick("user")}
        >
          <UserOutlined className="dashCardIcon" />
          <div className="dashsmallContainer">
            <div className="dashsmallContaineritem dashsmallContaineritem1">
              <p className="dashCardTitle">All Users</p>
              <p className="dashCardNumber">{userChartData?.TotalCount}</p>
            </div>
            <div className="dashsmallContaineritem dashsmallContaineritem2">
              <p className="dashCardTitle">Today</p>
              <p className="dashCardNumber">{userChartData?.todayData}</p>
            </div>
          </div>

          <div className="mainDashLine"></div>
        </div>
        <div
          className="mainDashBoardContainerChild mainDashBoardContainerChild2"
          onClick={() => handleButtonClick("breakingNews")}
        >
          <UserOutlined className="dashCardIcon" />
          <div className="dashsmallContainer">
            <div className="dashsmallContaineritem dashsmallContaineritem1">
              <p className="dashCardTitle">All Breaking News</p>
              <p className="dashCardNumber">
                {BreakingNewsChartData?.TotalCount}
              </p>
            </div>
            <div className="dashsmallContaineritem dashsmallContaineritem2">
              <p className="dashCardTitle">Today</p>
              <p className="dashCardNumber">
                {BreakingNewsChartData?.todayData}
              </p>
            </div>
          </div>

          <div className="mainDashLine"></div>
        </div>

        <div
          className="mainDashBoardContainerChild mainDashBoardContainerChild3"
          onClick={() => handleButtonClick("topStories")}
        >
          <UserOutlined className="dashCardIcon" />
          <div className="dashsmallContainer">
            <div className="dashsmallContaineritem dashsmallContaineritem1">
              <p className="dashCardTitle">All Top Stories</p>
              <p className="dashCardNumber">
                {TopStoriesChartData?.TotalCount}
              </p>
            </div>
            <div className="dashsmallContaineritem dashsmallContaineritem2">
              <p className="dashCardTitle">Today</p>
              <p className="dashCardNumber">{TopStoriesChartData?.todayData}</p>
            </div>
          </div>

          <div className="mainDashLine"></div>
        </div>

        <div
          className="mainDashBoardContainerChild mainDashBoardContainerChild7"
          onClick={() => handleButtonClick("uploads")}
        >
          <UserOutlined className="dashCardIcon" />
          <div className="dashsmallContainer">
            <div className="dashsmallContaineritem dashsmallContaineritem1">
              <p className="dashCardTitle">All Uploads</p>
              <p className="dashCardNumber">{UploadChartData?.TotalCount}</p>
            </div>
            <div className="dashsmallContaineritem dashsmallContaineritem2">
              <p className="dashCardTitle">Today</p>
              <p className="dashCardNumber">{UploadChartData?.todayData}</p>
            </div>
          </div>

          <div className="mainDashLine"></div>
        </div>

        <div
          className="mainDashBoardContainerChild mainDashBoardContainerChild4"
          onClick={() => handleButtonClick("ads")}
        >
          <UserOutlined className="dashCardIcon" />
          <div className="dashsmallContainer">
            <div className="dashsmallContaineritem dashsmallContaineritem1">
              <p className="dashCardTitle">All Ads</p>
              <p className="dashCardNumber">{ADSChartData?.TotalCount}</p>
            </div>
            <div className="dashsmallContaineritem dashsmallContaineritem2">
              <p className="dashCardTitle">Today</p>
              <p className="dashCardNumber">{ADSChartData?.todayData}</p>
            </div>
          </div>

          <div className="mainDashLine"></div>
        </div>

        <div
          className="mainDashBoardContainerChild mainDashBoardContainerChild5"
          onClick={() => handleButtonClick("flashNews")}
        >
          <UserOutlined className="dashCardIcon" />
          <div className="dashsmallContainer">
            <div className="dashsmallContaineritem dashsmallContaineritem1">
              <p className="dashCardTitle">All Flash News</p>
              <p className="dashCardNumber">{FlashNewsChartData?.TotalCount}</p>
            </div>
            <div className="dashsmallContaineritem dashsmallContaineritem2">
              <p className="dashCardTitle">Today</p>
              <p className="dashCardNumber">{FlashNewsChartData?.todayData}</p>
            </div>
          </div>

          <div className="mainDashLine"></div>
        </div>

        <div
          className="mainDashBoardContainerChild mainDashBoardContainerChild6"
          onClick={() => handleButtonClick("stories")}
        >
          <UserOutlined className="dashCardIcon" />
          <div className="dashsmallContainer">
            <div className="dashsmallContaineritem dashsmallContaineritem1">
              <p className="dashCardTitle">All Visual Stories</p>
              <p className="dashCardNumber">{StoriesChartData?.TotalCount}</p>
            </div>
            <div className="dashsmallContaineritem dashsmallContaineritem2">
              <p className="dashCardTitle">Today</p>
              <p className="dashCardNumber">{StoriesChartData?.todayData}</p>
            </div>
          </div>

          <div className="mainDashLine"></div>
        </div>

        <div
          className="mainDashBoardContainerChild mainDashBoardContainerChild1"
          onClick={() => handleButtonClick("photos")}
        >
          <UserOutlined className="dashCardIcon" />
          <div className="dashsmallContainer">
            <div className="dashsmallContaineritem dashsmallContaineritem1">
              <p className="dashCardTitle">All Photos</p>
              <p className="dashCardNumber">{PhotosChartData?.TotalCount}</p>
            </div>
            <div className="dashsmallContaineritem dashsmallContaineritem2">
              <p className="dashCardTitle">Today</p>
              <p className="dashCardNumber">{PhotosChartData?.todayData}</p>
            </div>
          </div>

          <div className="mainDashLine"></div>
        </div>
        <div
          className="mainDashBoardContainerChild mainDashBoardContainerChild2"
          onClick={() => handleButtonClick("videos")}
        >
          <UserOutlined className="dashCardIcon" />
          <div className="dashsmallContainer">
            <div className="dashsmallContaineritem dashsmallContaineritem1">
              <p className="dashCardTitle">All Videos</p>
              <p className="dashCardNumber">{VideosChartData?.TotalCount}</p>
            </div>
            <div className="dashsmallContaineritem dashsmallContaineritem2">
              <p className="dashCardTitle">Today</p>
              <p className="dashCardNumber">{VideosChartData?.todayData}</p>
            </div>
          </div>

          <div className="mainDashLine"></div>
        </div>

        <div
          className="mainDashBoardContainerChild mainDashBoardContainerChild3"
          onClick={() => handleButtonClick("comment")}
        >
          <UserOutlined className="dashCardIcon" />
          <div className="dashsmallContainer">
            <div className="dashsmallContaineritem dashsmallContaineritem1">
              <p className="dashCardTitle">All Comments</p>
              <p className="dashCardNumber">{CommentChartData?.TotalCount}</p>
            </div>
            <div className="dashsmallContaineritem dashsmallContaineritem2">
              <p className="dashCardTitle">Today</p>
              <p className="dashCardNumber">{CommentChartData?.todayData}</p>
            </div>
          </div>

          <div className="mainDashLine"></div>
        </div>

        <div
          className="mainDashBoardContainerChild mainDashBoardContainerChild4"
          onClick={() => handleButtonClick("live")}
        >
          <UserOutlined className="dashCardIcon" />
          <div className="dashsmallContainer">
            <div className="dashsmallContaineritem dashsmallContaineritem1">
              <p className="dashCardTitle">All Live</p>
              <p className="dashCardNumber">{LiveChartData?.TotalCount}</p>
            </div>
            <div className="dashsmallContaineritem dashsmallContaineritem2">
              <p className="dashCardTitle">Today</p>
              <p className="dashCardNumber">{LiveChartData?.todayData}</p>
            </div>
          </div>

          <div className="mainDashLine"></div>
        </div>

        <div
          className="mainDashBoardContainerChild mainDashBoardContainerChild5"
          onClick={() => handleButtonClick("poll")}
        >
          <UserOutlined className="dashCardIcon" />
          <div className="dashsmallContainer">
            <div className="dashsmallContaineritem dashsmallContaineritem1">
              <p className="dashCardTitle">All Poll</p>
              <p className="dashCardNumber">{PollChartData?.TotalCount}</p>
            </div>
            <div className="dashsmallContaineritem dashsmallContaineritem2">
              <p className="dashCardTitle">Today</p>
              <p className="dashCardNumber">{PollChartData?.todayData}</p>
            </div>
          </div>

          <div className="mainDashLine"></div>
        </div>
        <div
          className="mainDashBoardContainerChild mainDashBoardContainerChild6"
          onClick={() => handleButtonClick("report")}
        >
          <UserOutlined className="dashCardIcon" />
          <div className="dashsmallContainer">
            <div className="dashsmallContaineritem dashsmallContaineritem1">
              <p className="dashCardTitle">All Report</p>
              <p className="dashCardNumber">{ReportChartData?.TotalCount}</p>
            </div>
            <div className="dashsmallContaineritem dashsmallContaineritem2">
              <p className="dashCardTitle">Today</p>
              <p className="dashCardNumber">{ReportChartData?.todayData}</p>
            </div>
          </div>

          <div className="mainDashLine"></div>
        </div>
        <div
          className="mainDashBoardContainerChild mainDashBoardContainerChild1"
          onClick={() => handleButtonClick("content")}
        >
          <UserOutlined className="dashCardIcon" />
          <div className="dashsmallContainer">
            <div className="dashsmallContaineritem dashsmallContaineritem1">
              <p className="dashCardTitle">All Category</p>
              <p className="dashCardNumber">{CategoryChartData?.TotalCount}</p>
            </div>
            <div className="dashsmallContaineritem dashsmallContaineritem2">
              <p className="dashCardTitle">Today</p>
              <p className="dashCardNumber">{CategoryChartData?.todayData}</p>
            </div>
          </div>

          <div className="mainDashLine"></div>
        </div>
        <div
          className="mainDashBoardContainerChild mainDashBoardContainerChild2"
          onClick={() => handleButtonClick("subCat")}
        >
          <UserOutlined className="dashCardIcon" />
          <div className="dashsmallContainer">
            <div className="dashsmallContaineritem dashsmallContaineritem1">
              <p className="dashCardTitle">All Sub-Category</p>
              <p className="dashCardNumber">{SubCatChartData?.TotalCount}</p>
            </div>
            <div className="dashsmallContaineritem dashsmallContaineritem2">
              <p className="dashCardTitle">Today</p>
              <p className="dashCardNumber">{SubCatChartData?.todayData}</p>
            </div>
          </div>

          <div className="mainDashLine"></div>
        </div>

        {CatArticlesChartData?.map((categroy, index) => (
          <div
            className={`mainDashBoardContainerChild mainDashBoardContainerChild${
              index ? index % 7 : 1
            }`}
            onClick={() => handleButtonClick(categroy.category)}
          >
            <UserOutlined className="dashCardIcon" />
            <div className="dashsmallContainer">
              <div className={`dashsmallContaineritem dashsmallContaineritem1`}>
                <p className="dashCardTitle">All Cat: {categroy.category}</p>
                <p className="dashCardNumber">{categroy?.TotalCount}</p>
              </div>
              <div className="dashsmallContaineritem dashsmallContaineritem2">
                <p className="dashCardTitle">Today</p>
                <p className="dashCardNumber">{categroy?.todayData}</p>
              </div>
            </div>

            <div className="mainDashLine"></div>
          </div>
        ))}

        <Modal
          title="Chart"
          visible={modalVisible}
          onCancel={() => setModalVisible(false)}
          footer={null}
        >
          {selectedChart === "user" && (
            <BarChart
              TotalCount={userChartData.TotalCount}
              data={userChartData.chartData}
            />
          )}
          {selectedChart === "breakingNews" && (
            <BarChart
              TotalCount={BreakingNewsChartData.TotalCount}
              data={BreakingNewsChartData.chartData}
            />
          )}
          {selectedChart === "topStories" && (
            <BarChart
              TotalCount={TopStoriesChartData.TotalCount}
              data={TopStoriesChartData.chartData}
            />
          )}
          {selectedChart === "uploads" && (
            <BarChart
              TotalCount={UploadChartData.TotalCount}
              data={UploadChartData.chartData}
            />
          )}
          {selectedChart === "ads" && (
            <BarChart
              TotalCount={ADSChartData.TotalCount}
              data={ADSChartData.chartData}
            />
          )}
          {selectedChart === "flashNews" && (
            <BarChart
              TotalCount={FlashNewsChartData.TotalCount}
              data={FlashNewsChartData.chartData}
            />
          )}
          {selectedChart === "stories" && (
            <BarChart
              TotalCount={StoriesChartData.TotalCount}
              data={StoriesChartData.chartData}
            />
          )}
          {selectedChart === "videos" && (
            <BarChart
              TotalCount={VideosChartData.TotalCount}
              data={VideosChartData.chartData}
            />
          )}
          {selectedChart === "photos" && (
            <BarChart
              TotalCount={PhotosChartData.TotalCount}
              data={PhotosChartData.chartData}
            />
          )}
          {selectedChart === "comment" && (
            <BarChart
              TotalCount={CommentChartData.TotalCount}
              data={CommentChartData.chartData}
            />
          )}
          {selectedChart === "live" && (
            <BarChart
              TotalCount={LiveChartData.TotalCount}
              data={LiveChartData.chartData}
            />
          )}
          {selectedChart === "poll" && (
            <BarChart
              TotalCount={PollChartData.TotalCount}
              data={PollChartData.chartData}
            />
          )}
          {selectedChart === "report" && (
            <BarChart
              TotalCount={ReportChartData.TotalCount}
              data={ReportChartData.chartData}
            />
          )}
          {selectedChart === "content" && (
            <BarChart
              TotalCount={CategoryChartData.TotalCount}
              data={CategoryChartData.chartData}
            />
          )}
          {selectedChart === "subCat" && (
            <BarChart
              TotalCount={SubCatChartData.TotalCount}
              data={SubCatChartData.chartData}
            />
          )}
          {CatArticlesChartData?.map((category) => (
            <>
              {selectedChart === category.category && (
                <BarChart
                  TotalCount={category.TotalCount}
                  data={category.chartData}
                />
              )}
            </>
          ))}
        </Modal>
      </div>
    </>
  );
};

export default MainDashBoard;

const BarChart = ({ data, TotalCount }) => {
  const options = {
    borderWidth: 2,
    borderColor: "rgba(0,0,0,1)",
    scales: {
      x: {
        type: "category",
        // stepSize: 1, // Set x-axis type to category
        grid: {
          display: false, // Optionally, hide the grid lines
        },
        ticks: {
          precision: 0, // Set precision to 0 for integer values
          stepSize: 1, // Set the step size to 1 to ensure only whole numbers are displayed
        },
      },
      y: {
        beginAtZero: true, // Start y-axis at zero
        ticks: {
          precision: 0, // Set precision to 0 for integer values
          stepSize: 1, // Set the step size to 1 to ensure only whole numbers are displayed
        },
      },
    },
  };

  return (
    <>
      <p className="dashCardTitle">Total :{TotalCount}</p>
      <Bar data={data} options={options} />
    </>
  );
};
