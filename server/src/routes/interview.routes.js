const {Router} = require("express")
const authUserMiddleware = require("../middleware/auth.middleware")
const {generateInterViewReportController, getInterviewReportByIdController, getAllInterviewReportsController, generateResumePdfController} = require("../controller/interview.controller")
const upload = require("../middleware/file.middleware")


const interviewRouter = Router();

interviewRouter.post("/generate-report", authUserMiddleware, upload.single("resume"), generateInterViewReportController);
interviewRouter.get("/get-report/:interviewId", authUserMiddleware, getInterviewReportByIdController);
interviewRouter.get("/get-all-reports", authUserMiddleware, getAllInterviewReportsController);
interviewRouter.post("/get-resume/:interviewReportId", authUserMiddleware, generateResumePdfController);

module.exports = interviewRouter;