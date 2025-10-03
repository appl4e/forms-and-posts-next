/**
 * Handles POST requests for form submission.
 * Saves the submission to MongoDB and sends an email notification.
 * @param req The incoming NextRequest object.
 * @returns A NextResponse object with the result.
 */

import { db } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

// --- NODEMAILER CONFIGURATION ---
// These variables are loaded from the .env file.
const smtpConfig = {
	host: process.env.SMTP_HOST,
	port: parseInt(process.env.SMTP_PORT || "587", 10),
	secure: process.env.SMTP_PORT === "465",
	auth: {
		user: process.env.SMTP_USER,
		pass: process.env.SMTP_PASS,
	},
};

const transporter = nodemailer.createTransport(smtpConfig);

export async function POST(req: NextRequest) {
	try {
		// 1. Parse the request body
		const data = await req.json();
		console.log(data);

		const { name, email, phone, message } = data;
		if (!name || !email || !phone) {
			return NextResponse.json({ message: "Missing data for any required field" }, { status: 400 });
		}

		// --- DATABASE INTERACTION (Prisma) ---
		// 2. Save the submission to MongoDB
		const submission = await db.contactFormSubmission.create({
			data: { name, email, phone, message },
		});

		if (!submission || !submission) {
			// Throw an error to correctly trigger the catch block and log the failure
			throw new Error("Prisma CREATE operation failed or returned an invalid ID. Check MongoDB permissions or connection string.");
		}

		console.log(`Form Submission data stored successfully for ${email}. Id ${submission.id}`);

		// --- EMAIL INTERACTION (Nodemailer) ---
		// 3. Send email notification (to the configured recipient)
		const mailOptions = {
			from: `Forms and Posts nextjs app <${process.env.FROM_EMAIL}>`,
			to: process.env.TO_EMAIL,
			subject: `Get in touch form submitted in Forms and Posts nextjs app by ${name}`,
			text: `
				You have received a new contact form submission.

				Name: ${name}
				Phone: ${phone}
				Email: ${email}
				Message:
				---
				${message}
				---
				Record ID in DB: ${submission.id}
			`,
			html: `
			<div style="font-family: sans-serif; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
					<h2 style="color: #333;">New Contact Form Submission</h2>
					<p><strong>Name:</strong> ${name}</p>
					<p><strong>Phone:</strong> ${phone}</p>
					<p><strong>Email:</strong> ${email}</p>
					<p><strong>Message:</strong></p>
					<div style="background-color: #f9f9f9; padding: 10px; border-radius: 4px; border-left: 3px solid #0070f3;">
							${message.replace(/\n/g, "<br>")}
					</div>
					<small style="color: #666; display: block; margin-top: 15px;">Record ID: ${submission.id}</small>
			</div>
			`,
		};

		const info = await transporter.sendMail(mailOptions);
		console.log("Email sent: %s", info.messageId);

		return NextResponse.json({ message: "Form Submitted successfully", submissionId: submission.id }, { status: 200 });
	} catch (error) {
		console.log("submission failed", error);

		let errorMessage = "An unknown error occurred.";

		if (error instanceof Error) {
			errorMessage = error.message;
		}

		return NextResponse.json({ message: "Submission failed due to server error", details: errorMessage }, { status: 500 });
	}
}
