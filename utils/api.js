import axios from 'axios';

const get_headers = (token=None, content_type="application/json") => {
    let headers= {"Content-Type": content_type, "User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.11 (KHTML, like Gecko) Chrome/23.0.1271.64 Safari/537.11", "Authorization": token}
    return headers;
}

export const discord_api = async () => {
    let content = {}
    let options = {
        method: "GET",
        url: `https://discord.com/api/v9/channels/${process.env.CHANNEL_ID}/messages?limit=1`,
        headers: get_headers(process.env.USER_TOKEN),
      };
  
    let res = (await axios.request(options)).data[0];

    let time = new Date(res.timestamp)
    time = time.getTime()

    // if(lastTime < time) {
        content = res.content
    // }
    
    return content;
}

export default discord_api;