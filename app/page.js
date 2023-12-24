"use client";
import NavBar from "./components/NavBar";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { getComment, getChannelInfo, getVideoInfo } from "./action";
import Loading from "./components/Loading";
import ChannelInfo from "./components/ChannelInfo";
import VideoInfo from "./components/VideoInfo";
import EmotionResult from "./components/EmotionResult";
import Comments from "./components/Comments";

export default function Home() {
  const [videoUrl, setVideoUrl] = useState("");
  const { data: session } = useSession();
  const [comments, setComments] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [channel, setChannel] = useState({});
  const [video, setVideo] = useState({});
  const [result, setResult] = useState(null);
  const prefixUrl = "youtube.com/watch?v=";

  const cleanComment = (comment) => {
    const cleanedEmojis = comment.replace(/[\u{1F600}-\u{1F6FF}]/gu, "");
    const cleanedSpecialChars = cleanedEmojis.replace(/[^\w\s]/gi, "");
    return cleanedSpecialChars;
  };

  const exploreComments = async (comments) => {
    try {
      const data = await fetch(
        `${process.env.NEXT_PUBLIC_LOCAL_DEV_URL}/api/explore`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ comment_data: comments }),
        }
      );
      const result = await data.json();
      // console.log(data);
      return result;
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!videoUrl.includes(prefixUrl)) {
      return;
    }
    const videoId = videoUrl.split(prefixUrl)[1].split("&")[0];
    if (session) {
      setLoading(true);

      const commentsInfo = await getComment(videoId);
      const channelId = commentsInfo[0].channelId;
      const videoInfo = await getVideoInfo(videoId);
      const channelInfo = await getChannelInfo(channelId);

      setChannel(channelInfo);
      setVideo(videoInfo);

      const allComments = commentsInfo.map(
        (item) => item.topLevelComment.snippet.textDisplay
      );
      let cleanedComments = allComments.map((item) => cleanComment(item));
      setComments(cleanedComments);

      if (cleanedComments.length > 0) {
        const emotions = await exploreComments(cleanedComments);
        // console.log(emotions);
        setResult(emotions);
      }

      setVideoUrl("");
      setLoading(false);
    } else {
      alert("Please Sign In to Continue");
    }
  };

  return (
    <main className="bg-gradient-to-br from-main-purple flex flex-col min-h-screen text-black">
      <NavBar />
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white p-4 mx-6 my-12 font-mono rounded-2xl max-h-[720px]">
          <p className="m-4 text-[4rem] font-bold ">EmoTube Explorer</p>
          <p className="m-4 text-[1.5rem] ">
            Uncover the emotional pulse of Youtube comments
          </p>
          <p className="ml-4 mt-2 font-bold">By: Khanh Nguyen</p>

          <form onSubmit={handleSubmit}>
            <p className="ml-4 mt-12 text-[1.25rem">Insert Youtube Video URL</p>
            <input
              className="m-4 p-2 w-[60%] rounded-lg border-2 border-[#838181]"
              type="text"
              placeholder="https://www.youtube.com/watch?v=..."
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
            />
            {isLoading ? (
              <button
                className="m-4 p-2 rounded-lg border-2 border-[#838181]"
                type="submit"
              >
                <Loading />
              </button>
            ) : (
              <button
                className="m-4 p-2 rounded-lg font-sans border-2 border-[#838181]"
                type="submit"
              >
                Let's go
              </button>
            )}
          </form>
        </div>

        <div className="min-h-screen col-span-2 ">
          {isLoading ? (
            <div className="p-12">
              <Loading />
            </div>
          ) : (
            <div className="grid grid-cols-3  mt-16 ml-12 mr-24 rounded-md p-6 shadow-[2px_2px_2px_2px_rgba(0,0,0,0.3)]">
              <div className="col-span-2">
                <ChannelInfo channel={channel} />
                <VideoInfo video={video} />
              </div>

              <div className="mt-10">
                <p className="font-mono font-bold text-[1.25rem]">Result</p>
                <EmotionResult result={result} />
              </div>
            </div>
          )}

          <div className="ml-12 mt-8">
            <p className="font-mono font-bold text-2xl">
              Source of the result:
            </p>
            <Comments comments={comments} result={result} />
          </div>
        </div>
      </div>
    </main>
  );
}
