import { createContext, useState } from "react";
// import { generateInterViewReport } from "./services/interview.api";

export const InterviewContext = createContext();

export const InterviewProvider = ({ children }) => {
    const [report, setReport] = useState(null);
    const [loading, setLoading] = useState(false);
    const [reports, setReports] = useState([]);
    // const [error, setError] = useState(null);

    // const generateInterViewReport = async (data) => {
    //     setLoading(true);
    //     setError(null);
    //     try {
    //         const response = await generateInterViewReport(data);
    //         setInterviewReport(response.interviewReport);
    //         return response;
    //     } catch (error) {
    //         setError(error);
    //         return error;
    //     } finally {
    //         setLoading(false);
    //     }
    // }

    return (
        <InterviewContext.Provider value={{ report, setReport, loading, setLoading, reports, setReports }}>
            {children}
        </InterviewContext.Provider>
    )
}