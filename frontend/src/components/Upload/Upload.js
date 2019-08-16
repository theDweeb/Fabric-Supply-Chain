import React, { Component } from "react";
import Dropzone from "../Dropzone/Dropzone";
// import "./Upload.css";
import Progress from "../Progress/Progress";

class Upload extends Component {
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
        this.setState({ uploadProgress: {}, uploading: true });
        const promises = [];
        this.state.files.forEach(file => {
            promises.push(this.sendRequest(file));
        });
        try {
            await Promise.all(promises);

            this.setState({ successfullUploaded: true, uploading: false });
            alert(`Successfully uploaded chaincode`)
            this.props.onRouteChange('uploadCC')
        } catch (e) {
            // Not Production ready! Do some error handling here instead...
            alert(`Failed to upload chaincode.\n${e}`)
            this.setState({ successfullUploaded: true, uploading: false });
        }
    }

    sendRequest(file) {
        return new Promise((resolve, reject) => {
            const req = new XMLHttpRequest();

            req.upload.addEventListener("progress", event => {
                if (event.lengthComputable) {
                    const copy = { ...this.state.uploadProgress };
                    copy[file.name] = {
                        state: "pending",
                        percentage: (event.loaded / event.total) * 100
                    };
                    this.setState({ uploadProgress: copy });
                }
            });

            req.upload.addEventListener("load", event => {
                const copy = { ...this.state.uploadProgress };
                copy[file.name] = { state: "done", percentage: 100 };
                this.setState({ uploadProgress: copy });
                resolve(req.response);
            });

            req.upload.addEventListener("error", event => {
                const copy = { ...this.state.uploadProgress };
                copy[file.name] = { state: "error", percentage: 0 };
                this.setState({ uploadProgress: copy });
                reject(req.response);
            });

            const formData = new FormData();
            formData.append("file", file, file.name);

            req.open("POST", `http://localhost:3000/${this.props.activeOrg}/chaincode/upload`);
            req.send(formData);
        });
    }

    renderProgress(file) {
        const uploadProgress = this.state.uploadProgress[file.name];
        if (this.state.uploading || this.state.successfullUploaded) {
            return (
                <div className="ProgressWrapper">
                    <Progress progress={uploadProgress ? uploadProgress.percentage : 0} />
                    <img
                        className="CheckIcon"
                        alt="done"
                        src="baseline-check_circle_outline-24px.svg"
                        style={{
                            opacity:
                                uploadProgress && uploadProgress.state === "done" ? 0.5 : 0
                        }}
                    />
                </div>
            );
        }
    }

    renderActions() {
        if (this.state.successfullUploaded) {
            return (
                <button className="center b ph3 pv2 input-reset ba b--dark-blue bg-transparent grow pointer f6 dib navy"
                    onClick={() =>
                        this.setState({ files: [], successfullUploaded: false })
                    }
                >
                    Clear
        </button>
            );
        } else {
            return (
                <button className="center b ph3 pv2 input-reset ba b--dark-blue bg-transparent grow pointer f6 dib navy"
                    disabled={this.state.files.length < 0 || this.state.uploading}
                    onClick={this.uploadFiles}
                >
                    Upload
        </button>
            );
        }
    }

    render() {
        return (
            <article className="br3 background b--black-10 ma3 pa3 w-100 w-50-m w-25-l mw6 shadow-4 center">

                <div className="Upload">
                    <span className="Title center f1 fw6 ph0 mh0 tc navy">Upload Chaincode</span>
                    <div className="Content">
                        <div className="center">
                            <Dropzone
                                onFilesAdded={this.onFilesAdded}
                                disabled={this.state.uploading || this.state.successfullUploaded}
                            />
                        </div>
                        <div className="Files">
                            {this.state.files.map(file => {
                                return (
                                    <div key={file.name} className="Row">
                                        <span className="Filename tc">{file.name}</span>
                                        {this.renderProgress(file)}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                    <div className="center mv3 Actions">{this.renderActions()}</div>
                </div>
            </article>
        );
    }
}

export default Upload;