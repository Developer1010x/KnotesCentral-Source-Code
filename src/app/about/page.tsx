export default function About() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">About Knotes Central</h1>
      <p className="text-gray-700 dark:text-gray-300 mb-4">
        Welcome to Knotes Central - where panic meets preparation! Born from the
        age-old tradition of frantically searching for notes at 11 PM before
        exams, we're your one-stop solution for all RVCE academic resources.
        Because let's face it, your WhatsApp is already full of memes, and
        there's no space for those PDFs!
      </p>

      <h2 className="text-2xl font-bold mb-2">Our Vision</h2>
      <p className="text-gray-700 dark:text-gray-300 mb-4">
        We envision a world where no student has to experience the existential
        crisis of missing notes before exams. While we can't promise you'll
        study early, we can at least ensure you have something to study when you
        finally decide to start (probably the night before).
      </p>

      <h2 className="text-2xl font-bold mb-2">Our Team</h2>
      <p className="text-gray-700 dark:text-gray-300 mb-4">
        Our team consists of sleep-deprived students and caffeine-powered
        educators who understand the struggle is real. Fueled by coffee and pure
        desperation, we work tirelessly to keep Knotes Central running smoother
        than your excuses for missing classes.
      </p>

      <h2 className="text-2xl font-bold mb-2">Contact Us</h2>
      <p className="text-gray-700 dark:text-gray-300">
        Found a bug? Missing notes? Or just want to share your exam horror
        stories?{" "}
        <a
          href="/contact"
          className="text-blue-600 dark:text-blue-400 hover:underline"
        >
          Drop us a line
        </a>
        ! We're always here (except during exams, obviously). Your feedback
        helps us make Knotes Central better than your last-minute study plans.
      </p>
    </div>
  );
}
