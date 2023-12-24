import React from "react";

const ChannelInfo = ({ channel }) => {
  return (
    <div className="mt-12 ml-12 flex items-center gap-4  p-2 rounded-md w-[80%] shadow-[2px_2px_2px_2px_rgba(0,0,0,0.3)]">
      <img
        src={channel?.thumbnails?.default.url}
        alt={channel?.title}
        className="w-12 h-12 object-contain rounded-[50%]"
      />
      <p className="font-bold text-[1.25rem]">{channel?.title}</p>
    </div>
  );
};

export default ChannelInfo;
