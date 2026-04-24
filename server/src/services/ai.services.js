const { GoogleGenerativeAI } = require("@google/generative-ai");
const { z } = require("zod");
const { zodToJsonSchema } = require("zod-to-json-schema");
const puppetteer = require("puppeteer");

const ai = new GoogleGenerativeAI(process.env.GENAI_API_KEY);

const interviewReportSchema = z.object({
  matchScore: z
    .number()
    .describe(
      "A score between 0 and 100 indicating how well the candidate's profile matches the job describe",
    ),
  technicalQuestions: z
    .array(
      z.object({
        question: z
          .string()
          .describe("The technical question can be asked in the interview"),
        intention: z
          .string()
          .describe("The intention of interviewer behind asking this question"),
        answer: z
          .string()
          .describe(
            "How to answer this question, what points to cover, what approach to take etc.",
          ),
      }),
    )
    .describe(
      "Technical questions that can be asked in the interview along with their intention and how to answer them",
    ),
  behavioralQuestions: z
    .array(
      z.object({
        question: z
          .string()
          .describe("The behavioral question can be asked in the interview"),
        intention: z
          .string()
          .describe("The intention of interviewer behind asking this question"),
        answer: z
          .string()
          .describe(
            "How to answer this question, what points to cover, what approach to take etc.",
          ),
      }),
    )
    .describe(
      "Behavioral questions that can be asked in the interview along with their intention and how to answer them",
    ),
  skillGaps: z
    .array(
      z.object({
        skill: z.string().describe("The skill which the candidate is lacking"),
        severity: z
          .enum(["low", "medium", "high"])
          .describe(
            "The severity of this skill gap, i.e. how important is this skill for the job and how much it can impact the candidate's chances",
          ),
      }),
    )
    .describe(
      "List of skill gaps in the candidate's profile along with their severity",
    ),
  preparationPlan: z
    .array(
      z.object({
        day: z
          .number()
          .describe("The day number in the preparation plan, starting from 1"),
        focus: z
          .string()
          .describe(
            "The main focus of this day in the preparation plan, e.g. data structures, system design, mock interviews etc.",
          ),
        tasks: z
          .array(z.string())
          .describe(
            "List of tasks to be done on this day to follow the preparation plan, e.g. read a specific book or article, solve a set of problems, watch a video etc.",
          ),
      }),
    )
    .describe(
      "A day-wise preparation plan for the candidate to follow in order to prepare for the interview effectively",
    ),
  title: z
    .string()
    .describe(
      "The title of the job for which the interview report is generated",
    ),
});

// async function generateInterviewReport({
//   resume,
//   selfDescription,
//   jobDescription,
// }) {
//   const schema = zodToJsonSchema(interviewReportSchema);
//   delete schema.$schema; // 🛠️ Remove the field that Gemini rejects

//   const model = ai.getGenerativeModel({
//     model: "gemini-2.5-flash",
//     generationConfig: {
//       responseMimeType: "application/json",
//       responseSchema: schema,
//     },
//   });

//   const prompt = `Generate an interview report for a candidate with the following details:
//                         Resume: ${resume}
//                         Self Description: ${selfDescription}
//                         Job Description: ${jobDescription}

//                         Based on the Job Description, also generate a professional 'title' for this interview report (e.g., "Full Stack Developer Interview Plan").
// `;

//   const result = await model.generateContent(prompt);
//   const response = await result.response;
//   return JSON.parse(response.text());
// }


