import axios from "axios";


const api = axios.create({
    baseURL: "http://localhost:3000/api/interview",
    // headers: {
    //     "Content-Type": "application/json",
    //     "Authorization": `Bearer ${localStorage.getItem("token")}`
    // }
    withCredentials: true,
})

export const generateInterViewReport = async ({resumeFile, selfDescription, jobDescription}) => {
    const formData = new FormData();
    formData.append("resume", resumeFile);
    formData.append("selfDescription", selfDescription);
    formData.append("jobDescription", jobDescription);
    try {
        const response = await api.post("/generate-report", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        return response.data;
    } catch (error) {
        console.log(error);
        return error.response.data;
    }
}

export const getInterviewReportById = async (interviewId) => {
    try {
        const response = await api.get(`/get-report/${interviewId}`);
        return response.data;
    } catch (error) {
        console.log(error);
        return error.response.data;
    }
}

export const getAllInterviewReports = async () => {
    try {
        const response = await api.get("/get-all-reports");
        return response.data;
    } catch (error) {
        console.log(error);
        return error.response.data;
    }
}

export const generateResumePdf = async (interviewReportId) => {
    try {
        const response = await api.post(`/get-resume/${interviewReportId}`,{},{
            responseType: "blob",
        });
        return response.data;
    } catch (error) {
        console.log(error);
        return error.response.data;
    }
}
