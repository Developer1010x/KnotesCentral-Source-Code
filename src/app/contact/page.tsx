export default function Contact() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Contact Us</h1>
      <div className="max-w-2xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8 text-center">
          <p className="text-gray-700 dark:text-gray-300 mb-6">
            Have questions, suggestions, or want to contribute? We&apos;d love
            to hear from you. Click the button below to fill out our contact
            form.
          </p>

          <a
            href="https://forms.google.com/your-form-link-here"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium py-3 px-6 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-colors duration-300"
          >
            Open Contact Form
          </a>
        </div>

        <div className="text-center text-gray-600 dark:text-gray-400">
          <p className="mb-2">You can also reach us at:</p>
          <a
            href="mailto:contact@knotescentral.com"
            className="text-blue-600 dark:text-blue-400 hover:underline"
          >
            contact@knotescentral.com
          </a>
        </div>
      </div>
    </div>
  );
}