async function generateInterviewReport({
  resume,
  selfDescription,
  jobDescription,
}) {
  // 1. Generate the JSON schema
  const schema = zodToJsonSchema(interviewReportSchema);

  // 🛠️ REQUIRED: Gemini rejects schemas with the $schema or definitions field
  delete schema.$schema;
  delete schema.definitions;

  // 2. Initialize the model with the 2026 stable version
  const model = ai.getGenerativeModel(
    {
      model: "gemini-2.0-flash", // Use the current stable 2026 model
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: schema,
      },
    },
    {
      // Recommended: Higher timeout for complex report generation
      apiClient: { timeout: 45000 },
    },
  );

  const prompt = `
    Generate a detailed interview report based on these inputs:
    Resume: ${resume}
    Self Description: ${selfDescription}
    Job Description: ${jobDescription}
    
    Ensure the "matchScore" is an integer and the "preparationPlan" is realistic.
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;

    // 3. Return the parsed JSON
    return JSON.parse(response.text());
  } catch (error) {
    console.error("Report Generation Failed:", error);
    throw error;
  }
}


async function generatePdfFromHtml(htmlContent) {
  // const browser = await puppetteer.launch();
  // const page = await browser.newPage();
  // await page.setContent(htmlContent);
  // const pdfBuffer = await page.pdf({
  //   format: "A4",
  //   printBackground: true,
  //   margin: {
  //     top: "1cm",
  //     right: "1cm",
  //     bottom: "1cm",
  //     left: "1cm",
  //   },
  // });
  // await browser.close();
  // return pdfBuffer;

  const browser = await puppetteer.launch({
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
    // If you used the 'puppeteer-core' fix from earlier, add the line below:
    // executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
  });

  try {
    const page = await browser.newPage();
    // 'networkidle0' ensures the CSS/Fonts are loaded before printing
    await page.setContent(htmlContent, { waitUntil: "networkidle0" });

    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true, // Crucial for colors/styles Gemini generated
      margin: { top: "1cm", right: "1cm", bottom: "1cm", left: "1cm" },
    });
    return pdfBuffer;
  } finally {
    await browser.close(); // Ensure browser always closes even if error occurs
  }
}

async function generateResumePdf({ resume, jobDescription, selfDescription }) {
  const resumePdfSchema = z.object({
    html: z
      .string()
      .describe(
        "The HTML content of the resume which can be converted in pdf using puppeteer libary",
      ),
  });

  const schema = zodToJsonSchema(resumePdfSchema);
  delete schema.$schema;

  const model = ai.getGenerativeModel({
    model: "gemini-2.0-flash",
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: schema,
    },
  });

  const prompt = `Generate a resume for a candidate with the following details:
                        Resume: ${resume}
                        Job Description: ${jobDescription}
                        Self Description: ${selfDescription}

                        the response should be in html format and should be converted in pdf using puppeteer libary
                        The resume should be tailored for the given job description and should highlight the candidate's strengths and relevant experience. The HTML content should be well-formatted and structured, making it easy to read and visually appealing.
                        The content of resume should be not sound like it's generated by AI and should be as close as possible to a real human-written resume.
                        you can highlight the content using some colors or different font styles but the overall design should be simple and professional.
                        The content should be ATS friendly, i.e. it should be easily parsable by ATS systems without losing important information.
                        The resume should not be so lengthy, it should ideally be 1-2 pages long when converted to PDF. Focus on quality rather than quantity and make sure to include all the relevant information that can increase the candidate's chances of getting an interview call for the given job description.
