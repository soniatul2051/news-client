import React from "react";
import {
  FacebookShareButton,
  TwitterShareButton,
  WhatsappShareButton,
} from "react-share";
import { FaFacebookF, FaTwitter, FaWhatsapp } from "react-icons/fa"; // Import icons

const SocialShareButtons = ({ title, slug, imageUrl }) => {
  const shareUrl = `${window.location.origin}/${slug}`;

  return (
    <div className="flex space-x-4 mt-4">
      {/* Facebook Share */}
      <FacebookShareButton url={shareUrl} quote={title} hashtag="#news">
        <div className="p-2 bg-blue-600 rounded-full text-white hover:bg-blue-700 transition">
          <FaFacebookF size={20} /> {/* Using react-icons */}
        </div>
      </FacebookShareButton>

      {/* Twitter Share */}
      <TwitterShareButton url={shareUrl} title={title}>
        <div className="p-2 bg-blue-400 rounded-full text-white hover:bg-blue-500 transition">
          <FaTwitter size={20} /> {/* Using react-icons */}
        </div>
      </TwitterShareButton>

      {/* WhatsApp Share */}
      <WhatsappShareButton url={shareUrl} title={title} separator=":: ">
        <div className="p-2 bg-green-500 rounded-full text-white hover:bg-green-600 transition">
          <FaWhatsapp size={20} /> {/* Using react-icons */}
        </div>
      </WhatsappShareButton>
    </div>
  );
};

export default SocialShareButtons;
