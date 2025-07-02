import React from "react";
import YouTube from "react-youtube";

// Helper function to make iframes responsive
const makeIframeResponsive = (iframeHtml) => {
  if (!iframeHtml) return "";
  return iframeHtml.replace(
    /width="[^"]+" height="[^"]+"/,
    'width="100%" height="100%" style="position: absolute; top: 0; left: 0;"'
  );
};

// VideoPlayer Component
const VideoPlayer = ({ data }) => {
  const videoId = extractVideoId(data?.link);
  const isIframe = isIframeContent(data?.link);

  const opts = {
    playerVars: {
      autoplay: 0,
    },
  };

  return (
    <div className="w-full bg-green-600 h-390">
      <div
        className="relative w-full max-w-full mx-auto "
        style={{ paddingBottom: "56.25%" }}
      >
        {isIframe ? (
          <div
            className="absolute top-0 left-0 w-full h-full"
            dangerouslySetInnerHTML={{
              __html: makeIframeResponsive(data?.link),
            }}
          />
        ) : videoId ? (
          <YouTube
            className="absolute top-0 left-0 w-full h-full"
            videoId={videoId}
            opts={opts}
          />
        ) : (
          <p>Video not available</p>
        )}
      </div>
    </div>
  );
};

// Helper: Extract Video ID from Standard YouTube Links
const extractVideoId = (link) => {
  try {
    const embedMatch = link.match(/\/embed\/([a-zA-Z0-9_-]+)/);
    if (embedMatch) return embedMatch[1];
    const url = new URL(link);
    return url.searchParams.get("v") || null;
  } catch {
    return null;
  }
};

// Helper: Check if Content is an Iframe
const isIframeContent = (content) =>
  /<iframe.*src=".*youtube\.com/.test(content);

export default VideoPlayer;
