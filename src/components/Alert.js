import { message, Modal } from "antd";

const {confirm} = Modal;
export const successAlert = (des="Todo added successfully") => {
  setTimeout(() => {
    message.success(des);
  }, 1500);
};

export const deleteAlert = () => {
  setTimeout(() => {
    message.success("Todo deleted successfully");
  }, 1500);
};

export const warningAlert = (des) => {
  setTimeout(() => {
    message.warning(des);
  }, 1500);
};

export const showDeleteConfirm = (id, deleteRow) => {
    confirm({
      title: 'Are you sure delete this TODO?',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk() {
        deleteRow(id);
        deleteAlert();
      }
    });
};
