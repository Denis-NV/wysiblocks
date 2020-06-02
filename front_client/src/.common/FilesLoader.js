import React from "react";
import PropTypes from "prop-types";

// Components
import FilesDropZone from "./FilesDropZone";

// Utils
import axios from "axios";

const FilesLoader = (props) => {
  const {
    required,
    accept,
    token,
    uploadedCallback,
    upload_url,
    id_token,
    current_files,
    bg_img,
  } = props;

  // Hooks
  const [is_loading, setLoading] = React.useState(false);

  // Handlers
  const onFilesSelected = (files) => {
    const chunkSize = 2097152;
    const threadsQuantity = 3;

    let chunksQueue = [];
    let new_files = [];
    let activeConnections = 0;

    const sendNext = () => {
      if (activeConnections >= threadsQuantity) {
        return;
      }

      if (!chunksQueue.length) {
        if (!activeConnections) {
          console.log("All parts uploaded");
          setLoading(false);
          uploadedCallback([...current_files, ...new_files]);
        }
        return;
      }

      const chunk = chunksQueue.pop();
      const begin = chunk.index * chunkSize;
      const end = Math.min(begin + chunkSize, chunk.file.size);
      const blob_chunk = chunk.file.slice(begin, end);

      const formData = new FormData();
      formData.append("files", blob_chunk, chunk.file.name);
      formData.append("random", true);

      const req_config = {
        url: upload_url,
        method: "post",
        data: formData,
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
          "Content-Range": `bytes ${begin}-${end - 1}/${chunk.file.size}`,
          Authorization: `Bearer ${id_token}`,
        },
        cancelToken: token,
      };

      activeConnections += 1;

      axios
        .request(req_config)
        .then((res) => {
          const file_data = res.data.files[0];

          console.log("data", file_data);

          if (file_data.error) console.log(file_data.error);
          if (file_data.url) new_files.push(file_data);

          activeConnections -= 1;

          sendNext();
        })
        .catch((err) => {
          console.log(err);

          activeConnections -= 1;

          chunksQueue.push(chunk);
        });

      //

      // No multi-thread upload support on the back-end
      // sendNext();
    };

    files.forEach((file) => {
      const chunksQuantity = Math.ceil(file.size / chunkSize);

      chunksQueue = [
        ...chunksQueue,
        ...new Array(chunksQuantity)
          .fill()
          .map((_, index) => ({ index, file }))
          .reverse(),
      ];
    });

    setLoading(true);

    sendNext();
  };

  return (
    <FilesDropZone
      required={required && current_files.length === 0}
      className="drop-zone"
      onFilesSelected={onFilesSelected}
      is_loading={is_loading}
      msg="Drag & Drop your file"
      primary
      img={bg_img}
      accept={accept}
    />
  );
};

FilesLoader.propTypes = {};

export default FilesLoader;
