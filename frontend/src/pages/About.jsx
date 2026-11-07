const stack = [
  ["Frontend", "React.js, Vite, React Router DOM, Context API, Tailwind CSS, Axios"],
  ["Backend", "Node.js, Express.js (MVC structure)"],
  ["Database", "MongoDB with Mongoose"],
  ["Security", "JWT in HTTP-only cookies, bcryptjs, role-based authorization, express-validator, Helmet"],
  ["Tools", "Postman, Git and GitHub"],
];

// TODO: replace with your own details
const team = [
  { name: "Your Name", role: "Full Stack Developer", note: "Design, development and testing" },
  { name: "Your Mentor / Institute", role: "Guidance", note: "C-DAC project mentor" },
];

export default function About() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="text-3xl font-bold">About JobPortal</h1>
      <p className="mt-3 text-gray-700">
        JobPortal is a recruitment management system built as a C-DAC academic project. It connects job seekers,
        employers and administrators on one platform, and helps employers review applicants faster with a
        transparent skill match score.
      </p>

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        <section className="rounded-lg bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold">Our mission</h2>
          <p className="mt-1 text-gray-700">
            Make hiring simpler and fairer by showing, in plain terms, how a candidate's skills line up with a job.
          </p>
        </section>
        <section className="rounded-lg bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold">Our vision</h2>
          <p className="mt-1 text-gray-700">
            A single, secure place where every candidate finds a relevant opportunity and every employer finds the right fit.
          </p>
        </section>
      </div>

      <section className="mt-8 rounded-lg bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold">How the skill match score works</h2>
        <p className="mt-1 text-gray-700">
          Match score = (matched skills ÷ total job requirements) × 100. Skills are lowercased and
          de-duplicated before comparing, and we show which skills matched and which are missing.
        </p>
        <p className="mt-2 text-sm text-gray-600">
          This is a keyword-based estimate using the skills a candidate lists. It does not read resume files and
          is not a full professional ATS resume parser.
        </p>
      </section>

      <section className="mt-8">
        <h2 className="text-xl font-semibold">Technology stack</h2>
        <dl className="mt-3 divide-y divide-gray-200 rounded-lg bg-white shadow-sm">
          {stack.map(([layer, tech]) => (
            <div key={layer} className="grid gap-1 p-4 sm:grid-cols-4">
              <dt className="font-medium text-gray-900">{layer}</dt>
              <dd className="text-gray-700 sm:col-span-3">{tech}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="mt-8">
        <h2 className="text-xl font-semibold">Developer credits</h2>
        <div className="mt-3 grid gap-4 sm:grid-cols-2">
          {team.map((m) => (
            <div key={m.name} className="rounded-lg bg-white p-4 shadow-sm">
              <p className="font-semibold">{m.name}</p>
              <p className="text-sm text-blue-600">{m.role}</p>
              <p className="mt-1 text-sm text-gray-600">{m.note}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
