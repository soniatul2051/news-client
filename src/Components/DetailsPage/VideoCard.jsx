import React from 'react'
import { BsPlayCircle } from 'react-icons/bs'
import img1 from "../../assets/img-10.png";
import { useNavigate } from 'react-router-dom';

const DetailsVideoCard = ({data}) => {
  const navigate = useNavigate()
  let title = data?.title.replace(/[%.?]/g, "").split(" ").join("-");
  if(data && data.slug){
    title = data.slug
  }

  return (
    <div className="Detail-video-card-main-box" onClick={()=>navigate(`/videos/${title}?id=${data?._id}`)}>
      <div className="Detail-video-card" >
        <video style={{objectFit:"cover"}} src={data?.image} alt="" className="Detail-video-card-img" />
        <div className="Detail-video-card-length">
          <BsPlayCircle style={{ marginRight: "3px" }} /> 8:15
        </div>
      </div>
      <div className="Detail-video-card-text" >
      {data?.title} 
      </div>
    </div>
  )
}

export default DetailsVideoCard