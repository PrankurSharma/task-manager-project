import { Box, IconButton, List, ListItem, ListItemText, Typography } from "@mui/material";
import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import DeleteIcon from "@mui/icons-material/Delete";
import { Task } from "../../types/task";

interface DropzoneProps {
    data: Omit<Task, "position" | "id"> | Task,
    setData: React.Dispatch<React.SetStateAction<Omit<Task, "position" | "id"> | Task>>
}

export default function Dropzone({ data, setData }: DropzoneProps) {

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setData(data => ({
        ...data,
        attachments: data.attachments ? [...data.attachments, ...acceptedFiles] : [...acceptedFiles]
    }));
  }, []);

  const removeFile = (fileName: string) => {
    setData(data => ({
        ...data,
        attachments: data.attachments.filter(file => file.name !== fileName)
    }));
  };

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  return (
    <>
    <Box sx={{ border: "1px solid gray", borderRadius: 2, textAlign: "center", padding: "2px" }}>
      <Box {...getRootProps()} sx={{ cursor: "pointer", p: 2, bgcolor: "#f9f9f9" }}>
        <input {...getInputProps()} />
        <Typography variant="body1">Drag your files here to upload</Typography>
      </Box>
    </Box>
    {data.attachments?.length > 0 && (
        <List>
          {data.attachments?.map((file) => (
            <ListItem key={file.name} secondaryAction={
              <IconButton edge="end" onClick={() => removeFile(file.name)}>
                <DeleteIcon />
              </IconButton>
            }>
              <ListItemText primary={file.name} secondary={`${(file.size / 1024).toFixed(2)} KB`} />
            </ListItem>
          ))}
        </List>
      )}
    </>
  );
}