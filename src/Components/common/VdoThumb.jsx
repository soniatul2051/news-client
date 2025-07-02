import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { IoPlayCircleOutline } from "react-icons/io5";

const VdoThumb = ({ data, height }) => {
  // console.log("data from props : ", data);
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const title = data?.title?.replace(/[%.?]/g, "")?.split(" ")?.join("-");

  // Function to extract video ID from YouTube URL
  const extractVideoId = (url) => {
    const regex =
      /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/;
    const match = url?.match(regex);
    return match ? match[1] : null;
  };

  // Function to set the thumbnail URL based on the video ID or fallback to default image
  useEffect(() => {
    const videoId = extractVideoId(data?.link);

    if (videoId) {
      const maxResThumbnail = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;

      // Check if maxresdefault is available, otherwise fallback to default image
      const img = new Image();
      img.src = maxResThumbnail;
      img.onload = () => setThumbnailUrl(maxResThumbnail); // Use maxres if available
      img.onerror = () =>
        setThumbnailUrl(
          "https://d1csarkz8obe9u.cloudfront.net/posterpreviews/breaking-news-broadcast-youtube-thumbnail-design-template-d06ddc9f11789b47d62564e6e22a7730_screen.jpg?ts=1652194145"
        ); // Fallback to default thumbnail image
    } else {
      setThumbnailUrl(
        "https://d1csarkz8obe9u.cloudfront.net/posterpreviews/breaking-news-broadcast-youtube-thumbnail-design-template-d06ddc9f11789b47d62564e6e22a7730_screen.jpg?ts=1652194145"
      ); // Set default thumbnail if no video ID found
    }
  }, [data]);

  return (
    <div className=" overflow-hidden">
      <Link
        className={`${
          height ? "" : "p-1 rounded-lg"
        }  w-full h-full overflow-hidden flex flex-col`}
        to={`/videos/${title}?id=${data?._id}`}
      >
        <div
          className={` overflow-hidden p-1 w-full relative ${
            height ? `lg:h-[530px] rounded-3xl` : "h-full  rounded-3xl"
          }`}
        >
          <img
            style={{
              width: "100%",
              height: "100%",
              position: "relative",
              overflow: "hidden",
            }}
            src={thumbnailUrl}
            alt={data?.title}
          />
          <IoPlayCircleOutline
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
            }}
            className={`${
              height
                ? "lg:text-red-600 text-white text-7xl lg:text-8xl"
                : "text-white text-7xl"
            }`}
          />
          {height && (
            <div
              style={{
                // height: "3rem",
                backgroundColor: "rgba(75, 75, 75, 0.4)",
              }}
              className="absolute hidden lg:block  px-6 py-3 bottom-1 overflow-hidden backdrop-blur-sm w-[98.6%] mx-auto"
            >
              <span className="text-3xl font-semibold  text-white line-clamp-2">
                {data?.title}
              </span>
            </div>
          )}
        </div>

        <span
          style={{
            padding: "5px",
          }}
          className={`line-clamp-3 lg:h-[4.4rem]  text-lg font-semibold ${
            height ? "lg:hidden" : "block"
          } text-white`}
        >
          {data?.title}
        </span>
      </Link>
    </div>
  );
};

export default VdoThumb;
