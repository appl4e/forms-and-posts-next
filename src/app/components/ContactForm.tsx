"use client";
import { Send } from "lucide-react";
import { FormEvent, useState } from "react";

interface FormData {
	name: string;
	phone: string;
	email: string;
	message: string;
}
type Status = "idle" | "loading" | "success" | "error";
const ContactForm = () => {
	const [formData, setFormData] = useState<FormData>({
		name: "",
		phone: "",
		email: "",
		message: "",
	});
	const [status, setStatus] = useState<Status>("idle");
	const [responseMessage, setResponseMessage] = useState<string | null>(null);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault();
		setStatus("loading");
		setResponseMessage(null);

		if (!formData.name || !formData.email || !formData.phone) {
			setStatus("error");
			setResponseMessage("Please fill all the required fields.");
			return;
		}
		try {
			console.log(formData);
			const response = await fetch("/api/contactFormData", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(formData),
			});

			const result = await response.json();
			if (response.ok) {
				setStatus("success");
				setResponseMessage(result.message || "Your message has been submitted successfully");
				setFormData({ email: "", name: "", message: "", phone: "" });
			} else {
				setStatus("error");
				setResponseMessage(result.message || "Submission failed. Please try again later.");
				console.error("API Error Details:", result.details);
			}
		} catch (error) {
			console.error("Fetch Error:", error);
			setStatus("error");
			setResponseMessage("A network error occurred. Please check your connection.");
		}
	};
	return (
		<div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
			<div className="w-full max-w-lg bg-white shadow-xl rounded-2xl p-8 md:p-10 border border-gray-100">
				<h1 className="text-4xl font-extrabold text-gray-900 mb-2">Get in Touch</h1>
				<p className="text-gray-500 mb-8">We'd love to hear from you. Fill out the form below to send us a message.</p>
				<form onSubmit={handleSubmit} className="space-y-6">
					<div>
						<label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
							Name
						</label>
						<input
							type="text"
							name="name"
							id="name"
							value={formData.name}
							onChange={handleChange}
							required
							className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
							placeholder="Your full name"
							disabled={status === "loading"}
						/>
					</div>
					<div>
						<label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
							Phone
						</label>
						<input
							type="text"
							name="phone"
							id="phone"
							value={formData.phone}
							onChange={handleChange}
							required
							className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
							placeholder="Your Phone number"
							disabled={status === "loading"}
						/>
					</div>
					<div>
						<label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
							Email Address
						</label>
						<input
							type="text"
							name="email"
							id="email"
							value={formData.email}
							onChange={handleChange}
							required
							className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
							placeholder="Your Email Address"
							disabled={status === "loading"}
						/>
					</div>
					<div>
						<label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
							Message
						</label>
						<input
							type="text"
							name="message"
							id="message"
							value={formData.message}
							onChange={handleChange}
							required
							className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
							placeholder="Message"
							disabled={status === "loading"}
						/>
					</div>

					<button
						type="submit"
						className="w-full flex justify-center items-center py-3 px-6 border border-transparent rounded-lg shadow-md text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out disabled:opacity-60 disabled:cursor-not-allowed"
					>
						{status === "loading" ? (
							<svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
								<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
								<path
									className="opacity-75"
									fill="currentColor"
									d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
								></path>
							</svg>
						) : (
							<Send className="w-5 h-5 mr-2" />
						)}
						{status == "loading" ? "Sending..." : "Send Message"}
					</button>
				</form>
			</div>
		</div>
	);
};

export default ContactForm;
