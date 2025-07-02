import React, { useEffect, useRef, useState } from "react";
import "./style/index.css";
import { BsPlayCircle } from "react-icons/bs";
import img1 from "../../assets/img-1.png";
import { useNavigate } from "react-router-dom";
import { PlayCircleOutlined } from "@ant-design/icons";

// isMain = videoGalleryCenter
// fromVideoGallery = false means from articles section

const VideoCard = ({
  isMain,
  color,
  height,
  width,
  width2,
  data,
  fromVideoGallery,
}) => {
  const navigate = useNavigate();

  // let title = data?.title.split(" ").join("-");
  let title = data?.title.replace(/[%.?]/g, "").split(" ").join("-");

  function renderTextBox(params) {
    if (isMain) {
      return (
        <div
          className="video-center-card-text"
          style={{ color, position: "absolute", bottom: "0px", width: "100%" }}
        >
          {!data &&
            `Watch -{" "}"Pagal Hai Kya": Rohit's Chat With Gill Has Internet Talking`}

          {data && `Watch - ${data.title.substring(0, 70)}... `}
        </div>
      );
    }
    return (
      <div className="video-card-text" style={{ color }}>
        Watch -{" "}
        {data ? data.title : `Rohit's Chat With Gill Has Internet Talking`}
      </div>
    );
  }
  return (
    <div
      className={
        !isMain
          ? "video-card-main-box"
          : "video-card-main-box video-card-main-center-box "
      }
      style={{
        position: "relative",
        overflow: "hidden",
        // backgroundColor: "red",
      }}
      onClick={() => {
        if (!fromVideoGallery) {
          //!fromvideogallery means video articles
          navigate(`/videos/${title}?id=${data?._id}`);
        } else {
          navigate(`/videos2/${title}?id=${data?._id}`, { state: data });
        }
      }}
    >
      <div
        className={!isMain ? "video-card" : "video-card video-card-center"}
        // style={{ height, width }}
        // style={{ height }}
      >
        {data ? (
          data.image ? (
            <video
              // style={{width,height}}
              // style={{height}}
              className={
                !isMain
                  ? "video-card-img"
                  : "video-card-img video-card-img-center"
              }
              // autoPlay={true}
            >
              <source src={data.url} />
            </video>
          ) : (
            <iframe
              className="video video-card-img"
              title="Youtube player"
              sandbox="allow-same-origin allow-forms allow-popups allow-scripts allow-presentation"
              src={data?.link}
              // width={"300px"}
              // height={"200px"}
            ></iframe>
          )
        ) : (
          <img
            src={data?.image ? data.image : "video"}
            style={{ height, width }}
            alt=""
            className="video-card-img"
          />
        )}
        {!data && (
          <div className="video-card-length">
            <BsPlayCircle style={{ marginRight: "3px" }} />
          </div>
        )}
        {isMain ? (
          <PlayCircleOutlined
            style={{
              borderRadius: "100%",
              position: "absolute",
              backgroundColor: "transparent",
              top: "50%",
              left: "50%",
              fontSize: "80px",
              color: "red",
              translate: "-50% -50%",
            }}
          />
        ) : null}
      </div>
      {renderTextBox()}
    </div>
  );
};

export default VideoCard;

// import React, { useEffect, useRef, useState } from "react";
// import "./style/index.css";
// import { BsPlayCircle } from "react-icons/bs";
// import img1 from "../../assets/img-1.png";
// import { useNavigate } from "react-router-dom";

// // isMain = videoGalleryCenter
// // fromVideoGallery = false means from articles section

// const VideoCard = ({ isMain,color, height, width, width2, data,fromVideoGallery }) => {
//   const navigate = useNavigate();

//   // let title = data?.title.split(" ").join("-");
//   let title = data?.title.replace(/[%.?]/g, "").split(" ").join("-");
//   const [controls,setControls] = useState(false)
//   const videoCardRef = useRef(null);

//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (videoCardRef.current && !videoCardRef.current.contains(event.target)) {
//         setControls(false);
//       }
//     };

//     document.addEventListener('mousehover', handleClickOutside);
//     return () => {
//       document.removeEventListener('mousehover', handleClickOutside);
//     };
//   }, []);

//   function renderTextBox(params) {
//     if(isMain){
//       if(controls){
//         return ""
//       }else{
//         return (<div className="video-center-card-text" style={{ color ,position:"absolute",bottom:"0px",width:"100%"}}>
//           {(!data ) && `Watch -{" "}"Pagal Hai Kya": Rohit's Chat With Gill Has Internet Talking` }

//           {(data ) && `Watch - ${data.title.substring(0,70)}... `}

//         </div>)

//       }
//     }
//     return (
//       <div className="video-card-text" style={{ color }}>
//           Watch -{" "}
//           {data
//             ? data.title
//             : `"Pagal Hai Kya": Rohit's Chat With Gill Has Internet Talking`}
//       </div>

//     )

//   }
//   return (
//     <div
//     ref={videoCardRef}
//     onEnded={()=>{setControls(false)}}
//       className={!isMain?"video-card-main-box":"video-card-main-box video-card-main-center-box"}
//       style={{position:"relative" ,overflow:"hidden"}}
//       onClick={() => {
//         if(!fromVideoGallery){
//           navigate(`/videos/${title}?id=${data?._id}`)
//         }else{
//           setControls(true)
//         }

//       }}
//     >
//       <div className={!isMain?"video-card":"video-card video-card-center"}
//       // style={{ height, width }}
//       // style={{ height }}
//       >
//         {data ? (
//           <video
//           // style={{width,height}}
//           // style={{height}}
//            controls={controls}
//            className={!isMain?"video-card-img":"video-card-img video-card-img-center"}
//           //  autoPlay={true}
//            >
//             <source  src={data.image} />
//           </video>
//         ) : (
//           <img
//             src={img1}
//             style={{ height, width }}
//             alt=""
//             className="video-card-img"
//           />
//         )}
//         {!data && (
//           <div className="video-card-length">
//             <BsPlayCircle style={{ marginRight: "3px" }} />
//           </div>
//         )}
//       </div>
//       {renderTextBox()}

//     </div>
//   );
// };

// export default VideoCard;
