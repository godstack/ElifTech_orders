import React, { Component } from "react";
import Dropzone from "./Dropzone";
import Progress from "./Progress";
import "../css/Upload.css";

export default class Upload extends Component {
  constructor(props) {
    super(props);
    this.state = {
      files: [],
      uploading: false,
      uploadProgress: {},
      successfullUploaded: false
    };

    this.onFilesAdded = this.onFilesAdded.bind(this);
    this.uploadFiles = this.uploadFiles.bind(this);
    this.sendRequest = this.sendRequest.bind(this);
    this.renderActions = this.renderActions.bind(this);
  }

  onFilesAdded(files) {
    this.setState(prevState => ({
      files: prevState.files.concat(files)
    }));
  }

  async uploadFiles() {
    const { files } = this.state;
    this.setState({ uploadProgress: {}, uploading: true });
    const promises = [];
    files.forEach(file => {
      promises.push(this.sendRequest(file));
    });
    try {
      await Promise.all(promises);

      this.setState({
        successfullUploaded: true,
        uploading: false
      });
    } catch (e) {
      throw e.message;
    }
  }

  sendRequest(file) {
    const { uploadProgress } = this.state;
    return new Promise((resolve, reject) => {
      const req = new XMLHttpRequest();

      req.upload.addEventListener("progress", event => {
        if (event.lengthComputable) {
          const copy = { ...uploadProgress };
          copy[file.name] = {
            state: "pending",
            percentage: (event.loaded / event.total) * 100
          };
          this.setState({ uploadProgress: copy });
        }
      });

      req.upload.addEventListener("load", event => {
        const copy = { ...uploadProgress };
        copy[file.name] = { state: "done", percentage: 100 };
        this.setState({ uploadProgress: copy });
        resolve(req.response);
      });

      req.upload.addEventListener("error", event => {
        const copy = { ...uploadProgress };
        copy[file.name] = { state: "error", percentage: 0 };
        this.setState({ uploadProgress: copy });
        reject(req.response);
      });

      const formData = new FormData();
      formData.append("file", file, file.name);

      req.open("POST", "/upload");
      req.send(formData);
    });
  }

  renderProgress(file) {
    const { successfullUploaded, uploading } = this.state;
    const uploadProgress = this.state.uploadProgress[file.name];
    if (uploading || successfullUploaded) {
      return (
        <div className="ProgressWrapper">
          <Progress progress={uploadProgress ? uploadProgress.percentage : 0} />
          <div className="CheckIcon" />
        </div>
      );
    }
  }

  renderActions() {
    const { successfullUploaded, files, uploading } = this.state;

    if (successfullUploaded) {
      return (
        <div className="clear-btn">
          <p>Go to "Order list" section to see a result!</p>
          <button
            onClick={() =>
              this.setState({
                files: [],
                successfullUploaded: false
              })
            }
          >
            Clear
          </button>
        </div>
      );
    } else {
      return (
        <button
          disabled={files.length < 0 || uploading}
          onClick={this.uploadFiles}
        >
          Upload
        </button>
      );
    }
  }

  render() {
    const { files, successfullUploaded, uploading } = this.state;
    return (
      <div className="Upload">
        <span className="Title">Upload Files</span>
        <h3>Drag and drop file, or click on dashed circle for upload</h3>
        <div className="Content">
          <div>
            <Dropzone
              onFilesAdded={this.onFilesAdded}
              disabled={uploading || successfullUploaded}
            />
          </div>
          <div className="Files">
            {files.map(file => {
              return (
                <div key={file.name} className="Row">
                  <span className="Filename">{file.name}</span>
                  {this.renderProgress(file)}
                </div>
              );
            })}
          </div>
        </div>
        <div className="Actions">{this.renderActions()}</div>
      </div>
    );
  }
}
