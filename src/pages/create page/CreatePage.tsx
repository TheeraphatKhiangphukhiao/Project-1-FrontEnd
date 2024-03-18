import React, { useState } from 'react';
import { Button, MenuItem, Select } from '@mui/material';
import './createpage.css';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import { useNavigate } from "react-router-dom";

export default function CreatePage() {
  // create hook
  const navigate = useNavigate(); // useNavigate hook
  const [typeOfReceipt, setTypeOfReceipt] = useState("BigC");
  //const [selectedImage, setSelectedImage] = useState<File | null>(null);
  //const [imageName, setImageName] = useState<string>("");

  const handleFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files && event.target.files[0];
    if (file) {
      //setImageName(file.name);
      //setSelectedImage(file);
      navigate("/edit", { state: { selectedImage: file, typeOfReceipt: typeOfReceipt } });
    }
  };

  return (
    <div className="CreatePage_body">
      <Button
        className="CreatePage_btn_import"
        sx={{
          borderRadius: '15px',
          border: '3px solid rgba(22, 49, 114, 1)',
          color: 'rgba(22, 49, 114, 1)',
          paddingTop: 4,
          paddingBottom: 4,
          paddingLeft: 10,
          paddingRight: 10,
          textTransform: 'lowercase',
          fontFamily: 'Kanit',
        }}
        variant="outlined"
        component="label"
      >
        <AddPhotoAlternateIcon sx={{ width: 60, height: 60 }} />
        Import receipt image
        <input
          type="file"
          accept="image/*"
          hidden
          onChange={handleFile}
        />
      </Button>

      <Select
        className="CreatePage_select_type"
        sx={{
          "& .MuiSelect-icon": {
            color: "white",
          },
          borderRadius: "30px",
          backgroundColor: "rgba(22, 49, 114, 1)",
          color: "white",
          paddingLeft: 2,
          paddingRight: 2,
          fontFamily: 'Kanit',
        }}
        labelId="demo-simple-select-label"
        id="demo-simple-select"
        value={typeOfReceipt}
        onChange={(event) => {
          setTypeOfReceipt("" + event.target.value);
        }}
      >
        <MenuItem sx={{ fontFamily: 'Kanit' }} value={"BigC"}>Big C</MenuItem>
        <MenuItem sx={{ fontFamily: 'Kanit' }} value={"Lotus"}>Lotus</MenuItem>
      </Select>
    </div>
  );
}
