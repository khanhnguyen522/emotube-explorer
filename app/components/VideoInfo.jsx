import React from "react";

const VideoInfo = ({ video }) => {
  return (
    <div className="mt-12 ml-12 flex-col justify-center gap-4">
      <img
        src={video?.thumbnails?.maxres.url}
        alt=""
        className="object-cover w-[420px] rounded-md"
      />
      <p className="mt-4 font-bold text-[1.25rem]">{video?.title}</p>
    </div>
  );
};

export default VideoInfo;
