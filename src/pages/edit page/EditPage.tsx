import "./editpage.css";
import { useLocation } from "react-router-dom";
import { ReceiptService } from "../../services/ReceiptService";
import { useEffect, useState } from "react";
import Spreadsheet from "react-spreadsheet";
import { Container, Select, MenuItem, Button, Grid } from "@mui/material";
import "./editpage.css";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import { useNavigate } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import SaveAsIcon from "@mui/icons-material/SaveAs";
import React from "react";
import CircularProgress from "@mui/material/CircularProgress";

export default function EditPage() {
  const location = useLocation();
  const selectedImage = location.state.selectedImage;
  const typeReceipt = location.state.typeOfReceipt;

  const [typeOfReceipt, setTypeOfReceipt] = useState("");

  const receiptService = new ReceiptService();
  let count: number = 0;

  // create hook
  const navigate = useNavigate(); // useNavigate hook
  const handleFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files && event.target.files[0];
    if (file) {
      //setImageName(file.name);
      //setSelectedImage(file);

      setDataExcel([]);
      navigate("/edit", {
        state: { selectedImage: file, typeOfReceipt: typeOfReceipt },
      });
    }
  };

  const [dataExcel, setDataExcel] = useState([
    //[{ value: "A" }, { value: "B" }, { value: "C" }, { value: "D" }, { value: 'E' }],
    //[{ value: "A" }, { value: "B" }, { value: "C" }, { value: "D" }, { value: 'E' }],//jklmnopqrstuvwxyz
    //[{ value: "A" }, { value: "B" }, { value: "C" }, { value: "D" }, { value: 'E' }],
    //[{ value: "A" }, { value: "B" }, { value: "C" }, { value: "D" }, { value: 'E' }],
    //[{ value: "A" }, { value: "B" }, { value: "C" }, { value: "D" }, { value: 'E' }],
    //[{ value: "A" }, { value: "B" }, { value: "C" }, { value: "D" }, { value: 'E' }],
  ]);
  // update ข้อมูลใหม่ทุกครั้งเมื่อมีการคีย์ข้อมูลใน Spreadsheet
  function setnewdata(newData: SetStateAction<{ value: string }[][]>) {
    console.log(newData[0][1]["value"]);
    // console.log(newData);
    setDataExcel(newData);
  }

  // เพิ่มแถวใหม่ใน Spreadsheet
  function addRow() {
    // เราสร้างอ็อบเจ็กต์ใหม่ของข้อมูลโดยใช้ ...data เพื่อคัดลอกข้อมูลที่มีอยู่ และเพิ่มแถวใหม่เข้าไปที่สุดของอาร์เรย์ด้วย [{ value: "A" ...
    const newRow = dataExcel[0].map((cell) => ({ value: "" })); // สร้างแถวใหม่โดยมีค่าว่างในแต่ละเซลล์
    setDataExcel([...dataExcel, newRow]); // เพิ่มแถวใหม่ลงในข้อมูล
  }

  // เพิ่มคอลัมน์ใหม่ใน Spreadsheet
  function addColumn() {
    const newColumn = dataExcel.map((row) => [...row, { value: "" }]); // เพิ่มเซลล์ใหม่ลงในทุกแถว
    setDataExcel(newColumn); // ตั้งค่าข้อมูลใหม่
  }

  function selectData() {
    console.log(dataExcel);
  }

  function deleteRow() {
    // รับข้อมูลที่เป็นอาร์เรย์ใหม่ที่ไม่รวมแถวสุดท้ายออกมา
    const newData = dataExcel.slice(0, -1); // สร้างอาร์เรย์ใหม่โดยไม่รวม row สุดท้าย
    setDataExcel(newData);
  }

  function deleteColumn() {
    // เข้าถึง แถวทุกแถว และทำการสร้างอาร์เรย์ใหม่โดยไม่รวม column สุดท้าย
    const newData = dataExcel.map((row) => row.slice(0, -1));
    setDataExcel(newData);
  }

  function setNewTypeofImage(type: string) {
    setDataExcel([]);
    setTypeOfReceipt(type);
    navigate("/edit", {
      state: { selectedImage: selectedImage, typeOfReceipt: type },
    });
  }

  async function saveDataAsCSV() {
    console.log(dataExcel);
    const response = await receiptService.saveDataAsCSV(dataExcel);
    console.log(response.data);

    const bom = "\uFEFF";
    const blob = new Blob([bom + response.data], {
      type: "text/csv;charset=utf-8",
    });

    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "Receipt.csv";
    link.type = "text/csv;charset=utf-8";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  useEffect(() => {
    setTypeOfReceipt(typeReceipt);
    if (count == 0) {
      if (typeReceipt == "BigC") {
        const loadDataAsync = async () => {
          const response = await receiptService.getBigCReceiptInformation(
            selectedImage
          );

          const maxColumns = Math.max(
            ...response.result.map((item) => Object.keys(item).length)
          );
          const newData = response.result.map((item) => {
            const rowData = [];
            for (let i = 1; i <= maxColumns; i++) {
              const key = `item${i}`;
              rowData.push({ value: item[key] || "" });
            }
            return rowData;
          });
          setDataExcel(newData);
        };
        loadDataAsync();
      } else if (typeReceipt == "Lotus") {
        const loadDataAsync = async () => {
          const response = await receiptService.getLotusReceiptInformation(
            selectedImage
          );

          const maxColumns = Math.max(
            ...response.result.map((item) => Object.keys(item).length)
          );
          const newData = response.result.map((item) => {
            const rowData = [];
            for (let i = 1; i <= maxColumns; i++) {
              const key = `item${i}`;
              rowData.push({ value: item[key] || "" });
            }
            return rowData;
          });
          setDataExcel(newData);
        };
        loadDataAsync();
      }
      count++;
    }
  }, [selectedImage, typeReceipt]);

  return (
    <>
      <Container fixed>
        <div className="row">
          <div className="column">
            <div className="row">
              <Select
                className="EditPage_select_type"
                sx={{
                  "& .MuiSelect-icon": {
                    color: "white",
                  },
                  borderRadius: "30px",
                  backgroundColor: "rgba(22, 49, 114, 1)",
                  color: "white",
                  paddingLeft: 2,
                  paddingRight: 2,
                  fontFamily: "Kanit",
                  mt: 10,
                  mr: 2,
                }}
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={typeOfReceipt}
                onChange={(event) => {
                  setNewTypeofImage("" + event.target.value);
                  //setTypeOfReceipt("" + event.target.value);
                }}
              >
                <MenuItem sx={{ fontFamily: "Kanit" }} value={"BigC"}>
                  Big C
                </MenuItem>
                <MenuItem sx={{ fontFamily: "Kanit" }} value={"Lotus"}>
                  Lotus
                </MenuItem>
              </Select>

              <Button
                sx={{
                  borderRadius: "30px",
                  border: "3px solid rgba(22, 49, 114, 1)",
                  color: "rgba(22, 49, 114, 1)",

                  paddingLeft: 2,
                  paddingRight: 4,
                  textTransform: "lowercase",
                  fontFamily: "Kanit",
                  fontSize: "18px",
                  mt: 10,
                }}
                variant="outlined"
                component="label"
              >
                <AddPhotoAlternateIcon sx={{ width: 30, height: 30 }} />
                New
                <input
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={handleFile}
                />
              </Button>
            </div>
            <img
              src={URL.createObjectURL(selectedImage)}
              alt="Selected Image"
            />
          </div>
          <Grid container spacing={0}>
            <Grid item xs={3}></Grid>
            <Grid item xs={3}>
              <Button
                sx={{
                  borderRadius: "30px",
                  border: "3px solid rgba(22, 49, 114, 1)",
                  background: "rgba(22, 49, 114, 1)",
                  color: "white",

                  width: "90px",
                  textTransform: "lowercase",
                  fontFamily: "Kanit",
                  fontSize: "15px",
                  mt: 5,
                }}
                onClick={addRow}
              >
                <AddIcon sx={{ fontSize: "20px" }} />
                <span>Row</span>
              </Button>
            </Grid>
            <Grid item xs={3}></Grid>
            <Grid item xs={3}>
              <Button
                sx={{
                  borderRadius: "15px",
                  border: "3px solid rgba(22, 49, 114, 1)",
                  background: "rgba(22, 49, 114, 1)",
                  color: "white",

                  width: "90px",
                  textTransform: "lowercase",
                  fontFamily: "Kanit",
                  fontSize: "15px",
                  mt: 5,
                }}
                onClick={addColumn}
              >
                <AddIcon sx={{ fontSize: "20px" }} />
                <span>Column</span>
              </Button>
            </Grid>

            <Grid item xs={3}></Grid>
            <Grid item xs={3}></Grid>
            <Grid item xs={3}>
              <Button
                sx={{
                  borderRadius: "15px",
                  border: "3px solid rgba(70, 119, 87, 1)",
                  background: "rgba(70, 119, 87, 1)",
                  color: "white",

                  width: "90px",
                  textTransform: "lowercase",
                  fontFamily: "Kanit",
                  fontSize: "15px",
                  mt: -23,
                }}
                onClick={saveDataAsCSV}
              >
                <SaveAsIcon sx={{ fontSize: "20px" }} />
                <span>Save</span>
              </Button>
            </Grid>
            <Grid item xs={3}></Grid>

            <Grid item xs={3}></Grid>
            <Grid item xs={3}>
              <Button
                sx={{
                  borderRadius: "15px",
                  border: "3px solid rgba(215, 87, 59, 1)",
                  background: "rgba(215, 87, 59, 1)",
                  color: "white",

                  width: "90px",
                  textTransform: "lowercase",
                  fontFamily: "Kanit",
                  fontSize: "15px",
                  mt: -45,
                }}
                onClick={deleteRow}
              >
                <RemoveIcon sx={{ fontSize: "20px" }} />
                <span>Row</span>
              </Button>
            </Grid>
            <Grid item xs={3}></Grid>
            <Grid item xs={3}>
              <Button
                sx={{
                  borderRadius: "15px",
                  border: "3px solid rgba(215, 87, 59, 1)",
                  background: "rgba(215, 87, 59, 1)",
                  color: "white",

                  width: "90px",
                  textTransform: "lowercase",
                  fontFamily: "Kanit",
                  fontSize: "15px",
                  mt: -45,
                }}
                onClick={deleteColumn}
              >
                <RemoveIcon sx={{ fontSize: "20px" }} />
                <span>Column</span>
              </Button>
            </Grid>

            <Grid item xs={12} className="custom_spreadsheet_wrapper">
              {dataExcel.length > 0 ? (
                <Spreadsheet
                  className="custom_spreadsheet"
                  data={dataExcel}
                  onChange={setnewdata}
                  onKeyDown={(event) => console.log(event.key)}
                />
              ) : (
                <div className="custom_div">
                  <CircularProgress />
                </div>
              )}
            </Grid>
          </Grid>
        </div>
      </Container>
    </>
  );
}
