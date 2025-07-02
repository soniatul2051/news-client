import { AutoComplete, Input } from "antd";
import { IoIosCloseCircle } from "react-icons/io";
import { useNavigate } from "react-router-dom";

const NewSearchModel = ({ closeModel, autoList }) => {
  const navigation = useNavigate();

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0,0,0,0.2)",
        position: "fixed",
        zIndex: 9999,
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
      }}
    >
      <div
        style={{
          maxWidthwidth: "300px",
          padding: "10px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <AutoComplete
            style={{
              width: "70%",
              marginTop: 88,
            }}
            options={autoList}
            filterOption={(inputValue, option) =>
              option.value?.toUpperCase().indexOf(inputValue.toUpperCase()) !==
              -1
            }
          >
            <Input.Search
              autoFocus
              size="large"
              placeholder="Search"
              enterButton
              onSearch={(e) => {
                navigation(`itempage?item=${e}`);
                closeModel();
              }}
            />
          </AutoComplete>
          <div style={{}}>
            <IoIosCloseCircle
              onClick={closeModel}
              size={55}
              style={{
                padding: "10px",
                marginLeft: 20,
                marginTop: 79,
                cursor: "pointer",
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewSearchModel;
