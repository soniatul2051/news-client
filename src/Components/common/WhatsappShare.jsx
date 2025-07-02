// import React from "react";
// import { FaWhatsapp } from "react-icons/fa";

// const WhatsappShareBtn = ({ title, slug, imageUrl }) => {
//   const shareUrl = `${window.location.origin}/${slug}`;

//   // Create the WhatsApp message text
//   const whatsappMessage = `*${title}*\n\nCheck this out: ${shareUrl}\n\nImage: ${imageUrl}`;

//   // WhatsApp URL with the encoded message
//   const whatsappShareUrl = `https://wa.me/?text=${encodeURIComponent(
//     whatsappMessage
//   )}`;

//   return (
//     <div className="flex space-x-4 mt-4">
//       {/* WhatsApp Share Button */}
//       <a
//         href={whatsappShareUrl}
//         target="_blank"
//         rel="noopener noreferrer"
//         className="p-2 bg-green-500 rounded-full text-white hover:bg-green-600 transition"
//       >
//         <FaWhatsapp size={20} />
//       </a>
//     </div>
//   );
// };

// export default WhatsappShareBtn;
