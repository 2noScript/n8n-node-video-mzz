# n8n-nodes-video-mzz

This node provides simple yet powerful tools for **cutting and editing videos** directly within your workflow.  
It is optimized for **short-form content** and works best with videos **under 15 minutes**.  

Perfect for editing clips from platforms like:  
- YouTube Shorts  
- TikTok  
- Facebook Reels  
- Instagram Reels  
- Douyin  
- and other short-form video formats.  

With multiple cutting options (by range, duration, intervals, or keeping/removing specific segments),  
you can quickly prepare videos for publishing, sharing, or further processing.  


# ✂️ Cut Options  

The node supports several modes for cutting videos. You can select **only one mode** at a time.  

| Option | Description |
|--------|-------------|
| **By Range (Start–End)** (`range`) | Cut a segment based on **start time** and **end time** (e.g., from 00:01:00 to 00:02:30). |
| **By Duration** (`duration`) | Cut a segment with a **fixed length** starting from a position (e.g., take 30 seconds from 00:05:00). |
| **Keep Segments (Multiple)** (`keep`) | Keep multiple specified segments (e.g., [00:00–01:00], [02:00–03:00]) and merge them into the output. |
| **Remove Segments (Return leftovers)** (`remove`) | Remove the specified segments and keep the rest of the video (e.g., remove [01:00–02:00], output will contain everything before and after). |
| **Split by Interval** (`interval`) | Split the video into multiple equal segments based on a **time interval** (e.g., split a 10-minute video into 1-minute chunks). |
| **Split by Count** (`count`) | Split the video into **N equal parts** (e.g., split a 12-minute video into 4 segments = 3 minutes each). |

---

👉 Notes:  
- Only **one option** can be selected at a time.  
- To combine different cutting strategies, use **multiple nodes** in your workflow.  

