import { Space, Table, Tag } from "antd";

const OriginalImageGrid = ({ columns, data }) => (
  <Table columns={columns} dataSource={data} />
);
export default OriginalImageGrid;
