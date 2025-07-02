import { useNavigate } from "react-router-dom";
import Slider from "react-slick";

const ImageCard = ({
  fromVStrories = false,
  width,
  height,
  img,
  text,
  style,
  border,
  id,
  slug,
  dis,
}) => {
  const navigate = useNavigate();
  
  // Slider settings for 5-second autoplay
  const sliderSettings = {
    dots: true,
    infinite: true,
    autoplay: true,
    autoplaySpeed: 5000, // 5 seconds
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
  };

  return (
    <div
      className="image-box"
      style={{ width, height, borderRadius: border, cursor: "pointer" }}
      onClick={() => {
        if (dis === false) {
          return;
        } else {
          if (fromVStrories) {
            console.log("Visual story");
          } else {
            navigate(`/details/${slug}?id=${id}`);
          }
        }
      }}
    >
      {/* Conditional rendering based on img type */}
      {Array.isArray(img) && img.length > 1 ? (
        <Slider {...sliderSettings}>
          {img.map((imgSrc, index) => (
            <img
              key={index}
              src={imgSrc}
              alt=""
              style={{
                width: "100%",
                height: "100%",
                borderRadius: border,
                objectFit: "cover",
              }}
            />
          ))}
        </Slider>
      ) : (
        <img
          src={Array.isArray(img) ? img[0] : img} // Handles both array and single URL
          alt=""
          style={{
            width: "100%",
            height: "100%",
            borderRadius: border,
            objectFit: "cover",
          }}
        />
      )}

      {/* Text box below the image */}
      <div className="image-text-box">
        <div style={style}>{text}</div>
      </div>
    </div>
  );
};

export default ImageCard;