`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const jsonContent = JSON.parse(response.text());
  const pdfBuffer = await generatePdfFromHtml(jsonContent.html);
  return pdfBuffer;
}

module.exports = { generateInterviewReport, generateResumePdf };

// const { GoogleGenAI } = require("@google/genai");
// const { z } = require("zod");
// const { zodToJsonSchema } = require("zod-to-json-schema");
// const puppeteer = require("puppeteer");


// // Increase timeout to 60 seconds (60000ms) to allow for HTML generation
// const ai = new GoogleGenAI({
//     apiKey: process.env.GOOGLE_GENAI_API_KEY,
//     timeout: 60000 
// });

// // const ai = new GoogleGenAI({
// //   apiKey: process.env.GENAI_API_KEY,
// // });

// const interviewReportSchema = z.object({
//   matchScore: z
//     .number()
//     .describe(
//       "A score between 0 and 100 indicating how well the candidate's profile matches the job describe",
//     ),
//   technicalQuestions: z
//     .array(
//       z.object({
//         question: z
//           .string()
//           .describe("The technical question can be asked in the interview"),
//         intention: z
//           .string()
//           .describe("The intention of interviewer behind asking this question"),
//         answer: z
//           .string()
//           .describe(
//             "How to answer this question, what points to cover, what approach to take etc.",
//           ),
//       }),
//     )
//     .describe(
//       "Technical questions that can be asked in the interview along with their intention and how to answer them",
//     ),
//   behavioralQuestions: z
//     .array(
//       z.object({
//         question: z
//           .string()
//           .describe("The technical question can be asked in the interview"),
//         intention: z
//           .string()
//           .describe("The intention of interviewer behind asking this question"),
//         answer: z
//           .string()
//           .describe(
//             "How to answer this question, what points to cover, what approach to take etc.",
//           ),
//       }),
//     )
//     .describe(
//       "Behavioral questions that can be asked in the interview along with their intention and how to answer them",
//     ),
//   skillGaps: z
//     .array(
//       z.object({
//         skill: z.string().describe("The skill which the candidate is lacking"),
//         severity: z
//           .enum(["low", "medium", "high"])
//           .describe(
//             "The severity of this skill gap, i.e. how important is this skill for the job and how much it can impact the candidate's chances",
//           ),
//       }),
//     )
//     .describe(
//       "List of skill gaps in the candidate's profile along with their severity",
//     ),
//   preparationPlan: z
//     .array(
//       z.object({
//         day: z
//           .number()
//           .describe("The day number in the preparation plan, starting from 1"),
//         focus: z
//           .string()
//           .describe(
//             "The main focus of this day in the preparation plan, e.g. data structures, system design, mock interviews etc.",
//           ),
//         tasks: z
//           .array(z.string())
//           .describe(
//             "List of tasks to be done on this day to follow the preparation plan, e.g. read a specific book or article, solve a set of problems, watch a video etc.",
//           ),
//       }),
//     )
//     .describe(
//       "A day-wise preparation plan for the candidate to follow in order to prepare for the interview effectively",
//     ),
//   title: z
//     .string()
//     .describe(
//       "The title of the job for which the interview report is generated",
//     ),
// });

// async function generateInterviewReport({
//   resume,
//   selfDescription,
//   jobDescription,
// }) {
//   const prompt = `Generate an interview report for a candidate with the following details:
//                         Resume: ${resume}
//                         Self Description: ${selfDescription}
//                         Job Description: ${jobDescription}
// `;

//   const response = await ai.models.generateContent({
//     model: "gemini-3-flash-preview",
//     contents: prompt,
//     config: {
//       responseMimeType: "application/json",
//       responseSchema: zodToJsonSchema(interviewReportSchema),
//     },
//   });

//   return JSON.parse(response.text);
// }

// async function generatePdfFromHtml(htmlContent) {
//   const browser = await puppeteer.launch();
//   const page = await browser.newPage();
//   await page.setContent(htmlContent, { waitUntil: "networkidle0" });

//   const pdfBuffer = await page.pdf({
//     format: "A4",
//     margin: {
//       top: "20mm",
//       bottom: "20mm",
//       left: "15mm",
//       right: "15mm",
//     },
//   });

//   await browser.close();

//   return pdfBuffer;
// }

// async function generateResumePdf({ resume, selfDescription, jobDescription }) {
//   const resumePdfSchema = z.object({
//     html: z
//       .string()
//       .describe(
//         "The HTML content of the resume which can be converted to PDF using any library like puppeteer",
//       ),
//   });

//   const prompt = `Generate resume for a candidate with the following details:
//                         Resume: ${resume}
//                         Self Description: ${selfDescription}
//                         Job Description: ${jobDescription}

//                         the response should be a JSON object with a single field "html" which contains the HTML content of the resume which can be converted to PDF using any library like puppeteer.
//                         The resume should be tailored for the given job description and should highlight the candidate's strengths and relevant experience. The HTML content should be well-formatted and structured, making it easy to read and visually appealing.
//                         The content of resume should be not sound like it's generated by AI and should be as close as possible to a real human-written resume.
//                         you can highlight the content using some colors or different font styles but the overall design should be simple and professional.
//                         The content should be ATS friendly, i.e. it should be easily parsable by ATS systems without losing important information.
//                         The resume should not be so lengthy, it should ideally be 1-2 pages long when converted to PDF. Focus on quality rather than quantity and make sure to include all the relevant information that can increase the candidate's chances of getting an interview call for the given job description.
//                     `;

//   const response = await ai.models.generateContent({
//     model: "gemini-3-flash-preview",
//     contents: prompt,
//     config: {
//       responseMimeType: "application/json",
//       responseSchema: zodToJsonSchema(resumePdfSchema),
//     },
//   });

//   const jsonContent = JSON.parse(response.text);

//   const pdfBuffer = await generatePdfFromHtml(jsonContent.html);

//   return pdfBuffer;
// }

// module.exports = { generateInterviewReport, generateResumePdf };