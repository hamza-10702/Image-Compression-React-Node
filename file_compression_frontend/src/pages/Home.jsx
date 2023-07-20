import React, { useState, useEffect } from "react";
import {
  InboxOutlined,
  DeleteOutlined,
  FileImageOutlined,
} from "@ant-design/icons";
import { message, Upload } from "antd";
import {
  UploadOutlined,
  UserOutlined,
  DownloadOutlined,
} from "@ant-design/icons";
import { Button, Input, Space } from "antd";
import { postImages, getImages } from "../helper/api";
import OriginalImageGrid from "../component/originalImage";

const Home = () => {
  const { Dragger } = Upload;
  const [files, setFiles] = useState([]);
  const [previewImage, setPreviewImage] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [data, setData] = useState([]);
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [apiRespone, setApiResponse] = useState(null);

  const deleteFile = (id) => {
    setFiles(files?.filter((f) => f.uid !== id));
  };

  const previewFile = (file) => {
    setPreviewImage(file?.originFileObj);
  };

  const handleFileUpload = ({ fileList }) => {
    setError("");
    setFiles(fileList);
  };

  useEffect(() => {
    const timeOutId = setTimeout(() => {
      setApiResponse(null);
    }, 3000);

    return () => clearTimeout(timeOutId);
  }, [apiRespone]);

  const sendImages = async () => {
    if (files?.length === 0 || email === "") {
      setError("Require all Fields...");
      return;
    }

    const formData = new FormData();
    formData.append("email", email);
    for (let file of files) {
      formData.append("images", file.originFileObj);
    }
    localStorage.setItem("email_image", email);
    setLoading(true);

    const data = await postImages("/image", formData);
    if (data) {
      setApiResponse({ message: data.message });
    }

    setLoading(false);
  };

  const downloadImage = (file) => {
    try {
      fetch(file?.url)
        .then((response) => response.arrayBuffer())
        .then((buffer) => {
          const blob = new Blob([buffer], {
            type: "image/png",
          });
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute(
            "download",
            file?.original_filename + file?.asset_id
          );
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        })
        .catch((error) => {
          console.error("Error downloading image:", error);
        });
    } catch (error) {
      return error;
    }
  };

  const getImageApi = async () => {
    try {
      setFetching(true);
      const email = localStorage.getItem("email_image");
      const data = await getImages(`/image?email=${email}`);

      console.log(data);
      if (data?.data) {
        setData(data?.data?.links);
        localStorage.removeItem("email_image");
      } else {
        setApiResponse({ error: data?.error });
      }
    } catch (error) {
      setError(error);
    }
    setFetching(false);
  };

  const orginalImageColumns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      align: "left",
    },
    {
      title: "Image Type",
      dataIndex: "type",
      key: "type",
      align: "left",
    },
    {
      title: "Image Size",
      dataIndex: "size",
      key: "size",
      align: "left",
      render: (text) => <p>{(text / 1024).toFixed(2)} kb</p>,
    },

    {
      title: "Action",
      key: "action",
      align: "left",
      render: (_, record) => {
        return (
          <Space size="middle">
            <DeleteOutlined
              onClick={() => {
                deleteFile(record?.uid);
              }}
            />
            <FileImageOutlined
              onClick={() => {
                previewFile(record);
              }}
            />
          </Space>
        );
      },
    },
  ];
  const compressImageColumns = [
    {
      title: "Cloud ID",
      dataIndex: "asset_id",
      key: "asset_id",
      align: "left",
    },
    {
      title: "Image URL",
      dataIndex: "url",
      key: "url",
      align: "left",
      render: (text) => {
        return (
          <a href={text} target="_blank">
            {text}
          </a>
        );
      },
    },
    {
      title: "Image Size",
      dataIndex: "bytes",
      key: "bytes",
      align: "left",
      render: (text) => <p>{text && (text / 1024).toFixed(2)} kb</p>,
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      align: "left",
      render: (text) => <p>{text && text.split("T")[0]}</p>,
    },

    {
      title: "Action",
      key: "action",
      align: "left",
      render: (_, record) => {
        return (
          <Space size="middle">
            <DeleteOutlined
              onClick={() => {
                setData(data?.filter((d) => d.asset_id !== record.asset_id));
              }}
            />
            <DownloadOutlined
              onClick={() => {
                downloadImage(record);
              }}
            />
          </Space>
        );
      },
    },
  ];

  return (
    <div className="container">
      <div className="main__home">
        <h1>Compress Image Quality</h1>
        <div className="top_section">
          <div>
            <Input
              size="large"
              placeholder="Enter Email"
              prefix={<UserOutlined />}
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError("");
              }}
            />
            <Dragger
              multiple={true}
              name="file"
              onChange={handleFileUpload}
              fileList={files}
            >
              <p className="ant-upload-drag-icon">
                <InboxOutlined style={{ color: "black" }} />
              </p>
              <p className="ant-upload-text">
                Click or drag file to this area to upload
              </p>
              <p className="ant-upload-hint">
                Support for a single or bulk upload. Strictly prohibited from
                uploading company data or other banned files.
              </p>
            </Dragger>
            <div className="upload_container">
              <Button
                icon={<UploadOutlined />}
                size="middle"
                onClick={sendImages}
              >
                {loading ? "Uploading..." : "Upload Images"}
              </Button>
              <p style={{ color: "red" }}>{error}</p>
            </div>
          </div>
          <div>
            <OriginalImageGrid columns={orginalImageColumns} data={files} />
          </div>
        </div>
        {previewImage !== "" && (
          <span
            style={{
              position: "absolute",

              background: "white",
              // border: "10px solid gray",
            }}
          >
            <h3
              style={{
                color: "white",
                background: "black",
                padding: "5px",
                right: "10px",
                top: "15px",
                cursor: "pointer",
                position: "absolute",
              }}
              onClick={() => {
                setPreviewImage("");
              }}
            >
              X
            </h3>
            <img
              style={{
                maxWidth: "500px",
                maxHeight: "500px",
              }}
              src={` ${
                previewImage !== "" ? URL.createObjectURL(previewImage) : null
              }`}
              alt=""
            />
          </span>
        )}

        <div className="display_images">
          {apiRespone !== null && apiRespone?.message ? (
            <span style={{ color: "green" }}>{apiRespone?.message}</span>
          ) : (
            <span style={{ color: "red" }}>{apiRespone?.error}</span>
          )}
          <div>
            <div className="fetch_button">
              <h3>{fetching ? "Processing..." : "Compressed Images"}</h3>
              <Button size="middle" onClick={getImageApi}>
                {fetching ? "Loading..." : "Get Images"}
              </Button>
            </div>
            <OriginalImageGrid columns={compressImageColumns} data={data} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
