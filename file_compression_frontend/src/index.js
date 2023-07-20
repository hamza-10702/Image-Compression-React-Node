import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// import React, { useState } from "react";
// import {
//   InboxOutlined,
//   DeleteOutlined,
//   FileImageOutlined,
// } from "@ant-design/icons";
// import { message, Upload } from "antd";
// import {
//   UploadOutlined,
//   UserOutlined,
//   DownloadOutlined,
// } from "@ant-design/icons";
// import { Button, Input } from "antd";
// import { postImages, getImages } from "../helper/api";
// import OriginalImageGrid from "../component/originalImage";

// const Home = () => {
//   const { Dragger } = Upload;
//   const [files, setFiles] = useState([]);
//   const [previewImage, setPreviewImage] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [data, setData] = useState([]);
//   const [error, setError] = useState("");

//   const deleteFile = (id) => {
//     setFiles(files?.filter((f) => f.uid !== id));
//   };

//   const previewFile = (file) => {
//     setPreviewImage(file?.originFileObj);
//   };

//   const handleFileUpload = ({ fileList }) => {
//     setFiles(fileList);
//   };

//   const sendImages = async () => {
//     if (files?.length === 0) {
//       setError("No Image Found");
//       return;
//     }
//     const formData = new FormData();
//     for (let file of files) {
//       formData.append("images", file.originFileObj);
//     }
//     setLoading(true);
//     const data = await postImages("/image", formData);
//     if (data) {
//       setData(data.urls);
//     }
//     setLoading(false);
//   };

//   const downloadImage = (file) => {
//     try {
//       fetch(file?.url)
//         .then((response) => response.arrayBuffer())
//         .then((buffer) => {
//           const blob = new Blob([buffer], {
//             type: "image/png",
//           });
//           const url = window.URL.createObjectURL(blob);
//           const link = document.createElement("a");
//           link.href = url;
//           link.setAttribute("download", file?.original_filename);
//           document.body.appendChild(link);
//           link.click();
//           document.body.removeChild(link);
//         })
//         .catch((error) => {
//           console.error("Error downloading image:", error);
//         });
//     } catch (error) {
//       return error;
//     }
//   };

//   return (
//     <div className="container">
//       <div className="main__home">
//         <h1>Compress Image Quality</h1>
//         <div className="top_section">
//           <div>
//             <Input
//               size="large"
//               placeholder="Enter Email"
//               prefix={<UserOutlined />}
//             />
//             <Dragger
//               multiple={true}
//               name="file"
//               onChange={handleFileUpload}
//               fileList={files}
//             >
//               <p className="ant-upload-drag-icon">
//                 <InboxOutlined style={{ color: "black" }} />
//               </p>
//               <p className="ant-upload-text">
//                 Click or drag file to this area to upload
//               </p>
//               <p className="ant-upload-hint">
//                 Support for a single or bulk upload. Strictly prohibited from
//                 uploading company data or other banned files.
//               </p>
//             </Dragger>
//             <div className="upload_container">
//               <Button
//                 icon={<UploadOutlined />}
//                 size="middle"
//                 onClick={sendImages}
//               >
//                 {loading ? "Uploading..." : "Upload Images"}
//               </Button>
//             </div>
//           </div>
//           <div>
//             {/* <h2>Original Images</h2> */}
//             <OriginalImageGrid />
//           </div>
//         </div>
//         {previewImage !== "" && (
//           <span
//             style={{
//               position: "absolute",

//               background: "white",
//               border: "10px solid gray",
//             }}
//           >
//             <h3
//               style={{
//                 color: "white",
//                 background: "black",
//                 padding: "5px",
//                 right: "0px",
//                 cursor: "pointer",
//                 position: "absolute",
//               }}
//               onClick={() => {
//                 setPreviewImage("");
//               }}
//             >
//               X
//             </h3>
//             <img
//               style={{
//                 maxWidth: "300px",
//                 maxHeight: "300px",
//               }}
//               src={` ${
//                 previewImage !== "" ? URL.createObjectURL(previewImage) : null
//               }`}
//               alt=""
//             />
//           </span>
//         )}

//         {files?.length > 0 ? (
//           <div className="display_images">
//             <div className="left_display">
//               <table>
//                 <caption>Original Images</caption>
//                 {/* <thead>
//                   <tr>
//                     <th> No.</th>
//                     <th> Name</th>
//                     <th> Size</th>
//                     <th> Type</th>
//                     <th>Action</th>
//                   </tr>
//                 </thead> */}
//                 <tbody>
//                   {files?.length > 0 &&
//                     files?.map((file, index) => {
//                       return (
//                         <tr>
//                           <td>{index + 1}</td>
//                           <td>{file?.name.split(".")[0]}</td>
//                           <td>{(file?.size / 1024).toFixed(2)} Kb</td>
//                           <td>{file?.type.split("/")[1]}</td>
//                           <td>
//                             <div>
//                               <DeleteOutlined
//                                 onClick={() => {
//                                   deleteFile(file?.uid);
//                                 }}
//                               />
//                               <FileImageOutlined
//                                 onClick={() => {
//                                   previewFile(file);
//                                 }}
//                               />
//                             </div>
//                           </td>
//                         </tr>
//                       );
//                     })}
//                 </tbody>
//               </table>
//             </div>
//             <div className="center"></div>
//             <div className="right_display">
//               <table>
//                 <caption>Compressed Images</caption>
//                 {/* <thead>
//                   <tr>
//                     <th> No.</th>
//                     <th> Name</th>
//                     <th> Size</th>
//                     <th> Type</th>
//                     <th>Action</th>
//                   </tr>
//                 </thead> */}
//                 <tbody>
//                   {data?.length > 0 &&
//                     data?.map((file, index) => {
//                       return (
//                         <tr key={file?.asset_id}>
//                           <td>{index + 1}</td>
//                           <td>
//                             <a href={file?.url} target="_blank">
//                               {file?.url}
//                             </a>
//                           </td>
//                           <td>{(file?.bytes / 1024).toFixed(2)} Kb</td>

//                           <td>
//                             <div>
//                               <DeleteOutlined
//                                 onClick={() => {
//                                   deleteFile(file?.uid);
//                                 }}
//                               />
//                               <DownloadOutlined
//                                 onClick={() => {
//                                   downloadImage(file);
//                                 }}
//                               />
//                             </div>
//                           </td>
//                         </tr>
//                       );
//                     })}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         ) : (
//           <div>
//             <p style={{ fontSize: "20px", color: "red" }}>No Image Found</p>
//           </div>
//         )}
//       </div>
//       {/* <img
//         src={`${files.length > 0 ? URL.createObjectURL(files[0]) : null}`}
//         alt="NoImage"
//       /> */}
//     </div>
//   );
// };

// export default Home;
