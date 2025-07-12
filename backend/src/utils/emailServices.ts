export interface EmailOptions {
    to: string;
    subject: string;
    text?: string;
    html?: string;
}

export async function sendEmail(options: EmailOptions): Promise<void> {
    // Implement email sending logic here
    console.log(`Sending email to ${options.to} with subject "${options.subject}"`);
}