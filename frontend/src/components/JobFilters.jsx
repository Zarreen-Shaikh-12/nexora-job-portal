export default function JobFilters({ jobType, sort, onChange }) {
  const selectClass = "rounded border border-stone-300 bg-white px-3 py-2 text-sm";
  return (
    <div className="flex flex-wrap items-center gap-3">
      <div>
        <label htmlFor="filter-type" className="mr-2 text-sm font-medium">Job type</label>
        <select id="filter-type" value={jobType} onChange={(e) => onChange("jobType", e.target.value)} className={selectClass}>
          <option value="">All</option>
          <option value="Full-time">Full-time</option>
          <option value="Part-time">Part-time</option>
          <option value="Remote">Remote</option>
        </select>
      </div>
      <div>
        <label htmlFor="filter-sort" className="mr-2 text-sm font-medium">Sort by</label>
        <select id="filter-sort" value={sort} onChange={(e) => onChange("sort", e.target.value)} className={selectClass}>
          <option value="newest">Newest first</option>
          <option value="oldest">Oldest first</option>
          <option value="salary-high">Salary: high to low</option>
          <option value="salary-low">Salary: low to high</option>
        </select>
      </div>
    </div>
  );
}
