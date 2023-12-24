"use server";
export async function getComment(videoId) {
  const apiUrl = "https://www.googleapis.com/youtube/v3/commentThreads";
  const apiKey = process.env.API_KEY;
  const url = `${apiUrl}?part=snippet&order=relevance&videoId=${videoId}&key=${apiKey}`;
  const accessToken = "";

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/json",
      },
    });
    if (!response.ok) {
      throw new Error(response.statusText);
    }
    const data = await response.json();
    const snippet = data.items.map((item) => item.snippet);
    // console.log(snippet);
    return snippet;
  } catch (error) {
    console.log(error.message);
  }
}

export async function getVideoInfo(videoId) {
  const apiUrl = "https://youtube.googleapis.com/youtube/v3/videos";
  const apiKey = process.env.API_KEY;
  const accessToken = "";

  const url = `${apiUrl}?part=snippet%2CcontentDetails%2Cstatistics&id=${videoId}&key=${apiKey}`;

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/json",
      },
    });
    if (!response.ok) {
      throw new Error(response.statusText);
    }
    const data = await response.json();
    const snippet = data.items.map((item) => item.snippet);
    return snippet[0];
  } catch (error) {
    console.log(error.message);
  }
}

export async function getChannelInfo(channelId) {
  const apiUrl = "https://youtube.googleapis.com/youtube/v3/channels";
  const apiKey = process.env.API_KEY;
  const url = `${apiUrl}?part=snippet%2CcontentDetails%2Cstatistics&id=${channelId}&key=${apiKey}`;
  const accessToken = "";
  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/json",
      },
    });
    if (!response.ok) {
      throw new Error(response.statusText);
    }
    const data = await response.json();
    const snippet = data.items.map((item) => item.snippet);
    // console.log(snippet[0]);
    return snippet[0];
  } catch (error) {
    console.log(error.message);
  }
}
